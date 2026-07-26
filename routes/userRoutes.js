const express = require("express");
const router = express.Router();
const { myNFTs } = require("../controllers/userController");
const requireAuth = require("../middleware/authMiddleware");

router.get("/my-nfts", requireAuth, myNFTs);

module.exports = router;
