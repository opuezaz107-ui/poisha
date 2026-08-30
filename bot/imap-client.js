const Imap = require('imap-simple');
const { simpleParser } = require('mailparser');
const axios = require('axios');

// bot/imap-client.js
// Usage: set env variables (see bot/.env.example), then run with `node bot/imap-client.js`

const config = {
  imap: {
    user: process.env.IMAP_USER,
    password: process.env.IMAP_PASS,
    host: process.env.IMAP_HOST || 'imap.gmail.com',
    port: Number(process.env.IMAP_PORT) || 993,
    tls: true,
    authTimeout: 30000
  }
};

async function handleMessage(parsed) {
  // parsed: result from mailparser.simpleParser
  const from = parsed.from?.text || '';
  const subject = parsed.subject || '';
  const text = parsed.text || parsed.html || '';

  console.log('New message received');
  console.log('From:', from);
  console.log('Subject:', subject);
  // Basic routing example: forward to an internal support HTTP endpoint

  try {
    // Example: send inbound email to your app's support endpoint (configure SUPPORT_WEBHOOK_URL)
    if (process.env.SUPPORT_WEBHOOK_URL) {
      await axios.post(process.env.SUPPORT_WEBHOOK_URL, {
        from,
        subject,
        text,
        html: parsed.html || null,
        headers: parsed.headers ? Object.fromEntries(parsed.headers) : {}
      }, { timeout: 15000 });
    } else {
      console.log('No SUPPORT_WEBHOOK_URL configured — skipping forward');
    }
  } catch (err) {
    console.error('Error forwarding message to support webhook:', err?.message || err);
  }
}

async function start() {
  console.log('IMAP client starting with user', process.env.IMAP_USER);
  const connection = await Imap.connect(config);
  await connection.openBox('INBOX');

  // Lightweight polling — searches for UNSEEN messages at interval
  const pollInterval = Number(process.env.IMAP_POLL_INTERVAL_SEC) || 30;

  setInterval(async () => {
    try {
      const searchCriteria = ['UNSEEN'];
      const fetchOptions = { bodies: [''], markSeen: true };
      const results = await connection.search(searchCriteria, fetchOptions);

      for (const res of results) {
        const raw = res.parts.find(p => p.which === '').body;
        const parsed = await simpleParser(raw);
        // Handle parsed message (forward, notify admin, create ticket)
        await handleMessage(parsed);
      }
    } catch (err) {
      console.error('IMAP poll error', err?.message || err);
      // Attempt to reconnect if connection closed
      try {
        if (!connection.state || connection.state !== 'authenticated') {
          console.log('Reconnecting IMAP...');
          await connection.connect();
          await connection.openBox('INBOX');
        }
      } catch (reErr) {
        console.error('Reconnect failed', reErr?.message || reErr);
      }
    }
  }, pollInterval * 1000);
}

start().catch(err => {
  console.error('IMAP client failed to start:', err?.message || err);
  process.exit(1);
});
