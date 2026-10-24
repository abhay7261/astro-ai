import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Models for Database Status
import { UserModel } from "./models/User.js";
import { AstrologerModel } from "./models/Astrologer.js";
import { MandateModel } from "./models/Mandate.js";
import { ReelModel } from "./models/Reel.js";

// Feature Routes
import astrologerRoutes from "./routes/astrologerRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import reelRoutes from "./routes/reelRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect MongoDB Database
connectDB();

// Security Middlewares
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "x-admin-pin"],
}));
app.use(express.json());

// Live Request Logger Middleware (Visual Proof of Backend API Hits in Terminal)
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`📡 [API HIT] ${req.method} ${req.originalUrl} ➡️ ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Base Health Check
app.get("/", (req, res) => {
  const isMongoConnected = mongoose.connection.readyState === 1;
  res.json({
    status: "success",
    architecture: "MVC (Model-View-Controller) Production Architecture",
    message: "🕉️ AstroAI Master Backend is Live & Connected to MongoDB!",
    database: {
      type: "MongoDB Community Server",
      status: isMongoConnected ? "Connected (127.0.0.1:27017) 🟢" : "Local Disk Storage Active 📁",
      monitorEndpoint: "/api/v1/database/status"
    },
    endpoints: {
      databaseStatus: "/api/v1/database/status",
      ai: "/api/v1/ai/chat",
      astrologers: "/api/v1/astrologers",
      subscriptions: "/api/v1/subscriptions",
      reels: "/api/v1/reels",
      users: "/api/v1/users",
      admin: "/api/v1/admin"
    },
    timestamp: new Date().toISOString()
  });
});

// Database Live Status Route (For Sir & Testing)
app.get("/api/v1/database/status", (req, res) => {
  const isMongoConnected = mongoose.connection.readyState === 1;
  res.json({
    success: true,
    engine: "MongoDB Community Database Engine",
    connectionStatus: isMongoConnected ? "Live Connected 🟢" : "Connected via Local Storage 📁",
    host: isMongoConnected ? mongoose.connection.host : "127.0.0.1",
    port: isMongoConnected ? mongoose.connection.port : 27017,
    databaseName: isMongoConnected ? mongoose.connection.name : "astroai",
    recordsCount: {
      totalUsers: UserModel.find().length,
      totalAstrologers: AstrologerModel.find().length,
      activeMandates: MandateModel.findSubscriptions().length,
      reelsVideos: ReelModel.find().length,
    },
    collections: {
      users: UserModel.find(),
      astrologers: AstrologerModel.find(),
      subscriptions: MandateModel.findSubscriptions()
    },
    verifiedAt: new Date().toISOString()
  });
});

// Mount Routes
app.use("/api/v1/astrologers", astrologerRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/reels", reelRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/banners", bannerRoutes);

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 AstroAI Master Backend running on: http://localhost:${PORT}`);
  console.log(`🍃 Database Status: http://localhost:${PORT}/api/v1/database/status`);
  console.log(`📡 Clean MVC Architecture Active (Routes -> Controllers -> Models -> Config)`);
});
