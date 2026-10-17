// Astro Reels Store & Persistent Disk Model
import { loadData, saveData } from "../config/fileDb.js";

const DEFAULT_REELS = [
  {
    id: "1",
    title: "Shanivaar ko Shani Dev ko prasann karne ka 1 achook upay!",
    astrologerName: "Acharya Vidyadhar",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-burning-candle-in-the-dark-42998-large.mp4",
    likes: 1240,
    commentsCount: 84,
    tag: "#ShaniUpay",
    dateAdded: "12 Oct 2026",
  },
  {
    id: "2",
    title: "Agar Kundli me Chandrama kamzor ho toh kya karein?",
    astrologerName: "Dr. Ananya Mukherjee",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4",
    likes: 2480,
    commentsCount: 142,
    tag: "#MoonSign",
    dateAdded: "13 Oct 2026",
  },
  {
    id: "3",
    title: "Ghar ki tijori is disha me rakhein, dhan yog banega!",
    astrologerName: "Guruji Devendra",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-meditation-of-a-woman-in-nature-41585-large.mp4",
    likes: 3190,
    commentsCount: 215,
    tag: "#VastuTips",
    dateAdded: "14 Oct 2026",
  },
];

export let reelsStore = loadData("reels.json", DEFAULT_REELS);

export const ReelModel = {
  find: () => reelsStore,
  findById: (id) => reelsStore.find((r) => r.id === id),
  create: (data) => {
    const newReel = {
      id: Date.now().toString(),
      likes: 0,
      commentsCount: 0,
      dateAdded: "Today",
      ...data,
    };
    reelsStore.unshift(newReel);
    saveData("reels.json", reelsStore);
    return newReel;
  },
  deleteById: (id) => {
    const initialLen = reelsStore.length;
    reelsStore = reelsStore.filter((r) => r.id !== id);
    const deleted = reelsStore.length !== initialLen;
    if (deleted) {
      saveData("reels.json", reelsStore);
    }
    return deleted;
  },
  like: (id) => {
    const reel = reelsStore.find((r) => r.id === id);
    if (reel) {
      reel.likes += 1;
      saveData("reels.json", reelsStore);
    }
    return reel;
  },
};
