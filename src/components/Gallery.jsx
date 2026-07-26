import React, { useEffect, useState, useCallback } from "react";
import Item from "./Item";
import api from "../api/axios";

const CATEGORIES = ["All", "Art", "Music", "Photography", "Sports", "Collectibles", "Other"];

function Gallery({ title, mode }) {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const fetchNFTs = useCallback(async () => {
    setLoading(true);
    try {
      if (mode === "discover") {
        const params = {};
        if (search) params.search = search;
        if (category && category !== "All") params.category = category;
        const res = await api.get("/nft", { params });
        setNfts(res.data.nfts);
      } else {
        const res = await api.get("/user/my-nfts");
        setNfts(res.data.nfts);
      }
    } catch (err) {
      setNfts([]);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, search, category]);

  useEffect(() => {
    fetchNFTs();
  }, [fetchNFTs]);

  function handleSold(soldId) {
    // Optimistically drop a just-bought NFT from a Discover feed.
    setNfts((prev) => prev.filter((n) => n.id !== soldId));
  }

  return (
    <div className="gallery-view">
      <h3 className="makeStyles-title-99 Typography-h3">{title}</h3>

      {mode === "discover" && (
        <div className="search-filter-bar" style={{ padding: 0, marginBottom: 24 }}>
          <input
            type="text"
            placeholder="Search NFTs by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      )}

      {!loading && nfts.length === 0 && (
        <div className="empty-state" style={{ padding: "24px 0" }}>
          {mode === "discover" ? "No NFTs match yet — try a different search or category." : "You don't own any NFTs yet."}
        </div>
      )}

      <div className="disGrid-root disGrid-container disGrid-spacing-xs-2">
        <div className="disGrid-root disGrid-item disGrid-grid-xs-12">
          <div className="disGrid-root disGrid-container disGrid-spacing-xs-5 disGrid-justify-content-xs-center">
            {nfts.map((nft) => (
              <Item key={nft.id} nft={nft} mode={mode} onSold={handleSold} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gallery;
