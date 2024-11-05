// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AuraToken is ERC20 {
    constructor() ERC20("AuraToken", "AUR") {
        _mint(msg.sender, 1000 * 10 ** decimals());
    }
}
