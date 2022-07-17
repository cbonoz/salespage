//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract Salespage is Ownable {
    // A Salespage contract represents a unique storefront.
    
    string private title; // Title of the salespage contract (Store name).
    address private paymentAddress; // Designated payment address for incoming orders.

    // Flag to determine whether or not purchase orders can be accepted/emitted from contract.
    bool isOpen; 

    event PurchaseCompleted(address payer, uint amount, string items);

    constructor(string memory _title, address _paymentAddress) {
        console.log("Deploying a Salespage contract with title:", _title);
        title = _title; // A new Salespage should be created if the title changes.
        paymentAddress = _paymentAddress;
        isOpen = true;
    }

    function toggleOpen() public onlyOwner returns (bool) {
        isOpen = !isOpen;
        return isOpen;
    }

    function setPaymentAddress(address _paymentAddress) public onlyOwner returns (address) {
        paymentAddress = _paymentAddress;
        return paymentAddress;
    }

    function completePurchase(string memory _items) public payable {
        // signatureUrl is the url of the completed salespage receipt.
        // Assert caller has the same address as seller address else fail.
        require(isOpen, "Store is currently not accepting orders!");
        payable(paymentAddress).transfer(msg.value);
        emit PurchaseCompleted(msg.sender, msg.value, _items);
    }

    function getTitle() public view returns (string memory) {
        return title;
    }

}
