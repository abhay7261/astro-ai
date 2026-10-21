// Astro Reels Store & Persistent Disk Model
import { loadData, saveData } from "../config/fileDb.js";

const DEFAULT_REELS = [];

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
    reelsStore = reelsStore.filter((r) => r.id !== id && String(r.id) !== String(id));
    const deleted = reelsStore.length !== initialLen;
    if (deleted) {
      saveData("reels.json", reelsStore);
    }
    return deleted;
  },
  clearAll: () => {
    reelsStore = [];
    saveData("reels.json", reelsStore);
    return true;
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
