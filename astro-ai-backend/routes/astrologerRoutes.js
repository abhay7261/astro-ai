import express from "express";
import {
  getAllAstrologers,
  addAstrologer,
  deleteAstrologer,
  toggleAstrologerStatus,
} from "../controllers/astrologerController.js";

const router = express.Router();

// 1. GET all astrologers
router.get("/", getAllAstrologers);

// 2. POST add astrologer
router.post("/", addAstrologer);

// 3. DELETE astrologer by id
router.delete("/:id", deleteAstrologer);

// 4. PATCH toggle online/offline status
router.patch("/:id/status", toggleAstrologerStatus);

export default router;