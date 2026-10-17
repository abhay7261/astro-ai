import express from "express";
import {
  getAllUsers,
  loginUser,
  updateUserName,
  addBonusBalance,
  toggleBanUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/login", loginUser);
router.put("/profile/name", updateUserName);
router.post("/:id/bonus", addBonusBalance);
router.put("/:id/ban", toggleBanUser);

export default router;
