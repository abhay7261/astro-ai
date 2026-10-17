/**
 * AstroAI — Centralized Frontend API Service Client
 * Connects frontend views and components directly to the Node.js MVC backend.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// Generic request helper with timeout and fallback
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      console.warn(`[API] Error ${res.status} on ${endpoint}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.warn(`[API] Network error on ${endpoint}:`, err);
    return null;
  }
}

// 1. Astrologers API
export const astrologersApi = {
  getAll: async () => {
    const data = await apiRequest<{ success: boolean; astrologers: any[] }>("/astrologers");
    return data?.astrologers || null;
  },
  create: async (astroData: any) => {
    return await apiRequest<{ success: boolean; astrologer: any }>("/astrologers", {
      method: "POST",
      body: JSON.stringify(astroData),
    });
  },
  delete: async (id: string) => {
    return await apiRequest<{ success: boolean; message: string }>(`/astrologers/${id}`, {
      method: "DELETE",
    });
  },
  toggleStatus: async (id: string, isOnline: boolean) => {
    return await apiRequest<{ success: boolean; astrologer: any }>(`/astrologers/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ isOnline }),
    });
  },
};

// 2. AI Astrologer API
export const aiApi = {
  chat: async (message: string, context?: any) => {
    return await apiRequest<{
      success: boolean;
      reply: string;
      remedy?: string;
      mantra?: string;
    }>("/ai/chat", {
      method: "POST",
      body: JSON.stringify({ message, context }),
    });
  },
};

// 3. Subscriptions & ₹4 Auto-Debit Mandate API
export const subscriptionsApi = {
  getConfig: async () => {
    const data = await apiRequest<{ success: boolean; config: any }>("/subscriptions/config");
    return data?.config || null;
  },
  updateConfig: async (config: any) => {
    return await apiRequest<{ success: boolean; config: any }>("/subscriptions/config", {
      method: "PUT",
      body: JSON.stringify(config),
    });
  },
  createMandate: async (upiApp: string) => {
    return await apiRequest<{ success: boolean; mandate: any }>("/subscriptions/create-mandate", {
      method: "POST",
      body: JSON.stringify({ upiApp }),
    });
  },
  verifyMandate: async (mandateId: string, upiApp: string, userId?: string) => {
    return await apiRequest<{ success: boolean; subscription: any }>("/subscriptions/verify-mandate", {
      method: "POST",
      body: JSON.stringify({ mandateId, upiApp, userId }),
    });
  },
  cancelMandate: async (mandateId: string) => {
    return await apiRequest<{ success: boolean; message: string }>("/subscriptions/cancel-mandate", {
      method: "POST",
      body: JSON.stringify({ mandateId }),
    });
  },
};

// 4. Reels Short Videos API
export const reelsApi = {
  getAll: async () => {
    const data = await apiRequest<{ success: boolean; reels: any[] }>("/reels");
    return data?.reels || null;
  },
  publish: async (reelData: any) => {
    return await apiRequest<{ success: boolean; reel: any }>("/reels", {
      method: "POST",
      body: JSON.stringify(reelData),
    });
  },
  delete: async (id: string) => {
    return await apiRequest<{ success: boolean; message: string }>(`/reels/${id}`, {
      method: "DELETE",
    });
  },
  like: async (id: string) => {
    return await apiRequest<{ success: boolean; likes: number }>(`/reels/${id}/like`, {
      method: "POST",
    });
  },
};

// 5. App Users API
export const usersApi = {
  getAll: async () => {
    const data = await apiRequest<{ success: boolean; users: any[] }>("/users");
    return data?.users || null;
  },
  login: async (email: string, name?: string) => {
    return await apiRequest<{ success: boolean; user: any; token: string }>("/users/login", {
      method: "POST",
      body: JSON.stringify({ email, name }),
    });
  },
  addBonus: async (id: string, amount: number) => {
    return await apiRequest<{ success: boolean; walletBalance: number }>(`/users/${id}/bonus`, {
      method: "POST",
      body: JSON.stringify({ amount }),
    });
  },
  toggleBan: async (id: string) => {
    return await apiRequest<{ success: boolean; isBanned: boolean }>(`/users/${id}/ban`, {
      method: "PUT",
    });
  },
};

// 6. Master Admin API
export const adminApi = {
  getAnalytics: async () => {
    const data = await apiRequest<{ success: boolean; metrics: any }>("/admin/analytics");
    return data?.metrics || null;
  },
  getAIBots: async () => {
    const data = await apiRequest<{ success: boolean; aiPersonas: any[] }>("/admin/ai-bots");
    return data?.aiPersonas || null;
  },
  addAIBot: async (botData: any) => {
    return await apiRequest<{ success: boolean; bot: any }>("/admin/ai-bots", {
      method: "POST",
      body: JSON.stringify(botData),
    });
  },
  deleteAIBot: async (id: string) => {
    return await apiRequest<{ success: boolean; message: string }>(`/admin/ai-bots/${id}`, {
      method: "DELETE",
    });
  },
  broadcast: async (title: string, body: string) => {
    return await apiRequest<{ success: boolean; message: string }>("/admin/broadcast", {
      method: "POST",
      body: JSON.stringify({ title, body }),
    });
  },
};

// Convenient alias for AI Bot management
export const aiBotsApi = {
  getAll: adminApi.getAIBots,
  create: adminApi.addAIBot,
  delete: adminApi.deleteAIBot,
};
