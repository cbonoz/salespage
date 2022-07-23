import React, { useState, useEffect, useMemo } from "react";
import { Button, Card, Col, Empty, Input, Modal, Result, Row, Spin, Tooltip } from "antd";
import { useParams } from "react-router-dom";
import { fetchMetadata, retrieveFiles } from "../util/stor";
import { formatMoney, getExplorerUrl, ipfsUrl, isEmpty } from "../util";
import { APP_NAME, DEMO_ITEMS } from "../util/constants";
import { completePurchase } from "../contract/deploy";
import { InfoCircleOutlined, MinusCircleFilled, PlusCircleFilled } from "@ant-design/icons";
import salespageLogo from '../assets/icon.png'
import Meta from "antd/lib/card/Meta";
import Invoice from "./Invoice/Invoice";
import { loadStream } from "../util/ceramic";
import { createReceiptNft } from "../util/nftport";

function Salespage({ account, provider, login, logout }) {
  const { pageId } = useParams(); // cid
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState({})
  const [result, setResult] = useState();
  const [modifierText, setModifierText] = useState()
  const [activeItem, setActiveItem] = useState()
  const [showInvoice, setShowInvoice] = useState()
  const [error, setError] = useState()

  const fetchData = async () => {
    console.log("fetch", pageId);
    if (!pageId) {
      return;
    }

    setLoading(true);
    let res;

    try {
      // TODO: replace with ceramic stream id lookup.
      res = await fetchMetadata(pageId);
      const { streamId } = res.data

      const streamData = await loadStream(streamId);
      console.log("salespage request", streamData);
      setData({streamId, ...streamData})
    } catch (e) {
      console.error(e);
      // alert("error getting salespage data" + e);
    } finally {
      setLoading(false);
    }
  };

  const updateModifier = (item, modifier) => {
    cartItems[item.name].modifier = modifier
    setCartItems({...cartItems})
    setActiveItem(undefined)
  }

  useEffect(() => {
    fetchData();
  }, [pageId]);

  const { description, title, paymentAddress, address: contractAddress } = data;

  const completePayment = async (itemsToPurchase, amountEth) => {
    setError('')
    if (!provider || !account) {
      return await login(false)
    }

    console.log('completePayment', amountEth)
    let nftResults = {};
    let res;

    setLoading(true);

    try {
      //   https://docs.nftport.xyz/docs/nftport/b3A6MjE2NjM5MDM-easy-minting-w-url

      res = await completePurchase(provider, contractAddress, pageId, itemsToPurchase, amountEth);
      nftResults = await createReceiptNft(
        title,
        description,
        account,
      );
      res["receipt"] = nftResults.data || {}
      console.log('result', res)
      setResult(res);
      logout()
    } catch (e) {
      console.error("error checking out", e);
      // alert("Error completing salespage: " + JSON.stringify(e));
      setError(e.message || e.toString())
    } finally {
      setLoading(false);
    }
  };

  const modifyQuantity = (item, amount) => {
    if (!amount) {
      return
    }
    const existing = cartItems[item.name]
    if (!existing) {
      item.quantity = 0
      cartItems[item.name] = item
    }
    cartItems[item.name].quantity += amount
    if (cartItems[item.name].quantity <= 0) {
      delete cartItems[item.name]
    }
    setCartItems({...cartItems})
  }

  const items = useMemo(() => {
    if (data.files) {
      return data.files.map((name, i) => {
        const d = data[name]
        return {
          ...d,
          // TODO: get ipfs url
          imgUrl: ipfsUrl(pageId, name)
        }
      })

    }
    return []// DEMO_ITEMS
  }, [data]);

  if (loading) {
    return (
      <div className="container">
        <Spin size="large" />
      </div>
    );
  }

  const pageTitle = title || `${APP_NAME} checkout`;
  const activeItems = Object.values(cartItems);
  const noItems = isEmpty(activeItems);

  if (showInvoice) {
    return <div className="container boxed white">
      {result && <div>
       <Result
          status="success" 
          title="Transaction complete!" 
          subTitle="Present this page as proof of payment"
          extra={[
            <Button href={getExplorerUrl(result?.hash, true)} type="primary" key="console">
              View transaction
            </Button>
          ]}
        >

          
          <p><b>Receipt NFT:</b> {JSON.stringify(result['receipt'], null, '\t')}</p>
        </Result>
      </div>}
    <Invoice 
        storeName={pageTitle}
        address={account}
        paymentAddress={paymentAddress}
    paid={!!result} name={data.pageTitle} items={activeItems} pay={completePayment}/>
    <br/>
    {error && <p className="centered standard-button error-text">Error completing purchase - {error}</p>}
  </div>
  }

  return (<>
      <div className="centered salespage-header">
          <img src={data.storeLogo || salespageLogo} className='page-logo'/>
          <h2 className="centered">{pageTitle}</h2>
          <div>Purchase Page<br/>Add items to cart. Complete payment and get a proof of purchase receipt sent to your wallet.</div>
      </div>

    <div className="container boxed white">
      <Row>
        <Col span={7}>
          <Card title="Your items">
          {noItems && <Empty 
          image="https://cdn-icons-png.flaticon.com/512/34/34627.png"
          imageStyle={{
            height: 60,
          }}
          description="No items in cart">
            Click an item on the right to get started!
            </Empty>}
          {activeItems.map((item, i) => {
            return <div className="itemrow">
              {item.name}&nbsp;<Tooltip title="Add modifier to item">
                  <InfoCircleOutlined className="pointer" onClick={() => setActiveItem(item)}/>
                </Tooltip>
              <span className="float-right bold">
              x{item.quantity}
              </span>
              {item.modifier && <span>
                <br/>  
                {item.modifier}
              </span>}
            </div>
          })}
            {!noItems && <div className="checkout-area">
            <Button className="standard-button" type="primary" onClick={() => setShowInvoice(true)}>Go to checkout</Button>
          </div>}
</Card>
      
        </Col>
      <Col span={17}>
      {items.map((item, i) => {
        const imgUrl = item.imgUrl || "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png";
        return <Card
        className="item-card"
        // style={{ width: 300 }}
        cover={
          <img
            className="item-card-image"
            alt={item.name}
            src={imgUrl}
          />
        }
        actions={[
          <MinusCircleFilled key="minus" onClick={() => modifyQuantity(item, -1)} />,
          <PlusCircleFilled key="plus" onClick={() => modifyQuantity(item, 1)} />,
        ]}
      >
        <Meta
          title={item.name || 'Item title'}
          description={`${item.description || 'No description'}. ${formatMoney(item.usd)}`}
        />
      </Card>
      })}

      </Col>
      </Row>

      <Modal title={"Add modifier to " + activeItem?.name} visible={!!activeItem} okText="Save" onCancel={() => setActiveItem(undefined)} onOk={() => updateModifier(activeItem, modifierText)}>
        <Input
          value={modifierText}
          prefix={'Add request: '}
          onChange={e => setModifierText(e.target.value)}
          />
      </Modal>
    </div>
  </>
  );
}

Salespage.propTypes = {};

export default Salespage;
