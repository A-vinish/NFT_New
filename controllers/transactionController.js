const prisma = require("../lib/prisma");

// GET /api/transactions  (protected) - purchases and sales involving the current user
exports.myTransactions = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { OR: [{ buyerId: req.userId }, { sellerId: req.userId }] },
      include: {
        nft: { select: { id: true, title: true, imageUrl: true, price: true } },
        buyer: { select: { id: true, username: true } },
        seller: { select: { id: true, username: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ transactions });
  } catch (err) {
    res.status(500).json({ message: "Failed to load transaction history", error: err.message });
  }
};
