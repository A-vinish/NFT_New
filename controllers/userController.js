const prisma = require("../lib/prisma");

const userSelect = { id: true, username: true };

// GET /api/user/my-nfts  (protected) - everything the current user owns,
// whether minted by them and still listed, or purchased from someone else.
exports.myNFTs = async (req, res) => {
  try {
    const nfts = await prisma.nFT.findMany({
      where: { ownerId: req.userId },
      include: { creator: { select: userSelect }, owner: { select: userSelect } },
      orderBy: { updatedAt: "desc" },
    });

    res.json({ nfts });
  } catch (err) {
    res.status(500).json({ message: "Failed to load your NFTs", error: err.message });
  }
};
