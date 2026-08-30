const hre = require("hardhat");

async function main() {
  const name = process.env.TOKEN_NAME || "Poisha";
  const symbol = process.env.TOKEN_SYMBOL || "PISHA";
  const capStr = process.env.TOKEN_CAP || "1000000000"; // base units without decimals
  const decimals = process.env.TOKEN_DECIMALS || "18";
  const initialOwner = process.env.OWNER_ADDRESS || "";
  const mintTo = process.env.MINT_TO || "";
  const mintAmountStr = process.env.MINT_AMOUNT || "0";

  const cap = hre.ethers.utils.parseUnits(capStr, decimals);

  console.log(`Deploying Poisha with cap ${capStr} (decimals ${decimals})`);

  const Poisha = await hre.ethers.getContractFactory("Poisha");
  const token = await Poisha.deploy(name, symbol, cap);
  await token.deployed();
  console.log("Poisha deployed to:", token.address);

  if (initialOwner) {
    console.log("Transferring ownership to", initialOwner);
    const tx = await token.transferOwnership(initialOwner);
    await tx.wait();
    console.log("Ownership transferred");
  }

  if (mintTo && mintAmountStr !== "0") {
    const mintAmount = hre.ethers.utils.parseUnits(mintAmountStr, decimals);
    console.log(`Minting ${mintAmountStr} ${symbol} to ${mintTo}`);
    const tx2 = await token.connect(hre.ethers.provider.getSigner()).mint(mintTo, mintAmount);
    await tx2.wait();
    console.log("Minted");
  }

  console.log("Done");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
