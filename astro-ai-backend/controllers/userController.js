// User Profile and Session Controller (MongoDB Atlas Synced)
import { UserModel } from "../models/User.js";
import crypto from "crypto";

// Active in-memory session tokens for revocation
const activeSessions = new Set();

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Valid email is required" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await UserModel.findByEmail(cleanEmail);

    // STRICT LOGIN CHECK: Do NOT create user if not found!
    if (!user) {
      return res.status(404).json({
        success: false,
        code: "USER_NOT_FOUND",
        message: "No account found with this email. Please Sign Up first.",
      });
    }

    // Optional password verification if stored
    if (user.password && password && user.password !== password) {
      return res.status(401).json({
        success: false,
        code: "INVALID_PASSWORD",
        message: "Incorrect password. Please try again.",
      });
    }

    console.log(`🍃 [Auth] User logged in successfully: ${user.name} (${user.email})`);

    // Cryptographically random session token
    const sessionToken = `astro_session_${crypto.randomBytes(32).toString("hex")}`;
    activeSessions.add(sessionToken);

    res.json({
      success: true,
      message: "Login successful!",
      user,
      token: sessionToken,
    });
  } catch (err) {
    console.error("⚠️ [Auth] Login error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Valid email is required" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = (name || cleanEmail.split("@")[0]).trim();

    const existingUser = await UserModel.findByEmail(cleanEmail);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        code: "USER_ALREADY_EXISTS",
        message: "Account already exists with this email. Please Login instead.",
      });
    }

    console.log(`🍃 [Auth] Creating new registered user: ${cleanName} (${cleanEmail})`);
    const newUser = await UserModel.create({
      name: cleanName,
      email: cleanEmail,
      password: password || "",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
    });

    const sessionToken = `astro_session_${crypto.randomBytes(32).toString("hex")}`;
    activeSessions.add(sessionToken);

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      user: newUser,
      token: sessionToken,
    });
  } catch (err) {
    console.error("⚠️ [Auth] Signup error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      activeSessions.delete(token);
    }
    res.json({ success: true, message: "Session successfully invalidated and logged out." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const verifySession = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No active session token provided." });
    }
    const token = authHeader.split(" ")[1];
    if (!activeSessions.has(token)) {
      return res.status(401).json({ success: false, message: "Session expired or invalid." });
    }
    res.json({ success: true, message: "Session is active and valid." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateUserName = async (req, res) => {
  try {
    const { userId, name } = req.body;
    const user = await UserModel.updateName(userId, name);
    res.json({ success: true, name: user?.name || name });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const addBonusBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    const user = await UserModel.addBonus(id, amount);
    if (user) return res.json({ success: true, walletBalance: user.walletBalance });
    res.status(404).json({ success: false, message: "User not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const toggleBanUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.toggleBan(id);
    if (user) return res.json({ success: true, isBanned: user.isBanned });
    res.status(404).json({ success: false, message: "User not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
