import React, { useState } from "react";
import { Button, Input, Row, Col, Radio, Steps, Result } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { salespageUrl, ipfsUrl, getExplorerUrl } from "../util";
import { APP_NAME, EXAMPLE_FORM } from "../util/constants";
import { storeFiles } from "../util/stor";
import { deployContract, validAddress } from "../contract/deploy";
import { FileDropzone } from "./FileDropzone/FileDropzone";
import { createStream } from "../util/ceramic";

const { Step } = Steps;

function CreateSalespage({provider}) {
  const [data, setData] = useState({ ...EXAMPLE_FORM });
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();

  const updateData = (key, value) => {
    setData({ ...data, [key]: value });
  };

  const isValid = (data) => {
    return (
      data.title &&
      data.files.length > 0 &&
      validAddress(data.paymentAddress)
    );
  };
  const isValidData = isValid(data);

  const create = async () => {
    setError(undefined);

    if (!isValidData) {
      setError(
        "Please provide a store name, valid address, and at least one file."
      );
      return;
    }

    setLoading(true);
    const body = { ...data };

    // Format files for upload.
    const files = body.files.map((x) => {
      return x;
    });

    let res = { ...data };

    try {
      // 1) deploy base contract with metadata,
      const contract = await deployContract(provider, data.title, data.paymentAddress);
      res["address"] = contract.address
      res["files"] = files.map(f => f.path)

      // 2) Create stream
      const streamId = await createStream(res);
      res['streamId'] = streamId;

      const blob = new Blob([JSON.stringify({streamId})], { type: 'application/json' })
      const metadataFile = new File([blob], 'metadata.json')
      const allFiles = [...files, metadataFile]

      // 3) Upload files to ipfs,
      const cid = await storeFiles(allFiles);
      res['cid'] = cid;

      // 4) return shareable url.
      res["salespageUrl"] = salespageUrl(cid); // Could use stream or cid.
      res["contractUrl"] = getExplorerUrl(res.address);

      // Result rendered after successful doc upload + contract creation.
      setResult(res);
      try {
        // await postPacket(res.salespage request);
      } catch (e) {
        console.error("error posting salespage request", e);
      }
    } catch (e) {
      console.error("error creating salespage request", e);
      setError(e.message || e.toString())
    } finally {
      setLoading(false);
    }
  };

  const getStep = () => {
    if (!!result) {
      return 2;
    } else if (isValidData) {
      return 1;
    }
    return 0;
  };

  return (
    <div>
      <Row>
        <Col span={24}>
        <div>
          <h1 className="centered">Create Salespage</h1>
          <br/>
          <br/>
            <Steps
              className="standard-margin"
              direction="horizontal"
              size="small"
              current={getStep()}
            >
              <Step title="Fill in fields" description="Enter required data." />
              <Step
                title="Create salespage"
                description="Requires authorizing a create Salespage contract transaction."
              />
              <Step
                title="Done"
                description="Your salespage will be live for others to view and complete purchases."
              />
            </Steps>
          </div>
          <br/>
        </Col>
      </Row>
      <Row>
        
        <Col span={24}>
       
          {!result && <div className="create-form white boxed">

            {/* <h2>Create new salespage request</h2> */}
            <br />

            <h3 className="vertical-margin">Store name:</h3>
            <Input
              placeholder="Name of the Salespage"
              value={data.title}
              prefix="Name: "
              onChange={(e) => updateData("name", e.target.value)}
            />
            {/* <TextArea
              aria-label="Description"
              onChange={(e) => updateData("description", e.target.value)}
              placeholder="Description of the salespage request"
              prefix="Description"
              value={data.description}
            /> */}

            {/* TODO: add configurable amount of items */}
            <h3 className="vertical-margin">Upload images:</h3>
            <FileDropzone
              info={data}
              updateInfo={updateData}
              files={data.files}
              setFiles={(files) => updateData("files", files)}
            />

            <h3 className="vertical-margin">Enter payment address:</h3>
            <p>
              Enter payment address for this {APP_NAME}. Defaults to current address.
            </p>
            <Input
              placeholder="Payment address"
              value={data.paymentAddress}
              prefix="Payment Address: "
              onChange={(e) => updateData("paymentAddress", e.target.value)}
            />
            <br />

            <Button
              type="primary"
              className="standard-button"
              onClick={create}
              disabled={loading} // || !isValidData}
              loading={loading}
            >
              Create {APP_NAME}!
            </Button>
            {!error && !result && loading && (
              <span>&nbsp;Note this may take a few moments.</span>
            )}
            {error && <div className="error-text">{error}</div>}
            </div>}
            {result && (
              <div>
                {/* https://ant.design/components/result/ */}
                <Result
                  status="success"
                  title={`Created ${APP_NAME}`}
                  subTitle="See below for information"
                  extra={[
                    <Button href={result.salespageUrl} type="primary" key="console">
                      Open {APP_NAME}
                    </Button>,
                    <Button href={ipfsUrl(result.cid)} key="metadata">View metadata</Button>,
                    <Button href={result.contractUrl} key="contract">View contract</Button>,
                  ]}
                />
              </div>
            )}
        </Col>
        <Col span={1}></Col>
        <Col span={7}>
          
        </Col>
      </Row>
    </div>
  );
}

CreateSalespage.propTypes = {};

export default CreateSalespage;
