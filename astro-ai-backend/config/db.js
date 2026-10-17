// MongoDB Database Connection Manager using Mongoose
import mongoose from "mongoose";
import dns from "dns";

// Ensure reliable SRV DNS resolution on Windows
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log("🍃 [Database] Notice: MONGODB_URI not set in .env.");
    console.log("📁 [Database] Using Persistent Disk JSON DB (data/users.json, etc.).");
    console.log("👉 Add MONGODB_URI in astro-ai-backend/.env to connect real MongoDB Atlas!");
    return;
  }

  try {
    console.log("🍃 [MongoDB] Connecting to MongoDB Database...");
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ [MongoDB] Live Connected Successfully: ${conn.connection.host}`);
    console.log(`🗄️ [MongoDB] Database Name: ${conn.connection.name}`);

    // Auto-seed initial collections into Atlas
    import("./seedAtlas.js").then((m) => m.seedAtlasIfEmpty()).catch(() => {});
  } catch (error) {
    console.warn("⚠️ [MongoDB] Connection error:", error.message);
    console.log("📁 [Database] Fallback active: Using persistent local disk DB.");
  }
};
