const { ethers } = require("ethers");
require("dotenv").config();
const fs = require("fs");

const provider = new ethers.JsonRpcProvider(`https://polygon-amoy.infura.io/v3/${process.env.INFURA_API_KEY}`);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const walletAddress = wallet.address;

const nftAbi = JSON.parse(fs.readFileSync(`./contracts/nftContractAbi.json`));
const nftContract = new ethers.Contract(process.env.NFT_CONTRACT_ADDRESS, nftAbi, wallet);

const stakingAbi = JSON.parse(fs.readFileSync(`./contracts/stakingContractAbi.json`));
const stakingContract = new ethers.Contract(process.env.STAKING_CONTRACT_ADDRESS, stakingAbi, wallet);

module.exports = {
    provider,
    walletAddress,
    nftContract,
    stakingContract
};
