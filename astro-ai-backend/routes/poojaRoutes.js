import express from "express";
import {
  getAllPoojas,
  createPooja,
  updatePooja,
  deletePooja,
  bookAppointment,
  getAllAppointments,
  updateAppointmentStatus,
  deleteAppointment,
} from "../controllers/poojaController.js";

const router = express.Router();

// Pooja Catalog
router.get("/", getAllPoojas);
router.post("/", createPooja);
router.put("/:id", updatePooja);
router.delete("/:id", deletePooja);

// Appointments & Bookings
router.post("/book", bookAppointment);
router.get("/appointments", getAllAppointments);
router.patch("/appointments/:id/status", updateAppointmentStatus);
router.delete("/appointments/:id", deleteAppointment);

export default router;
