require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const prisma = require("./lib/prisma");

const authRoutes = require("./routes/authRoutes");
const nftRoutes = require("./routes/nftRoutes");
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/nft", nftRoutes);
app.use("/api/user", userRoutes);
app.use("/api/transactions", transactionRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Central error handler (e.g. multer file-type errors)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await prisma.$connect();
    console.log("Postgres connected via Prisma");
  } catch (err) {
    console.error("Could not connect to Postgres:", err.message);
    console.error("Check DATABASE_URL in server/.env and that Postgres is running.");
    process.exit(1);
  }

  app.listen(PORT, () => console.log(`OpenD server running on http://localhost:${PORT}`));
}

start();

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
