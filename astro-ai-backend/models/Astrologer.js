// Astrologer Data Model & Persistent Disk Store
import { loadData, saveData } from "../config/fileDb.js";

const DEFAULT_ASTROLOGERS = [];

export let astrologersStore = loadData("astrologers.json", DEFAULT_ASTROLOGERS);

export const AstrologerModel = {
  find: () => astrologersStore,
  findById: (id) => astrologersStore.find((a) => a.id === id),
  create: (data) => {
    const newAstro = {
      id: Date.now().toString(),
      rating: 4.9,
      totalConsultations: "100+",
      isOnline: true,
      languages: ["Hindi", "English"],
      ...data,
    };
    astrologersStore.unshift(newAstro);
    saveData("astrologers.json", astrologersStore);
    return newAstro;
  },
  deleteById: (id) => {
    const initialLen = astrologersStore.length;
    astrologersStore = astrologersStore.filter((a) => a.id !== id && String(a.id) !== String(id));
    const deleted = astrologersStore.length !== initialLen;
    if (deleted) {
      saveData("astrologers.json", astrologersStore);
    }
    return deleted;
  },
  clearAll: () => {
    astrologersStore = [];
    saveData("astrologers.json", astrologersStore);
    return true;
  },
  updateStatus: (id, isOnline) => {
    const astro = astrologersStore.find((a) => a.id === id);
    if (astro) {
      astro.isOnline = isOnline;
      saveData("astrologers.json", astrologersStore);
    }
    return astro;
  },
};
