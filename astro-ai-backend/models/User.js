// User Data Model & Persistent Disk Store
import { loadData, saveData } from "../config/fileDb.js";

const DEFAULT_USERS = [
  {
    id: "u-1",
    name: "Abhay Saini",
    email: "sainiabhay070@gmail.com",
    joinedDate: "12 Oct 2026",
    walletBalance: 250,
    totalConsultations: 4,
    isVIP: true,
    isBanned: false,
  },
  {
    id: "u-2",
    name: "Rohit Sharma",
    email: "rohit.sharma@example.com",
    joinedDate: "13 Oct 2026",
    walletBalance: 0,
    totalConsultations: 1,
    isVIP: false,
    isBanned: false,
  },
  {
    id: "u-3",
    name: "Pooja Malhotra",
    email: "pooja.m@example.com",
    joinedDate: "14 Oct 2026",
    walletBalance: 80,
    totalConsultations: 2,
    isVIP: true,
    isBanned: false,
  },
];

export let usersStore = loadData("users.json", DEFAULT_USERS);

export const UserModel = {
  find: () => usersStore,
  findByEmail: (email) => usersStore.find((u) => u.email === email),
  findById: (id) => usersStore.find((u) => u.id === id),
  create: (data) => {
    const newUser = {
      id: `u-${Date.now()}`,
      joinedDate: "Today",
      walletBalance: 50,
      isVIP: false,
      isBanned: false,
      ...data,
    };
    usersStore.unshift(newUser);
    saveData("users.json", usersStore);
    return newUser;
  },
  updateName: (id, name) => {
    const user = usersStore.find((u) => u.id === id || u.email === "sainiabhay070@gmail.com");
    if (user) {
      user.name = name;
      saveData("users.json", usersStore);
    }
    return user;
  },
  addBonus: (id, amount) => {
    const user = usersStore.find((u) => u.id === id);
    if (user) {
      user.walletBalance += Number(amount) || 50;
      saveData("users.json", usersStore);
    }
    return user;
  },
  toggleBan: (id) => {
    const user = usersStore.find((u) => u.id === id);
    if (user) {
      user.isBanned = !user.isBanned;
      saveData("users.json", usersStore);
    }
    return user;
  },
};
