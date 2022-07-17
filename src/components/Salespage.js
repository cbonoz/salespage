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

function Salespage({ account, provider }) {
  const { pageId } = useParams(); // cid
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState({})
  const [result, setResult] = useState();
  const [modifierText, setModifierText] = useState()
  const [activeItem, setActiveItem] = useState()
  const [showInvoice, setShowInvoice] = useState()

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

  const { description, title, signerAddress, address: contractAddress } = data;

  const completePayment = async (amountEth) => {
    console.log('completePayment', amountEth)
    let nftResults = {};
    let res;

    setLoading(true);

    try {
      //   https://docs.nftport.xyz/docs/nftport/b3A6MjE2NjM5MDM-easy-minting-w-url
      // let res = await createReceiptNft(
      //   title,
      //   description,
      //   signerAddress,
      //   signatureData
      // );
      // nftResults["signatureNft"] = res.data;
      const url = nftResults["transaction_external_url"];
      res = await completePurchase(provider, contractAddress, url || pageId, amountEth);
      nftResults = { nftResults, ...res };
      console.log('result', nftResults)
      setResult(nftResults);
    } catch (e) {
      console.error("error checking out", e);
      alert("Error completing salespage: " + JSON.stringify(e));
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
    return DEMO_ITEMS
  }, [data]);

  if (loading) {
    return (
      <div className="container">
        <Spin size="large" />
      </div>
    );
  }

  const pageTitle = data.title || `${APP_NAME} checkout`;
  const activeItems = Object.values(cartItems);
  const noItems = isEmpty(activeItems);

  if (showInvoice) {
    return <div className="container boxed white">
      {result && <div>
       <Result

          title="Transaction complete!" 
          subTitle="Present this page as proof of payment"
          extra={[
            // <Button href={trans} type="primary" key="console">
            //   View transaction
            // </Button>
          ]}
        >

          
          {JSON.stringify(result)}
        </Result>
      </div>}
    <Invoice paid={!!result} name={data.pageTitle} items={activeItems} pay={completePayment}/>
  </div>
  }

  return (
    <div className="container boxed white">
        <div className="centered">
        <img src={data.storeLogo || salespageLogo} className='page-logo'/>
        <h2 className="centered">{pageTitle}</h2>
        <br/>
    </div>

      <Row>
        <Col span={6}>
          {noItems && <Empty description="No items in cart"/>}
          {activeItems.map((item, i) => {
            return <div className="itemrow">
              {item.name} x{item.quantity}
              <span className="float-right">
                <Tooltip title="Add modifier to item">
                  <InfoCircleOutlined className="pointer" onClick={() => setActiveItem(item)}/>
                </Tooltip>
              </span>
              {item.modifier && <span>
                <br/>  
                {item.modifier}
              </span>}
            </div>
          })}

          {!noItems && <div className="checkout-area">
            <Button type="primary" onClick={() => setShowInvoice(true)}>Go to checkout</Button>
          </div>}
        </Col>
      <Col span={18}>
      {items.map((item, i) => {
        const imgUrl = item.imgUrl || "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png";
        return <Card
        className="item-card"
        // style={{ width: 300 }}
        cover={
          <img
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
  );
}

Salespage.propTypes = {};

export default Salespage;
