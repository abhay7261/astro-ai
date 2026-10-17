// User Data Model & MongoDB Atlas Mongoose Integration
import mongoose from "mongoose";
import { loadData, saveData } from "../config/fileDb.js";

const DEFAULT_USERS = [
  {
    id: "u-1",
    userId: "u-1",
    name: "Abhay Saini",
    email: "sainiabhay070@gmail.com",
    joinedDate: "12 Oct 2026",
    walletBalance: 250,
    totalConsultations: 4,
    isVIP: true,
    isBanned: false,
  },
  {
    id: "u-2",
    userId: "u-2",
    name: "Rohit Sharma",
    email: "rohit.sharma@example.com",
    joinedDate: "13 Oct 2026",
    walletBalance: 0,
    totalConsultations: 1,
    isVIP: false,
    isBanned: false,
  },
  {
    id: "u-3",
    userId: "u-3",
    name: "Pooja Malhotra",
    email: "pooja.m@example.com",
    joinedDate: "14 Oct 2026",
    walletBalance: 80,
    totalConsultations: 2,
    isVIP: true,
    isBanned: false,
  },
];

export let usersStore = loadData("users.json", DEFAULT_USERS);

// 🍃 Mongoose Schema for MongoDB Atlas
const userSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    joinedDate: { type: String, default: "Today" },
    walletBalance: { type: Number, default: 50 },
    totalConsultations: { type: Number, default: 0 },
    isVIP: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }
);

export const MongoUser = mongoose.models.User || mongoose.model("User", userSchema, "users");

export const UserModel = {
  find: async () => {
    try {
      if (mongoose.connection.readyState === 1) {
        const atlasUsers = await MongoUser.find().lean();
        if (atlasUsers && atlasUsers.length > 0) {
          return atlasUsers.map(u => ({ ...u, id: u.userId || u._id.toString() }));
        }
      }
    } catch (e) {
      console.warn("⚠️ [User Model] Atlas read fallback:", e.message);
    }
    return usersStore;
  },

  findByEmail: async (email) => {
    if (!email) return null;
    const cleanEmail = email.trim().toLowerCase();
    try {
      if (mongoose.connection.readyState === 1) {
        const user = await MongoUser.findOne({ email: cleanEmail }).lean();
        if (user) {
          return { ...user, id: user.userId || user._id.toString() };
        }
      }
    } catch (e) {
      console.warn("⚠️ [User Model] Atlas findByEmail fallback:", e.message);
    }
    return usersStore.find((u) => u.email?.toLowerCase() === cleanEmail);
  },

  findById: async (id) => {
    try {
      if (mongoose.connection.readyState === 1) {
        const user = await MongoUser.findOne({ $or: [{ userId: id }, { _id: mongoose.isValidObjectId(id) ? id : null }] }).lean();
        if (user) {
          return { ...user, id: user.userId || user._id.toString() };
        }
      }
    } catch (e) {
      console.warn("⚠️ [User Model] Atlas findById fallback:", e.message);
    }
    return usersStore.find((u) => u.id === id || u.userId === id);
  },

  create: async (data) => {
    const userId = `u-${Date.now()}`;
    const cleanEmail = (data.email || `user_${Date.now()}@astroai.com`).trim().toLowerCase();
    const newUserObj = {
      userId,
      id: userId,
      name: data.name || "Seeker",
      email: cleanEmail,
      joinedDate: data.joinedDate || "Today",
      walletBalance: data.walletBalance !== undefined ? data.walletBalance : 50,
      totalConsultations: 0,
      isVIP: data.isVIP || false,
      isBanned: false,
      avatar: data.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
    };

    // 1. Save directly to MongoDB Atlas
    try {
      if (mongoose.connection.readyState === 1) {
        const created = await MongoUser.create(newUserObj);
        console.log(`🍃 [MongoDB Atlas] Successfully inserted new user: ${created.name} (${created.email})`);
        newUserObj._id = created._id;
      }
    } catch (e) {
      console.warn("⚠️ [User Model] Atlas create error, writing to disk fallback:", e.message);
    }

    // 2. Also keep local memory / disk store in sync
    usersStore.unshift(newUserObj);
    saveData("users.json", usersStore);
    return newUserObj;
  },

  updateName: async (id, name) => {
    try {
      if (mongoose.connection.readyState === 1) {
        await MongoUser.updateOne(
          { $or: [{ userId: id }, { email: "sainiabhay070@gmail.com" }] },
          { $set: { name } }
        );
      }
    } catch (e) {}

    const user = usersStore.find((u) => u.id === id || u.email === "sainiabhay070@gmail.com");
    if (user) {
      user.name = name;
      saveData("users.json", usersStore);
    }
    return user;
  },

  addBonus: async (id, amount) => {
    const bonus = Number(amount) || 50;
    try {
      if (mongoose.connection.readyState === 1) {
        const updated = await MongoUser.findOneAndUpdate(
          { $or: [{ userId: id }, { _id: mongoose.isValidObjectId(id) ? id : null }] },
          { $inc: { walletBalance: bonus } },
          { new: true }
        ).lean();
        if (updated) return { ...updated, id: updated.userId || updated._id.toString() };
      }
    } catch (e) {}

    const user = usersStore.find((u) => u.id === id);
    if (user) {
      user.walletBalance += bonus;
      saveData("users.json", usersStore);
    }
    return user;
  },

  toggleBan: async (id) => {
    try {
      if (mongoose.connection.readyState === 1) {
        const current = await MongoUser.findOne({ $or: [{ userId: id }, { _id: mongoose.isValidObjectId(id) ? id : null }] });
        if (current) {
          current.isBanned = !current.isBanned;
          await current.save();
          return { ...current.toObject(), id: current.userId || current._id.toString() };
        }
      }
    } catch (e) {}

    const user = usersStore.find((u) => u.id === id);
    if (user) {
      user.isBanned = !user.isBanned;
      saveData("users.json", usersStore);
    }
    return user;
  },
};
