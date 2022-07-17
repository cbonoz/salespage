import React, { useEffect, useState } from "react";

import { Route, Routes, useNavigate } from "react-router-dom";

import Home from "./components/Home";
import CreateSalespage from "./components/CreateSalespage";
import { Layout, Menu, Breadcrumb, Button } from "antd";
import { ACTIVE_CHAIN, APP_DESC, APP_NAME, CONNECT_PROMPT } from "./util/constants";
import History from "./components/History";
import logo from "./assets/logo.png";

import "./App.css";
import { web3ModalSetup } from "./util/web3util";
import Salespage from "./components/Salespage";
import { ethers } from "ethers";
import { abbreviate } from "./util";
import { initCeramic } from "./util/ceramic";

const { Header, Content, Footer } = Layout;

export const web3Modal = web3ModalSetup()

function App() {
  const [account, setAccount] = useState();
  const [provider, setProvider] = useState();
  const [loading ,setLoading] = useState(false);

  async function login(checkOnInit) {
    if (checkOnInit && !web3Modal.cachedProvider) {
      // Don't force login if no cached provider.
      return
    }
    try {
      const instance = await web3Modal.connect();
      const p = new ethers.providers.Web3Provider(instance);
      setProvider(p)
      const accounts = await p.listAccounts()
      const addr = accounts[0]
      setAccount(addr)
      await initCeramic(addr)
    }  catch (e) {
      console.error('login error', e)
      alert(e)
    }
  }

  const logout = () => {
    web3Modal.clearCachedProvider()
    setAccount(undefined)
    setProvider(undefined)
  }

  useEffect(() => {
    login(true)
  }, [])

  const navigate = useNavigate();
  const path = window.location.pathname;

  const isCheckout = path.startsWith("/page");

  return (
    <div className="App">
      <Layout className="layout">
        {!isCheckout && <Header>
          {/* <div className="logo" /> */}
          <Menu
            // theme="dark"
            mode="horizontal"
            defaultSelectedKeys={[]}
          >
            <Menu.Item key={0}>
              <img
                src={logo}
                className="header-logo pointer"
                onClick={() => navigate("/")}
              />
            </Menu.Item>

            {!isCheckout && (
              <>
                <Menu.Item key={1} onClick={() => navigate("/create")}>
                  Create salespage request
                </Menu.Item>
                <Menu.Item key={2} onClick={() => navigate("/history")}>
                  Lookup
                </Menu.Item>
              </>
            )}
            {!account && <span>
              <Button type="primary" onClick={() => login(false)}  loading={loading} disabled={loading}>{CONNECT_PROMPT}</Button>
            </span> }
            {account && <span>
              Hello: {abbreviate(account)}&nbsp;(<a href="#" onClick={e => {
                e.preventDefault()
                logout()
              }}>logout</a>)</span>}
          &nbsp;
          <span>
            Network: {ACTIVE_CHAIN.name}
          </span>
          </Menu>
        </Header>}
        <Content style={{ padding: "0 50px" }}>
          <div className={`${!isCheckout ? "container" : ""}`}>
            <Routes>
              <Route path="/" element={<Home account={account} />} />
              <Route path="/page/:pageId" element={<Salespage provider={provider} account={account} />} />
              <Route path="/create" element={<CreateSalespage provider={provider} account={account}/>} />
              <Route path="/history" element={<History />} />
            </Routes>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          {APP_NAME} ©2022 - {APP_DESC}
        </Footer>
      </Layout>
    </div>
  );
}

export default App;
