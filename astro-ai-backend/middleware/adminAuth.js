// Master Admin Authentication & Security Guard
export const verifyAdmin = (req, res, next) => {
  const masterPin = process.env.ADMIN_MASTER_PIN || "7788";
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
