// Astrologer Data Model & Persistent MongoDB Atlas Store
import mongoose from "mongoose";
import { loadData, saveData } from "../config/fileDb.js";

const astrologerSchema = new mongoose.Schema(
  {
    astrologerId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    title: { type: String, default: "Vedic Astrologer" },
    category: { type: String, default: "Kundli" },
    experience: { type: String, default: "5+ Yrs Exp" },
    languages: { type: [String], default: ["Hindi", "English"] },
    pricePerMin: { type: Number, default: 20 },
    rating: { type: Number, default: 4.9 },
    totalConsultations: { type: String, default: "100+" },
    image: { type: String, default: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80" },
    specialty: { type: String, default: "General Jyotish" },
    isOnline: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const MongoAstrologer =
  mongoose.models.Astrologer || mongoose.model("Astrologer", astrologerSchema, "astrologers");

export const DEFAULT_ASTROLOGERS = [
  {
    id: "1",
    astrologerId: "1",
    name: "Acharya Vidyadhar Shastri",
    title: "Chief Vedic Pandit & Kundli Expert",
    category: "Kundli",
    experience: "18+ Yrs Exp",
    languages: ["Hindi", "Sanskrit", "English"],
    rating: 4.95,
    totalConsultations: "34.5K+",
    pricePerMin: 25,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    specialty: "Lagna Dosha, Graha Shanti & Kundli",
    isOnline: true,
  },
  {
    id: "2",
    astrologerId: "2",
    name: "Dr. Ananya Mukherjee",
    title: "Love & Marriage Compatibility Guru",
    category: "Love",
    experience: "12+ Yrs Exp",
    languages: ["Hindi", "English", "Bengali"],
    rating: 4.92,
    totalConsultations: "28.1K+",
    pricePerMin: 20,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    specialty: "Kundli Milan, Vivah Yog & Relationship",
    isOnline: true,
  },
  {
    id: "3",
    astrologerId: "3",
    name: "Pandit Radheshyam Joshi",
    title: "Career & Business Astrology Specialist",
    category: "Career",
    experience: "15+ Yrs Exp",
    languages: ["Hindi", "Gujarati"],
    rating: 4.88,
    totalConsultations: "22.4K+",
    pricePerMin: 22,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    specialty: "Job Timing, Wealth & Dhan Yog",
    isOnline: true,
  },
  {
    id: "4",
    astrologerId: "4",
    name: "Maa Gayatri Devi",
    title: "Karmic Healer & Prashna Kundli",
    category: "Kundli",
    experience: "21+ Yrs Exp",
    languages: ["Hindi", "English"],
    rating: 4.98,
    totalConsultations: "45.2K+",
    pricePerMin: 30,
    image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=400&q=80",
    specialty: "Shani Sade Sati, Rahu-Ketu & Dosha",
    isOnline: true,
  },
  {
    id: "5",
    astrologerId: "5",
    name: "Guruji Devendra Nath",
    title: "Vastu Shastra & Gemstone Expert",
    category: "Vastu",
    experience: "14+ Yrs Exp",
    languages: ["Hindi", "Marathi"],
    rating: 4.89,
    totalConsultations: "18.7K+",
    pricePerMin: 18,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    specialty: "Home Vastu, Ratna Salah & Swasthya",
    isOnline: true,
  },
  {
    id: "6",
    astrologerId: "6",
    name: "Acharya Priyadarshini",
    title: "Relationship & Tarot Astrologer",
    category: "Love",
    experience: "10+ Yrs Exp",
    languages: ["Hindi", "English"],
    rating: 4.85,
    totalConsultations: "15.3K+",
    pricePerMin: 18,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    specialty: "Relationship Healing & Intuitive Tarot",
    isOnline: true,
  },
];

export let astrologersStore = loadData("astrologers.json", DEFAULT_ASTROLOGERS);

// If file loaded empty array, fill it with default astrologers
if (!astrologersStore || astrologersStore.length === 0) {
  astrologersStore = [...DEFAULT_ASTROLOGERS];
  saveData("astrologers.json", astrologersStore);
}

export const AstrologerModel = {
  find: async (query = {}) => {
    try {
      if (mongoose.connection.readyState === 1) {
        let atlasAstros = await MongoAstrologer.find(query).lean();
        if (atlasAstros && atlasAstros.length > 0) {
          return atlasAstros.map((a) => ({
            ...a,
            id: a.astrologerId || a._id.toString(),
          }));
        } else if (DEFAULT_ASTROLOGERS.length > 0) {
          try {
            await MongoAstrologer.insertMany(DEFAULT_ASTROLOGERS);
            atlasAstros = await MongoAstrologer.find(query).lean();
            if (atlasAstros && atlasAstros.length > 0) {
              return atlasAstros.map((a) => ({
                ...a,
                id: a.astrologerId || a._id.toString(),
              }));
            }
          } catch (seedErr) {
            console.warn("⚠️ [Astrologer Model] Atlas auto-seed fallback:", seedErr.message);
          }
        }
      }
    } catch (e) {
      console.warn("⚠️ [Astrologer Model] Atlas read fallback:", e.message);
    }
    if (!astrologersStore || astrologersStore.length === 0) {
      astrologersStore = [...DEFAULT_ASTROLOGERS];
      saveData("astrologers.json", astrologersStore);
    }
    return astrologersStore;
  },

  findById: async (id) => {
    try {
      if (mongoose.connection.readyState === 1) {
        const a = await MongoAstrologer.findOne({
          $or: [{ astrologerId: id }, { _id: mongoose.isValidObjectId(id) ? id : null }],
        }).lean();
        if (a) return { ...a, id: a.astrologerId || a._id.toString() };
      }
    } catch (e) {}
    return astrologersStore.find((a) => a.id === id || String(a.astrologerId) === String(id));
  },

  create: async (data) => {
    const astroId = data.id || data.astrologerId || Date.now().toString();
    const newAstro = {
      id: astroId,
      astrologerId: astroId,
      rating: Number(data.rating) || 4.9,
      totalConsultations: data.totalConsultations || "100+",
      isOnline: data.isOnline !== undefined ? data.isOnline : true,
      languages: data.languages || ["Hindi", "English"],
      ...data,
    };

    try {
      if (mongoose.connection.readyState === 1) {
        const doc = await MongoAstrologer.create(newAstro);
        newAstro._id = doc._id;
      }
    } catch (e) {
      console.warn("⚠️ [Astrologer Model] Atlas insert fallback:", e.message);
    }

    astrologersStore.unshift(newAstro);
    saveData("astrologers.json", astrologersStore);
    return newAstro;
  },

  updateById: async (id, data) => {
    try {
      if (mongoose.connection.readyState === 1) {
        await MongoAstrologer.updateOne(
          { $or: [{ astrologerId: id }, { _id: mongoose.isValidObjectId(id) ? id : null }] },
          { $set: data }
        );
      }
    } catch (e) {
      console.warn("⚠️ [Astrologer Model] Atlas update fallback:", e.message);
    }

    const idx = astrologersStore.findIndex((a) => a.id === id || String(a.astrologerId) === String(id));
    if (idx !== -1) {
      astrologersStore[idx] = { ...astrologersStore[idx], ...data };
      saveData("astrologers.json", astrologersStore);
      return astrologersStore[idx];
    }
    return null;
  },

  deleteById: async (id) => {
    try {
      if (mongoose.connection.readyState === 1) {
        await MongoAstrologer.deleteOne({
          $or: [{ astrologerId: id }, { _id: mongoose.isValidObjectId(id) ? id : null }],
        });
      }
    } catch (e) {}

    const initialLen = astrologersStore.length;
    astrologersStore = astrologersStore.filter((a) => a.id !== id && String(a.astrologerId) !== String(id));
    const deleted = astrologersStore.length !== initialLen;
    if (deleted) saveData("astrologers.json", astrologersStore);
    return deleted;
  },

  clearAll: async () => {
    try {
      if (mongoose.connection.readyState === 1) {
        await MongoAstrologer.deleteMany({});
      }
    } catch (e) {}
    astrologersStore = [];
    saveData("astrologers.json", astrologersStore);
    return true;
  },

  updateStatus: async (id, isOnline) => {
    try {
      if (mongoose.connection.readyState === 1) {
        await MongoAstrologer.updateOne(
          { $or: [{ astrologerId: id }, { _id: mongoose.isValidObjectId(id) ? id : null }] },
          { $set: { isOnline } }
        );
      }
    } catch (e) {}

    const astro = astrologersStore.find((a) => a.id === id || String(a.astrologerId) === String(id));
    if (astro) {
      astro.isOnline = isOnline;
      saveData("astrologers.json", astrologersStore);
    }
    return astro;
  },
};
