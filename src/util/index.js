import { ACTIVE_CHAIN, IPFS_BASE_URL } from "./constants";

export const ipfsUrl = (cid, fileName) => {
  // let url = `https://ipfs.io/ipfs/${cid}`;
  let url = `${IPFS_BASE_URL}/${cid}`;
  if (fileName) {
    return `${url}/${fileName}`;
  }
  return url;
};

export const createItemString = (items) => {
  return items.map(item => `${item.name}x${item.quantity || 1}`).join(', ')
}

export const salespageUrl = (cid) => `${window.location.origin}/page/${cid}`;

export function capitalize(string) {
  return (string.charAt(0).toUpperCase() + string.slice(1)).replace('_', ' ')
}

export const abbreviate = s => s ? `${s.substr(0, 6)}**` : ''

export const getExplorerUrl = (hash, useTx) =>
  `${ACTIVE_CHAIN.url}${useTx ? "tx/" : "address/"}${hash}`;

export const createJsonFile = (signload, fileName) => {
  const st = JSON.stringify(signload);
  const blob = new Blob([st], { type: "application/json" });
  const fileData = new File([blob], fileName);
  return fileData;
};

export const getDateStringFromTimestamp = (ts, showTime) => {
  const d = new Date(ts);
  if (showTime) {
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  }
  return d.toLocaleDateString();
};

export const col = (k, render) => ({
  title: capitalize(k),
  dataIndex: k,
  key: k,
  render,
});

const WEI_PER_UNIT=Math.pow(10,18)

export const getHistoryColumns = (currentAddress) => {
  return [
    col("type", (row, record, _) => {
      console.log('rec', record)
      return record['to_address']?.toLowerCase() === currentAddress?.toLowerCase() ? 'Inbound (Revenue)' : 'Outbound (Deduction)'
    }),
    col("tx_hash", (row) => abbreviate(row)),
    col("from_address", (row) => abbreviate(row)),
    col("value", row => row/WEI_PER_UNIT),
    col("block_signed_at",
      (row) =>
        `${new Date(row).toLocaleDateString()} ${new Date(
          row
        ).toLocaleTimeString()}`
    ),
  ]
};


export function bytesToSize(bytes) {
  var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes == 0) return "0 Byte";
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}

export const isEmpty = s => !s || s.length === 0

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

export function formatMoney(s) {
  if (!s) {
    return 'Free'
  }

  return formatter.format(s)
}
