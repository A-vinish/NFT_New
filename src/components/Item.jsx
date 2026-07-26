import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import PriceLabel from "./PriceLabel";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Item({ nft, mode, onSold }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bought, setBought] = useState(false);

  const isOwner = user && nft.owner && (nft.owner.id === user.id || nft.owner === user.id);

  async function handleBuy() {
    if (!user) {
      setError("Log in to buy this NFT.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.put(`/nft/buy/${nft.id}`);
      setBought(true);
      if (onSold) onSold(nft.id);
    } catch (err) {
      setError(err.response?.data?.message || "Purchase failed");
    } finally {
      setLoading(false);
    }
  }

  if (bought) return null;

  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <Link to={`/nft/${nft.id}`}>
          <img
            className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
            src={nft.imageUrl}
            alt={nft.title}
          />
        </Link>

        <div className="lds-ellipsis" hidden={!loading}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>

        <div className="disCardContent-root">
          {mode === "discover" && <PriceLabel sellPrice={nft.price} />}

          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            <Link to={`/nft/${nft.id}`}>{nft.title}</Link>
            {mode === "collection" && nft.isSold && (
              <span className="purple-text">Purchased</span>
            )}
          </h2>

          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {nft.owner?.username || "Unknown"}
          </p>

          {error && <p style={{ color: "#ff9d9d", fontSize: "0.78rem" }}>{error}</p>}

          {mode === "discover" && !isOwner && (
            <Button handleClick={handleBuy} text={loading ? "Processing..." : "Buy"} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Item;
