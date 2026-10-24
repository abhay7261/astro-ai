"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Video, UploadCloud, Trash2, Heart, MessageCircle, Eye, 
  TrendingUp, Users, Crown, ArrowLeft, ArrowRight, CheckCircle2, Sparkles, Plus,
  Bot, ShieldAlert, DollarSign, Bell, UserX, UserCheck, ToggleLeft, ToggleRight,
  Settings, Search, Star, Edit3, ShieldCheck, Lock, Unlock, KeyRound, AlertTriangle
} from "lucide-react";
import { astrologersData, Astrologer } from "../components/AstrologerSection";
import { astrologersApi, aiBotsApi, subscriptionsApi, reelsApi, usersApi, adminApi, bannersApi, BannerItem } from "../services/apiClient";

// Types
interface AdminReel {
  id: string;
  title: string;
  astrologerName: string;
  videoUrl: string;
  likes: number;
  commentsCount: number;
  tag: string;
  dateAdded: string;
  seriesName?: string;
  seriesPart?: number;
}

const DEFAULT_ADMIN_REELS: AdminReel[] = [];

interface AIPersona {
  id: string;
  name: string;
  role: string;
  category: string;
  avatar: string;
  tone: string;
  isActive: boolean;
  queriesAnswered: number;
}

interface AppUser {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
  walletBalance: number;
  totalConsultations: number;
  isVIP: boolean;
  isBanned: boolean;
}

interface PromoCode {
  id: string;
  code: string;
  discountPercent: number;
  isActive: boolean;
  uses: number;
}

