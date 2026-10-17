// Astrologer Operations Controller
import { AstrologerModel } from "../models/Astrologer.js";

// 1. GET All Astrologers
export const getAllAstrologers = (req, res) => {
  const astrologers = AstrologerModel.find();
  res.json({
    success: true,
    count: astrologers.length,
    astrologers,
  });
};

// 2. POST Add New Astrologer
export const addAstrologer = (req, res) => {
  const { name, title, category, pricePerMin, experience, specialty, image } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: "Naam likhna zaroori hai!" });
  }

  const newAstrologer = AstrologerModel.create({
    name,
    title: title || "Vedic Astrologer",
    category: category || "Kundli",
    experience: experience || "5+ Yrs Exp",
    pricePerMin: Number(pricePerMin) || 20,
    specialty: specialty || "General Jyotish",
    languages: req.body.languages || ["Hindi", "English"],
    image: image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  });

  res.status(201).json({
    success: true,
    message: "Naye Astrologer safalta-poorvak add ho gaye! 🎉",
    astrologer: newAstrologer,
  });
};

// 3. DELETE Astrologer
export const deleteAstrologer = (req, res) => {
  const { id } = req.params;
  const deleted = AstrologerModel.deleteById(id);

  if (!deleted) {
    return res.status(404).json({ success: false, message: "Astrologer nahi mila!" });
  }

  res.json({
    success: true,
    message: `Astrologer ID ${id} ko delete kar diya gaya hai.`,
  });
};

// 4. PATCH Toggle Status
export const toggleAstrologerStatus = (req, res) => {
  const { id } = req.params;
  const { isOnline } = req.body;
  const updated = AstrologerModel.updateStatus(id, isOnline);
  if (updated) {
    return res.json({ success: true, astrologer: updated });
  }
  res.status(404).json({ success: false, message: "Astrologer not found" });
};
