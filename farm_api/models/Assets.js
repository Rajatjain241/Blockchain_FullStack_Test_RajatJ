const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema({
    name: String,
    type: String,
    status: {
        type: String,
        enum: ["available", "tokenized", "staked", "sold"],
        default: "available",
    },
    owner_id: String,
    token_id: Number,
    price: Number,
});

module.exports = mongoose.model("Asset", assetSchema);
