// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AuraToken is ERC20 {
    address private _owner;
    uint256 private _mintAmount = 0;
    uint256 private _mintDelay = 60 * 60 * 24; // 1 day

    mapping(address => uint256) private _netxMintTime;

    constructor() ERC20("AuraToken", "AUR") {
        _owner = msg.sender;
        _mint(msg.sender, 1000 * 10 ** decimals());
    }

    function mint(address to) public onlyOwner {
        require(_mintAmount > 0, "AuraToken: mint amount is 0");
        require(
            _netxMintTime[to] < block.timestamp,
            "AuraToken: mint is not allowed yet"
        );
        _mint(to, _mintAmount);
        _netxMintTime[to] = block.timestamp + _mintDelay;
    }

    function setMintAmount(uint amount) public onlyOwner {
        _mintAmount = amount;
    }

    function setMintDelay(uint256 delayInSeconds) public onlyOwner {
        _mintDelay = delayInSeconds;
    }

    modifier onlyOwner() {
        require(
            msg.sender == _owner,
            "AuraToken: only owner can call this function"
        );
        _;
    }
}
