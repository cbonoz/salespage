//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract Salespage is Ownable {
    // A Salespage contract represents a storefront.
    
    string private title; // Title of the salespage contract.
    string private resourceUrl; // Link to the salespage metadata (items, prices ,etc.)
    address private paymentAddress; // Designated payment.

    event PurchaseCompleted(address payment, uint amount);

    constructor(string memory _title, address _paymentAddress) {
        console.log("Deploying a Salespage contract with title:", _title);
        title = _title;
        paymentAddress = _paymentAddress;
    }

    function updateResourceUrl(string memory newUrl) external onlyOwner {
        emit UpdatedResourceUrl(resourceUrl, newUrl);
        resourceUrl = newUrl;
    }

    function completePurchase(string memory _transactionGuid) public {
        // signatureUrl is the url of the completed salespage receipt.
        // Assert caller has the same address as seller address else fail.
        emit completePurchase();
        completed = true;
    }

    function getTitle() public view returns (string memory) {
        return title;
    }

    function getResourceUrl() public view returns (string memory) {
        return resourceUrl;
    }


}
