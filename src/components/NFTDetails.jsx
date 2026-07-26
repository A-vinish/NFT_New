import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";

function NFTDetails() {
  const { id } = useParams();
  const history = useHistory();
  const { user } = useAuth();
  const [nft, setNft] = useState(null);
  const [error, setError] = useState("");
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    api
      .get(`/nft/${id}`)
      .then((res) => setNft(res.data.nft))
      .catch(() => setError("This NFT could not be found."));
  }, [id]);

  async function handleBuy() {
    if (!user) {
      setError("Log in to buy this NFT.");
      return;
    }
    setBuying(true);
    setError("");
    try {
      await api.put(`/nft/buy/${id}`);
      history.push("/collection");
    } catch (err) {
      setError(err.response?.data?.message || "Purchase failed");
    } finally {
      setBuying(false);
    }
  }

  if (error && !nft) {
    return <div className="empty-state">{error}</div>;
  }

  if (!nft) {
    return <div className="empty-state">Loading...</div>;
  }

  const isOwner = user && nft.owner && nft.owner.id === user.id;

  return (
    <div className="nft-details">
      <img src={nft.imageUrl} alt={nft.title} />
      <div className="nft-details-info">
        <span className="category-tag">{nft.category}</span>
        <h2>{nft.title}</h2>
        <p className="description">{nft.description || "No description provided."}</p>
        <div className="meta-row">Owner: {nft.owner?.username}</div>
        <div className="meta-row">Created by: {nft.creator?.username}</div>
        <div style={{ margin: "18px 0" }}>
          <span className="disButtonBase-root disChip-root makeStyles-price-23 disChip-outlined" style={{ position: "static" }}>
            <span className="disChip-label">${nft.price}</span>
          </span>
        </div>
        {error && <p style={{ color: "#ff9d9d", fontSize: "0.85rem" }}>{error}</p>}
        {!nft.isSold && !isOwner && (
          <Button handleClick={handleBuy} text={buying ? "Processing..." : "Buy"} />
        )}
        {nft.isSold && <p style={{ color: "var(--text-faint)" }}>This NFT has already been sold.</p>}
        {isOwner && <p style={{ color: "var(--text-faint)" }}>You own this NFT.</p>}
      </div>
    </div>
  );
}

export default NFTDetails;
