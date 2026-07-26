import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = ["Art", "Music", "Photography", "Sports", "Collectibles", "Other"];

function Minter() {
  const { register, handleSubmit } = useForm();
  const { user, loading: authLoading } = useAuth();
  const [mintedNFT, setMintedNFT] = useState(null);
  const [loaderHidden, setLoaderHidden] = useState(true);
  const [error, setError] = useState("");

  async function onSubmit(data) {
    setError("");
    setLoaderHidden(false);
    try {
      const formData = new FormData();
      formData.append("title", data.name);
      formData.append("description", data.description || "");
      formData.append("price", data.price);
      formData.append("category", data.category || "Other");
      formData.append("image", data.image[0]);

      const res = await api.post("/nft/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMintedNFT(res.data.nft);
    } catch (err) {
      setError(err.response?.data?.message || "Minting failed");
    } finally {
      setLoaderHidden(true);
    }
  }

  if (!authLoading && !user) {
    return (
      <div className="minter-container">
        <h3 className="makeStyles-title-99 Typography-h3 form-Typography-gutterBottom">
          Create NFT
        </h3>
        <p style={{ color: "var(--text-muted)" }}>
          You need to be logged in to mint an NFT.{" "}
          <Link to="/login" style={{ color: "var(--accent-bright)", fontWeight: 600 }}>
            Log in
          </Link>
        </p>
      </div>
    );
  }

  if (!mintedNFT) {
    return (
      <div className="minter-container">
        <div hidden={loaderHidden} className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <h3 className="makeStyles-title-99 Typography-h3 form-Typography-gutterBottom">
          Create NFT
        </h3>

        {error && <div className="auth-error">{error}</div>}

        <h6 className="form-Typography-root makeStyles-subhead-102 form-Typography-subtitle1 form-Typography-gutterBottom">
          Upload Image
        </h6>
        <form noValidate autoComplete="off" onSubmit={(e) => e.preventDefault()}>
          <div className="upload-container">
            <input
              {...register("image", { required: true })}
              className="upload"
              type="file"
              accept="image/x-png,image/jpeg,image/gif,image/svg+xml,image/webp"
            />
          </div>

          <h6 className="form-Typography-root makeStyles-subhead-102 form-Typography-subtitle1 form-Typography-gutterBottom">
            Collection Name
          </h6>
          <div className="form-FormControl-root form-TextField-root form-FormControl-marginNormal form-FormControl-fullWidth">
            <div className="form-InputBase-root form-OutlinedInput-root form-InputBase-fullWidth form-InputBase-formControl">
              <input
                {...register("name", { required: true })}
                placeholder="e.g. CryptoDunks"
                type="text"
                className="form-InputBase-input form-OutlinedInput-input"
              />
              <fieldset className="PrivateNotchedOutline-root-60 form-OutlinedInput-notchedOutline"></fieldset>
            </div>
          </div>

          <h6 className="form-Typography-root makeStyles-subhead-102 form-Typography-subtitle1 form-Typography-gutterBottom">
            Description
          </h6>
          <div className="form-FormControl-root form-TextField-root form-FormControl-marginNormal form-FormControl-fullWidth">
            <div className="form-InputBase-root form-OutlinedInput-root form-InputBase-fullWidth form-InputBase-formControl">
              <input
                {...register("description")}
                placeholder="What makes this piece unique?"
                type="text"
                className="form-InputBase-input form-OutlinedInput-input"
              />
              <fieldset className="PrivateNotchedOutline-root-60 form-OutlinedInput-notchedOutline"></fieldset>
            </div>
          </div>

          <h6 className="form-Typography-root makeStyles-subhead-102 form-Typography-subtitle1 form-Typography-gutterBottom">
            Price (USD)
          </h6>
          <div className="form-FormControl-root form-TextField-root form-FormControl-marginNormal form-FormControl-fullWidth">
            <div className="form-InputBase-root form-OutlinedInput-root form-InputBase-fullWidth form-InputBase-formControl">
              <input
                {...register("price", { required: true, min: 0 })}
                placeholder="e.g. 250"
                type="number"
                step="0.01"
                className="form-InputBase-input form-OutlinedInput-input"
              />
              <fieldset className="PrivateNotchedOutline-root-60 form-OutlinedInput-notchedOutline"></fieldset>
            </div>
          </div>

          <h6 className="form-Typography-root makeStyles-subhead-102 form-Typography-subtitle1 form-Typography-gutterBottom">
            Category
          </h6>
          <div className="form-FormControl-root form-TextField-root form-FormControl-marginNormal form-FormControl-fullWidth">
            <div className="form-InputBase-root form-OutlinedInput-root form-InputBase-fullWidth form-InputBase-formControl">
              <select
                {...register("category")}
                className="form-InputBase-input form-OutlinedInput-input"
                defaultValue="Other"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <fieldset className="PrivateNotchedOutline-root-60 form-OutlinedInput-notchedOutline"></fieldset>
            </div>
          </div>

          <div className="form-ButtonBase-root form-Chip-root makeStyles-chipBlue-108 form-Chip-clickable">
            <span onClick={handleSubmit(onSubmit)} className="form-Chip-label">
              Mint NFT
            </span>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="minter-container">
      <h3 className="Typography-root makeStyles-title-99 Typography-h3 form-Typography-gutterBottom">
        Minted!
      </h3>
      <div className="horizontal-center">
        <img
          src={mintedNFT.imageUrl}
          alt={mintedNFT.title}
          style={{ maxWidth: 260, borderRadius: 14, border: "1px solid var(--border)" }}
        />
      </div>
      <p style={{ marginTop: 18 }}>
        <Link to="/collection" style={{ color: "var(--accent-bright)", fontWeight: 600 }}>
          View it in My NFTs
        </Link>
      </p>
    </div>
  );
}

export default Minter;
