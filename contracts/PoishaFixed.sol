// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title PoishaFixed — fixed supply ERC20 (no minting functions)
contract PoishaFixed is ERC20 {
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 totalSupply_,
        address initialHolder
    ) ERC20(name_, symbol_) {
        require(initialHolder != address(0), "Invalid holder");
        _mint(initialHolder, totalSupply_);
    }
}
