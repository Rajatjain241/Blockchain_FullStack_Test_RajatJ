const { ethers, upgrades } = require("hardhat");

async function main() {
    // 1. Deploy ERC20 Token
    const FarmToken = await ethers.getContractFactory("FarmToken");
    const farmToken = await FarmToken.deploy();
    await farmToken.waitForDeployment();
    console.log(`✅ FarmToken deployed at: ${await farmToken.getAddress()}`);

    // 2. Deploy FarmAssetNFT (UUPS Upgradeable)
    const FarmAssetNFT = await ethers.getContractFactory("FarmAssetNFT");
    const farmAssetNFT = await upgrades.deployProxy(FarmAssetNFT, ["0xA0d02Ba23D9a47d321A3c2d4A7FA2D4c11636a88"], {
        initializer: "initialize",
        kind: "uups",
    });
    await farmAssetNFT.waitForDeployment();
    console.log(`✅ FarmAssetNFT (Proxy) deployed at: ${await farmAssetNFT.getAddress()}`);

    // 3. Deploy FarmAssetStaking with addresses
    const FarmAssetStaking = await ethers.getContractFactory("FarmAssetStaking");
    const farmStaking = await upgrades.deployProxy(
        FarmAssetStaking,
        ["0xA0d02Ba23D9a47d321A3c2d4A7FA2D4c11636a88", await farmAssetNFT.getAddress(), await farmToken.getAddress()],
        {
            initializer: "initialize",
            kind: "uups",
        }
    );
    await farmStaking.waitForDeployment();
    console.log(`✅ FarmAssetStaking (Proxy) deployed at: ${await farmStaking.getAddress()}`);
}

main().catch((error) => {
    console.error(error);
});
