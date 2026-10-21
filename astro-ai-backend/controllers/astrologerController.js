// Astrologer Operations Controller (MongoDB Atlas & Persistent Store)
import { AstrologerModel } from "../models/Astrologer.js";

// 1. GET All Astrologers
export const getAllAstrologers = async (req, res) => {
  try {
    const astrologers = await AstrologerModel.find();
    res.json({
      success: true,
      count: astrologers.length,
      astrologers,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. POST Add New Astrologer
export const addAstrologer = async (req, res) => {
  try {
    const { name, title, category, pricePerMin, experience, specialty, image, languages } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Naam likhna zaroori hai!" });
    }

    const newAstrologer = await AstrologerModel.create({
      name: name.trim(),
      title: title ? title.trim() : "Vedic Astrologer",
      category: category || "Kundli",
      experience: experience || "5+ Yrs Exp",
      pricePerMin: Number(pricePerMin) || 20,
      specialty: specialty || "General Jyotish",
      languages: languages || ["Hindi", "English"],
      image: image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    });

    res.status(201).json({
      success: true,
      message: "Naye Astrologer safalta-poorvak add ho gaye! 🎉",
      astrologer: newAstrologer,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 3. DELETE Astrologer
export const deleteAstrologer = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await AstrologerModel.deleteById(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Astrologer nahi mila!" });
    }

    res.json({
      success: true,
      message: `Astrologer ID ${id} ko delete kar diya gaya hai.`,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 4. PATCH Toggle Status
export const toggleAstrologerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isOnline } = req.body;
    const updated = await AstrologerModel.updateStatus(id, isOnline);
    if (updated) {
      return res.json({ success: true, astrologer: updated });
    }
    res.status(404).json({ success: false, message: "Astrologer not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
