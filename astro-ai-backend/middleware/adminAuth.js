// Master Admin Authentication & Security Guard (MongoDB Atlas Synced)
import { getActiveMasterPin } from "../controllers/adminController.js";

export const verifyAdmin = async (req, res, next) => {
  const masterPin = await getActiveMasterPin();
  const authHeader = req.headers.authorization;
  const pinHeader = req.headers["x-admin-pin"] || req.body?.pin;

  // Check Master PIN or Authorization Header
  if (pinHeader === masterPin || (authHeader && authHeader.includes("master_admin"))) {
    return next();
  }

  return res.status(401).json({
    success: false,
    message: "Access Denied! Valid Master Admin PIN or Token required.",
  });
};
