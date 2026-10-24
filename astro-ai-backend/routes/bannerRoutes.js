import express from "express";
import {
  getBanners,
  createBanner,
  toggleBannerStatus,
  deleteBanner,
} from "../controllers/bannerController.js";

const router = express.Router();

// Public read route
router.get("/", getBanners);

// Admin modification routes
router.post("/", createBanner);
router.patch("/:id/status", toggleBannerStatus);
router.delete("/:id", deleteBanner);

export default router;
