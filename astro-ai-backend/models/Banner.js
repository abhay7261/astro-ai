// Banner Data Model & Persistent MongoDB Atlas Store
import mongoose from "mongoose";
import { loadData, saveData } from "../config/fileDb.js";

const bannerSchema = new mongoose.Schema(
  {
    bannerId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    badge: { type: String, default: "SPECIAL ASTRO INSIGHT" },
    imageUrl: { type: String, default: "" },
    type: { type: String, default: "custom_banner" }, // "kalachakra_chakra" | "animated_card" | "custom_banner"
    bgGradient: { type: String, default: "from-[#FFF9F2] via-[#FFEEDC] to-[#FFDFC8]" },
    ctaText: { type: String, default: "Explore Now" },
    ctaLink: { type: String, default: "/chat" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isSystemDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const MongoBanner =
  mongoose.models.Banner || mongoose.model("Banner", bannerSchema, "banners");

// 4 High-UI Preset Banners (including the primary animated Vedic Kalachakra)
export const DEFAULT_BANNERS = [
  {
    bannerId: "banner-kalachakra",
    title: "Daily Planetary Alignment",
    subtitle: "Real-time planetary transits and Vedic blessings tailored to your Janam Kundli.",
    badge: "DAILY PLANETARY ALIGNMENT",
    imageUrl: "",
    type: "kalachakra_chakra",
    bgGradient: "from-[#FFF9F2] via-[#FFEEDC] to-[#FFDFC8]",
    ctaText: "Explore Upay",
    ctaLink: "/ai-chat",
    order: 1,
    isActive: true,
    isSystemDefault: true,
  },
  {
    bannerId: "banner-dhan-lakshmi",
    title: "Auspicious Dhan & Lakshmi Yog",
    subtitle: "Unlock financial abundance and business success with ancient Vedic wealth remedies.",
    badge: "🪙 SHREE DHAN & LAKSHMI YOG",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    type: "animated_card",
    bgGradient: "from-[#FEF3C7] via-[#FDE68A] to-[#F59E0B]",
    ctaText: "Check Dhan Yog",
    ctaLink: "/ai-chat",
    order: 2,
    isActive: true,
    isSystemDefault: true,
  },
  {
    bannerId: "banner-graha-shanti",
    title: "Navagraha Dosh & Shani Shanti",
    subtitle: "Get instant Vedic solutions for Shani Sade Sati, Rahu-Ketu, and Manglik Dosha.",
    badge: "🪐 GRAHA DOSH NIVARAN",
    imageUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
    type: "animated_card",
    bgGradient: "from-[#E0F2FE] via-[#BAE6FD] to-[#38BDF8]",
    ctaText: "Talk to Astrologer",
    ctaLink: "/chat",
    order: 3,
    isActive: true,
    isSystemDefault: true,
  },
  {
    bannerId: "banner-kundli-milan",
    title: "36 Gunas Kundli Milan & Vivah Yog",
    subtitle: "Check deep marriage compatibility, love harmony, and auspicious wedding dates.",
    badge: "❤️ VIVAH & PREM SAMBANDH",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    type: "animated_card",
    bgGradient: "from-[#FCE7F3] via-[#FBCFE8] to-[#F43F5E]",
    ctaText: "Match Kundli",
    ctaLink: "/kundli-milan",
    order: 4,
    isActive: true,
    isSystemDefault: true,
  },
];

export let bannersStore = loadData("banners.json", DEFAULT_BANNERS);

export const BannerModel = {
  find: async (query = {}) => {
    try {
      if (mongoose.connection.readyState === 1) {
        const atlasBanners = await MongoBanner.find(query).sort({ order: 1, createdAt: -1 }).lean();
        if (atlasBanners && atlasBanners.length > 0) {
          return atlasBanners.map((b) => ({
            ...b,
            id: b.bannerId || b._id.toString(),
          }));
        }
      }
    } catch (e) {
      console.warn("⚠️ [Banner Model] Atlas read fallback:", e.message);
    }
    return bannersStore.filter((b) => query.isActive === undefined || b.isActive === query.isActive);
  },

  findById: async (id) => {
    try {
      if (mongoose.connection.readyState === 1) {
        const b = await MongoBanner.findOne({
          $or: [{ bannerId: id }, { _id: mongoose.isValidObjectId(id) ? id : null }],
        }).lean();
        if (b) return { ...b, id: b.bannerId || b._id.toString() };
      }
    } catch (e) {}
    return bannersStore.find((b) => b.id === id || b.bannerId === id);
  },

  create: async (data) => {
    const bannerId = `banner_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const bannerPayload = {
      bannerId,
      title: data.title || "Special Astro Update",
      subtitle: data.subtitle || "",
      badge: data.badge || "SPECIAL INSIGHT",
      imageUrl: data.imageUrl || "",
      type: data.type || "custom_banner",
      bgGradient: data.bgGradient || "from-[#FFF9F2] via-[#FFEEDC] to-[#FFDFC8]",
      ctaText: data.ctaText || "Explore Now",
      ctaLink: data.ctaLink || "/chat",
      order: data.order !== undefined ? Number(data.order) : bannersStore.length + 1,
      isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      isSystemDefault: false,
    };

    try {
      if (mongoose.connection.readyState === 1) {
        const created = await MongoBanner.create(bannerPayload);
        const obj = created.toObject();
        obj.id = obj.bannerId;
        bannersStore.push(obj);
        saveData("banners.json", bannersStore);
        return obj;
      }
    } catch (e) {
      console.warn("⚠️ [Banner Model] Atlas create fallback:", e.message);
    }

    const localBanner = {
      ...bannerPayload,
      id: bannerId,
      createdAt: new Date().toISOString(),
    };
    bannersStore.push(localBanner);
    saveData("banners.json", bannersStore);
    return localBanner;
  },

  updateStatus: async (id, isActive) => {
    try {
      if (mongoose.connection.readyState === 1) {
        await MongoBanner.findOneAndUpdate(
          { $or: [{ bannerId: id }, { _id: mongoose.isValidObjectId(id) ? id : null }] },
          { $set: { isActive: Boolean(isActive) } }
        );
      }
    } catch (e) {}

    const idx = bannersStore.findIndex((b) => b.id === id || b.bannerId === id);
    if (idx !== -1) {
      bannersStore[idx].isActive = Boolean(isActive);
      saveData("banners.json", bannersStore);
      return bannersStore[idx];
    }
    return null;
  },

  deleteById: async (id) => {
    try {
      if (mongoose.connection.readyState === 1) {
        await MongoBanner.deleteOne({
          $or: [{ bannerId: id }, { _id: mongoose.isValidObjectId(id) ? id : null }],
        });
      }
    } catch (e) {}

    bannersStore = bannersStore.filter((b) => b.id !== id && b.bannerId !== id);
    saveData("banners.json", bannersStore);
    return true;
  },
};
