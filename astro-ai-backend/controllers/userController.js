// User Profile and Wallet Controller
import { UserModel } from "../models/User.js";

export const getAllUsers = (req, res) => {
  const users = UserModel.find();
  res.json({ success: true, count: users.length, users });
};

export const loginUser = (req, res) => {
  const { email, name } = req.body;
  let user = UserModel.findByEmail(email);

  if (!user) {
    user = UserModel.create({
      name: name || "Seeker",
      email: email || `user_${Date.now()}@astroai.com`,
    });
  }

  res.json({
    success: true,
    message: "Login successful!",
    user,
    token: `jwt_session_${user.id}`,
  });
};

export const updateUserName = (req, res) => {
  const { userId, name } = req.body;
  const user = UserModel.updateName(userId, name);
  res.json({ success: true, name: user?.name || name });
};

export const addBonusBalance = (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  const user = UserModel.addBonus(id, amount);
  if (user) return res.json({ success: true, walletBalance: user.walletBalance });
  res.status(404).json({ success: false, message: "User not found" });
};

export const toggleBanUser = (req, res) => {
  const { id } = req.params;
  const user = UserModel.toggleBan(id);
  if (user) return res.json({ success: true, isBanned: user.isBanned });
  res.status(404).json({ success: false, message: "User not found" });
};
