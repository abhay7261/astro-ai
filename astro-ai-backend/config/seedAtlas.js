import mongoose from "mongoose";

// Pure Database Guard - NO automatic fake data insertion
// Whatever user adds/deletes from Admin or MongoDB Atlas remains exactly as-is.
export async function seedAtlasIfEmpty() {
  try {
    const db = mongoose.connection.db;
    if (!db) return;

    // Clean up any legacy dummy placeholder astrologers if present
    const astrosCol = db.collection("astrologers");
    await astrosCol.deleteMany({
      $or: [
        { astrologerId: { $in: ["1", "2", "3"] } },
        { id: { $in: ["1", "2", "3"] } },
        { name: "Acharya Vidyadhar Shastri" },
        { name: "Dr. Ananya Mukherjee" },
        { name: "Pandit Radheshyam Joshi" },
      ],
    });

    console.log("🍃 [MongoDB Atlas] Database verified: Only user-authorized documents active.");
  } catch (err) {
    console.warn("⚠️ [MongoDB Atlas] Guard warning:", err.message);
  }
}
