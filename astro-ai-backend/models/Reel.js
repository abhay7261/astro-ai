// Astro Reels Store & Persistent MongoDB Atlas Model
import mongoose from "mongoose";
import { loadData, saveData } from "../config/fileDb.js";

const reelSchema = new mongoose.Schema(
  {
    reelId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: "Daily astrological guidance & Vedic insights." },
    astrologerName: { type: String, default: "AstroAI Creator" },
    astrologerTitle: { type: String, default: "Vedic Astrologer" },
    astrologerAvatar: {
      type: String,
      default: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    },
    videoUrl: { type: String, default: "" },
    likes: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    tag: { type: String, default: "#DailyUpay" },
    seriesName: { type: String, default: "" },
    seriesPart: { type: Number, default: 1 },
    dateAdded: { type: String, default: "Today" },
    isPublished: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const MongoReel = mongoose.models.Reel || mongoose.model("Reel", reelSchema, "reels");

export let reelsStore = loadData("reels.json", []);

export const ReelModel = {
  find: async (query = {}, options = {}) => {
    try {
      if (mongoose.connection.readyState === 1) {
        const { page = 1, limit = 50, sort = { createdAt: -1, _id: -1 } } = options;
        const skip = (Number(page) - 1) * Number(limit);
        const atlasReels = await MongoReel.find({ isPublished: true, ...query })
          .sort(sort)
          .skip(skip)
          .limit(Number(limit))
          .lean();
        return (atlasReels || []).map((r) => ({
          ...r,
          id: r.reelId || r._id.toString(),
        }));
      }
    } catch (e) {
      console.warn("⚠️ [Reel Model] Atlas read fallback:", e.message);
    }
    return reelsStore || [];
  },

  findById: async (id) => {
    try {
      if (mongoose.connection.readyState === 1) {
        const r = await MongoReel.findOne({
          $or: [{ reelId: id }, { _id: mongoose.isValidObjectId(id) ? id : null }],
        }).lean();
        if (r) return { ...r, id: r.reelId || r._id.toString() };
      }
    } catch (e) {}
    return reelsStore.find((r) => r.id === id || String(r.reelId) === String(id));
  },

  findBySeries: async (seriesName) => {
    try {
      if (mongoose.connection.readyState === 1) {
        const list = await MongoReel.find({ seriesName, isPublished: true }).sort({ seriesPart: 1 }).lean();
        if (list && list.length > 0) {
          return list.map((r) => ({ ...r, id: r.reelId || r._id.toString() }));
        }
      }
    } catch (e) {}
    return reelsStore.filter((r) => r.seriesName === seriesName);
  },

  create: async (data) => {
    const reelId = data.id || data.reelId || `reel-${Date.now()}`;
    const newReel = {
      id: reelId,
      reelId: reelId,
      title: data.title,
      description: data.description || "Daily astrological guidance & Vedic insights.",
      astrologerName: data.astrologerName || "AstroAI Creator",
      astrologerTitle: data.astrologerTitle || "Vedic Astrologer",
      astrologerAvatar:
        data.astrologerAvatar ||
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
      videoUrl: data.videoUrl || "",
      likes: Number(data.likes) || 0,
      commentsCount: Number(data.commentsCount) || 0,
      tag: data.tag ? (data.tag.startsWith("#") ? data.tag : `#${data.tag}`) : "#DailyUpay",
      seriesName: data.seriesName ? data.seriesName.trim() : "",
      seriesPart: data.seriesPart ? Number(data.seriesPart) || 1 : null,
      dateAdded: data.dateAdded || "Today",
      isPublished: true,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
    };

    try {
      if (mongoose.connection.readyState === 1) {
        const doc = await MongoReel.create(newReel);
        newReel._id = doc._id;
      }
    } catch (e) {
      console.warn("⚠️ [Reel Model] Atlas insert fallback:", e.message);
    }

    reelsStore.unshift(newReel);
    saveData("reels.json", reelsStore);
    return newReel;
  },

  deleteById: async (id) => {
    try {
      if (mongoose.connection.readyState === 1) {
        await MongoReel.deleteOne({
          $or: [{ reelId: id }, { _id: mongoose.isValidObjectId(id) ? id : null }],
        });
      }
    } catch (e) {}

    const initialLen = reelsStore.length;
    reelsStore = reelsStore.filter((r) => r.id !== id && String(r.reelId) !== String(id));
    const deleted = reelsStore.length !== initialLen;
    if (deleted) saveData("reels.json", reelsStore);
    return deleted;
  },

  deleteBySeries: async (seriesName) => {
    try {
      if (mongoose.connection.readyState === 1) {
        await MongoReel.deleteMany({ seriesName });
      }
    } catch (e) {}

    const initialLen = reelsStore.length;
    reelsStore = reelsStore.filter((r) => r.seriesName !== seriesName);
    const deleted = reelsStore.length !== initialLen;
    if (deleted) saveData("reels.json", reelsStore);
    return deleted;
  },

  clearAll: async () => {
    try {
      if (mongoose.connection.readyState === 1) {
        await MongoReel.deleteMany({});
      }
    } catch (e) {}
    reelsStore = [];
    saveData("reels.json", reelsStore);
    return true;
  },

  like: async (id) => {
    let likes = 0;
    try {
      if (mongoose.connection.readyState === 1) {
        const doc = await MongoReel.findOneAndUpdate(
          { $or: [{ reelId: id }, { _id: mongoose.isValidObjectId(id) ? id : null }] },
          { $inc: { likes: 1 } },
          { new: true }
        );
        if (doc) likes = doc.likes;
      }
    } catch (e) {}

    const reel = reelsStore.find((r) => r.id === id || String(r.reelId) === String(id));
    if (reel) {
      reel.likes = (reel.likes || 0) + 1;
      saveData("reels.json", reelsStore);
      likes = reel.likes;
    }
    return { id, likes };
  },
};
