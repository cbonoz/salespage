import { ethers } from "ethers";
import { createItemString } from "../util";
import { SALESPAGE_CONTRACT } from "./metadata";


// https://dapp-world.com/smartbook/how-to-use-ethers-with-polygon-k5Hn
export async function deployContract(provider, title, signerAddress) {

  //   https://dev.to/yosi/deploy-a-smart-contract-with-ethersjs-28no

  // Create an instance of a Contract Factory
  const factory = new ethers.ContractFactory(
    SALESPAGE_CONTRACT.abi,
    SALESPAGE_CONTRACT.bytecode,
    provider.getSigner()
  );

  const validatedAddress = ethers.utils.getAddress(signerAddress);

  // Start deployment, returning a promise that resolves to a contract object
  const contract = await factory.deploy(title, validatedAddress);
  await contract.deployed();
  console.log("Contract deployed to address:", contract.address);
  return contract;
}

export const validAddress = (addr) => {
  try {
    ethers.utils.getAddress(addr);
    return true;
  } catch (e) {
    return false;
  }
};

export const completePurchase = async (provider, contractAddress, pageId, items, amountEth) => {
  if (!contractAddress || !items) {
    return {};
  }

  const salespageContract = new ethers.Contract(
    contractAddress,
    SALESPAGE_CONTRACT.abi,
    provider.getSigner()
  );

  const itemString = createItemString(items)
  const value =  ethers.utils.parseEther(amountEth.toString())
  console.log('complete purchase', itemString, value, pageId, contractAddress, amountEth)
  const options = {value}
  const result = await salespageContract.completePurchase(itemString, options);
  return result;
};
