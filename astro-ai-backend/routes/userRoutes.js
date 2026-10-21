import express from "express";
import {
  getAllUsers,
  loginUser,
  signupUser,
  logoutUser,
  verifySession,
  updateUserName,
  addBonusBalance,
  toggleBanUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/login", loginUser);
router.post("/signup", signupUser);
router.post("/register", signupUser);
router.post("/logout", logoutUser);
router.get("/verify-session", verifySession);
router.put("/profile/name", updateUserName);
router.post("/:id/bonus", addBonusBalance);
router.put("/:id/ban", toggleBanUser);

export default router;
