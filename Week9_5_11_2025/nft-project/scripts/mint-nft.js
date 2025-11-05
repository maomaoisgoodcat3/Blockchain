const { ethers } = require("hardhat");

async function main() {
  // Triển khai contract
  const [deployer] = await ethers.getSigners();
  console.log("Triển khai với tài khoản:", deployer.address);

  const NFT = await ethers.getContractFactory("MyNFT");
  const nft = await NFT.deploy();
  await nft.waitForDeployment();
  console.log("✅ NFT deployed to:", await nft.getAddress());

  // Mint 1 NFT mới
  const tokenURI = "https://ipfs.io/ipfs/bafkreifav5akd4nfaa2p3gkwrtzqozmzsi5lwh7qzwlajzdz2m4qmxl554"; // link metadata của NFT
  const mintTx = await nft.mintNFT(deployer.address, tokenURI);
  await mintTx.wait();

  console.log("🎉 Minted NFT successfully!");
  console.log("Token ID:", (await nft.totalSupply?.()) || 1);
  console.log("Token URI:", tokenURI);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
