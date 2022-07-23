import axios from "axios";
import { COVALENT_KEY } from "./constants";

// Fetch transactions against a given Salespage owner address (measures activity).
export const getTransactions = (chainId, address) => {
  const url = `https://api.covalenthq.com/v1/${chainId}/address/${address}/transactions_v2/?&key=${COVALENT_KEY}`;
  return axios.get(url);
};

// Fetch historic balances for a given Salespage owner address (measures performance).
export const getBalances = (chainId, address) => {
  const url = `https://api.covalenthq.com/v1/${chainId}/address/${address}/portfolio_v2/?&key=${COVALENT_KEY}`;
  return axios.get(url);
}