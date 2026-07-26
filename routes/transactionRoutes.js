const express = require("express");
const router = express.Router();
const { myTransactions } = require("../controllers/transactionController");
const requireAuth = require("../middleware/authMiddleware");

router.get("/", requireAuth, myTransactions);

module.exports = router;
