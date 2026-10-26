// Pooja & Pandit Ji Appointment Data Model (MongoDB Atlas & FileDB Fallback)
import mongoose from "mongoose";
import { loadData, saveData } from "../config/fileDb.js";

// 1. Pooja Catalog Schema
const poojaSchema = new mongoose.Schema(
  {
    poojaId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    subtitle: { type: String, default: "Vedic Anushthan & Pooja" },
    deity: { type: String, default: "Bhagwan Shiv" },
    category: { type: String, default: "Dosha" },
    duration: { type: String, default: "60-90 mins" },
    price: { type: Number, default: 1499 },
    originalPrice: { type: Number, default: 1999 },
    purohitsCount: { type: String, default: "1 Purohit" },
    badge: { type: String, default: "POPULAR" },
    panditName: { type: String, default: "Acharya Vidyadhar Shastri" },
    image: { type: String, default: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80" },
    benefits: { type: [String], default: ["Graha Shanti", "Sankalp Darshan"] },
    description: { type: String, default: "Vedic vidhi-vidhan se sampoorna pooja anushthan." },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const MongoPooja =
  mongoose.models.Pooja || mongoose.model("Pooja", poojaSchema, "poojas");

// 2. Pooja Appointment Schema
const appointmentSchema = new mongoose.Schema(
  {
    appointmentId: { type: String, required: true, index: true },
    poojaId: { type: String, required: true },
    poojaName: { type: String, required: true },
    panditName: { type: String, default: "Acharya Vidyadhar Shastri" },
    userName: { type: String, required: true },
    userPhone: { type: String, required: true },
    userEmail: { type: String, default: "" },
    gotra: { type: String, default: "Kashyap" },
    preferredDate: { type: String, required: true },
    preferredTime: { type: String, default: "Morning 09:00 AM" },
    mode: { type: String, default: "Live Video Sankalp" },
    price: { type: Number, default: 2100 },
    status: { type: String, default: "Pending" }, // Pending, Confirmed, Completed, Cancelled
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export const MongoAppointment =
  mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema, "pooja_appointments");

export const DEFAULT_POOJAS = [
  {
    id: "pooja-1",
    poojaId: "pooja-1",
    name: "Maha Mrityunjaya Anushthan",
    subtitle: "Aayu Vriddhi & Gambhir Rog Mukti Havan",
    deity: "Bhagwan Shiv",
    category: "Health",
    duration: "2-3 Ghante",
    price: 2100,
    panditName: "Acharya Vidyadhar Shastri",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    benefits: ["Akal mrityu bhay se mukti", "Arogya evam aayu me vriddhi", "Shiva Sahasranama paath"],
    description: "Vedic parampara ke anusaar 1100 Maha Mrityunjaya mantra jaap aur ghrut aahuti sahit shanti havan.",
    isActive: true,
  },
  {
    id: "pooja-2",
    poojaId: "pooja-2",
    name: "Rudrabhishek & Kalsarp Dosh Shanti",
    subtitle: "Kaal Sarp & Graha Badha Nivaran",
    deity: "Mahadev",
    category: "Dosha",
    duration: "1.5 Ghanta",
    price: 1500,
    panditName: "Pandit Radheshyam Joshi",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    benefits: ["Kaal Sarp dosh nivaran", "Mansik tanaav se mukti", "Panchamrit Abhishek live darshan"],
    description: "Shivalinga par panchamrit, gangajal, belpatra aur shubh dravyon se abhishek kar dosh mukti sankalp.",
    isActive: true,
  },
  {
    id: "pooja-3",
    poojaId: "pooja-3",
    name: "Navagraha Shanti & Mahahavan",
    subtitle: "Shani Sade Sati & Rahu-Ketu Shanti",
    deity: "Navagraha Devta",
    category: "Dosha",
    duration: "2 Ghante",
    price: 2500,
    panditName: "Maa Gayatri Devi",
    image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=600&q=80",
    benefits: ["Shani Sade Sati shanti", "Rahu-Ketu dosha nivaran", "Sampoorna parivar kalyan"],
    description: "Kundli ke sabhi 9 graho ki shanti ke liye samidha aahuti aur navagraha stotra jaap.",
    isActive: true,
  },
  {
    id: "pooja-4",
    poojaId: "pooja-4",
    name: "Kuber Lakshmi Dhan Prapti Pooja",
    subtitle: "Vyapar Vriddhi & Karz Mukti Anushthan",
    deity: "Maa Lakshmi & Kuber Dev",
    category: "Wealth",
    duration: "1.5 Ghanta",
    price: 1800,
    panditName: "Guruji Devendra Nath",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    benefits: ["Karobar aur vyapar me vriddhi", "Karz mukti aur aarthik labh", "Shree Yantra abhimantrit prasad"],
    description: "Kanakadhara stotra aur Shree Suktam ke 16 aahutiyon dwara dhan sthirta aur samriddhi poojan.",
    isActive: true,
  },
  {
    id: "pooja-5",
    poojaId: "pooja-5",
    name: "Vivah Badha Nivaran & Manglik Shanti",
    subtitle: "Sheeghra Vivah & Jeevansathi Prapti",
    deity: "Devguru Brihaspati & Mangal Dev",
    category: "Marriage",
    duration: "2 Ghante",
    price: 2100,
    panditName: "Dr. Ananya Mukherjee",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    benefits: ["Shaadi me rukawato ka nidaan", "Shubh jeevansathi yog", "Mangal dosha nivaran havan"],
    description: "Brihaspati kripa prapti aur Manglik dosha shanti ke liye peele pushp aur vishesh ahuti sankalp.",
    isActive: true,
  },
  {
    id: "pooja-6",
    poojaId: "pooja-6",
    name: "Ghar Vastu Shanti & Sukh Havan",
    subtitle: "Ghar me Nakaratmak Urja Nivaran",
    deity: "Vastu Purush",
    category: "Vastu",
    duration: "2.5 Ghante",
    price: 3100,
    panditName: "Guruji Devendra Nath",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    benefits: ["Ghar me sakaratmak urja pravah", "Parivarik shanti aur samriddhi", "Vastu kalash sthapana"],
    description: "Ishan kon me kalash sthapana sahit sampoorna ghar ka shuddhikaran aur havan anushthan.",
    isActive: true,
  },
];

export let poojasStore = loadData("poojas.json", DEFAULT_POOJAS);
if (!poojasStore || poojasStore.length === 0) {
  poojasStore = [...DEFAULT_POOJAS];
  saveData("poojas.json", poojasStore);
}

export let appointmentsStore = loadData("appointments.json", []);

export const PoojaModel = {
  find: async (query = {}) => {
    try {
      if (mongoose.connection.readyState === 1) {
        const atlasPoojas = await MongoPooja.find(query).lean();
        return (atlasPoojas || []).map((p) => ({
          ...p,
          id: p.poojaId || p._id.toString(),
        }));
      }
    } catch (e) {
      console.warn("⚠️ [Pooja Model] Atlas read fallback:", e.message);
    }
    return poojasStore || [];
  },

  create: async (data) => {
    const poojaId = data.id || data.poojaId || `pooja-${Date.now()}`;
    const newPooja = {
      id: poojaId,
      poojaId,
      isActive: data.isActive !== undefined ? data.isActive : true,
      price: Number(data.price) || 1499,
      originalPrice: Number(data.originalPrice) || (Number(data.price) ? Math.round(Number(data.price) * 1.3) : 1999),
      purohitsCount: data.purohitsCount || "1 Purohit",
      badge: data.badge !== undefined ? data.badge : "POPULAR",
      duration: data.duration || "60-90 mins",
      category: data.category || "All",
      deity: data.deity || "Bhagwan",
      benefits: Array.isArray(data.benefits) ? data.benefits : ["Graha Shanti", "Sankalp Darshan"],
      ...data,
    };

    try {
      if (mongoose.connection.readyState === 1) {
        const doc = await MongoPooja.create(newPooja);
        newPooja._id = doc._id;
      }
    } catch (e) {
      console.warn("⚠️ [Pooja Model] Atlas insert fallback:", e.message);
    }

    poojasStore.unshift(newPooja);
    saveData("poojas.json", poojasStore);
    return newPooja;
  },

  updateById: async (id, data) => {
    try {
      if (mongoose.connection.readyState === 1) {
        await MongoPooja.updateOne(
          { $or: [{ poojaId: id }, { _id: mongoose.isValidObjectId(id) ? id : null }] },
          { $set: data }
        );
      }
    } catch (e) {}

    const idx = poojasStore.findIndex((p) => p.id === id || String(p.poojaId) === String(id));
    if (idx !== -1) {
      poojasStore[idx] = { ...poojasStore[idx], ...data };
      saveData("poojas.json", poojasStore);
      return poojasStore[idx];
    }
    return null;
  },

  deleteById: async (id) => {
    try {
      if (mongoose.connection.readyState === 1) {
        await MongoPooja.deleteOne({
          $or: [{ poojaId: id }, { _id: mongoose.isValidObjectId(id) ? id : null }],
        });
      }
    } catch (e) {}

    const initLen = poojasStore.length;
    poojasStore = poojasStore.filter((p) => p.id !== id && String(p.poojaId) !== String(id));
    const deleted = poojasStore.length !== initLen;
    if (deleted) saveData("poojas.json", poojasStore);
    return deleted;
  },
};

export const AppointmentModel = {
  find: async (query = {}) => {
    try {
      if (mongoose.connection.readyState === 1) {
        const atlasApps = await MongoAppointment.find(query).sort({ createdAt: -1 }).lean();
        if (atlasApps && atlasApps.length > 0) {
          return atlasApps.map((a) => ({
            ...a,
            id: a.appointmentId || a._id.toString(),
          }));
        }
      }
    } catch (e) {}
    return appointmentsStore;
  },

  create: async (data) => {
    const appointmentId = `apt-${Date.now()}`;
    const newApp = {
      id: appointmentId,
      appointmentId,
      status: "Pending",
      createdAt: new Date().toISOString(),
      ...data,
    };

    try {
      if (mongoose.connection.readyState === 1) {
        const doc = await MongoAppointment.create(newApp);
        newApp._id = doc._id;
      }
    } catch (e) {}

    appointmentsStore.unshift(newApp);
    saveData("appointments.json", appointmentsStore);
    return newApp;
  },

  updateStatus: async (id, status) => {
    try {
      if (mongoose.connection.readyState === 1) {
        await MongoAppointment.updateOne(
          { $or: [{ appointmentId: id }, { _id: mongoose.isValidObjectId(id) ? id : null }] },
          { $set: { status } }
        );
      }
    } catch (e) {}

    const idx = appointmentsStore.findIndex((a) => a.id === id || String(a.appointmentId) === String(id));
    if (idx !== -1) {
      appointmentsStore[idx].status = status;
      saveData("appointments.json", appointmentsStore);
      return appointmentsStore[idx];
    }
    return null;
  },

  deleteById: async (id) => {
    try {
      if (mongoose.connection.readyState === 1) {
        await MongoAppointment.deleteOne({
          $or: [{ appointmentId: id }, { _id: mongoose.isValidObjectId(id) ? id : null }],
        });
      }
    } catch (e) {}

    const initLen = appointmentsStore.length;
    appointmentsStore = appointmentsStore.filter((a) => a.id !== id && String(a.appointmentId) !== String(id));
    const deleted = appointmentsStore.length !== initLen;
    if (deleted) saveData("appointments.json", appointmentsStore);
    return deleted;
  },
};
