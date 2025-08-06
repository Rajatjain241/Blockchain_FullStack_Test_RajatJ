const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const assetRoutes = require("./routes/assets");
const app = express();
app.use(cors())
app.use(express.json());
app.use("/assets", assetRoutes);

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () => {
        console.log(`Server running on http://localhost:${process.env.PORT}`);
    });
});
