
// Import `connect` from the Tableland library
import { connect } from "@tableland/sdk";
import { ACTIVE_CHAIN } from "./constants";

// Connect to the Tableland testnet (defaults to Goerli testnet)
// @return {Connection} Interface to access the Tableland network and target chain
const tableland = await connect({ network: "testnet", chainId: ACTIVE_CHAIN.id });

// Create a new table with a supplied SQL schema and optional `prefix`
// @return {Connection} Connection object, including the table's `name`
const { name: TABLE_NAME } = await tableland.create(
  `pageId text, name text, description text, usd real, url text, primary key (pageId, name)`, // Table schema definition
  `salespage_items` // Optional `prefix` used to define a human-readable string
);

// The table's `name` is in the format `{prefix}_{chainId}_{tableId}`
console.log('table', TABLE_NAME); // e.g., mytable_5_30
// Without the supplied `prefix`, `name` would be be `_5_30`

// Insert a row into the table
// @return {WriteQueryResult} On-chain transaction hash of the write query

export const writeRow = async (rowId, {name, description, usd, url}) => {
    const writeRes = await tableland.write(`INSERT INTO ${TABLE_NAME} (pageId, name, description, usd, url) VALUES (${rowId}, ${name}, ${description}, ${usd}, ${url});`);
    return writeRes
}

export const readRow = async (pageId) => {
    const readRes = await tableland.read(`SELECT * FROM ${TABLE_NAME} where pageId=${pageId};`);
    return readRes
}
