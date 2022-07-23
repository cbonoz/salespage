import React from "react";
import { Row, Col, Button } from "antd";
import logo from "../assets/home2.png";
import ReactRotatingText from "react-rotating-text";
import { useNavigate } from "react-router-dom";
import { APP_DESC, APP_NAME, CONNECT_PROMPT } from "../util/constants";
import { CheckCircleOutlined, CheckCircleTwoTone } from "@ant-design/icons";


const CHECKLIST_ITEMS = [
  "Create instant point of sale pages with no minimum fees.",
  "Each page is managed by its own dedicated smart contract.",
  "Every receipt generated as an NFT.",
];

function Home({account}) {
  const navigate = useNavigate();

  const goToCreate = () => {
    navigate("/create");
  };

  return (
    <div className="hero-section">
      <Row>
        <Col span={12}>
          <div className="hero-slogan-section">
            <div className="hero-slogan">
              <p>
                {APP_DESC} for&nbsp;
                <ReactRotatingText
                  items={["businesses", "restaurants", "retail"]}
                />
                .
              </p>
            </div>
            {/* // "#eb2f96" */}
            {CHECKLIST_ITEMS.map((item, i) => {
              return (
                <p>
                  <CheckCircleTwoTone twoToneColor="#00aa00" />
                  &nbsp;
                  {item}
                </p>
              );
            })}
            <br />

            <Button type="primary" size="large" onClick={goToCreate}>
              {account ? 'Create salespage request' : CONNECT_PROMPT}
            </Button>
          </div>
        </Col>
        <Col span={12}>
          <div className="centered">
          <img src={logo} className="hero-image" />
          <p><i>An example checkout page dynamically created by {APP_NAME}.</i></p>
        </div>
        </Col>
      </Row>
    </div>
  );
}

Home.propTypes = {};

export default Home;
