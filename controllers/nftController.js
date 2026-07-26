const prisma = require("../lib/prisma");

const userSelect = { id: true, username: true };

// POST /api/nft/create  (protected, multipart/form-data: image + fields)
exports.createNFT = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;

    if (!title || !price || !req.file) {
      return res.status(400).json({ message: "title, price, and image are required" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const nft = await prisma.nFT.create({
      data: {
        title,
        description: description || "",
        price: Number(price),
        category: category || "Other",
        imageUrl,
        creatorId: req.userId,
        ownerId: req.userId,
      },
      include: { creator: { select: userSelect }, owner: { select: userSelect } },
    });

    res.status(201).json({ nft });
  } catch (err) {
    res.status(500).json({ message: "Failed to create NFT", error: err.message });
  }
};

// GET /api/nft?search=&category=   -> Discover feed: unsold NFTs only
exports.listNFTs = async (req, res) => {
  try {
    const { search, category } = req.query;

    const where = { isSold: false };
    if (category && category !== "All") where.category = category;
    if (search) where.title = { contains: search, mode: "insensitive" };

    const nfts = await prisma.nFT.findMany({
      where,
      include: { creator: { select: userSelect }, owner: { select: userSelect } },
      orderBy: { createdAt: "desc" },
    });

    res.json({ nfts });
  } catch (err) {
    res.status(500).json({ message: "Failed to load NFTs", error: err.message });
  }
};

// GET /api/nft/:id
exports.getNFT = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid NFT id" });
    }

    const nft = await prisma.nFT.findUnique({
      where: { id },
      include: { creator: { select: userSelect }, owner: { select: userSelect } },
    });

    if (!nft) return res.status(404).json({ message: "NFT not found" });
    res.json({ nft });
  } catch (err) {
    res.status(500).json({ message: "Failed to load NFT", error: err.message });
  }
};

// PUT /api/nft/buy/:id  (protected)
exports.buyNFT = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid NFT id" });
    }

    const nft = await prisma.nFT.findUnique({ where: { id } });

    // 1. Verify NFT exists
    if (!nft) {
      return res.status(404).json({ message: "NFT not found" });
    }
    if (nft.isSold) {
      return res.status(409).json({ message: "This NFT has already been sold" });
    }

    // 2. Verify buyer is not owner
    if (nft.ownerId === req.userId) {
      return res.status(400).json({ message: "You already own this NFT" });
    }

    const sellerId = nft.ownerId;

    // 3, 4, 5 — mark sold, change owner, and record the transaction atomically
    const [updatedNFT, transaction] = await prisma.$transaction([
      prisma.nFT.update({
        where: { id },
        data: { isSold: true, ownerId: req.userId },
        include: { creator: { select: userSelect }, owner: { select: userSelect } },
      }),
      prisma.transaction.create({
        data: {
          nftId: id,
          sellerId,
          buyerId: req.userId,
          price: nft.price,
        },
      }),
    ]);

    // 6/7 happen naturally on the frontend: listNFTs excludes isSold NFTs
    // (removes it from Discover), myNFTs includes it (shows it in My NFTs).

    res.json({ message: "Purchase successful", nft: updatedNFT, transaction });
  } catch (err) {
    res.status(500).json({ message: "Purchase failed", error: err.message });
  }
};