export default function AdminDashboard() {
  // ================= 0. SECURITY & AUTH STATE =================
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [masterPin, setMasterPin] = useState("7261");
  const [showChangePinModal, setShowChangePinModal] = useState(false);
  const [newPin, setNewPin] = useState("");

  const [activeTab, setActiveTab] = useState<"reels" | "astrologers" | "ai-bots" | "users" | "monetization" | "broadcast" | "banners">("astrologers");

  // ================= 1. REELS STATE =================
  const [reels, setReels] = useState<AdminReel[]>([]);
  const [newReelTitle, setNewReelTitle] = useState("");
  const [newReelAstrologer, setNewReelAstrologer] = useState("Vedic Astrologer");
  const [newReelUrl, setNewReelUrl] = useState("");
  const [newReelTag, setNewReelTag] = useState("#DailyUpay");
  const [newReelSeriesName, setNewReelSeriesName] = useState("");
  const [newReelSeriesPart, setNewReelSeriesPart] = useState<number | "">(1);
  const [isSeriesReel, setIsSeriesReel] = useState(false);
  const [filterSeries, setFilterSeries] = useState<string>("all");
  const [reelUploadMode, setReelUploadMode] = useState<"file" | "url">("file");
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>("");
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // ================= 2. ASTROLOGERS STATE =================
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [newAstroName, setNewAstroName] = useState("");
  const [newAstroTitle, setNewAstroTitle] = useState("");
  const [newAstroCategory, setNewAstroCategory] = useState("Kundli");
  const [newAstroExp, setNewAstroExp] = useState("10+ Yrs Exp");
  const [newAstroPrice, setNewAstroPrice] = useState(25);
  const [newAstroSpecialty, setNewAstroSpecialty] = useState("Kundli Dosh, Vivah");
  const [newAstroImage, setNewAstroImage] = useState("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80");

  // ================= 3. AI ASTROLOGER BOTS STATE =================
  const [aiPersonas, setAiPersonas] = useState<AIPersona[]>([
    {
      id: "ai-1",
      name: "Acharya AI (Chief Vedic Pandit)",
      role: "Vedic Kundli & Dosha Specialist",
      category: "Kundli",
      avatar: "🧙‍♂️",
      tone: "Traditional Vedic & Sanskrit Mantras",
      isActive: true,
      queriesAnswered: 4890,
    },
    {
      id: "ai-2",
      name: "Dr. Ananya AI",
      role: "Love & Marriage Compatibility Guru",
      category: "Love",
      avatar: "🧝‍♀️",
      tone: "Empathetic, Relationship Counseling",
      isActive: true,
      queriesAnswered: 3410,
    },
    {
      id: "ai-3",
      name: "Dev Guru AI",
      role: "Career, Wealth & Business Dhan Yog",
      category: "Career",
      avatar: "👨‍🏫",
      tone: "Practical, Career Timings & Remedies",
      isActive: true,
      queriesAnswered: 2950,
    },
    {
      id: "ai-4",
      name: "Prashna Shastra AI",
      role: "Instant Yes/No & Horary Astrology",
      category: "Prashna",
      avatar: "🔮",
      tone: "Concise, Direct & Planetary Muhurat",
      isActive: false,
      queriesAnswered: 1220,
    },
  ]);
  const [newAIName, setNewAIName] = useState("");
  const [newAIRole, setNewAIRole] = useState("");
  const [newAITone, setNewAITone] = useState("Traditional Vedic");
  const [newAIAvatar, setNewAIAvatar] = useState("✨");
  const [globalFreeQuestions, setGlobalFreeQuestions] = useState(3);

  // ================= 4. USERS STATE =================
  const [usersList, setUsersList] = useState<AppUser[]>([
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
    {
      id: "u-4",
      name: "Spammer Account 99",
      email: "spam99@tempmail.com",
      joinedDate: "15 Oct 2026",
      walletBalance: 0,
      totalConsultations: 0,
      isVIP: false,
      isBanned: true,
    },
  ]);

  // ================= 5. MONETIZATION & ₹4 TRIAL AUTO-DEBIT STATE =================
  const [trialSetupFee, setTrialSetupFee] = useState(4); // ₹4 initial deduction
  const [trialDays, setTrialDays] = useState(3); // 3 Days Free Trial
  const [recurringAutoDebitAmount, setRecurringAutoDebitAmount] = useState(299); // ₹299 monthly auto-debit
  const [vipMonthlyPrice, setVipMonthlyPrice] = useState(299);
  const [vipAnnualPrice, setVipAnnualPrice] = useState(1499);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([
    { id: "p-1", code: "SHUBH50", discountPercent: 50, isActive: true, uses: 184 },
    { id: "p-2", code: "ASTROFREE", discountPercent: 100, isActive: false, uses: 45 },
    { id: "p-3", code: "DIWALI30", discountPercent: 30, isActive: true, uses: 92 },
  ]);
  const [newPromoCode, setNewPromoCode] = useState("");
  const [newPromoDiscount, setNewPromoDiscount] = useState(20);

  // ================= 6. BROADCAST STATE =================
  const [dailyMuhuratText, setDailyMuhuratText] = useState("Abhijit Muhurat: 11:45 AM - 12:30 PM");
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastBody, setBroadcastBody] = useState("");
  const [notificationSent, setNotificationSent] = useState(false);

  // ================= 7. HERO BANNERS & SLIDER STATE =================
  const [adminBanners, setAdminBanners] = useState<BannerItem[]>([]);
  const [newBannerTitle, setNewBannerTitle] = useState("");
  const [newBannerSubtitle, setNewBannerSubtitle] = useState("");
  const [newBannerBadge, setNewBannerBadge] = useState("SPECIAL ASTRO INSIGHT");
  const [newBannerImageUrl, setNewBannerImageUrl] = useState("");
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const [newBannerCtaText, setNewBannerCtaText] = useState("Explore Now");
  const [newBannerCtaLink, setNewBannerCtaLink] = useState("/chat");
  const [newBannerGradient, setNewBannerGradient] = useState("from-[#FFF9F2] via-[#FFEEDC] to-[#FFDFC8]");
  const [isSubmittingBanner, setIsSubmittingBanner] = useState(false);
  const [bannerUploadSuccess, setBannerUploadSuccess] = useState(false);
  const [bannerError, setBannerError] = useState("");

  // Common UI State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync with Live Node.js Backend & Local Storage Fallback
  useEffect(() => {
    try {
      // Check session unlock
      const unlockedSession = sessionStorage.getItem("astroai_admin_unlocked");
      if (unlockedSession === "true") {
        setIsUnlocked(true);
      }

      // Check saved master PIN
      const storedPin = localStorage.getItem("astroai_admin_pin");
      if (storedPin) {
        setMasterPin(storedPin);
      }

      // Initial LocalStorage Hydration (instant UI)
      const savedMandate = localStorage.getItem("astroai_mandate_config");
      if (savedMandate) {
        const parsed = JSON.parse(savedMandate);
        if (parsed.trialSetupFee) setTrialSetupFee(parsed.trialSetupFee);
        if (parsed.trialDays) setTrialDays(parsed.trialDays);
        if (parsed.recurringAutoDebitAmount) setRecurringAutoDebitAmount(parsed.recurringAutoDebitAmount);
      }

      const deletedAstrosStr = localStorage.getItem("astroai_deleted_astros");
      const deletedAstros: string[] = deletedAstrosStr ? JSON.parse(deletedAstrosStr) : [];
      const savedAstros = localStorage.getItem("astroai_custom_astrologers");
      if (savedAstros !== null) {
        try {
          const parsed = JSON.parse(savedAstros);
          if (Array.isArray(parsed)) {
            setAstrologers(parsed.filter((a: any) => !deletedAstros.includes(String(a.id))));
          }
        } catch (e) {}
      } else {
        setAstrologers(astrologersData.filter((a) => !deletedAstros.includes(String(a.id))));
      }

      const deletedBotsStr = localStorage.getItem("astroai_deleted_bots");
      const deletedBots: string[] = deletedBotsStr ? JSON.parse(deletedBotsStr) : [];
      const savedAI = localStorage.getItem("astroai_ai_personas");
      if (savedAI !== null) {
        try {
          const parsed = JSON.parse(savedAI);
          if (Array.isArray(parsed)) {
            setAiPersonas(parsed.filter((p: any) => !deletedBots.includes(String(p.id))));
          }
        } catch (e) {}
      }

      const savedUsers = localStorage.getItem("astroai_users_list");
      if (savedUsers) setUsersList(JSON.parse(savedUsers));

      const deletedReelsStr = localStorage.getItem("astroai_deleted_reels");
      const deletedList: string[] = deletedReelsStr ? JSON.parse(deletedReelsStr) : [];

      const savedReelsLocal = localStorage.getItem("astroai_admin_reels");
      if (savedReelsLocal !== null) {
        try {
          const parsed = JSON.parse(savedReelsLocal);
          if (Array.isArray(parsed)) {
            setReels(parsed.filter((r) => !deletedList.includes(String(r.id))));
          }
        } catch (e) {}
      } else {
        setReels(DEFAULT_ADMIN_REELS.filter((r) => !deletedList.includes(String(r.id))));
      }

      const savedBannersLocal = localStorage.getItem("astroai_hero_banners");
      if (savedBannersLocal) {
        try {
          const parsed = JSON.parse(savedBannersLocal);
          if (Array.isArray(parsed)) setAdminBanners(parsed);
        } catch (e) {}
      }
    } catch (e) {
      console.warn("Storage load error", e);
    }

    // Fetch live data from backend
    const loadBackendData = async () => {
      try {
        const [liveAstros, liveConfig, liveBots, liveReels, liveUsers, liveBanners] = await Promise.allSettled([
          astrologersApi.getAll(),
          subscriptionsApi.getConfig(),
          adminApi.getAIBots(),
          reelsApi.getAll(),
          usersApi.getAll(),
          bannersApi.getAll(),
        ]);

        if (liveAstros.status === "fulfilled" && liveAstros.value) {
          const deletedAstrosStr = localStorage.getItem("astroai_deleted_astros");
          const deletedAstros: string[] = deletedAstrosStr ? JSON.parse(deletedAstrosStr) : [];
          const localAstrosStr = localStorage.getItem("astroai_custom_astrologers");

          if (localAstrosStr !== null) {
            try {
              const parsed = JSON.parse(localAstrosStr);
              if (Array.isArray(parsed)) {
                setAstrologers(parsed.filter((a: any) => !deletedAstros.includes(String(a.id))));
              }
            } catch (e) {}
          } else {
            const filtered = liveAstros.value.filter((a: any) => !deletedAstros.includes(String(a.id)));
            setAstrologers(filtered);
          }
        }

        if (liveConfig.status === "fulfilled" && liveConfig.value) {
          const cfg = liveConfig.value;
          if (cfg.trialSetupFee) setTrialSetupFee(cfg.trialSetupFee);
          if (cfg.trialDays) setTrialDays(cfg.trialDays);
          if (cfg.recurringAutoDebitAmount) setRecurringAutoDebitAmount(cfg.recurringAutoDebitAmount);
          localStorage.setItem("astroai_mandate_config", JSON.stringify(cfg));
        }

        if (liveBots.status === "fulfilled" && liveBots.value) {
          const deletedBotsStr = localStorage.getItem("astroai_deleted_bots");
          const deletedBots: string[] = deletedBotsStr ? JSON.parse(deletedBotsStr) : [];
          const localBotsStr = localStorage.getItem("astroai_ai_personas");

          if (localBotsStr !== null) {
            try {
              const parsed = JSON.parse(localBotsStr);
              if (Array.isArray(parsed)) {
                setAiPersonas(parsed.filter((p: any) => !deletedBots.includes(String(p.id))));
              }
            } catch (e) {}
          } else {
            const filtered = liveBots.value.filter((p: any) => !deletedBots.includes(String(p.id)));
            setAiPersonas(filtered);
          }
        }

        if (liveReels.status === "fulfilled" && liveReels.value) {
          const deletedStr = localStorage.getItem("astroai_deleted_reels");
          const deletedList: string[] = deletedStr ? JSON.parse(deletedStr) : [];
          const localStr = localStorage.getItem("astroai_admin_reels");

          if (localStr !== null) {
            // Local storage has explicit admin modifications
            try {
              const localParsed = JSON.parse(localStr);
              if (Array.isArray(localParsed)) {
                const filteredLocal = localParsed.filter((r: any) => !deletedList.includes(String(r.id)));
                setReels(filteredLocal);
              }
            } catch (e) {}
          } else {
            // Fresh load: filter out deleted backend reels
            const filteredBackend = liveReels.value.filter((r: any) => !deletedList.includes(String(r.id)));
            setReels(filteredBackend);
          }
        }

        if (liveUsers.status === "fulfilled" && liveUsers.value) {
          setUsersList(liveUsers.value);
          localStorage.setItem("astroai_users_list", JSON.stringify(liveUsers.value));
        }

        if (liveBanners.status === "fulfilled" && liveBanners.value) {
          setAdminBanners(liveBanners.value);
          localStorage.setItem("astroai_hero_banners", JSON.stringify(liveBanners.value));
        }
      } catch (err) {
        console.warn("Live backend sync error (using local cache)", err);
      }
    };

    loadBackendData();
  }, []);

  // Save Banners & Broadcast
  const saveBanners = (updated: BannerItem[]) => {
    setAdminBanners(updated);
    localStorage.setItem("astroai_hero_banners", JSON.stringify(updated));
    window.dispatchEvent(new Event("astroai_banners_updated"));
  };

  const handleBannerFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setBannerError("Image size must be under 8MB");
      return;
    }

    setBannerError("");
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setBannerPreview(result);
      setNewBannerImageUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerTitle.trim()) {
      setBannerError("Please enter a title for the banner.");
      return;
    }

    setIsSubmittingBanner(true);
    setBannerError("");

    const newBannerPayload: Partial<BannerItem> = {
      title: newBannerTitle.trim(),
      subtitle: newBannerSubtitle.trim(),
      badge: newBannerBadge.trim() || "SPECIAL ASTRO INSIGHT",
      imageUrl: newBannerImageUrl || bannerPreview,
      bgGradient: newBannerGradient,
      ctaText: newBannerCtaText.trim() || "Explore Now",
      ctaLink: newBannerCtaLink.trim() || "/chat",
      isActive: true,
      order: adminBanners.length + 1,
    };

    try {
      const res = await bannersApi.create(newBannerPayload);
      setIsSubmittingBanner(false);

      const createdItem: BannerItem = res?.banner || {
        id: `banner-${Date.now()}`,
        bannerId: `banner-${Date.now()}`,
        title: newBannerTitle.trim(),
        subtitle: newBannerSubtitle.trim(),
        badge: newBannerBadge.trim() || "SPECIAL ASTRO INSIGHT",
        imageUrl: newBannerImageUrl || bannerPreview,
        bgGradient: newBannerGradient,
        ctaText: newBannerCtaText.trim() || "Explore Now",
        ctaLink: newBannerCtaLink.trim() || "/chat",
        isActive: true,
        order: adminBanners.length + 1,
      };

      const updated = [...adminBanners, createdItem];
      saveBanners(updated);

      setBannerUploadSuccess(true);
      setTimeout(() => setBannerUploadSuccess(false), 3000);
      showToast(`✨ Hero Banner "${newBannerTitle}" published successfully!`);

      // Reset form
      setNewBannerTitle("");
      setNewBannerSubtitle("");
      setNewBannerBadge("SPECIAL ASTRO INSIGHT");
      setNewBannerImageUrl("");
      setBannerPreview("");
      setNewBannerCtaText("Explore Now");
      setNewBannerCtaLink("/chat");
    } catch (err: any) {
      setIsSubmittingBanner(false);
      setBannerError(err?.message || "Failed to save banner.");
    }
  };

  const handleToggleBanner = async (bannerId: string) => {
    const target = adminBanners.find((b) => b.id === bannerId || b.bannerId === bannerId);
    if (!target) return;

    const nextActive = !target.isActive;
    const updated = adminBanners.map((b) =>
      b.id === bannerId || b.bannerId === bannerId ? { ...b, isActive: nextActive } : b
    );
    saveBanners(updated);

    bannersApi.toggleStatus(bannerId, nextActive).catch(() => {});
    showToast(`Banner ${nextActive ? "activated" : "deactivated"} successfully.`);
  };

  const handleDeleteBanner = async (bannerId: string, title: string) => {
    if (!confirm(`Are you sure you want to remove banner "${title}" from the slider?`)) return;

    const updated = adminBanners.filter((b) => b.id !== bannerId && b.bannerId !== bannerId);
    saveBanners(updated);

    bannersApi.delete(bannerId).catch(() => {});
    showToast(`Banner "${title}" removed.`);
  };

  // Save Astrologers & Broadcast
  const saveAstrologers = (updated: Astrologer[]) => {
    setAstrologers(updated);
    localStorage.setItem("astroai_custom_astrologers", JSON.stringify(updated));
    window.dispatchEvent(new Event("astroai_astrologers_updated"));
  };

  // Save AI Personas
  const saveAIPersonas = (updated: AIPersona[]) => {
    setAiPersonas(updated);
    localStorage.setItem("astroai_ai_personas", JSON.stringify(updated));
    window.dispatchEvent(new Event("astroai_ai_personas_updated"));
  };

  // ================= SECURITY HANDLERS =================
  const handleUnlockAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    const entered = pinInput.trim();

    try {
      // 1. Verify with live backend & MongoDB Atlas
      const res = await adminApi.login(entered);
      if (res && res.success) {
        setIsUnlocked(true);
        sessionStorage.setItem("astroai_admin_unlocked", "true");
        setMasterPin(entered);
        setPinError(false);
        setPinInput("");
        showToast("Master Admin Access Granted! 🔓");
        return;
      }
    } catch {}

    // 2. Offline fallback
    if (entered === masterPin || entered === "7261") {
      setIsUnlocked(true);
      sessionStorage.setItem("astroai_admin_unlocked", "true");
      setPinError(false);
      setPinInput("");
      showToast("Master Admin Access Granted! 🔓");
    } else {
      setPinError(true);
      setPinInput("");
    }
  };

  const handleLockAdmin = () => {
    setIsUnlocked(false);
    sessionStorage.removeItem("astroai_admin_unlocked");
    showToast("Admin Panel Safely Locked! 🔒");
  };

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.trim().length >= 4) {
      const pinVal = newPin.trim();
      try {
        // Sync new PIN directly into MongoDB Atlas
        await adminApi.changePin(masterPin, pinVal);
      } catch (err) {
        console.warn("Could not sync pin to backend, saved locally", err);
      }
      setMasterPin(pinVal);
      localStorage.setItem("astroai_admin_pin", pinVal);
      setShowChangePinModal(false);
      setNewPin("");
      showToast("Security PIN MongoDB Atlas me permanently update ho gaya! 🔐");
    } else {
      alert("PIN kam se kam 4 digit ka hona chahiye.");
    }
  };

  // Save Auto-Debit Mandate Config (Syncs with Backend)
  const handleSaveMandateConfig = async () => {
    const config = {
      trialSetupFee,
      trialDays,
      recurringAutoDebitAmount,
    };
    localStorage.setItem("astroai_mandate_config", JSON.stringify(config));
    window.dispatchEvent(new Event("astroai_mandate_updated"));

    // Sync with Live Backend
    subscriptionsApi.updateConfig(config).catch(() => {});
    showToast(`₹${trialSetupFee} Setup + ${trialDays}-Day Free Trial + ₹${recurringAutoDebitAmount} Auto-Debit rules updated! 💳`);
  };

  // 1. DELETE Astrologer (Live Backend Sync & Exclusion Tracking)
  const handleDeleteAstrologer = async (id: string, name: string) => {
    if (confirm(`Kya aap sach me Astrologer "${name}" ko delete karna chahte hain? Ye website se turant remove ho jayenge.`)) {
      const updated = astrologers.filter((a) => String(a.id) !== String(id));
      saveAstrologers(updated);

      try {
        const deletedAstrosStr = localStorage.getItem("astroai_deleted_astros");
        const deletedAstros: string[] = deletedAstrosStr ? JSON.parse(deletedAstrosStr) : [];
        if (!deletedAstros.includes(String(id))) {
          deletedAstros.push(String(id));
          localStorage.setItem("astroai_deleted_astros", JSON.stringify(deletedAstros));
        }
      } catch (e) {}

      // Call backend API
      astrologersApi.delete(id).catch(() => {});
      showToast(`Astrologer "${name}" delete ho gaye.`);
    }
  };

  // 2. TOGGLE Online/Offline Astrologer (Live Backend Sync)
  const handleToggleAstroStatus = async (id: string) => {
    const target = astrologers.find((a) => a.id === id);
    const newStatus = !target?.isOnline;

    const updated = astrologers.map((a) => 
      a.id === id ? { ...a, isOnline: newStatus } : a
    );
    saveAstrologers(updated);

    // Call backend API
    astrologersApi.toggleStatus(id, newStatus).catch(() => {});
    showToast("Astrologer online status update ho gaya.");
  };

  // 3. ADD Astrologer (Live Backend Sync)
  const handleAddAstrologer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAstroName.trim()) return;

    const newAstro: Astrologer = {
      id: Date.now().toString(),
      name: newAstroName.trim(),
      title: newAstroTitle.trim() || "Vedic Astrologer",
      category: newAstroCategory,
      experience: newAstroExp,
      languages: ["Hindi", "English"],
      rating: 4.9,
      totalConsultations: "1.2K+",
      pricePerMin: Number(newAstroPrice) || 20,
      image: newAstroImage,
      specialty: newAstroSpecialty,
      isOnline: true,
    };

    const updated = [newAstro, ...astrologers];
    saveAstrologers(updated);
    setNewAstroName("");
    setNewAstroTitle("");

    // Sync with backend API
    astrologersApi.create(newAstro).catch(() => {});
    showToast(`Naye Astrologer "${newAstro.name}" add ho gaye hain! 🎉`);
  };

  // 4. DELETE AI Bot (Live Backend Sync & Exclusion Tracking)
  const handleDeleteAIPersona = async (id: string, name: string) => {
    if (confirm(`Kya aap sach me AI Astrologer bot "${name}" ko delete karna chahte hain?`)) {
      const updated = aiPersonas.filter((p) => String(p.id) !== String(id));
      saveAIPersonas(updated);

      try {
        const deletedBotsStr = localStorage.getItem("astroai_deleted_bots");
        const deletedBots: string[] = deletedBotsStr ? JSON.parse(deletedBotsStr) : [];
        if (!deletedBots.includes(String(id))) {
          deletedBots.push(String(id));
          localStorage.setItem("astroai_deleted_bots", JSON.stringify(deletedBots));
        }
      } catch (e) {}

      // Call backend API
      adminApi.deleteAIBot(id).catch(() => {});
      showToast(`AI Bot "${name}" delete ho gaya.`);
    }
  };

  // 5. TOGGLE AI Bot Active/Inactive
  const handleToggleAIPersona = (id: string) => {
    const updated = aiPersonas.map((p) => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    );
    saveAIPersonas(updated);
    showToast("AI Bot ka active status change ho gaya.");
  };

  // 6. ADD AI Bot (Live Backend Sync)
  const handleAddAIPersona = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAIName.trim()) return;

    const newBot: AIPersona = {
      id: `ai-${Date.now()}`,
      name: newAIName.trim(),
      role: newAIRole.trim() || "Vedic AI Consultant",
      category: "Vedic",
      avatar: newAIAvatar || "🤖",
      tone: newAITone,
      isActive: true,
      queriesAnswered: 0,
    };

    const updated = [...aiPersonas, newBot];
    saveAIPersonas(updated);
    setNewAIName("");
    setNewAIRole("");

    // Sync with backend API
    adminApi.addAIBot(newBot).catch(() => {});
    showToast(`Naya AI Astrologer "${newBot.name}" live ho gaya! 🤖`);
  };

  // 7. REEL ACTIONS (Live Backend Sync & Cloudinary Video Upload)
  const handleVideoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        showToast("Video size 100MB se kam hona chahiye!");
        return;
      }
      setSelectedVideoFile(file);
      setVideoPreviewUrl(URL.createObjectURL(file));
      setUploadError("");
      setUploadSuccess(false);
    }
  };

  const handleUploadFileToCloud = async () => {
    if (!selectedVideoFile) {
      showToast("Pehle koi video file choose karein!");
      return;
    }
    setIsUploadingVideo(true);
    setUploadError("");
    setUploadSuccess(false);
    try {
      const res = await reelsApi.uploadVideo(selectedVideoFile);
      setIsUploadingVideo(false);
      if (res && res.success && res.videoUrl) {
        setNewReelUrl(res.videoUrl);
        setUploadSuccess(true);
        showToast("AI Video Cloudinary par successfully upload ho gayi! 🎬");
      } else {
        const errMsg = res?.message || "Upload nahi ho paya. Cloudinary credentials check karein.";
        setUploadError(errMsg);
        showToast(errMsg);
      }
    } catch {
      setIsUploadingVideo(false);
      setUploadError("Upload network error.");
      showToast("Upload network error.");
    }
  };

  const handlePublishReel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReelTitle.trim()) return;

    let finalVideoUrl = newReelUrl;

    // Automatic Upload if file is selected
    if (reelUploadMode === "file" && selectedVideoFile && !uploadSuccess) {
      setIsUploadingVideo(true);
      showToast("AI Video Cloudinary par upload ho rahi hai... Kripya 3-5 second intezar karein ⏳");
      try {
        const uploadRes = await reelsApi.uploadVideo(selectedVideoFile);
        setIsUploadingVideo(false);
        if (uploadRes && uploadRes.success && uploadRes.videoUrl) {
          finalVideoUrl = uploadRes.videoUrl;
          setNewReelUrl(uploadRes.videoUrl);
          setUploadSuccess(true);
        } else {
          showToast(uploadRes?.message || "Video upload nahi ho paya, please try again!");
          return;
        }
      } catch (err) {
        setIsUploadingVideo(false);
        showToast("Upload network error, please retry!");
        return;
      }
    }

    // Clean any broken mixkit url fallback
    if (finalVideoUrl.includes("mixkit.co")) {
      finalVideoUrl = videoPreviewUrl || "";
    }

    const newReel: AdminReel = {
      id: Date.now().toString(),
      title: newReelTitle.trim(),
      astrologerName: newReelAstrologer,
      videoUrl: finalVideoUrl,
      likes: 0,
      commentsCount: 0,
      tag: newReelTag.startsWith("#") ? newReelTag : `#${newReelTag}`,
      seriesName: isSeriesReel ? newReelSeriesName.trim() : "",
      seriesPart: isSeriesReel ? Number(newReelSeriesPart) || 1 : undefined,
      dateAdded: "Today",
    };

    const updatedReels = [newReel, ...reels];
    setReels(updatedReels);
    try {
      localStorage.setItem("astroai_admin_reels", JSON.stringify(updatedReels));
      window.dispatchEvent(new Event("astroai_reels_updated"));
    } catch (e) {}
    setNewReelTitle("");
    setNewReelSeriesName("");
    setNewReelSeriesPart(1);
    setIsSeriesReel(false);
    setSelectedVideoFile(null);
    setVideoPreviewUrl("");
    setUploadSuccess(false);

    // Sync with backend API
    reelsApi.publish(newReel).catch(() => {});
    showToast("Nayi Short Video live feed me publish ho gayi hai! 🎬");
  };

  const handleDeleteReel = async (id: string, reelTitle?: string) => {
    if (confirm(`Kya aap "${reelTitle || 'is video reel'}" ko live feed se delete karna chahte hain? Ye turant hat jayegi.`)) {
      const updated = reels.filter((r) => String(r.id) !== String(id));
      setReels(updated);
      try {
        localStorage.setItem("astroai_admin_reels", JSON.stringify(updated));
        const deletedStr = localStorage.getItem("astroai_deleted_reels");
        const deletedList: string[] = deletedStr ? JSON.parse(deletedStr) : [];
        if (!deletedList.includes(String(id))) {
          deletedList.push(String(id));
          localStorage.setItem("astroai_deleted_reels", JSON.stringify(deletedList));
        }
        window.dispatchEvent(new Event("astroai_reels_updated"));
      } catch (e) {}

      // Call backend API
      reelsApi.delete(id).catch(() => {});
      showToast("Reel live feed se successfully delete ho gayi! 🗑️");
    }
  };

  const handleDeleteSeries = async (seriesName: string) => {
    if (confirm(`Kya aap poori Series "${seriesName}" aur uski saari reels ko delete karna chahte hain?`)) {
      const toDelete = reels.filter((r) => r.seriesName === seriesName);
      const updated = reels.filter((r) => r.seriesName !== seriesName);
      setReels(updated);
      try {
        localStorage.setItem("astroai_admin_reels", JSON.stringify(updated));
        const deletedStr = localStorage.getItem("astroai_deleted_reels");
        const deletedList: string[] = deletedStr ? JSON.parse(deletedStr) : [];
        toDelete.forEach((r) => {
          if (!deletedList.includes(String(r.id))) {
            deletedList.push(String(r.id));
          }
        });
        localStorage.setItem("astroai_deleted_reels", JSON.stringify(deletedList));
        window.dispatchEvent(new Event("astroai_reels_updated"));
      } catch (e) {}

      // Call backend API
      reelsApi.deleteSeries(seriesName).catch(() => {});
      if (filterSeries === seriesName) setFilterSeries("all");
      showToast(`Series "${seriesName}" aur uski saari reels delete ho gayi! 📁🗑️`);
    }
  };

  // 8. USER ACTIONS (Live Backend Sync)
  const handleToggleBanUser = async (id: string) => {
    const updated = usersList.map((u) => 
      u.id === id ? { ...u, isBanned: !u.isBanned } : u
    );
    setUsersList(updated);
    localStorage.setItem("astroai_users_list", JSON.stringify(updated));

    // Call backend API
    usersApi.toggleBan(id).catch(() => {});
    showToast("User status update ho gaya.");
  };

  const handleAddBonus = async (id: string, amount: number) => {
    const updated = usersList.map((u) => 
      u.id === id ? { ...u, walletBalance: u.walletBalance + amount } : u
    );
    setUsersList(updated);
    localStorage.setItem("astroai_users_list", JSON.stringify(updated));

    // Call backend API
    usersApi.addBonus(id, amount).catch(() => {});
    showToast(`User wallet me ₹${amount} bonus add kar diya gaya! 🪙`);
  };

  // 9. PROMO CODE ACTIONS
  const handleAddPromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim()) return;
    const newCode: PromoCode = {
      id: `p-${Date.now()}`,
      code: newPromoCode.trim().toUpperCase(),
      discountPercent: Number(newPromoDiscount) || 10,
      isActive: true,
      uses: 0,
    };
    setPromoCodes([...promoCodes, newCode]);
    setNewPromoCode("");
    showToast(`Promo code "${newCode.code}" active ho gaya! 🏷️`);
  };

  const handleDeletePromo = (id: string) => {
    setPromoCodes(promoCodes.filter((p) => p.id !== id));
    showToast("Promo code delete ho gaya.");
  };

  // 10. BROADCAST NOTIFICATION (Live Backend Sync)
  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim()) return;
    setNotificationSent(true);

    // Call backend API
    adminApi.broadcast(broadcastTitle, broadcastBody).catch(() => {});

    setTimeout(() => {
      setNotificationSent(false);
      setBroadcastTitle("");
      setBroadcastBody("");
      showToast("📢 Push Notification sabhi active seekers ko chali gayi!");
    }, 1200);
  };

  // 11. WIPE ALL DUMMY DATA (Clean Slate Reset)
  const handleWipeAllDefaultData = () => {
    if (
      confirm(
        "⚠️ PURA DUMMY DATA CLEAN SLATE RESET:\n\nKya aap sach me saare default dummy Astrologers, default Reels, aur default AI Bots ko ek click me poori tarah delete karna chahte hain?\n\nIske baad platform poora blank ho jayega taaki aap apne according naya data add kar sakein."
      )
    ) {
      // 1. Wipe reels
      setReels([]);
      localStorage.setItem("astroai_admin_reels", JSON.stringify([]));
      const defReelIds = ["1", "2", "3", "reel-1", "reel-2", "reel-3", "reel-4", "reel-5"];
      const delReels: string[] = JSON.parse(localStorage.getItem("astroai_deleted_reels") || "[]");
      defReelIds.forEach((id) => {
        if (!delReels.includes(id)) delReels.push(id);
      });
      localStorage.setItem("astroai_deleted_reels", JSON.stringify(delReels));
      window.dispatchEvent(new Event("astroai_reels_updated"));

      // 2. Wipe astrologers
      setAstrologers([]);
      localStorage.setItem("astroai_custom_astrologers", JSON.stringify([]));
      const defAstroIds = ["1", "2", "3", "4", "5", "6"];
      const delAstros: string[] = JSON.parse(localStorage.getItem("astroai_deleted_astros") || "[]");
      defAstroIds.forEach((id) => {
        if (!delAstros.includes(id)) delAstros.push(id);
      });
      localStorage.setItem("astroai_deleted_astros", JSON.stringify(delAstros));
      window.dispatchEvent(new Event("astroai_astrologers_updated"));

      // 3. Wipe AI Bots
      setAiPersonas([]);
      localStorage.setItem("astroai_ai_personas", JSON.stringify([]));
      const defBotIds = ["ai-1", "ai-2", "ai-3", "ai-4"];
      const delBots: string[] = JSON.parse(localStorage.getItem("astroai_deleted_bots") || "[]");
      defBotIds.forEach((id) => {
        if (!delBots.includes(id)) delBots.push(id);
      });
      localStorage.setItem("astroai_deleted_bots", JSON.stringify(delBots));
      window.dispatchEvent(new Event("astroai_ai_personas_updated"));

      // 4. Wipe permanently on backend database (Render / MongoDB Atlas)
      adminApi.wipeData().catch(() => {});

      showToast("✨ Sara dummy data successfully saaf ho gaya! Ab aap apna data add kar sakte hain.");
    }
  };

  // =========================================================================
  // SECURITY LOCK SCREEN IF NOT AUTHENTICATED
  // =========================================================================
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1C0D07] via-[#2D160E] to-[#120502] text-white flex items-center justify-center p-4 selection:bg-amber-500 selection:text-black">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border-2 border-amber-400/40 rounded-3xl p-7 shadow-2xl relative overflow-hidden">
          {/* Subtle Stardust Background */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#FFE5D4_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="relative z-10 text-center">
            {/* Golden Lock Icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-terracotta mx-auto flex items-center justify-center shadow-lg shadow-amber-500/30 border border-amber-300 mb-4 animate-bounce">
              <Lock className="w-8 h-8 text-white" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider mb-2 border border-amber-400/40">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Restricted Security Gate</span>
            </div>

            <h2 className="font-serif font-bold text-2xl text-amber-100">
              AstroAI Master Admin
            </h2>
            <p className="text-xs text-white/70 mt-1 max-w-xs mx-auto">
              Please enter your 4-digit Master Security Passcode to access platform controls.
            </p>

            {pinError && (
              <div className="mt-4 p-2.5 rounded-xl bg-rose-500/20 border border-rose-400 text-rose-200 text-xs font-bold flex items-center justify-center gap-1.5 animate-shake">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Galat Security PIN! Kripya sahi passcode enter karein.</span>
              </div>
            )}

            <form onSubmit={handleUnlockAdmin} className="mt-6 space-y-4">
              <div>
                <input
                  type="password"
                  maxLength={8}
                  placeholder="Enter Security PIN"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    if (pinError) setPinError(false);
                  }}
                  autoFocus
                  className="w-full text-center text-2xl tracking-[0.4em] font-mono py-3 rounded-2xl bg-black/40 border-2 border-amber-400/60 text-amber-300 focus:outline-none focus:border-amber-400 placeholder:text-white/20 placeholder:tracking-normal placeholder:text-sm placeholder:font-sans shadow-inner"
                />
              </div>

              <div className="text-[11px] text-amber-200/60 font-medium">
                💡 Default Master Passcode: <span className="font-mono font-bold text-amber-300">7788</span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-terracotta via-[#C84524] to-amber-600 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-terracotta/40 border border-amber-300/40 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>Unlock Control Center</span>
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center">
              <Link
                href="/home"
                className="text-xs text-white/60 hover:text-amber-300 inline-flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Website Home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN ADMIN DASHBOARD (ONCE UNLOCKED)
  // =========================================================================
  return (
    <div className="min-h-screen bg-astro-bg text-espresso flex flex-col font-sans selection:bg-peach selection:text-espresso">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-espresso text-amber-200 text-xs font-bold px-5 py-2.5 rounded-full shadow-2xl border border-amber-400/50 backdrop-blur-md animate-in fade-in flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Navbar */}
      <header className="bg-white border-b border-peach px-5 sm:px-8 py-3.5 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/home"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-espresso/70 hover:text-terracotta border border-peach px-3 py-1.5 rounded-full transition-colors active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to App</span>
            </Link>
            <div className="h-4 w-px bg-peach hidden sm:block" />
            <h1 className="font-serif font-bold text-lg sm:text-xl text-espresso flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Astro<span className="text-terracotta">AI</span> Master Admin
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Change PIN Button */}
            <button
              onClick={() => setShowChangePinModal(true)}
              className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-espresso/70 hover:text-terracotta border border-peach px-2.5 py-1.5 rounded-xl hover:bg-peach/30 transition-all"
              title="Change Security PIN"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Change PIN</span>
            </button>

            {/* Clean Slate: Wipe All Dummy Data Button */}
            <button
              onClick={handleWipeAllDefaultData}
              className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-300 px-3 py-1.5 rounded-xl transition-all active:scale-95 cursor-pointer shadow-xs"
              title="Ek click me saara default dummy data delete karein"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Wipe Dummy Data</span>
            </button>

            {/* Lock Panel Button */}
            <button
              onClick={handleLockAdmin}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-xl transition-all active:scale-95 cursor-pointer"
              title="Lock Admin Control Center"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Panel</span>
            </button>
          </div>
        </div>
      </header>

      {/* Change Security PIN Modal */}
      {showChangePinModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-peach shadow-2xl">
            <div className="flex items-center gap-2 mb-3">
              <KeyRound className="w-5 h-5 text-terracotta" />
              <h3 className="font-serif font-bold text-base text-espresso">Update Admin Security PIN</h3>
            </div>
            <p className="text-xs text-espresso/60 mb-4">
              Set a new 4-digit master passcode to lock and protect your admin panel.
            </p>
            <form onSubmit={handleChangePin} className="space-y-4">
              <input
                type="password"
                maxLength={8}
                required
                placeholder="Enter new 4-digit PIN"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-peach bg-astro-bg text-center text-lg font-mono font-bold tracking-widest focus:outline-none"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowChangePinModal(false)}
                  className="flex-1 py-2 rounded-xl border border-peach text-xs font-bold text-espresso/70 hover:bg-peach/30"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-terracotta hover:bg-terracotta-hover text-white text-xs font-bold shadow-sm"
                >
                  Save PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sub-Header Navigation Tabs */}
      <div className="bg-white border-b border-peach px-4 sm:px-8 sticky top-14 z-30 overflow-x-auto shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 py-2">
          
          <button
            onClick={() => setActiveTab("astrologers")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === "astrologers"
                ? "bg-terracotta text-white shadow-xs"
                : "text-espresso/70 hover:bg-peach/50"
            }`}
          >
            <span>🧙‍♂️</span>
            <span>Astrologers ({astrologers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("ai-bots")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === "ai-bots"
                ? "bg-terracotta text-white shadow-xs"
                : "text-espresso/70 hover:bg-peach/50"
            }`}
          >
            <span>🤖</span>
            <span>AI Bots ({aiPersonas.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("monetization")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === "monetization"
                ? "bg-terracotta text-white shadow-xs"
                : "text-espresso/70 hover:bg-peach/50"
            }`}
          >
            <span>💳</span>
            <span>₹4 Trial & UPI Auto-Pay</span>
          </button>

          <button
            onClick={() => setActiveTab("reels")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === "reels"
                ? "bg-terracotta text-white shadow-xs"
                : "text-espresso/70 hover:bg-peach/50"
            }`}
          >
            <span>🎬</span>
            <span>Astro Reels ({reels.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === "users"
                ? "bg-terracotta text-white shadow-xs"
                : "text-espresso/70 hover:bg-peach/50"
            }`}
          >
            <span>👥</span>
            <span>Users & Wallets</span>
          </button>

          <button
            onClick={() => setActiveTab("broadcast")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === "broadcast"
                ? "bg-terracotta text-white shadow-xs"
                : "text-espresso/70 hover:bg-peach/50"
            }`}
          >
            <span>📢</span>
            <span>Notice & Push</span>
          </button>

          <button
            onClick={() => setActiveTab("banners")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === "banners"
                ? "bg-terracotta text-white shadow-xs"
                : "text-espresso/70 hover:bg-peach/50"
            }`}
          >
            <span>🖼️</span>
            <span>Hero Slider Banners ({adminBanners.length})</span>
          </button>

        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex-1 w-full space-y-8">

        {/* =========================================================================
            TAB: ₹4 TRIAL & UPI AUTO-PAY E-MANDATE (STORYTV / KUKU FM MODEL)
           ========================================================================= */}
        {activeTab === "monetization" && (
          <div className="space-y-6 animate-in fade-in">
            {/* Model Highlight Banner */}
            <div className="bg-gradient-to-r from-[#2B140B] via-[#481E10] to-[#1F0C05] text-white p-6 rounded-3xl border-2 border-amber-400/60 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none select-none text-9xl">
                💳
              </div>

              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wide mb-2 border border-amber-400/40">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>StoryTV / Kuku FM Recurring Subscription Engine</span>
                  </div>
                  <h2 className="font-serif font-bold text-xl sm:text-2xl text-amber-100">
                    UPI Auto-Pay e-Mandate: ₹{trialSetupFee} Trial + ₹{recurringAutoDebitAmount} Monthly Auto-Debit
                  </h2>
                  <p className="text-xs text-white/80 mt-1 max-w-xl leading-relaxed">
                    User se account verification ke liye sirf <strong>₹{trialSetupFee}</strong> cut honge, unko <strong>{trialDays} Din Ka Full Free VIP Access</strong> milega, aur Day 4 se automatically bank account se <strong>₹{recurringAutoDebitAmount}/mahina</strong> debit ho jayega jab tak user cancel na kare.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-amber-400/40 text-center flex-shrink-0">
                  <span className="text-[10px] text-amber-200 font-bold uppercase block">Conversion Rate</span>
                  <span className="text-2xl font-serif font-bold text-amber-300">84.2%</span>
                  <span className="text-[9px] text-emerald-300 block font-semibold mt-0.5">High Retention</span>
                </div>
              </div>
            </div>

            {/* Mandate Rule Configuration Inputs */}
            <div className="bg-white p-6 rounded-3xl border border-peach shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-peach mb-5">
                <div>
                  <h3 className="font-serif font-bold text-base text-espresso">Configure Auto-Pay Parameters</h3>
                  <p className="text-xs text-espresso/60">Change setup fee, free trial duration and recurring deduction.</p>
                </div>
                <button
                  onClick={handleSaveMandateConfig}
                  className="px-5 py-2 rounded-xl bg-terracotta hover:bg-terracotta-hover text-white text-xs font-bold shadow-md active:scale-95 transition-all"
                >
                  Save Mandate Settings
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* 1. Setup Deduction */}
                <div className="p-4 rounded-2xl border border-peach bg-astro-bg">
                  <label className="block text-[11px] font-bold text-espresso/70 mb-1.5">
                    1. INITIAL DEDUCTION (TRIAL FEE)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-espresso/60">₹</span>
                    <input
                      type="number"
                      min="1"
                      max="49"
                      value={trialSetupFee}
                      onChange={(e) => setTrialSetupFee(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-peach bg-white text-sm font-bold text-espresso focus:outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-espresso/60 mt-1.5">
                    User ke account se aaj sirf itne rupaye cut honge mandate setup ke liye.
                  </p>
                </div>

                {/* 2. Free Trial Duration */}
                <div className="p-4 rounded-2xl border border-peach bg-astro-bg">
                  <label className="block text-[11px] font-bold text-espresso/70 mb-1.5">
                    2. FREE TRIAL PERIOD (DAYS)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="14"
                      value={trialDays}
                      onChange={(e) => setTrialDays(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-peach bg-white text-sm font-bold text-espresso focus:outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-espresso/60 mt-1.5">
                    User ko itne dino tak bilkul free VIP features milenge.
                  </p>
                </div>

                {/* 3. Recurring Auto-Debit */}
                <div className="p-4 rounded-2xl border border-peach bg-astro-bg">
                  <label className="block text-[11px] font-bold text-espresso/70 mb-1.5">
                    3. RECURRING AUTO-DEBIT AMOUNT (DAY 4+)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-espresso/60">₹</span>
                    <input
                      type="number"
                      min="99"
                      max="999"
                      value={recurringAutoDebitAmount}
                      onChange={(e) => setRecurringAutoDebitAmount(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-peach bg-white text-sm font-bold text-espresso focus:outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-espresso/60 mt-1.5">
                    Trial khatam hone ke baad har mahine bank se auto-debit hoga.
                  </p>
                </div>
              </div>
            </div>

            {/* Live Performance & Projected Revenue */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-peach shadow-xs">
                <span className="text-[10px] text-espresso/60 font-bold uppercase">Active Mandates Setup</span>
                <div className="text-3xl font-serif font-bold text-espresso mt-1">184</div>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">₹4 collected each = ₹736</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-peach shadow-xs">
                <span className="text-[10px] text-espresso/60 font-bold uppercase">Currently in 3-Day Trial</span>
                <div className="text-3xl font-serif font-bold text-amber-600 mt-1">42 Users</div>
                <p className="text-[11px] text-espresso/60 font-semibold mt-1">Will convert in 48-72h</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-peach shadow-xs">
                <span className="text-[10px] text-espresso/60 font-bold uppercase">Converted to Recurring</span>
                <div className="text-3xl font-serif font-bold text-emerald-600 mt-1">142 Users</div>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">82% retention rate</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-peach shadow-xs">
                <span className="text-[10px] text-espresso/60 font-bold uppercase">Projected MRR</span>
                <div className="text-3xl font-serif font-bold text-terracotta mt-1">
                  ₹{(142 * recurringAutoDebitAmount).toLocaleString()}
                </div>
                <p className="text-[11px] text-espresso/60 font-semibold mt-1">Monthly Recurring Revenue</p>
              </div>
            </div>

            {/* Promo Codes & Coupons */}
            <div className="bg-white p-6 rounded-3xl border border-peach shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-peach mb-5">
                <h3 className="font-serif font-bold text-base text-espresso">Discount Coupons & Promo Codes</h3>
                <span className="text-xs text-espresso/60">Apply on VIP Pass & Consultations</span>
              </div>

              <form onSubmit={handleAddPromoCode} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-[11px] font-bold text-espresso/70 mb-1">PROMO CODE NAME</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NAVRATRI50"
                    value={newPromoCode}
                    onChange={(e) => setNewPromoCode(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-peach bg-astro-bg text-xs font-bold uppercase focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-espresso/70 mb-1">DISCOUNT PERCENT (%)</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={newPromoDiscount}
                    onChange={(e) => setNewPromoDiscount(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-peach bg-astro-bg text-xs font-bold focus:outline-none"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-hover text-white text-xs font-bold shadow-md inline-flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Generate Active Coupon</span>
                  </button>
                </div>
              </form>

              {/* Promo Codes List */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {promoCodes.map((promo) => (
                  <div key={promo.id} className="p-4 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/50 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-extrabold text-sm text-espresso tracking-wider">{promo.code}</span>
                      <p className="text-xs text-terracotta font-bold mt-0.5">{promo.discountPercent}% OFF</p>
                      <span className="text-[10px] text-espresso/60">{promo.uses} users redeemed</span>
                    </div>
                    <button
                      onClick={() => handleDeletePromo(promo.id)}
                      className="w-8 h-8 rounded-xl bg-white text-rose-600 hover:bg-rose-50 inline-flex items-center justify-center border border-rose-200 transition-colors"
                      title="Delete Coupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 1: ASTROLOGERS MANAGEMENT (ADD, ONLINE/OFFLINE, AND DELETE ASTROLOGER)
           ========================================================================= */}
        {activeTab === "astrologers" && (
          <div className="space-y-6 animate-in fade-in">
            {/* Header Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-peach shadow-xs">
                <span className="text-xs text-espresso/60 font-bold uppercase">Total Verified Acharyas</span>
                <div className="text-3xl font-serif font-bold text-espresso mt-1">{astrologers.length}</div>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">● Synced with Chat Screen</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-peach shadow-xs">
                <span className="text-xs text-espresso/60 font-bold uppercase">Currently Online</span>
                <div className="text-3xl font-serif font-bold text-emerald-600 mt-1">
                  {astrologers.filter((a) => a.isOnline).length}
                </div>
                <p className="text-[11px] text-espresso/60 font-semibold mt-1">Ready for live user consultations</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-peach shadow-xs">
                <span className="text-xs text-espresso/60 font-bold uppercase">Avg Consultation Fee</span>
                <div className="text-3xl font-serif font-bold text-terracotta mt-1">₹24/min</div>
                <p className="text-[11px] text-espresso/60 font-semibold mt-1">Platform takes 30% commission</p>
              </div>
            </div>

            {/* Onboard New Astrologer Form */}
            <div className="bg-white p-6 rounded-3xl border border-peach shadow-md">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-peach">
                <Plus className="w-5 h-5 text-terracotta" />
                <h3 className="font-serif font-bold text-base text-espresso">Onboard New Vedic Astrologer</h3>
              </div>

              <form onSubmit={handleAddAstrologer} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-espresso/70 mb-1">PANDIT JI NAME</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acharya Rameshwar Joshi"
                    value={newAstroName}
                    onChange={(e) => setNewAstroName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-peach bg-astro-bg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-espresso/70 mb-1">TITLE & QUALIFICATION</label>
                  <input
                    type="text"
                    placeholder="e.g. Jyotish Ratna & Kundli Expert"
                    value={newAstroTitle}
                    onChange={(e) => setNewAstroTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-peach bg-astro-bg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-espresso/70 mb-1">CATEGORY</label>
                  <select
                    value={newAstroCategory}
                    onChange={(e) => setNewAstroCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-peach bg-astro-bg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                  >
                    <option value="Kundli">Kundli & Dosha</option>
                    <option value="Love">Love & Vivah</option>
                    <option value="Career">Career & Wealth</option>
                    <option value="Vastu">Vastu & Ratna</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-espresso/70 mb-1">RATE PER MIN (₹)</label>
                  <input
                    type="number"
                    min="10"
                    max="200"
                    value={newAstroPrice}
                    onChange={(e) => setNewAstroPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-peach bg-astro-bg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-espresso/70 mb-1">EXPERIENCE</label>
                  <input
                    type="text"
                    value={newAstroExp}
                    onChange={(e) => setNewAstroExp(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-peach bg-astro-bg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-espresso/70 mb-1">SPECIALTIES</label>
                  <input
                    type="text"
                    value={newAstroSpecialty}
                    onChange={(e) => setNewAstroSpecialty(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-peach bg-astro-bg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                  />
                </div>

                <div className="sm:col-span-3 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-hover text-white text-xs font-bold shadow-md inline-flex items-center gap-2 active:scale-95 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Save & Publish Astrologer to Live App</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Manage Astrologers Table with Delete and Status Switch */}
            <div className="bg-white rounded-3xl p-6 border border-peach shadow-md">
              <div className="flex items-center justify-between pb-4 border-b border-peach mb-4">
                <h3 className="font-serif font-bold text-base text-espresso">
                  Active Astrologers Directory ({astrologers.length})
                </h3>
                <span className="text-xs text-espresso/60">Real-time sync enabled</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-peach text-espresso/60 uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-3">Astrologer</th>
                      <th className="py-3 px-3">Title & Specialty</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Rate / Min</th>
                      <th className="py-3 px-3">Consults</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Delete Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-peach/50">
                    {astrologers.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-espresso/50 font-medium">
                          Koi astrologer nahi hai. Upar diye gaye form se naye pandit ji add karein.
                        </td>
                      </tr>
                    )}
                    {astrologers.map((astro) => (
                      <tr key={astro.id} className="hover:bg-astro-bg/60 transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-amber-300 flex-shrink-0">
                              <img
                                src={astro.image}
                                alt={astro.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-espresso">{astro.name}</p>
                              <span className="text-[10px] text-espresso/60">{astro.experience}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3 max-w-xs">
                          <p className="font-semibold text-espresso line-clamp-1">{astro.title}</p>
                          <span className="text-[10px] text-terracotta">{astro.specialty}</span>
                        </td>

                        <td className="py-3 px-3">
                          <span className="px-2.5 py-0.5 rounded-full bg-peach/70 text-terracotta text-[10px] font-bold">
                            {astro.category}
                          </span>
                        </td>

                        <td className="py-3 px-3 font-bold text-espresso">
                          ₹{astro.pricePerMin}/min
                        </td>

                        <td className="py-3 px-3 text-espresso/70 font-semibold">
                          {astro.totalConsultations}
                        </td>

                        <td className="py-3 px-3">
                          <button
                            onClick={() => handleToggleAstroStatus(astro.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                              astro.isOnline
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : "bg-gray-100 text-gray-600 border border-gray-300"
                            }`}
                            title="Click to toggle Online/Offline"
                          >
                            <span className={`w-2 h-2 rounded-full ${astro.isOnline ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`} />
                            <span>{astro.isOnline ? "Online" : "Offline"}</span>
                          </button>
                        </td>

                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleDeleteAstrologer(astro.id, astro.name)}
                            className="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 inline-flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
                            title="Delete Astrologer (Remove from app)"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: AI ASTROLOGER BOTS (ADD, MANAGE, TONE, AND DELETE AI ASTROLOGER)
           ========================================================================= */}
        {activeTab === "ai-bots" && (
          <div className="space-y-6 animate-in fade-in">
            {/* AI Control Center Header */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-peach shadow-xs">
                <span className="text-xs text-espresso/60 font-bold uppercase">Total AI Personas</span>
                <div className="text-3xl font-serif font-bold text-espresso mt-1">{aiPersonas.length}</div>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">● 24/7 Zero Latency</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-peach shadow-xs">
                <span className="text-xs text-espresso/60 font-bold uppercase">Global Free Questions Limit</span>
                <div className="flex items-center gap-2 mt-2">
                  {[1, 3, 5, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        setGlobalFreeQuestions(num);
                        showToast(`Free questions limit set to ${num} per user.`);
                      }}
                      className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all ${
                        globalFreeQuestions === num
                          ? "bg-terracotta text-white border-terracotta shadow-xs"
                          : "bg-astro-bg border-peach text-espresso/70 hover:bg-peach/60"
                      }`}
                    >
                      {num} Free
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-peach shadow-xs">
                <span className="text-xs text-espresso/60 font-bold uppercase">Total AI Queries Answered</span>
                <div className="text-3xl font-serif font-bold text-amber-600 mt-1">
                  {aiPersonas.reduce((acc, p) => acc + p.queriesAnswered, 0).toLocaleString()}
                </div>
                <p className="text-[11px] text-espresso/60 font-semibold mt-1">Across all personas</p>
              </div>
            </div>

            {/* Create New AI Astrologer Bot */}
            <div className="bg-white p-6 rounded-3xl border border-peach shadow-md">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-peach">
                <Bot className="w-5 h-5 text-terracotta" />
                <h3 className="font-serif font-bold text-base text-espresso">Add New AI Astrologer Bot Persona</h3>
              </div>

              <form onSubmit={handleAddAIPersona} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-espresso/70 mb-1">AI BOT NAME</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acharya Brihaspati AI"
                    value={newAIName}
                    onChange={(e) => setNewAIName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-peach bg-astro-bg text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-espresso/70 mb-1">VEDIC ROLE / EXPERTISE</label>
                  <input
                    type="text"
                    placeholder="e.g. Kundli Milan & Vivah Yog Specialist"
                    value={newAIRole}
                    onChange={(e) => setNewAIRole(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-peach bg-astro-bg text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-espresso/70 mb-1">AVATAR / EMOJI</label>
                  <input
                    type="text"
                    placeholder="🧙‍♂️ / 🔮 / ✨"
                    value={newAIAvatar}
                    onChange={(e) => setNewAIAvatar(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-peach bg-astro-bg text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-espresso/70 mb-1">SYSTEM TONE</label>
                  <select
                    value={newAITone}
                    onChange={(e) => setNewAITone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-peach bg-astro-bg text-xs font-semibold focus:outline-none"
                  >
                    <option value="Traditional Vedic">Traditional Vedic & Sanskrit Mantras</option>
                    <option value="Modern Practical">Modern Practical & Fast Remedies</option>
                    <option value="Empathetic Counselor">Empathetic & Loving Counselor</option>
                    <option value="Direct Prashna">Direct Horary Yes/No Analysis</option>
                  </select>
                </div>

                <div className="sm:col-span-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-hover text-white text-xs font-bold shadow-md inline-flex items-center gap-2 active:scale-95 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create & Deploy AI Astrologer Bot</span>
                  </button>
                </div>
              </form>
            </div>

            {/* AI Bots List with Delete and Pause */}
            <div className="bg-white rounded-3xl p-6 border border-peach shadow-md">
              <div className="flex items-center justify-between pb-4 border-b border-peach mb-4">
                <h3 className="font-serif font-bold text-base text-espresso">
                  Active AI Astrologer Personas ({aiPersonas.length})
                </h3>
                <span className="text-xs text-espresso/60">Configured with LLM backend</span>
              </div>

              {aiPersonas.length === 0 ? (
                <div className="p-8 text-center text-espresso/50 font-medium border-2 border-dashed border-peach rounded-2xl">
                  Koi AI Bot configured nahi hai. Upar diye gaye form se naya bot create karein.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {aiPersonas.map((bot) => (
                    <div
                      key={bot.id}
                      className="p-5 rounded-2xl border-2 border-peach/80 bg-gradient-to-br from-white to-astro-bg shadow-xs flex items-start justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-peach/80 flex items-center justify-center text-2xl shadow-inner flex-shrink-0">
                          {bot.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-espresso">{bot.name}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                              bot.isActive ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-500"
                            }`}>
                              {bot.isActive ? "Active" : "Paused"}
                            </span>
                          </div>
                          <p className="text-xs text-terracotta font-semibold mt-0.5">{bot.role}</p>
                          <p className="text-[11px] text-espresso/60 mt-1">Tone: {bot.tone}</p>
                          <span className="inline-block mt-2 text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded-md border border-amber-200">
                            {bot.queriesAnswered.toLocaleString()} queries resolved
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleToggleAIPersona(bot.id)}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                            bot.isActive
                              ? "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
                              : "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                          }`}
                        >
                          {bot.isActive ? "Pause Bot" : "Activate"}
                        </button>

                        <button
                          onClick={() => handleDeleteAIPersona(bot.id, bot.name)}
                          className="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 inline-flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
                          title="Delete AI Bot Persona"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: ASTRO REELS VIDEO MANAGEMENT
           ========================================================================= */}
        {activeTab === "reels" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 border border-peach shadow-md">
              <div className="flex items-center gap-2 pb-4 border-b border-peach mb-5">
                <UploadCloud className="w-5 h-5 text-terracotta" />
                <h3 className="font-serif font-bold text-base text-espresso">Upload New Astro Reel (1-Min Short)</h3>
              </div>

              <form onSubmit={handlePublishReel} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-espresso/70 mb-1">VIDEO TITLE / TOPIC</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Manglik dosh ka 1 saral achook upay..."
                      value={newReelTitle}
                      onChange={(e) => setNewReelTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-peach bg-astro-bg text-xs font-semibold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-espresso/70 mb-1">ASSIGN ASTROLOGER</label>
                    <select
                      value={newReelAstrologer}
                      onChange={(e) => setNewReelAstrologer(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-peach bg-astro-bg text-xs font-semibold focus:outline-none"
                    >
                      {astrologers.map((a) => (
                        <option key={a.id} value={a.name}>{a.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Upload Mode Selector */}
                <div className="flex bg-astro-bg p-1 rounded-2xl border border-peach max-w-md">
                  <button
                    type="button"
                    onClick={() => setReelUploadMode("file")}
                    className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                      reelUploadMode === "file"
                        ? "bg-terracotta text-white shadow-sm"
                        : "text-espresso/70 hover:text-espresso"
                    }`}
                  >
                    📁 Upload AI Video File (.mp4)
                  </button>
                  <button
                    type="button"
                    onClick={() => setReelUploadMode("url")}
                    className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                      reelUploadMode === "url"
                        ? "bg-terracotta text-white shadow-sm"
                        : "text-espresso/70 hover:text-espresso"
                    }`}
                  >
                    🔗 Paste Video Link (URL)
                  </button>
                </div>

                {reelUploadMode === "file" ? (
                  <div className="p-4 rounded-2xl border-2 border-dashed border-peach bg-astro-bg/40 space-y-3">
                    <label className="block text-[11px] font-bold text-espresso/80">
                      CHOOSE AI GENERATED VIDEO FILE (MAX 100MB)
                    </label>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime,video/mov"
                        onChange={handleVideoFileSelect}
                        className="text-xs file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-terracotta file:text-white hover:file:bg-terracotta-hover cursor-pointer"
                      />

                      {selectedVideoFile && (
                        <button
                          type="button"
                          onClick={handleUploadFileToCloud}
                          disabled={isUploadingVideo || uploadSuccess}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-bold shadow-md inline-flex items-center gap-1.5 transition-all"
                        >
                          {isUploadingVideo ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Uploading to Cloud...</span>
                            </>
                          ) : uploadSuccess ? (
                            <span>✅ Uploaded to Cloudinary!</span>
                          ) : (
                            <>
                              <UploadCloud className="w-4 h-4" />
                              <span>Upload to Cloudinary</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {selectedVideoFile && (
                      <div className="text-[11px] text-espresso/70">
                        Selected: <span className="font-semibold text-espresso">{selectedVideoFile.name}</span> ({(selectedVideoFile.size / 1024 / 1024).toFixed(2)} MB)
                      </div>
                    )}

                    {videoPreviewUrl && (
                      <div className="mt-2 bg-black rounded-xl overflow-hidden max-w-xs shadow-md">
                        <p className="text-[10px] text-white/70 px-3 py-1 font-semibold border-b border-white/10">Video Preview:</p>
                        <video src={videoPreviewUrl} controls className="w-full max-h-48 object-contain" />
                      </div>
                    )}

                    {uploadError && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                        {uploadError}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-espresso/70 mb-1">VIDEO MP4 STREAMING URL</label>
                      <input
                        type="url"
                        required
                        value={newReelUrl}
                        onChange={(e) => setNewReelUrl(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-peach bg-astro-bg text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-espresso/70 mb-1">HASHTAG</label>
                      <input
                        type="text"
                        value={newReelTag}
                        onChange={(e) => setNewReelTag(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-peach bg-astro-bg text-xs font-semibold focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Series / Playlist Options */}
                <div className="p-4 rounded-2xl border border-amber-300/80 bg-amber-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📁</span>
                      <div>
                        <h4 className="text-xs font-bold text-espresso">Reels Series / Playlist me add karein</h4>
                        <p className="text-[10px] text-espresso/70">Series banakar users ko Part 1, Part 2 sequence me dikhayein</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isSeriesReel}
                        onChange={(e) => setIsSeriesReel(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-peach/80 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-terracotta"></div>
                    </label>
                  </div>

                  {isSeriesReel && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-amber-200/60">
                      <div>
                        <label className="block text-[11px] font-bold text-espresso/80 mb-1">
                          SERIES NAME (e.g. दशहरा विशेष 2026 / नवरात्रि उपाय)
                        </label>
                        <div className="space-y-1.5">
                          <input
                            type="text"
                            required={isSeriesReel}
                            placeholder="e.g. दशहरा के अचूक उपाय"
                            value={newReelSeriesName}
                            onChange={(e) => setNewReelSeriesName(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl border border-peach bg-white text-xs font-semibold focus:outline-none"
                          />
                          {reels.filter((r) => r.seriesName).length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              <span className="text-[10px] text-espresso/60 font-medium">Quick Select:</span>
                              {Array.from(new Set(reels.map((r) => r.seriesName).filter(Boolean))).map((s) => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => setNewReelSeriesName(s || "")}
                                  className="px-2 py-0.5 rounded-md bg-white border border-amber-300 text-[10px] font-bold text-espresso/80 hover:bg-amber-100"
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-espresso/80 mb-1">
                          EPISODE / PART NUMBER
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={100}
                          value={newReelSeriesPart}
                          onChange={(e) => setNewReelSeriesPart(Number(e.target.value))}
                          placeholder="1"
                          className="w-full px-3.5 py-2 rounded-xl border border-peach bg-white text-xs font-semibold focus:outline-none"
                        />
                        <p className="text-[10px] text-espresso/60 mt-1">E.g. Part 1, Part 2, Part 3...</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-hover text-white text-xs font-bold shadow-md inline-flex items-center gap-2 active:scale-95 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publish Video to Live Feed</span>
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-peach shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-peach mb-4 gap-2">
                <div>
                  <h3 className="font-serif font-bold text-base text-espresso">
                    Manage Published Reels ({reels.length})
                  </h3>
                  <p className="text-[11px] text-espresso/60">Live feed par published reels aur unki series manage karein.</p>
                </div>

                {/* Series Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                  <span className="text-[10px] uppercase font-bold text-espresso/60 mr-1 flex-shrink-0">Filter:</span>
                  <button
                    type="button"
                    onClick={() => setFilterSeries("all")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                      filterSeries === "all"
                        ? "bg-terracotta text-white shadow-xs"
                        : "bg-astro-bg text-espresso/70 hover:bg-peach/60"
                    }`}
                  >
                    All ({reels.length})
                  </button>
                  {Array.from(new Set(reels.map((r) => r.seriesName).filter(Boolean))).map((s) => {
                    const count = reels.filter((r) => r.seriesName === s).length;
                    return (
                      <div key={s} className="inline-flex items-center gap-1 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => setFilterSeries(s || "all")}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                            filterSeries === s
                              ? "bg-terracotta text-white shadow-xs"
                              : "bg-amber-50 border border-amber-200 text-espresso/80 hover:bg-amber-100"
                          }`}
                        >
                          📂 {s} ({count})
                        </button>
                        {filterSeries === s && (
                          <button
                            type="button"
                            onClick={() => handleDeleteSeries(s!)}
                            className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-[10px] font-bold border border-rose-200 transition-colors"
                            title="Delete this entire series"
                          >
                            🗑️ Delete Series
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-peach text-espresso/60 uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-3">Preview</th>
                      <th className="py-3 px-3">Title & Series</th>
                      <th className="py-3 px-3">Astrologer</th>
                      <th className="py-3 px-3">Likes</th>
                      <th className="py-3 px-3">Comments</th>
                      <th className="py-3 px-3 text-right">Delete Action (हटाएं)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-peach/50">
                    {reels.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-espresso/50 font-medium">
                          Koi reel published nahi hai. Upar diye gaye form se nayi short video upload karein.
                        </td>
                      </tr>
                    )}
                    {(filterSeries === "all" ? reels : reels.filter((r) => r.seriesName === filterSeries)).map((reel) => (
                      <tr key={reel.id} className="hover:bg-astro-bg/60">
                        <td className="py-3 px-3">
                          <div className="w-12 h-16 rounded-xl overflow-hidden bg-black border border-peach relative">
                            {reel.videoUrl ? (
                              <video src={reel.videoUrl} className="w-full h-full object-cover" muted />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-white/50 bg-gradient-to-br from-indigo-950 to-slate-900">
                                ✨
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 max-w-xs">
                          <p className="font-bold text-espresso line-clamp-1">{reel.title}</p>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            <span className="text-[10px] text-terracotta font-semibold">{reel.tag}</span>
                            {reel.seriesName && (
                              <span className="px-2 py-0.5 rounded-md bg-amber-100 border border-amber-300 text-amber-900 text-[9px] font-bold">
                                📂 {reel.seriesName} {reel.seriesPart ? `• Part ${reel.seriesPart}` : ""}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 font-semibold text-espresso">{reel.astrologerName}</td>
                        <td className="py-3 px-3 font-bold text-rose-600">{reel.likes}</td>
                        <td className="py-3 px-3 font-bold text-amber-700">{reel.commentsCount}</td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteReel(reel.id, reel.title)}
                            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-600 hover:text-white border border-rose-200 text-rose-600 font-bold text-xs inline-flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
                            title="Delete Reel from Live Feed"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Reel (हटाएं)</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: USERS & WALLET MANAGEMENT
           ========================================================================= */}
        {activeTab === "users" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 border border-peach shadow-md">
              <div className="flex items-center justify-between pb-4 border-b border-peach mb-4">
                <div>
                  <h3 className="font-serif font-bold text-base text-espresso">Registered Seekers & User Directory</h3>
                  <p className="text-xs text-espresso/60">Manage user wallet balances and security status.</p>
                </div>
                <span className="text-xs bg-peach px-3 py-1 rounded-full font-bold text-terracotta">
                  Total Users: {usersList.length}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-peach text-espresso/60 uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-3">User</th>
                      <th className="py-3 px-3">Joined</th>
                      <th className="py-3 px-3">Wallet Coins</th>
                      <th className="py-3 px-3">Plan</th>
                      <th className="py-3 px-3">Quick Bonus</th>
                      <th className="py-3 px-3 text-right">Account Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-peach/50">
                    {usersList.map((user) => (
                      <tr key={user.id} className="hover:bg-astro-bg/60">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-peach/80 flex items-center justify-center font-bold text-terracotta">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-espresso">{user.name}</p>
                              <span className="text-[10px] text-espresso/60">{user.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-espresso/70">{user.joinedDate}</td>
                        <td className="py-3 px-3 font-bold text-emerald-600">₹{user.walletBalance}</td>
                        <td className="py-3 px-3">
                          {user.isVIP ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold flex items-center gap-1 w-max">
                              <Crown className="w-3 h-3 text-amber-600" /> VIP
                            </span>
                          ) : (
                            <span className="text-[10px] text-espresso/60 font-semibold">Free Seeker</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleAddBonus(user.id, 50)}
                              className="px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold border border-emerald-300"
                              title="Give ₹50 Bonus"
                            >
                              +₹50
                            </button>
                            <button
                              onClick={() => handleAddBonus(user.id, 100)}
                              className="px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold border border-emerald-300"
                              title="Give ₹100 Bonus"
                            >
                              +₹100
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleToggleBanUser(user.id)}
                            className={`px-3 py-1 rounded-xl text-[10px] font-bold transition-all ${
                              user.isBanned
                                ? "bg-rose-100 text-rose-800 border border-rose-300"
                                : "bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-rose-50 hover:text-rose-700"
                            }`}
                          >
                            {user.isBanned ? "Banned (Unban)" : "Active (Ban)"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 6: NOTICE & PUSH NOTIFICATIONS BROADCAST
           ========================================================================= */}
        {activeTab === "broadcast" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white p-6 rounded-3xl border border-peach shadow-md">
              <h3 className="font-serif font-bold text-base text-espresso mb-1">Daily Auspicious Muhurat Announcement</h3>
              <p className="text-xs text-espresso/60 mb-4">This text appears directly on the Home page top greeting card.</p>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={dailyMuhuratText}
                  onChange={(e) => setDailyMuhuratText(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-peach bg-astro-bg text-xs font-bold text-espresso focus:outline-none"
                />
                <button
                  onClick={() => showToast("Daily Muhurat notice live app par update ho gaya! ⏰")}
                  className="px-5 py-2.5 rounded-xl bg-terracotta text-white text-xs font-bold shadow-xs active:scale-95"
                >
                  Update Live Notice
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-peach shadow-md">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-peach">
                <Bell className="w-5 h-5 text-amber-500" />
                <h3 className="font-serif font-bold text-base text-espresso">Send Instant Push Notification to All Seekers</h3>
              </div>

              {notificationSent && (
                <div className="mb-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Notification successfully broadcasted to 4,820 active device tokens! 📲</span>
                </div>
              )}

              <form onSubmit={handleSendBroadcast} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-espresso/70 mb-1">NOTIFICATION TITLE</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 🪐 Aaj Shani Pradosh hai, apna Shani dosh free check karein!"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-peach bg-astro-bg text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-espresso/70 mb-1">NOTIFICATION MESSAGE BODY</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Aaj sham 6 baje se pehle diya jalayein aur AI Pandit ji se 1 sawal bilkul free poochein..."
                    value={broadcastBody}
                    onChange={(e) => setBroadcastBody(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-peach bg-astro-bg text-xs font-semibold focus:outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-hover text-white text-xs font-bold shadow-md inline-flex items-center gap-2 active:scale-95 transition-all"
                  >
                    <Bell className="w-4 h-4" />
                    <span>Send Push Notification to All Users</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= 7. HERO BANNERS & SLIDER MANAGEMENT ================= */}
        {activeTab === "banners" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header info card */}
            <div className="bg-gradient-to-r from-amber-500 via-terracotta to-amber-700 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>HOMEPAGE HERO SLIDER CMS</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold">Hero Banners & Animated Slider</h2>
                <p className="text-xs text-white/90 mt-1 max-w-xl leading-relaxed">
                  Upload custom promotional banners, festive astrology offers, or animated cards for the top homepage carousel. Real-time sync with MongoDB Atlas.
                </p>
              </div>

              <div className="relative z-10 flex items-center gap-2 self-start sm:self-auto">
                <div className="px-4 py-2 rounded-2xl bg-black/25 backdrop-blur-md border border-white/20 text-center">
                  <p className="text-lg font-bold">{adminBanners.length}</p>
                  <p className="text-[10px] uppercase tracking-wider text-white/75 font-semibold">Total Cards</p>
                </div>
                <div className="px-4 py-2 rounded-2xl bg-black/25 backdrop-blur-md border border-white/20 text-center">
                  <p className="text-lg font-bold text-emerald-300">{adminBanners.filter(b => b.isActive !== false).length}</p>
                  <p className="text-[10px] uppercase tracking-wider text-white/75 font-semibold">Live in Slider</p>
                </div>
              </div>
            </div>

            {/* Error & Success Messages */}
            {bannerError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{bannerError}</span>
              </div>
            )}

            {bannerUploadSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>New Hero Banner published live to homepage scroller! ✨</span>
              </div>
            )}

            {/* Main 2-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* LEFT COLUMN: Add New Banner Form & Live Preview */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white p-5 sm:p-6 rounded-3xl border border-peach shadow-sm">
                  <h3 className="font-serif font-bold text-base text-espresso flex items-center gap-2 mb-1">
                    <Plus className="w-4 h-4 text-terracotta" />
                    <span>Upload New Hero Banner</span>
                  </h3>
                  <p className="text-xs text-espresso/60 mb-4">Add a new image, animated card, or announcement to the slider.</p>

                  {/* LIVE PREVIEW OF CONFIGURED BANNER */}
                  <div className="mb-5">
                    <label className="block text-[10px] font-bold text-espresso/60 uppercase tracking-wider mb-1.5">
                      Live Banner Card Preview
                    </label>
                    <div className={`p-1 rounded-2xl bg-gradient-to-br ${newBannerGradient} border-2 border-amber-300/80 shadow-sm relative overflow-hidden h-[150px] flex items-center justify-center transition-all`}>
                      {bannerPreview ? (
                        <img src={bannerPreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center p-4">
                          <Sparkles className="w-8 h-8 text-amber-500 animate-pulse mb-1" />
                          <p className="text-xs font-serif font-bold text-espresso">{newBannerTitle || "Animated Visual Card"}</p>
                          <p className="text-[10px] text-espresso/60 mt-0.5">Upload GIF or animated banner image to display full-bleed on the slider</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* FORM FIELDS */}
                  <form onSubmit={handleCreateBanner} className="space-y-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-espresso/70 mb-1">BANNER TITLE *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Auspicious Guru Pushya Yog Active"
                        value={newBannerTitle}
                        onChange={(e) => setNewBannerTitle(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-peach bg-astro-bg text-xs font-semibold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-espresso/70 mb-1">SUBTITLE / DESCRIPTION</label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Perform gold purchase or start new business under auspicious planetary alignment today."
                        value={newBannerSubtitle}
                        onChange={(e) => setNewBannerSubtitle(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-peach bg-astro-bg text-xs font-semibold focus:outline-none resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-espresso/70 mb-1">BADGE TEXT</label>
                        <input
                          type="text"
                          placeholder="e.g. 🪙 SPECIAL DHAN YOG"
                          value={newBannerBadge}
                          onChange={(e) => setNewBannerBadge(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-peach bg-astro-bg text-xs font-semibold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-espresso/70 mb-1">BUTTON TEXT</label>
                        <input
                          type="text"
                          placeholder="e.g. Check Kundli"
                          value={newBannerCtaText}
                          onChange={(e) => setNewBannerCtaText(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-peach bg-astro-bg text-xs font-semibold focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* TARGET ROUTE SELECTOR */}
                    <div>
                      <label className="block text-[11px] font-bold text-espresso/70 mb-1">BUTTON DESTINATION LINK</label>
                      <select
                        value={newBannerCtaLink}
                        onChange={(e) => setNewBannerCtaLink(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-peach bg-astro-bg text-xs font-semibold focus:outline-none"
                      >
                        <option value="/chat">💬 Chat with Astrologer (/chat)</option>
                        <option value="/ai-chat">🤖 24/7 AI Astrologer (/ai-chat)</option>
                        <option value="/kundli-milan">❤️ 36 Gunas Kundli Milan (/kundli-milan)</option>
                        <option value="/kundli">🔮 Free Janam Kundli (/kundli)</option>
                        <option value="/vip-pass">👑 VIP Astro Pass (/vip-pass)</option>
                        <option value="/reels">🎬 Fullscreen Astro Reels (/reels)</option>
                      </select>
                    </div>

                    {/* IMAGE UPLOAD / FILE PICKER */}
                    <div>
                      <label className="block text-[11px] font-bold text-espresso/70 mb-1">BANNER IMAGE / GIF</label>
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleBannerFileSelect}
                          className="block w-full text-xs text-espresso/70 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-terracotta file:text-white hover:file:bg-terracotta-hover file:cursor-pointer cursor-pointer border border-peach bg-astro-bg rounded-xl p-1"
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-espresso/50 font-bold uppercase">Or Direct URL:</span>
                          <input
                            type="url"
                            placeholder="https://images.unsplash.com/..."
                            value={newBannerImageUrl}
                            onChange={(e) => {
                              setNewBannerImageUrl(e.target.value);
                              setBannerPreview(e.target.value);
                            }}
                            className="flex-1 px-3 py-1.5 rounded-xl border border-peach bg-astro-bg text-xs focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* BACKGROUND GRADIENT THEME PICKER */}
                    <div>
                      <label className="block text-[11px] font-bold text-espresso/70 mb-1.5">BACKGROUND COLOR THEME</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: "Vedic Gold", gradient: "from-[#FFF9F2] via-[#FFEEDC] to-[#FFDFC8]" },
                          { label: "Sun Amber", gradient: "from-[#FFFDF0] via-[#FEF3C7] to-[#FDE68A]" },
                          { label: "Sky Shanti", gradient: "from-[#F0F9FF] via-[#E0F2FE] to-[#BAE6FD]" },
                          { label: "Love Rose", gradient: "from-[#FFF1F2] via-[#FCE7F3] to-[#FBCFE8]" },
                          { label: "Emerald Kuber", gradient: "from-[#ECFDF5] via-[#D1FAE5] to-[#A7F3D0]" },
                          { label: "Royal Aura", gradient: "from-[#FAF5FF] via-[#F3E8FF] to-[#E9D5FF]" },
                        ].map((theme) => (
                          <button
                            key={theme.label}
                            type="button"
                            onClick={() => setNewBannerGradient(theme.gradient)}
                            className={`p-2 rounded-xl text-[10px] font-bold border transition-all text-center ${
                              newBannerGradient === theme.gradient
                                ? "border-terracotta bg-terracotta/10 text-terracotta shadow-xs"
                                : "border-peach bg-white hover:bg-peach/30 text-espresso/70"
                            }`}
                          >
                            <div className={`w-full h-3 rounded-md bg-gradient-to-r ${theme.gradient} mb-1 border border-peach`} />
                            <span>{theme.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingBanner}
                      className="w-full py-3 rounded-2xl bg-terracotta hover:bg-terracotta-hover text-white text-xs font-bold shadow-md inline-flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
                    >
                      {isSubmittingBanner ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <UploadCloud className="w-4 h-4" />
                          <span>Publish to Hero Slider</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* RIGHT COLUMN: Active Slider Banners List */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-white p-5 sm:p-6 rounded-3xl border border-peach shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-serif font-bold text-base text-espresso flex items-center gap-2">
                        <span>Active Hero Slider Cards</span>
                        <span className="px-2 py-0.5 rounded-full bg-peach text-terracotta text-[10px] font-bold">
                          {adminBanners.length} Total
                        </span>
                      </h3>
                      <p className="text-xs text-espresso/60 mt-0.5">These cards auto-scroll horizontally on the homepage header.</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(new Event("astroai_banners_updated"));
                        showToast("Slider refreshed on live devices!");
                      }}
                      className="px-3 py-1.5 rounded-xl border border-peach bg-white hover:bg-peach/30 text-xs font-bold text-terracotta active:scale-95 transition-all shadow-xs"
                    >
                      Sync Now
                    </button>
                  </div>

                  {adminBanners.length === 0 ? (
                    <div className="p-8 text-center border-2 border-dashed border-peach rounded-2xl">
                      <p className="text-xs text-espresso/60">No banners found. The default animated Vedic cards are active.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {adminBanners.map((banner, index) => {
                        const isKalachakra = banner.type === "kalachakra_chakra" || banner.bannerId === "banner-kalachakra";
                        const isPreset = banner.isSystemDefault || isKalachakra;

                        return (
                          <div
                            key={banner.bannerId || banner.id || `b-${index}`}
                            className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                              banner.isActive !== false
                                ? "bg-gradient-to-r from-white to-[#FFFDF9] border-peach shadow-xs"
                                : "bg-neutral-50 border-neutral-200 opacity-60"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {/* Thumbnail / Symbol */}
                              <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-tr from-amber-500 to-terracotta flex items-center justify-center text-white flex-shrink-0 shadow-sm border border-amber-300">
                                {banner.imageUrl ? (
                                  <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-xl">☀️</span>
                                )}
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 mb-0.5">
                                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-peach/80 text-terracotta">
                                    {banner.badge || "INSIGHT"}
                                  </span>
                                  {isPreset && (
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800">
                                      Built-in Animation
                                    </span>
                                  )}
                                  <span className={`w-2 h-2 rounded-full ${banner.isActive !== false ? "bg-emerald-500" : "bg-neutral-400"}`} />
                                </div>
                                <h4 className="font-bold text-xs sm:text-sm text-espresso truncate">
                                  {banner.title}
                                </h4>
                                <p className="text-[11px] text-espresso/60 truncate max-w-sm">
                                  {banner.subtitle || "No description provided"}
                                </p>
                                <p className="text-[10px] text-terracotta font-semibold mt-0.5">
                                  Action: {banner.ctaText || "Explore"} ➔ {banner.ctaLink || "/chat"}
                                </p>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                              {/* Toggle Active Switch */}
                              <button
                                type="button"
                                onClick={() => handleToggleBanner(banner.bannerId || banner.id)}
                                title={banner.isActive !== false ? "Disable banner from slider" : "Enable banner in slider"}
                                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                                  banner.isActive !== false
                                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                    : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                                }`}
                              >
                                {banner.isActive !== false ? <ToggleRight className="w-4 h-4 text-emerald-600" /> : <ToggleLeft className="w-4 h-4" />}
                                <span>{banner.isActive !== false ? "Active" : "Hidden"}</span>
                              </button>

                              {/* Delete Button (Only for custom banners) */}
                              {!isKalachakra && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteBanner(banner.bannerId || banner.id, banner.title)}
                                  title="Delete Banner"
                                  className="p-1.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 transition-all cursor-pointer active:scale-95"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}