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

const DEFAULT_ASTROLOGERS = [];

export let astrologersStore = loadData("astrologers.json", DEFAULT_ASTROLOGERS);

export const AstrologerModel = {
  find: async (query = {}) => {
    try {
      if (mongoose.connection.readyState === 1) {
        const atlasAstros = await MongoAstrologer.find(query).lean();
        if (atlasAstros && atlasAstros.length > 0) {
          return atlasAstros.map((a) => ({
            ...a,
            id: a.astrologerId || a._id.toString(),
          }));
        }
      }
    } catch (e) {
      console.warn("⚠️ [Astrologer Model] Atlas read fallback:", e.message);
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
