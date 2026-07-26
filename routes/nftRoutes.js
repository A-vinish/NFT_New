const express = require("express");
const router = express.Router();
const { createNFT, listNFTs, getNFT, buyNFT } = require("../controllers/nftController");
const requireAuth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/create", requireAuth, upload.single("image"), createNFT);
router.get("/", listNFTs);
router.get("/:id", getNFT);
router.put("/buy/:id", requireAuth, buyNFT);

module.exports = router;
