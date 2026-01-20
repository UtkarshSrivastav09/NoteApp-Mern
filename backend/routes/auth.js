import express from 'express';
import User from "../models/User.js";
import { protect } from '../middleware/auth.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// =================== REGISTER ===================
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body; // <-- use "name" to match frontend

  try {
    // Validate fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields..Don't leave blank" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists.." });
    }

    // Create user
    const user = await User.create({
      username: name, // store as username in DB
      email,
      password, // make sure your User model hashes password in pre-save hook
    });

    const token = generateToken(user._id);

    res.status(201).json({
      id: user._id,
      name: user.username, // return as name
      email: user.email,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error..Please try again" });
  }
});

// =================== LOGIN ===================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = generateToken(user._id);

    res.json({
      id: user._id,
      name: user.username,
      email: user.email,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error..Please try again" });
  }
});

// =================== GET CURRENT USER ===================
router.get("/me", protect, async (req, res) => {
  res.status(200).json(req.user);
});

export default router;
