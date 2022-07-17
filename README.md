
<br/>
<p align='center'>
    <img src='./img/logo.png' width=600/>
</p>
<br/>

## Salespage 

A Point of Sale platform built on Polygon and IPFS

Prototype built for the HackFS 2022 hackathon.

### TODO
Add architecture diagram (showing different tech and app flow).
NFT mint post payment.
Manage existing salespages.

### Inspiration

Pain points:

- Many of these existing providers don't integrate cryptocurrency.
- Providers aren't distributed and suffer downsides of existing centralized platforms (vendor lock in, variable pricing, outages, credit card fees).
- History entrusted to a centralized authority vs. blockchain used a decentralized permanent record-keeping system of transactions.

### Features

- Upload images and descriptions for the live page. Metadata for each page is delivered via a Ceramic stream.
- Show sharable product pages hosted on IPFS.
- Integrated pricing and checkout using Unlock protocol (other payment integrations could also be added).
- Create a new wallet to support payments to help new businesses adopt and receive cryptocurrency payments.
- IPFS powered storage and transaction record keeping.
- Once the payment is complete, the user gets a receipt that they can show to the person in the store/restaurant, but an event also gets fired from the smart contract which could be subscribed to anywhere.

### Technologies used

- IPFS and Protocol labs (Hosting and sharing of assets): IPFS and Filecoin are the primary drivers making CheckoutFS possible. Using web3.storage, a storefront or product page creator can host a distributed menu or catalog of items available for purchase with cryptocurrency.
- Polygon: Smart contract 'Salespage' representing a unique store front.
- Ceramic: Used for storefront metadata storage and retrieval using streams (community node: https://developers.ceramic.network/run/nodes/community-nodes/). When a product page is accessed, a ceramic stream with the streamId of the page cid is opened and the metadata is rendered with the products from IPFS.
- NFTPort: NFT receipt after purchase.
- Covalent: Transaction history against a given salespage.

<!-- - Fluence: Price oracle interaction for rendering real time USD quotes on checkout pages based on latest Eth price. Fluence enables doing this without a deployed smart contract or other oracle. Custom checkout pages would also be generated via an IPNS call. -->

### How to run

Define the following env variables

<pre>
    REACT_APP_STORAGE_KEY = {YOUR_WEB3_STORAGE_KEY} #web3.storage api key
    REACT_APP_COVALENT_KEY = {YOUR_COVALENT_API_KEY} # covalent api key
    REACT_APP_NFT_PORT_KEY = {YOUR_NFT_PORT_API_KEY} # nft port key (client side mint currently)
    REACT_APP_SALESPAGE_INFURA_KEY = {YOUR_INFURA_API_KEY} # for client-side RPC calls.
</pre>

`yarn; yarn start`

<!-- Example simple checkout page already hosted on IPFS: http://localhost:3000/page/bafybeid67zzz5auzpc2botitsrp2lh2ybutnqkw3mej4s6dlrkthhmis5q -->


<!--
Demo flow:
1. Intro (compare with toast)
2. Assets (IPFS / filecoin / polygon)
3. Upload (IPFS / filecoin)
4. Generate CID with hosted content (IPFS / filecoin / ceramic)
7. Show salespage (ceramic / ipfs / polygon)
8. Show NFT receipt (NFTport).
9. History page of transactions.

-->

### Enhancements

## Screenshots

### Salespage

<img src="./img/home.png" width="800"/>

### Creating a new storefront

<img src="./img/step1.png" width="800"/>

### Upload complete

<img src="./img/complete.png" width="800"/>

### IPNS publish to publicize storefront uploads.

<img src="./img/ipns_generation.png" width="800"/>

### Creating shortcut or scannable link

<img src="./img/qr.png" width="800"/>

### Basic storefront

<img src="./img/store.png" width="800"/>


### Useful links
* https://ethglobal.com/events/hackfs2022/home
* https://ethglobal.com/events/hackfs2022/prizes

<!--
### Other links
* https://www.notion.so/Prizes-HackFS-d2aeebcda5694c7a9c06dc7aa2b7a2d8
* https://www.qr-code-generator.com/qr-code-api/?target=api-ad

React
* https://www.npmjs.com/package/react-catalog-view
* https://www.npmjs.com/package/react-image-gallery

-->
