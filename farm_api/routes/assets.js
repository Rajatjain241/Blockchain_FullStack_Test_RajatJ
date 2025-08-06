const express = require("express");
const router = express.Router();
const Asset = require("../models/Assets");
const { stakingContract, nftContract, provider } = require("../web3");

// POST /assets — Create & Mint NFT
router.post("/", async (req, res) => {
    const { name, type, status, owner_id, price, tokenURI } = req.body;

    try {
        const tx = await nftContract.mintAsset(tokenURI);
        const receipt = await tx.wait();
        const receiptLogs = await provider.getTransactionReceipt(receipt.hash);
        const tokenId = receiptLogs.logs[1].data;

        const asset = new Asset({ name, type, status: "tokenized", owner_id, token_id: Number(tokenId), price });
        await asset.save();

        res.status(201).json({ asset, txHash: receipt.transactionHash });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /assets — Get all or filter by owner/sale
router.get("/", async (req, res) => {
    const { owner_id, forSale } = req.query;

    let filter = {};
    if (owner_id) filter.owner_id = owner_id;
    if (forSale === "true") filter.status = "available";

    try {
        const assets = await Asset.find(filter);
        res.json(assets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /assets/:id — Update asset (e.g., price, status)
router.put("/:id", async (req, res) => {
    try {
        const updated = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /assets/:id/stake — Stake asset NFT
router.post("/:id/stake", async (req, res) => {
    const assetId = req.params.id;

    try {
        const asset = await Asset.findById(assetId);
        if (!asset) return res.status(404).json({ error: "Asset not found" });

        const approveTx = await nftContract.approve(await stakingContract.getAddress(), asset.token_id);
        await approveTx.wait();
        const stakeTx = await stakingContract.stake(asset.token_id);
        const receipt = await stakeTx.wait();
        if (receipt.status == 0) return res.status(404).json({ error: "Transaction failed" });

        asset.status = "staked";
        await asset.save();

        res.json({ message: "Asset staked", txHash: receipt.transactionHash });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// list asset
router.post("/:id/list", async (req, res) => {
    const assetId = req.params.id;

    try {
        const asset = await Asset.findById(assetId);
        if (!asset) return res.status(404).json({ error: "Asset not found" });

        const details = await nftContract.getAssetDetails(0);
        console.log('details', details)
        const listTx = await nftContract.listAsset(asset.token_id, 5000000);
        const receipt = await listTx.wait();
        if (receipt.status == 0) return res.status(404).json({ error: "Transaction failed" });

        res.json({ message: "Asset listed", txHash: receipt.transactionHash });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
