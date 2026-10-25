import express from "express";
import {
  getAllAstrologers,
  addAstrologer,
  updateAstrologer,
  deleteAstrologer,
  toggleAstrologerStatus,
} from "../controllers/astrologerController.js";

const router = express.Router();

// 1. GET all astrologers
router.get("/", getAllAstrologers);

// 2. POST add astrologer
router.post("/", addAstrologer);

// 3. PUT update/edit astrologer
router.put("/:id", updateAstrologer);

// 4. DELETE astrologer by id
router.delete("/:id", deleteAstrologer);

// 5. PATCH toggle online/offline status
router.patch("/:id/status", toggleAstrologerStatus);

export default router;