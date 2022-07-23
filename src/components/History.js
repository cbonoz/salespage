import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Input, Select, Table } from "antd";
import { ACTIVE_CHAIN, APP_NAME, CHAIN_OPTIONS } from "../util/constants";
import { getTransactions } from "../util/covalent";
import { capitalize, getHistoryColumns, HISTORY_COLUMNS} from "../util";

import logo from '../assets/logo.png'

const { Option } = Select;


function History(props) {
  const [address, setAddress] = useState(
    "0xD7e02fB8A60E78071D69ded9Eb1b89E372EE2292"
  );
  const [chainId, setChainId] = useState(ACTIVE_CHAIN.id + "");
  const [loading, setLoading] = useState();
  const [data, setData] = useState();

  useEffect(() => {
    setData(undefined)
  }, [chainId])

  const fetchHistory = async () => {
    if (!address || !chainId) {
      alert("Address and chainId are required");
      return;
    }

    setLoading(true);
    try {
      const res = await getTransactions(chainId, address);
      setData(res.data.data.items);
    } catch (e) {
      console.error(e);
      alert("error getting signdata" + e);
    } finally {
      setLoading(false);
    }
  };

  const currentChain = CHAIN_OPTIONS[chainId];
  const cols = getHistoryColumns(address);

  return (
    <div>
      <div align='center'>
        <img className="history-logo" src={logo}/>
        <p>
          This page can be used to lookup {APP_NAME} transactions given a store owner address
          on <b>{currentChain.name}</b>.
        </p>
        <br/>
        <br/>
      </div>
      <Input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        prefix="Address"
      ></Input>
      <br />
      <p></p>
      <Select
        defaultValue={chainId}
        style={{ width: 120 }}
        onChange={(v) => setChainId(v)}
      >
        {Object.keys(CHAIN_OPTIONS).map((cId, i) => {
          return (
            <Option key={i} value={cId}>
              {capitalize(CHAIN_OPTIONS[cId].name)}
            </Option>
          );
        })}
      </Select>
      &nbsp;
      <Button onClick={fetchHistory} disabled={loading} loading={loading}>
        View transactions
      </Button>
      <br />
      <hr />
      {data && (
        <div>
          <h1>Transaction History</h1>
          <Table
            dataSource={data.filter(d => d.value > 0)}
            columns={cols}
            className="pointer"
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  console.log("event", event.target.value);
                  window.open(
                    `${currentChain.url}tx/${record.tx_hash}`,
                    "_blank"
                  );
                }, // click row
                onDoubleClick: (event) => {}, // double click row
                onContextMenu: (event) => {}, // right button click row
                onMouseEnter: (event) => {}, // mouse enter row
                onMouseLeave: (event) => {}, // mouse leave row
              };
            }}
          />
          ;
        </div>
      )}
    </div>
  );
}

History.propTypes = {};

export default History;