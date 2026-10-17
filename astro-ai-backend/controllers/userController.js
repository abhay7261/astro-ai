// User Profile and Wallet Controller (MongoDB Atlas Ready)
import { UserModel } from "../models/User.js";

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
    const { email, name } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    let user = await UserModel.findByEmail(email);

    if (!user) {
      console.log(`🍃 [Auth] Creating new user for email: ${email}`);
      user = await UserModel.create({
        name: name || email.split("@")[0],
        email: email,
      });
    } else {
      console.log(`🍃 [Auth] Found existing user: ${user.name} (${user.email})`);
    }

    res.json({
      success: true,
      message: "Login successful!",
      user,
      token: `jwt_session_${user._id || user.userId || user.id}`,
    });
  } catch (err) {
    console.error("⚠️ [Auth] Login error:", err);
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
