# Gnosis Safe quick guide (recommended)

Why use Gnosis Safe?
- Gnosis Safe is a widely used multisig wallet that requires multiple signatures to execute transactions — recommended for team security and admin control.

Create a Safe (summary):
1. Visit https://gnosis-safe.io/app/
2. Connect a hardware wallet or MetaMask account as owner 1.
3. Add additional owners (cofounders / hardware wallets / cold wallets).
4. Choose a threshold (2 of 3 or 3 of 5 recommended).
5. Create the Safe and copy its address.
6. Fund the Safe with some native chain token for gas (Polygon MATIC) to allow on‑chain transactions.

Use Safe to hold admin role
- Use the Safe address as OWNER_ADDRESS in deployment scripts.
- After deploy, transfer ownership of the Poisha contract to the Safe via `transferOwnership`.

Recommended policies
- Keep at least 2 hardware wallets as owners.
- Keep signer keys offline where possible.
- Use transaction review and human checks for large mints or multisig actions.
