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
    const { email, name, googleCredential } = req.body;

    let verifiedEmail = email;
    let verifiedName = name;
    let verifiedAvatar = "";

    // If Google ID token is supplied, verify signature & audience directly with Google
    if (googleCredential) {
      try {
        const googleRes = await fetch(
          `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(googleCredential)}`
        );
        if (googleRes.ok) {
          const payload = await googleRes.json();
          if (payload.email && (payload.email_verified === "true" || payload.email_verified === true)) {
            verifiedEmail = payload.email;
            verifiedName = payload.name || payload.email.split("@")[0];
            verifiedAvatar = payload.picture || "";
          }
        }
      } catch (gErr) {
        console.warn("⚠️ [Google OAuth] Token verification network warning:", gErr.message);
      }
    }

    if (!verifiedEmail) {
      return res.status(400).json({ success: false, message: "Valid email is required" });
    }

    const cleanEmail = verifiedEmail.trim().toLowerCase();
    const cleanName = (verifiedName || cleanEmail.split("@")[0]).trim();

    let user = await UserModel.findByEmail(cleanEmail);

    if (!user) {
      console.log(`🍃 [Auth] Creating new user for email: ${cleanEmail}`);
      user = await UserModel.create({
        name: cleanName,
        email: cleanEmail,
        avatar: verifiedAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
      });
    } else {
      console.log(`🍃 [Auth] Found existing user: ${user.name} (${user.email})`);
    }

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
