import express from "express";
import {
  getAllReels,
  publishReel,
  deleteReel,
  likeReel,
} from "../controllers/reelController.js";

const router = express.Router();

router.get("/", getAllReels);
router.post("/", publishReel);
router.delete("/:id", deleteReel);
router.post("/:id/like", likeReel);

export default router;
