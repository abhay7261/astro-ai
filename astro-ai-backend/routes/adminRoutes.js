import express from "express";
import {
  adminLogin,
  getAdminAnalytics,
  getAIPersonas,
  addAIPersona,
  deleteAIPersona,
  broadcastNotification,
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/analytics", getAdminAnalytics);
router.get("/ai-bots", getAIPersonas);
router.post("/ai-bots", addAIPersona);
router.delete("/ai-bots/:id", deleteAIPersona);
router.post("/broadcast", broadcastNotification);

export default router;
