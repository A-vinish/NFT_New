import React, { useEffect, useState } from "react";
import { BrowserRouter, Link, Switch, Route } from "react-router-dom";
import logo from "../assets/logo.svg";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Minter from "./Minter";
import Gallery from "./Gallery";
import NFTDetails from "./NFTDetails";
import PurchaseHistory from "./PurchaseHistory";
import Login from "./Login";
import Register from "./Register";

function Header() {
  const { user, logout, loading } = useAuth();
  const [discoverKey, setDiscoverKey] = useState(0);
  const [myKey, setMyKey] = useState(0);

  // Bump the key whenever we navigate into these tabs, so Gallery re-fetches
  // fresh data (e.g. right after a buy or a mint).
  useEffect(() => {
    setDiscoverKey((k) => k + 1);
    setMyKey((k) => k + 1);
  }, [user]);

  return (
    <BrowserRouter>
      <div className="app-root-1">
        <header className="Paper-root AppBar-root AppBar-positionStatic AppBar-colorPrimary Paper-elevation4">
          <div className="Toolbar-root Toolbar-regular header-appBar-13 Toolbar-gutters">
            <div className="header-left-4"></div>
            <img className="header-logo-11" src={logo} alt="OpenD" />
            <div className="header-vertical-9"></div>
            <Link to="/">
              <h5 className="Typography-root header-logo-text">OpenD</h5>
            </Link>
            <div className="header-empty-6"></div>
            <div className="header-space-8"></div>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/discover">Discover</Link>
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/minter">Minter</Link>
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/collection">My NFTs</Link>
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/transactions">History</Link>
            </button>

            {!loading && (
              <div className="header-auth">
                {user ? (
                  <>
                    <span className="header-username">{user.username}</span>
                    <button className="header-logout-btn" onClick={logout}>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
                      <Link to="/login">Login</Link>
                    </button>
                    <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
                      <Link to="/register">Register</Link>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </header>
      </div>

      <Switch>
        <Route exact path="/">
          <Hero />
        </Route>
        <Route path="/discover">
          <Gallery key={discoverKey} title="Discover" mode="discover" />
        </Route>
        <Route path="/minter">
          <Minter />
        </Route>
        <Route path="/collection">
          <Gallery key={myKey} title="My NFTs" mode="collection" />
        </Route>
        <Route path="/transactions">
          <PurchaseHistory />
        </Route>
        <Route path="/nft/:id">
          <NFTDetails />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

// Lightweight hero for "/" — replaces the original static home-img.png,
// which wasn't part of the source files handed over for this rewrite.
function Hero() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    api
      .get("/nft")
      .then((res) => setCount(res.data.nfts.length))
      .catch(() => setCount(null));
  }, []);

  return (
    <div className="hero">
      <h1>The marketplace for your NFTs.</h1>
      <p>
        Mint, list, and trade digital collectibles — running entirely on your own
        machine, no wallet or blockchain setup required.
        {count !== null && ` ${count} NFT${count === 1 ? "" : "s"} listed right now.`}
      </p>
      <Link to="/discover" className="hero-cta">
        Explore Discover
      </Link>
    </div>
  );
}

export default Header;
