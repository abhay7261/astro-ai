import express from "express";
import { chatWithAIAstrologer } from "../controllers/aiController.js";

const router = express.Router();

// POST /api/v1/ai/chat
router.post("/chat", chatWithAIAstrologer);

export default router;