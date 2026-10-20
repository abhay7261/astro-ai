// Astro Reels Store & Persistent Disk Model
import { loadData, saveData } from "../config/fileDb.js";

const DEFAULT_REELS = [
  {
    id: "1",
    title: "Shanivaar ko Shani Dev ko prasann karne ka 1 achook upay!",
    astrologerName: "Acharya Vidyadhar",
    videoUrl: "",
    likes: 1240,
    commentsCount: 84,
    tag: "#ShaniUpay",
    seriesName: "शनि दोष निवारण",
    seriesPart: 1,
    dateAdded: "12 Oct 2026",
  },
  {
    id: "2",
    title: "Agar Kundli me Chandrama kamzor ho toh kya karein?",
    astrologerName: "Dr. Ananya Mukherjee",
    videoUrl: "",
    likes: 2480,
    commentsCount: 142,
    tag: "#MoonSign",
    seriesName: "नवग्रह शांति सीरीज",
    seriesPart: 1,
    dateAdded: "13 Oct 2026",
  },
  {
    id: "3",
    title: "Ghar ki tijori is disha me rakhein, dhan yog banega!",
    astrologerName: "Guruji Devendra",
    videoUrl: "",
    likes: 3190,
    commentsCount: 215,
    tag: "#VastuTips",
    seriesName: "वास्तु और धन योग",
    seriesPart: 1,
    dateAdded: "14 Oct 2026",
  },
];

export let reelsStore = loadData("reels.json", DEFAULT_REELS);

export const ReelModel = {
  find: () => reelsStore,
  findById: (id) => reelsStore.find((r) => r.id === id),
  findBySeries: (seriesName) => reelsStore.filter((r) => r.seriesName === seriesName),
  create: (data) => {
    const newReel = {
      id: Date.now().toString(),
      likes: 0,
      commentsCount: 0,
      seriesName: data.seriesName ? data.seriesName.trim() : "",
      seriesPart: data.seriesPart ? Number(data.seriesPart) || 1 : null,
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
  deleteBySeries: (seriesName) => {
    const initialLen = reelsStore.length;
    reelsStore = reelsStore.filter((r) => r.seriesName !== seriesName);
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
