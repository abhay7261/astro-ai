// Pooja & Pandit Ji Appointment Controller (MongoDB Atlas & Persistent Store)
import { PoojaModel, AppointmentModel } from "../models/Pooja.js";

// 1. GET All Poojas
export const getAllPoojas = async (req, res) => {
  try {
    const poojas = await PoojaModel.find();
    res.json({
      success: true,
      count: poojas.length,
      poojas,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. POST Add New Pooja (Admin)
export const createPooja = async (req, res) => {
  try {
    const {
      name,
      subtitle,
      deity,
      category,
      duration,
      price,
      originalPrice,
      purohitsCount,
      badge,
      panditName,
      image,
      benefits,
      description,
      isActive,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Pooja ka naam likhna zaroori hai!" });
    }

    const newPooja = await PoojaModel.create({
      name: name.trim(),
      subtitle: subtitle ? subtitle.trim() : "Vedic Anushthan",
      deity: deity || "Bhagwan Shiv",
      category: category || "Dosha",
      duration: duration || "60-90 mins",
      price: Number(price) || 1499,
      originalPrice: Number(originalPrice) || 1999,
      purohitsCount: purohitsCount || "1 Purohit",
      badge: badge !== undefined ? badge : "POPULAR",
      panditName: panditName || "Acharya Vidyadhar Shastri",
      image: image || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
      benefits: Array.isArray(benefits) ? benefits : [benefits || "Graha Shanti"],
      description: description || "Vedic vidhi-vidhan se pooja anushthan.",
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      message: "Nayi Vedic Pooja safalta-poorvak add ho gayi! 🕉️",
      pooja: newPooja,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 3. PUT Update/Edit Pooja (Admin)
export const updatePooja = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await PoojaModel.updateById(id, req.body);

    if (!updated) {
      return res.status(404).json({ success: false, message: "Pooja nahi mili!" });
    }

    res.json({
      success: true,
      message: "Pooja details successfully update ho gayi hain! ✨",
      pooja: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 4. DELETE Pooja (Admin)
export const deletePooja = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await PoojaModel.deleteById(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Pooja nahi mili!" });
    }

    res.json({
      success: true,
      message: `Pooja ID ${id} delete ho gayi hai.`,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 5. POST Book Pooja Appointment (User / Client)
export const bookAppointment = async (req, res) => {
  try {
    const {
      poojaId,
      poojaName,
      panditName,
      userName,
      userPhone,
      userEmail,
      gotra,
      preferredDate,
      preferredTime,
      mode,
      price,
      notes,
    } = req.body;

    if (!userName || !userPhone || !preferredDate) {
      return res.status(400).json({
        success: false,
        message: "Apna Naam, Phone Number aur Pooja ki Date bharna zaroori hai!",
      });
    }

    const newAppointment = await AppointmentModel.create({
      poojaId: poojaId || "custom",
      poojaName: poojaName || "Vedic Pooja",
      panditName: panditName || "Acharya Vidyadhar Shastri",
      userName: userName.trim(),
      userPhone: userPhone.trim(),
      userEmail: userEmail ? userEmail.trim() : "",
      gotra: gotra ? gotra.trim() : "Kashyap",
      preferredDate,
      preferredTime: preferredTime || "Morning 09:00 AM",
      mode: mode || "Live Video Sankalp",
      price: Number(price) || 2100,
      notes: notes || "",
    });

    res.status(201).json({
      success: true,
      message: `Pranam ${userName}! Pandit Ji se aapka Pooja Appointment book ho gaya hai! 🙏`,
      appointment: newAppointment,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 6. GET All Booked Appointments (Admin)
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await AppointmentModel.find();
    res.json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 7. PATCH Update Appointment Status (Admin: Confirm / Complete / Cancel)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await AppointmentModel.updateStatus(id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Appointment nahi mila!" });
    }

    res.json({
      success: true,
      message: `Appointment status update hokar "${status}" ho gaya.`,
      appointment: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 8. DELETE Appointment (Admin)
export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await AppointmentModel.deleteById(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Appointment nahi mila!" });
    }

    res.json({
      success: true,
      message: "Appointment record delete kar diya gaya hai.",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
