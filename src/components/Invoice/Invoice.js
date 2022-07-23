import { CheckCircleTwoTone } from "@ant-design/icons";
import { Button, Tooltip, Modal, Input, Result } from "antd";
import React, { useState, useMemo, useEffect } from "react";
import logo from "../../assets/logo.png";
import { abbreviate, formatMoney, getDateStringFromTimestamp } from "../../util";
import { getRates } from "../../util/coins";
import { ACTIVE_CHAIN, APP_NAME } from "../../util/constants";

import "./Invoice.css";

const IMG_WIDTH = "200px";

const DEMO_NUMBER =
  Date.now().toString(36) + Math.random().toString(36).substring(2);

// github.com/sparksuite/simple-html-invoice-template
function Invoice({
  storeName,
  address,
  paymentAddress,
  paid,
  ref,
  createdAt,
  logoUrl,
  pay,
  items=[],
  invoiceNumber=DEMO_NUMBER,
}) {
  const [rates, setRates] = useState()

  const total = useMemo(() => items 
    .map((item) => item.usd * (item.quantity || 1))
    .reduce(function (a, b) {
      return a + b;
    }, 0), [items])


  async function fetchRates() {
    try {
      const {data} = await getRates()
      setRates(data)
      console.log('rates', data)
    } catch (e) {
      console.error('err getting rates', e)
    }
  }

  useEffect(() => {
    fetchRates() 
  }, [])

  const amountString = `${formatMoney(total)} USD`
  const ethString = rates && total*rates.MATIC

  return (
    <div className="invoice-box" ref={ref}>
      {/* <p>
        <b>Transaction Complete! Please print this page.</b>
      </p> */}
      <table cellPadding="0" cellSpacing="0">
        <tbody>
          <tr className="top">
            <td colSpan="2">
              <table>
                <tr>
                  <td className="title">
                    <img
                      src={logoUrl || logo}
                      style={{ width: "100%", maxWidth: IMG_WIDTH }}
                    />
                  </td>

                  <td>
                    Purchase #:&nbsp;
                    <Tooltip
                      placement="top"
                      title={<span>{invoiceNumber}</span>}
                    >
                      {invoiceNumber.slice(0, 16)}
                    </Tooltip>
                    <br />
                    Created:&nbsp;
                    {getDateStringFromTimestamp(createdAt || Date.now(), true)}
                    <br />
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr className="information">
            <td colSpan="2">
              <table>
                <tr>
                  <td>
                    {storeName && <span><b>{storeName}</b><br/></span>}
                    Fulfilled by {APP_NAME}, Inc.
                    <br />
                    {/* 12345 Sunny Road */}
                  </td>

                  <td>
                    Your account: {abbreviate(address)}<br/>
                    Payable to: {abbreviate(paymentAddress)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

    
          <tr className="heading">
            <td>Item</td>
            <td>Price</td>
            <td>Quantity</td>
          </tr>

          {items.map(({ name: itemName, usd, quantity }, i) => (
            <tr className="item" key={i}>
              <td>{itemName}</td>
              <td>{formatMoney(usd)}</td>
              <td>
                {quantity}
              </td>
            </tr>
          ))}

          <br/>

        <tr className="heading">
            <td>Payment Method</td>
            <td>Check #</td>
          </tr>

          <tr className="details">
            <td>USD</td>

            <td>
              {/* {payId} */}
              {amountString}<br/>
              {ethString?.toFixed(4)} MATIC ({ACTIVE_CHAIN.name})
            </td>
          </tr>


          <tr className="total">
            <td>
              {/* <a href={url} target="_blank">
              View NFT
            </a> */}
              <br />
              <br />
              {!paid && <span>
                <Button
                  type="primary"
                  size="large"
                  className="standard-button"
                  onClick={() => pay(items, ethString)}
                >
                  Pay with wallet
                </Button>
              </span>}
              {paid && <div>
                <CheckCircleTwoTone twoToneColor="#00aa00" />
                  &nbsp;
                  Paid
              </div>}
            </td>

            <td>Total: {amountString}</td>
          </tr>
        </tbody>
      </table>
     
    </div>
  );
}

export default Invoice;
