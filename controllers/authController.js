const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const prisma = require("../lib/prisma");

function signToken(user) {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function toSafeUser(user) {
  return { id: user.id, username: user.username, email: user.email };
}

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "username, email, and password are required" });
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (existing) {
      return res.status(409).json({ message: "A user with that email or username already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, email, password: hashed },
    });

    const token = signToken(user);
    res.status(201).json({ token, user: toSafeUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(user);
    res.json({ token, user: toSafeUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user: toSafeUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Failed to load user", error: err.message });
  }
};
