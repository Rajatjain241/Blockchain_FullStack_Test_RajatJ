// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract FarmAssetNFT is
    Initializable,
    ERC721URIStorageUpgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    uint256 public tokenCounter;

    struct AssetInfo {
        uint256 price;
        bool forSale;
    }

    mapping(uint256 => AssetInfo) public assetInfo;

    event Minted(uint256 tokenId, address owner, string uri);
    event Listed(uint256 tokenId, uint256 price);
    event Purchased(uint256 tokenId, address buyer);

    function initialize(address _owner) public initializer {
        __ERC721_init("FarmAssetNFT", "FANFT");
        __ERC721URIStorage_init();
        __Ownable_init(_owner);
        __UUPSUpgradeable_init();
        tokenCounter = 0;
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    function mintAsset(
        address buyer,
        string memory tokenURI
    ) public returns (uint256) {
        uint256 tokenId = tokenCounter;
        _safeMint(buyer, tokenId);
        _setTokenURI(tokenId, tokenURI);
        tokenCounter++;
        emit Minted(tokenId, buyer, tokenURI);
        return tokenId;
    }

    function listAsset(address owner, uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == owner, "Not the owner");
        assetInfo[tokenId] = AssetInfo(price, true);
        emit Listed(tokenId, price);
    }

    function purchaseAsset(address buyer, uint256 tokenId) public payable {
        AssetInfo memory info = assetInfo[tokenId];
        require(info.forSale, "Not for sale");
        require(msg.value == info.price, "Incorrect price");

        address seller = ownerOf(tokenId);
        _transfer(seller, buyer, tokenId);

        payable(seller).transfer(msg.value);
        assetInfo[tokenId].forSale = false;

        emit Purchased(tokenId, buyer);
    }

    function getAssetDetails(
        uint256 tokenId
    )
        public
        view
        returns (address owner, uint256 price, bool forSale, string memory uri)
    {
        return (
            ownerOf(tokenId),
            assetInfo[tokenId].price,
            assetInfo[tokenId].forSale,
            tokenURI(tokenId)
        );
    }
}
