import express from "express";
import {
  adminLogin,
  changeAdminPin,
  getAdminAnalytics,
  getAIPersonas,
  addAIPersona,
  deleteAIPersona,
  broadcastNotification,
  wipeAllData,
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/login", adminLogin);
router.post("/change-pin", changeAdminPin);
router.get("/analytics", getAdminAnalytics);
router.get("/ai-bots", getAIPersonas);
router.post("/ai-bots", addAIPersona);
router.delete("/ai-bots/:id", deleteAIPersona);
router.post("/broadcast", broadcastNotification);
router.post("/wipe-data", wipeAllData);

export default router;
