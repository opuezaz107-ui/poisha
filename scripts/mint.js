const hre = require("hardhat");

async function main() {
  const tokenAddress = process.env.TOKEN_ADDRESS;
  const to = process.env.TO;
  const amountStr = process.env.AMOUNT || "0";
  const decimals = process.env.TOKEN_DECIMALS || "18";

  if (!tokenAddress) throw new Error("TOKEN_ADDRESS env required");
  if (!to) throw new Error("TO env required");

  const Token = await hre.ethers.getContractFactory("Poisha");
  const token = Token.attach(tokenAddress);
  const amount = hre.ethers.utils.parseUnits(amountStr, decimals);
  const tx = await token.mint(to, amount);
  await tx.wait();
  console.log(`Minted ${amountStr} to ${to}`);
}

main().catch((err) => { console.error(err); process.exitCode = 1; });
