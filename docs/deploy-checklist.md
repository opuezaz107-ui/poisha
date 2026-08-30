# Poisha — Deployment checklist

This document lists steps and safety recommendations for deploying Poisha to Polygon mainnet.

1) Prepare deployer and multisig
- Create a Gnosis Safe multisig (recommended 2-of-3 or 3-of-5) for admin/owner. Do NOT use a single hot wallet for ownership.
- Fund a deployer wallet (your machine/hardware wallet address) with enough MATIC to deploy (estimate: 0.01–0.1 MATIC for simple contracts, but keep margin).

2) Review & compile locally
- Clone the repo and run `npm install` in the contracts root (install devDependencies).
- Run `npx hardhat compile` and `npx hardhat test`.

3) Deploy to testnet first
- Set env vars in a .env file (never commit):
  - PRIVATE_KEY=your_private_key_for_deployer
  - ALCHEMY_MUMBAI_URL=https://... (or QuickNode)
  - TOKEN_NAME=Poisha
  - TOKEN_SYMBOL=PISHA
  - TOKEN_CAP=1000000000
  - TOKEN_DECIMALS=18
  - OWNER_ADDRESS=gnosis_safe_address (optional)
  - MINT_TO=address to mint to (optional)
  - MINT_AMOUNT=amount to mint (optional)
- Run: `npm run deploy:mumbai`
- Verify contract on Polygonscan Mumbai and test minting functions.

4) Audit & review
- Consider a quick internal audit or third-party review before mainnet deploy.
- Test transferOwnership if using OWNER_ADDRESS to ensure multisig receives ownership.

5) Deploy to mainnet
- Update .env ALCHEMY_POLYGON_URL and PRIVATE_KEY (deployer with small balance).
- Run: `npm run deploy:polygon`
- Verify contract on Polygonscan (mainnet).

6) Post-deploy actions
- Transfer initial supply or mint required amounts to your Gnosis Safe.
- Add liquidity on QuickSwap (PISHA/USDC or PISHA/MATIC) from the multisig.
- Lock liquidity and publish proof (recommended).
- Submit listing requests (CoinGecko / CoinMarketCap) with verified contract address.

Support contact
- For support and inquiries: charging.bull.org@gmail.com

Security notes
- Never expose PRIVATE_KEY in the repo. Use a hardware wallet or Gnosis Safe.
- Use a multisig as the owner; consider a timelock or DAO for future decentralization.
