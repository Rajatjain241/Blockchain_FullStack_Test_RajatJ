// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract FarmAssetStaking is
    Initializable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    IERC721 public farmAssetNFT;
    IERC20 public farmToken;

    struct StakeInfo {
        address owner;
        uint256 tokenId;
        uint256 startTime;
        bool staked;
    }

    mapping(uint256 => StakeInfo) public stakes;

    event Staked(address user, uint256 tokenId);
    event Unstaked(address user, uint256 tokenId);
    event RewardClaimed(address user, uint256 amount);

    function initialize(
        address _owner,
        address _farmNFT,
        address _farmToken
    ) public initializer {
        __Ownable_init(_owner);
        __UUPSUpgradeable_init();
        farmAssetNFT = IERC721(_farmNFT);
        farmToken = IERC20(_farmToken);
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    function stake(uint256 tokenId) public {
        require(!stakes[tokenId].staked, "Already staked");
        require(farmAssetNFT.ownerOf(tokenId) == msg.sender, "Not owner");
        farmAssetNFT.transferFrom(msg.sender, address(this), tokenId);

        stakes[tokenId] = StakeInfo(msg.sender, tokenId, block.timestamp, true);
        emit Staked(msg.sender, tokenId);
    }

    function claimReward(uint256 tokenId) public {
        StakeInfo storage info = stakes[tokenId];
        require(info.owner == msg.sender, "Not owner");
        require(info.staked, "Not staked");

        uint256 timeStaked = block.timestamp - info.startTime;
        uint256 rewardAmount = timeStaked / 1 days; // 1 token per day

        if (rewardAmount > 0) {
            info.startTime = block.timestamp;
            farmToken.transfer(msg.sender, rewardAmount * 1e18);
            emit RewardClaimed(msg.sender, rewardAmount);
        }
    }

    function unstake(uint256 tokenId) public {
        StakeInfo storage info = stakes[tokenId];
        require(info.owner == msg.sender, "Not owner");
        require(info.staked, "Not staked");

        claimReward(tokenId);

        info.staked = false;
        farmAssetNFT.transferFrom(address(this), msg.sender, tokenId);
        emit Unstaked(msg.sender, tokenId);
    }
}
