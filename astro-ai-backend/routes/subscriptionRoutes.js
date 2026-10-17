import express from "express";
import {
  getMandateConfig,
  updateMandateConfig,
  createMandateOrder,
  verifyMandate,
  cancelMandate,
} from "../controllers/subscriptionController.js";

const router = express.Router();

router.get("/config", getMandateConfig);
router.put("/config", updateMandateConfig);
router.post("/create-mandate", createMandateOrder);
router.post("/verify-mandate", verifyMandate);
router.post("/cancel-mandate", cancelMandate);

export default router;
