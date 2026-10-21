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

// 5 Real Cloudinary Uploaded Reels Dataset (Preserved from User Uploads)
export const INITIAL_REAL_REELS = [
  {
    id: "reel-1792572437",
    reelId: "reel-1792572437",
    title: "Bhagya Uday Ke Saral Vedic Upay",
    description: "Apne bhagya ko jagane ke liye daily subah karein ye 1 saral upay.",
    astrologerName: "Dev Guru Shastri",
    astrologerTitle: "Vedic & Career Expert",
    astrologerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://res.cloudinary.com/kah2bbjm/video/upload/v1792572437/astroai_reels/lpuw6fhynyw8diizu4ou.mp4",
    likes: 342,
    commentsCount: 28,
    tag: "#BhagyaUday",
    seriesName: "Vedic Bhagya Series",
    seriesPart: 1,
    dateAdded: "21 Oct 2026",
    isPublished: true,
    createdAt: new Date("2026-10-21T08:47:17Z"),
  },
  {
    id: "reel-1792572347",
    reelId: "reel-1792572347",
    title: "Graha Dosh Nivaran & Kundli Rahasya",
    description: "Kundli me graha dosh shanti ke mool mantra aur upay.",
    astrologerName: "Acharya Rameshwar",
    astrologerTitle: "Senior Jyotish Ratna",
    astrologerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://res.cloudinary.com/kah2bbjm/video/upload/v1792572347/astroai_reels/uqa9wrwyv1mb3owt3vvq.mp4",
    likes: 418,
    commentsCount: 35,
    tag: "#GrahaDosh",
    seriesName: "Vedic Bhagya Series",
    seriesPart: 2,
    dateAdded: "21 Oct 2026",
    isPublished: true,
    createdAt: new Date("2026-10-21T08:45:47Z"),
  },
  {
    id: "reel-1792561807",
    reelId: "reel-1792561807",
    title: "Ghar Me Dhan Vriddhi Ke Vastu Tips",
    description: "Tijori aur ghar ki disha me ye parivartan layega dhan yoga.",
    astrologerName: "Pandit Radheshyam Joshi",
    astrologerTitle: "Vastu & Dhan Yog Specialist",
    astrologerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://res.cloudinary.com/kah2bbjm/video/upload/v1792561807/astroai_reels/ezqzdvbyocqya7jwuvqh.mp4",
    likes: 580,
    commentsCount: 42,
    tag: "#DhanVriddhi",
    seriesName: "Vastu & Dhan Yog",
    seriesPart: 1,
    dateAdded: "21 Oct 2026",
    isPublished: true,
    createdAt: new Date("2026-10-21T05:50:07Z"),
  },
  {
    id: "reel-1792561133",
    reelId: "reel-1792561133",
    title: "Kundli Me Vivah Yog Aur Prem Sambandh",
    description: "Shighra vivah ke liye Shukra aur Brihaspati ki anukoolta upay.",
    astrologerName: "Dr. Ananya Mukherjee",
    astrologerTitle: "Love & Marriage Counselor",
    astrologerAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://res.cloudinary.com/kah2bbjm/video/upload/v1792561133/astroai_reels/lfosgpjbr1rsc0k1r2ca.mp4",
    likes: 695,
    commentsCount: 54,
    tag: "#VivahYog",
    seriesName: "Vivah & Prem Yog",
    seriesPart: 1,
    dateAdded: "21 Oct 2026",
    isPublished: true,
    createdAt: new Date("2026-10-21T05:38:53Z"),
  },
  {
    id: "reel-1792485818",
    reelId: "reel-1792485818",
    title: "Shani Sade Sati Ke 3 Asarkari Upay",
    description: "Shani Dev ke dushprabhav ko shanti me badalney ke 3 achook upay.",
    astrologerName: "Acharya Vidyadhar Shastri",
    astrologerTitle: "Vedic Astrologer",
    astrologerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://res.cloudinary.com/kah2bbjm/video/upload/v1792485818/astroai_reels/dpv7hdnbdbgmysa3myfu.mp4",
    likes: 890,
    commentsCount: 67,
    tag: "#ShaniSadeSati",
    seriesName: "Shani Dosh Nivaran",
    seriesPart: 1,
    dateAdded: "20 Oct 2026",
    isPublished: true,
    createdAt: new Date("2026-10-20T08:43:38Z"),
  },
];

export let reelsStore = loadData("reels.json", INITIAL_REAL_REELS);

// Ensure memory store has real reels on startup
if (!reelsStore || reelsStore.length === 0) {
  reelsStore = [...INITIAL_REAL_REELS];
  saveData("reels.json", reelsStore);
}

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
        if (atlasReels && atlasReels.length > 0) {
          return atlasReels.map((r) => ({
            ...r,
            id: r.reelId || r._id.toString(),
          }));
        }
      }
    } catch (e) {
      console.warn("⚠️ [Reel Model] Atlas read fallback:", e.message);
    }
    return reelsStore;
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
