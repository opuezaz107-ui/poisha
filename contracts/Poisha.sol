// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Poisha ERC20 (mintable & burnable) — owner (multisig) controls minting and bulk airdrops
contract Poisha is ERC20, Ownable {
    uint256 public immutable cap; // maximum total supply (with decimals)

    event BulkAirdrop(address indexed operator, uint256 totalAmount);

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 cap_
    ) ERC20(name_, symbol_) {
        require(cap_ > 0, "Cap: zero");
        cap = cap_;
    }

    /// @notice Mint tokens to an address. Only owner (deployer/admin multisig) can mint.
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= cap, "Cap exceeded");
        _mint(to, amount);
    }

    /// @notice Burn tokens from caller.
    function burn(uint256 amount) external {
        _burn(_msgSender(), amount);
    }

    /// @notice Bulk airdrop: send many recipients amounts in a single tx.
    /// @dev Arrays must be same length. Emits BulkAirdrop event with sum.
    function bulkAirdrop(address[] calldata recipients, uint256[] calldata amounts) external onlyOwner {
        require(recipients.length == amounts.length, "Length mismatch");
        uint256 total = 0;
        for (uint256 i = 0; i < recipients.length; i++) {
            total += amounts[i];
        }
        require(totalSupply() + total <= cap, "Cap exceeded");
        for (uint256 i = 0; i < recipients.length; i++) {
            _mint(recipients[i], amounts[i]);
        }
        emit BulkAirdrop(_msgSender(), total);
    }
}
