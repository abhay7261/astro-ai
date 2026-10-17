// UPI Auto-Pay Mandate Store & Persistent Disk Model
import { loadData, saveData } from "../config/fileDb.js";

const DEFAULT_CONFIG = {
  trialSetupFee: 4,
  trialDays: 3,
  recurringAutoDebitAmount: 299,
  isActive: true,
};

const DEFAULT_SUBSCRIPTIONS = [
  {
    mandateId: "mandate_1729012800",
    userId: "u-1",
    userName: "Abhay Saini",
    upiApp: "phonepe",
    setupFeePaid: 4,
    status: "active",
    trialStartedAt: new Date().toISOString(),
    trialEndsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    nextDebitAmount: 299,
  },
];

export let mandateConfigStore = loadData("mandate_config.json", DEFAULT_CONFIG);
export let subscriptionsStore = loadData("mandates.json", DEFAULT_SUBSCRIPTIONS);

export const MandateModel = {
  getConfig: () => mandateConfigStore,
  updateConfig: (newConfig) => {
    mandateConfigStore = { ...mandateConfigStore, ...newConfig };
    saveData("mandate_config.json", mandateConfigStore);
    return mandateConfigStore;
  },
  findSubscriptions: () => subscriptionsStore,
  createSubscription: (data) => {
    const sub = {
      mandateId: `mandate_${Date.now()}`,
      setupFeePaid: mandateConfigStore.trialSetupFee,
      status: "active",
      trialStartedAt: new Date().toISOString(),
      trialEndsAt: new Date(Date.now() + mandateConfigStore.trialDays * 24 * 60 * 60 * 1000).toISOString(),
      nextDebitAmount: mandateConfigStore.recurringAutoDebitAmount,
      ...data,
    };
    subscriptionsStore.unshift(sub);
    saveData("mandates.json", subscriptionsStore);
    return sub;
  },
  cancelSubscription: (mandateId) => {
    const sub = subscriptionsStore.find((s) => s.mandateId === mandateId);
    if (sub) {
      sub.status = "cancelled";
      saveData("mandates.json", subscriptionsStore);
    }
    return sub;
  },
};
