export const COVALENT_KEY = process.env.REACT_APP_COVALENT_KEY; // covalent api key
export const NFT_PORT_KEY = process.env.REACT_APP_NFT_PORT_KEY; // nft port key
export const INFURA_ID = process.env.REACT_APP_SALESPAGE_INFURA_ID; //Infura ID

export const APP_NAME = "Salespage";
export const APP_DESC = "A Point of Sale platform built on Polygon and IPFS"

export const CONNECT_PROMPT = 'Connect Wallet'

export const CHAIN_OPTIONS = {
  80001: {
    name: "Mumbai",
    url: "https://mumbai.polygonscan.com/",
    id: 80001,
  },
  137: {
    name: "Matic Mainnet",
    url: "https://polygonscan.com/",
    id: 137,
  },
};

export const DEMO_ITEMS = [
  {
    'name': 'Burrito',
    'usd': '8.99',
    'modifier': 'add cheese'
  },
  {
    'name': 'Chips',
    'usd': '1.99',
    'modifier': ''
  },
  {
    'name': 'Soda',
    'usd': '1.99',
    'modifier': ''
  },
]

export const CHAIN_IDS = Object.keys(CHAIN_OPTIONS)

// 1: { name: "ethereum", url: "https://etherscan.io/tx/", id: 1 },
// 42: { name: "kovan", url: "https://kovan.etherscan.io/tx/", id: 42 },
// 4: { name: "rinkeby", url: "https://rinkeby.etherscan.io/tx/", id: 4 },

export const ACTIVE_CHAIN = CHAIN_OPTIONS["80001"];

export const EXAMPLE_FORM = {
  title: "My restaurant",
  paymentAddress: "0xD7e02fB8A60E78071D69ded9Eb1b89E372EE2292",
  files: [],
};

export const IPFS_BASE_URL = "https://ipfs.io/ipfs"

console.log("config", INFURA_ID, COVALENT_KEY, NFT_PORT_KEY, ACTIVE_CHAIN);
