// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

/**
 * MyTokenContract
 */
contract MyToken is ERC20, ERC20Burnable, Pausable, Ownable, ERC20Permit, ERC20Votes {

    // token Name
    string tokenName;
    // token Symbol
    string tokenSymbol;

    /**
     * constructor
     * @param _name token Name
     * @param _symbol token Symbol
     */
    constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) ERC20Permit(_name) {
        tokenName = _name;
        tokenSymbol = _symbol;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * mint method
     * @param to address
     * @param amount amount
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    /**
     * burn method
     * @param to address
     * @param amount amount 
     */
    function burn(address to, uint256 amount) public onlyOwner {
        _burn(to, amount);
    }

    /**
     * transfer token method
     * @param from address
     * @param to address
     * @param amount amount 
     */
    function _beforeTokenTransfer(address from, address to, uint256 amount) internal whenNotPaused override {
        super._beforeTokenTransfer(from, to, amount);
    }

    /**
     * transfer token method
     * @param from address
     * @param to address
     * @param amount amount 
     */
    function _afterTokenTransfer(address from, address to, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    /**
     * mint
     */
    function _mint(address to, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._mint(to, amount);
    }

    /**
     * burn 
     */
    function _burn(address account, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._burn(account, amount);
    }
}