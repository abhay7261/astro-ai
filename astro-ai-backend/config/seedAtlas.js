import mongoose from "mongoose";
import { loadData } from "./fileDb.js";

export async function seedAtlasIfEmpty() {
  try {
    const db = mongoose.connection.db;
    if (!db) return;

    // 1. Seed Users
    const usersCol = db.collection("users");
    const userCount = await usersCol.countDocuments();
    if (userCount === 0) {
      const usersData = loadData("users.json", []);
      if (usersData.length > 0) {
        await usersCol.insertMany(usersData.map(({ id, ...rest }) => ({ ...rest, userId: id })));
        console.log(`🍃 [MongoDB Atlas] Seeded ${usersData.length} users into 'users' collection!`);
      }
    }

    // 2. Clean up legacy dummy astros and seed only if real data exists
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
    const astroCount = await astrosCol.countDocuments();
    if (astroCount === 0) {
      const astrosData = loadData("astrologers.json", []);
      if (astrosData.length > 0) {
        await astrosCol.insertMany(astrosData.map(({ id, ...rest }) => ({ ...rest, astrologerId: id })));
        console.log(`🍃 [MongoDB Atlas] Seeded ${astrosData.length} astrologers into 'astrologers' collection!`);
      }
    }

    // 3. Seed Mandates / Subscriptions
    const mandatesCol = db.collection("mandates");
    const mandateCount = await mandatesCol.countDocuments();
    if (mandateCount === 0) {
      const mandatesData = loadData("mandates.json", []);
      if (mandatesData.length > 0) {
        await mandatesCol.insertMany(mandatesData);
        console.log(`🍃 [MongoDB Atlas] Seeded ${mandatesData.length} subscriptions into 'mandates' collection!`);
      }
    }

    // 4. Clean up legacy dummy reels and seed only if real data exists
    const reelsCol = db.collection("reels");
    await reelsCol.deleteMany({
      $or: [
        { reelId: { $in: ["1", "2", "3"] } },
        { id: { $in: ["1", "2", "3"] } },
      ],
    });
    const reelCount = await reelsCol.countDocuments();
    if (reelCount === 0) {
      const reelsData = loadData("reels.json", []);
      if (reelsData.length > 0) {
        await reelsCol.insertMany(reelsData.map(({ id, ...rest }) => ({ ...rest, reelId: id })));
        console.log(`🍃 [MongoDB Atlas] Seeded ${reelsData.length} reels into 'reels' collection!`);
      }
    }

    // 5. Seed Poojas
    const poojasCol = db.collection("poojas");
    const poojaCount = await poojasCol.countDocuments();
    if (poojaCount === 0) {
      const poojasData = loadData("poojas.json", []);
      if (poojasData.length > 0) {
        await poojasCol.insertMany(poojasData.map(({ id, ...rest }) => ({ ...rest, poojaId: id })));
        console.log(`🍃 [MongoDB Atlas] Seeded ${poojasData.length} Vedic Poojas into 'poojas' collection!`);
      }
    }
  } catch (err) {
    console.warn("⚠️ [MongoDB Atlas] Seed warning:", err.message);
  }
}
