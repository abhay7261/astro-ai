"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Heart, MessageCircle, Share2, ArrowLeft, Volume2, VolumeX, 
  Play, Pause, Sparkles, Send, X, ChevronUp, ChevronDown, 
  Flame, Music2, CheckCircle2, Bookmark, Film
} from "lucide-react";
import AstroChatModal from "../AstroChatModal";
import AuthGateModal from "./AuthGateModal";
import { reelsApi } from "../../services/apiClient";

export interface ReelItem {
  id: string;
  reelId?: string;
  title: string;
  description: string;
  astrologerName: string;
  astrologerTitle: string;
  astrologerAvatar: string;
  astrologerSpecialty: string;
  astrologerExp: string;
  themeColor: string;
  bgGradient: string;
  symbol: string;
  mantra: string;
  audioName: string;
  likes: number;
  commentsCount: number;
  sharesCount: number;
  tag?: string;
  tags: string[];
  videoUrl?: string;
  seriesName?: string;
  seriesPart?: number;
  comments: {
    id: string;
    userName: string;
    userAvatar: string;
    text: string;
    timeAgo: string;
    likes: number;
  }[];
}

// 5 Real Cloudinary Uploaded Reels Dataset
const FALLBACK_REAL_REELS: ReelItem[] = [
  {
    id: "reel-1792572437",
    reelId: "reel-1792572437",
    title: "Bhagya Uday Ke Saral Vedic Upay",
    description: "Apne bhagya ko jagane ke liye daily subah karein ye 1 saral upay.",
    astrologerName: "Dev Guru Shastri",
    astrologerTitle: "Vedic & Career Expert",
    astrologerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    astrologerSpecialty: "Dhan & Bhagya Yog",
    astrologerExp: "15+ Yrs Exp",
    themeColor: "#F59E0B",
    bgGradient: "from-[#451A03] via-[#78350F] to-[#1C1917]",
    symbol: "🪙",
    mantra: "ॐ गुरुवे नमः",
    audioName: "Original Audio • Dev Guru Vedic Chants",
    videoUrl: "https://res.cloudinary.com/kah2bbjm/video/upload/v1792572437/astroai_reels/lpuw6fhynyw8diizu4ou.mp4",
    likes: 342,
    commentsCount: 28,
    sharesCount: 75,
    tag: "#BhagyaUday",
    tags: ["#BhagyaUday", "#DailyUpay", "#AstroAI"],
    seriesName: "Vedic Bhagya Series",
    seriesPart: 1,
    comments: [
      { id: "1", userName: "Sunil Verma", userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80", text: "Guru ji ye upay kis din se shuru karna chahiye?", timeAgo: "2h ago", likes: 12 },
    ],
  },
  {
    id: "reel-1792572347",
    reelId: "reel-1792572347",
    title: "Graha Dosh Nivaran & Kundli Rahasya",
    description: "Kundli me graha dosh shanti ke mool mantra aur saral upay.",
    astrologerName: "Acharya Rameshwar",
    astrologerTitle: "Senior Jyotish Ratna",
    astrologerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    astrologerSpecialty: "Kundli Milan & Dosh",
    astrologerExp: "18+ Yrs Exp",
    themeColor: "#38BDF8",
    bgGradient: "from-[#082F49] via-[#0C4A6E] to-[#1E1B4B]",
    symbol: "🔮",
    mantra: "ॐ नवग्रहाय नमः",
    audioName: "Original Audio • Sacred Temple Bells",
    videoUrl: "https://res.cloudinary.com/kah2bbjm/video/upload/v1792572347/astroai_reels/uqa9wrwyv1mb3owt3vvq.mp4",
    likes: 418,
    commentsCount: 35,
    sharesCount: 92,
    tags: ["#GrahaDosh", "#VedicAstrology", "#ShantiUpay"],
    seriesName: "Vedic Bhagya Series",
    seriesPart: 2,
    comments: [],
  },
  {
    id: "reel-1792561807",
    reelId: "reel-1792561807",
    title: "Ghar Me Dhan Vriddhi Ke Vastu Tips",
    description: "Tijori aur ghar ki disha me ye parivartan layega dhan yoga.",
    astrologerName: "Pandit Radheshyam Joshi",
    astrologerTitle: "Vastu & Dhan Yog Specialist",
    astrologerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    astrologerSpecialty: "Dhan Yog & Vastu",
    astrologerExp: "15+ Yrs Exp",
    themeColor: "#10B981",
    bgGradient: "from-[#064E3B] via-[#065F46] to-[#022C22]",
    symbol: "💰",
    mantra: "ॐ श्रीं सिद्ध लक्ष्म्यै नमः",
    audioName: "Maha Lakshmi Stotram • Sacred Chants",
    videoUrl: "https://res.cloudinary.com/kah2bbjm/video/upload/v1792561807/astroai_reels/ezqzdvbyocqya7jwuvqh.mp4",
    likes: 580,
    commentsCount: 42,
    sharesCount: 120,
    tags: ["#DhanVriddhi", "#VastuTips", "#LakshmiYog"],
    seriesName: "Vastu & Dhan Yog",
    seriesPart: 1,
    comments: [],
  },
  {
    id: "reel-1792561133",
    reelId: "reel-1792561133",
    title: "Kundli Me Vivah Yog Aur Prem Sambandh",
    description: "Shighra vivah ke liye Shukra aur Brihaspati ki anukoolta upay.",
    astrologerName: "Dr. Ananya Mukherjee",
    astrologerTitle: "Love & Marriage Counselor",
    astrologerAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    astrologerSpecialty: "Love & Marriage Compatibility",
    astrologerExp: "12+ Yrs Exp",
    themeColor: "#E11D48",
    bgGradient: "from-[#4C0519] via-[#831843] to-[#1E1B4B]",
    symbol: "❤️",
    mantra: "ॐ क्लीं कृष्णाय नमः",
    audioName: "Vivah Sanskar • Melodious Flute",
    videoUrl: "https://res.cloudinary.com/kah2bbjm/video/upload/v1792561133/astroai_reels/lfosgpjbr1rsc0k1r2ca.mp4",
    likes: 695,
    commentsCount: 54,
    sharesCount: 160,
    tags: ["#VivahYog", "#KundliMilan", "#LoveMarriage"],
    seriesName: "Vivah & Prem Yog",
    seriesPart: 1,
    comments: [],
  },
  {
    id: "reel-1792485818",
    reelId: "reel-1792485818",
    title: "Shani Sade Sati Ke 3 Asarkari Upay",
    description: "Shani Dev ke dushprabhav ko shanti me badalney ke 3 achook upay.",
    astrologerName: "Acharya Vidyadhar Shastri",
    astrologerTitle: "Vedic Astrologer",
    astrologerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    astrologerSpecialty: "Lagna & Shani Shanti",
    astrologerExp: "18+ Yrs Exp",
    themeColor: "#4B5563",
    bgGradient: "from-[#0F172A] via-[#1E1B4B] to-[#31102A]",
    symbol: "🪐",
    mantra: "ॐ शं शनैश्चराय नमः",
    audioName: "Original Audio • Shani Shanti Chants",
    videoUrl: "https://res.cloudinary.com/kah2bbjm/video/upload/v1792485818/astroai_reels/dpv7hdnbdbgmysa3myfu.mp4",
    likes: 890,
    commentsCount: 67,
    sharesCount: 210,
    tags: ["#ShaniSadeSati", "#ShaniUpay", "#VedicUpay"],
    seriesName: "Shani Dosh Nivaran",
    seriesPart: 1,
    comments: [],
  },
];

export default function InstagramReelsPlayer() {
  const router = useRouter();
  const [allReels, setAllReels] = useState<ReelItem[]>(FALLBACK_REAL_REELS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [videoLoadErrors, setVideoLoadErrors] = useState<Record<string, boolean>>({});
  const [likesState, setLikesState] = useState<Record<string, { liked: boolean; count: number }>>({});
  const [savedReels, setSavedReels] = useState<Record<string, boolean>>({});
  const [showCommentsDrawer, setShowCommentsDrawer] = useState(false);
  const [newCommentInput, setNewCommentInput] = useState("");
  const [selectedAstroForChat, setSelectedAstroForChat] = useState<any | null>(null);
  const [showSeriesDrawer, setShowSeriesDrawer] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [showPlayPauseFeedback, setShowPlayPauseFeedback] = useState<"play" | "pause" | null>(null);
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [authFeatureName, setAuthFeatureName] = useState<string>("Astro Reels");
  const [pendingAuthAction, setPendingAuthAction] = useState<(() => void) | null>(null);

  // Require Auth Check: Prompt Login/Sign Up for guests on direct navigation to Reels
  useEffect(() => {
    try {
      const sessionToken = sessionStorage.getItem("astroai_session_token");
      if (!sessionToken) {
        setShowAuthGate(true);
        setAuthFeatureName("Astro Reels");
      }
    } catch {}
  }, []);

  const handleCloseAuth = () => {
    setShowAuthGate(false);
    setPendingAuthAction(null);
    const sessionToken = sessionStorage.getItem("astroai_session_token");
    if (!sessionToken) {
      router.replace("/home");
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthGate(false);
    if (pendingAuthAction) {
      pendingAuthAction();
      setPendingAuthAction(null);
    }
  };

  const handleAstroChatClick = (astroData: any) => {
    try {
      const sessionToken = sessionStorage.getItem("astroai_session_token");
      if (!sessionToken) {
        setAuthFeatureName(`Chat with ${astroData.name}`);
        setPendingAuthAction(() => () => setSelectedAstroForChat(astroData));
        setShowAuthGate(true);
        return;
      }
    } catch {}
    setSelectedAstroForChat(astroData);
  };

  const handleCommentsDrawerOpen = () => {
    try {
      const sessionToken = sessionStorage.getItem("astroai_session_token");
      if (!sessionToken) {
        setAuthFeatureName("Reel Comments");
        setPendingAuthAction(() => () => setShowCommentsDrawer(true));
        setShowAuthGate(true);
        return;
      }
    } catch {}
    setShowCommentsDrawer(true);
  };

  const handleLikeWithAuth = (reelId: string) => {
    try {
      const sessionToken = sessionStorage.getItem("astroai_session_token");
      if (!sessionToken) {
        setAuthFeatureName("Like Reel");
        setPendingAuthAction(() => () => handleLikeToggle(reelId));
        setShowAuthGate(true);
        return;
      }
    } catch {}
    handleLikeToggle(reelId);
  };

  const containerRef = useRef<HTMLDivElement | null>(null);
  const reelRefs = useRef<(HTMLElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Fetch Live Reels and Merge (Ensuring Older and Newer Reels are all preserved)
  const fetchReels = useCallback(async () => {
    try {
      const deletedStr = localStorage.getItem("astroai_deleted_reels");
      const deletedList: string[] = deletedStr ? JSON.parse(deletedStr) : [];

      let adminReels: any[] = [];
      try {
        const localStr = localStorage.getItem("astroai_admin_reels");
        if (localStr) {
          const parsed = JSON.parse(localStr);
          if (Array.isArray(parsed)) adminReels = parsed;
        }
      } catch (e) {}

      let liveReels: any[] = [];
      try {
        const res = await reelsApi.getAll();
        if (Array.isArray(res)) liveReels = res;
      } catch (e) {}

      // Combine admin-uploaded local reels and live backend database reels
      const combined: any[] = [...adminReels];

      // Merge backend reels without duplicates
      liveReels.forEach((br: any) => {
        const isDeleted = deletedList.includes(String(br.id)) || deletedList.includes(String(br.reelId));
        const alreadyExists = combined.some(
          (cr) =>
            String(cr.id) === String(br.id) ||
            String(cr.id) === String(br.reelId) ||
            (br.videoUrl && cr.videoUrl === br.videoUrl)
        );
        if (!isDeleted && !alreadyExists) {
          combined.push(br);
        }
      });

      // Also merge fallback real Cloudinary dataset if backend didn't return them yet
      FALLBACK_REAL_REELS.forEach((fb) => {
        const isDeleted = deletedList.includes(fb.id);
        const alreadyExists = combined.some(
          (cr) => String(cr.id) === fb.id || (fb.videoUrl && cr.videoUrl === fb.videoUrl)
        );
        if (!isDeleted && !alreadyExists) {
          combined.push(fb);
        }
      });

      // Filter out any explicitly deleted records
      const finalRaw = combined.filter(
        (r: any) => !deletedList.includes(String(r.id)) && !deletedList.includes(String(r.reelId))
      );

      if (finalRaw.length > 0) {
        const mapped: ReelItem[] = finalRaw.map((r: any, idx: number) => ({
          id: String(r.id || r.reelId || `reel-${idx}`),
          reelId: String(r.reelId || r.id || `reel-${idx}`),
          title: r.title || "Vedic Astro Upay & Prediction",
          description: r.description || "Daily astrological insights and remedies.",
          astrologerName: r.astrologerName || "AstroAI Creator",
          astrologerTitle: r.astrologerTitle || "Vedic Astrologer",
          astrologerAvatar:
            r.astrologerAvatar ||
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
          astrologerSpecialty: r.astrologerSpecialty || "Daily Upay",
          astrologerExp: r.astrologerExp || "10+ Yrs Exp",
          themeColor: r.themeColor || "#F59E0B",
          bgGradient: r.bgGradient || "from-[#18181B] via-[#27272A] to-black",
          symbol: r.symbol || "✨",
          mantra: r.mantra || "ॐ शांति शांति शांतिः",
          audioName: r.audioName || "Original Audio • AstroAI Vedic Chants",
          likes: Number(r.likes) || 120,
          commentsCount: Number(r.commentsCount) || 15,
          sharesCount: Number(r.sharesCount) || 30,
          tags: r.tags || (r.tag ? [r.tag] : ["#DailyUpay", "#AstroReels"]),
          videoUrl: r.videoUrl,
          seriesName: r.seriesName || "",
          seriesPart: r.seriesPart ? Number(r.seriesPart) : undefined,
          comments: r.comments || [],
        }));

        setAllReels(mapped);
      } else {
        setAllReels([]);
      }
    } catch (e) {
      console.warn("Reels fetch error:", e);
    }
  }, []);

  useEffect(() => {
    fetchReels();
    const handleReelsUpdated = () => fetchReels();
    window.addEventListener("astroai_reels_updated", handleReelsUpdated);
    return () => window.removeEventListener("astroai_reels_updated", handleReelsUpdated);
  }, [fetchReels]);

  // Instagram-Style Intersection Observer (Detect active snapped reel)
  useEffect(() => {
    if (!containerRef.current || allReels.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const idx = Number(entry.target.getAttribute("data-index"));
            if (!isNaN(idx)) {
              setCurrentIndex(idx);
              setCurrentTime(0);
              setDuration(0);
              setIsPlaying(true);
            }
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.6,
      }
    );

    reelRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [allReels.length]);

  // Synchronize Single Active Video Playback & Muting across Reels
  useEffect(() => {
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      if (idx === currentIndex) {
        vid.muted = isMuted;
        if (isPlaying) {
          vid.play().catch(() => {
            // Autoplay policy fallback: mute and play
            vid.muted = true;
            setIsMuted(true);
            vid.play().catch(() => {});
          });
        } else {
          vid.pause();
        }
      } else {
        vid.pause();
        vid.currentTime = 0;
        vid.muted = true;
      }
    });
  }, [currentIndex, isPlaying, isMuted]);

  // Keyboard navigation (ArrowUp / ArrowDown)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showCommentsDrawer || showSeriesDrawer) return;
      if (e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault();
        scrollToReel(currentIndex + 1);
      } else if (e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault();
        scrollToReel(currentIndex - 1);
      } else if (e.key === " ") {
        e.preventDefault();
        handleScreenDoubleTap();
      } else if (e.key === "m") {
        setIsMuted((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, allReels.length, showCommentsDrawer, showSeriesDrawer]);

  const scrollToReel = (targetIdx: number) => {
    if (targetIdx < 0 || targetIdx >= allReels.length) return;
    const targetEl = reelRefs.current[targetIdx];
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleLikeToggle = (reelId: string) => {
    const reel = allReels.find((r) => r.id === reelId);
    const current = likesState[reelId] || { liked: false, count: reel?.likes || 0 };
    const nextLiked = !current.liked;

    setLikesState((prev) => ({
      ...prev,
      [reelId]: {
        liked: nextLiked,
        count: nextLiked ? current.count + 1 : Math.max(0, current.count - 1),
      },
    }));

    if (nextLiked) {
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 900);
      reelsApi.like(reelId).catch(() => {});
    }
  };

  // Double tap to like & Single tap to pause/play
  const lastTapRef = useRef<number>(0);
  const handleScreenDoubleTap = () => {
    const now = Date.now();
    const currentReel = allReels[currentIndex];
    if (!currentReel) return;

    if (now - lastTapRef.current < 300) {
      if (!likesState[currentReel.id]?.liked) {
        handleLikeToggle(currentReel.id);
      } else {
        setShowHeartBurst(true);
        setTimeout(() => setShowHeartBurst(false), 900);
      }
    } else {
      setIsPlaying((prev) => {
        const next = !prev;
        setShowPlayPauseFeedback(next ? "play" : "pause");
        return next;
      });
      setTimeout(() => setShowPlayPauseFeedback(null), 600);
    }
    lastTapRef.current = now;
  };

  const handleToggleSound = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    showToast(nextMuted ? "Sound Muted 🔇" : "Sound Playing 🔊");
  };

  const handleShare = (reel: ReelItem) => {
    if (navigator.share) {
      navigator.share({
        title: reel.title,
        text: reel.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast("✨ Reel link copied to clipboard!");
    }
  };

  const handleSaveToggle = (reelId: string) => {
    setSavedReels((prev) => {
      const isSaved = !prev[reelId];
      showToast(isSaved ? "Saved to your bookmarks ✨" : "Removed from bookmarks");
      return { ...prev, [reelId]: isSaved };
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    const currentReel = allReels[currentIndex];
    if (!newCommentInput.trim() || !currentReel) return;

    const newComment = {
      id: Date.now().toString(),
      userName: "You (Seeker)",
      userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80",
      text: newCommentInput.trim(),
      timeAgo: "Just now",
      likes: 0,
    };

    currentReel.comments.unshift(newComment);
    currentReel.commentsCount += 1;
    setNewCommentInput("");
    showToast("Comment posted successfully ✨");
  };

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const activeReel = allReels[currentIndex] || allReels[0];

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex items-center justify-center select-none overflow-hidden font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[80] bg-espresso/90 border border-amber-400/40 text-amber-200 text-xs font-semibold px-4 py-2 rounded-full shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-200 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Instagram Snap-Scroll Viewport */}
      <div
        ref={containerRef}
        data-no-scrollbar="true"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className="relative w-full h-[100dvh] max-w-md mx-auto sm:max-h-[92dvh] sm:rounded-3xl sm:border sm:border-white/15 overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar [&::-webkit-scrollbar]:hidden shadow-2xl bg-black"
      >
        {/* Empty State when no reels exist */}
        {allReels.length === 0 && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#18181B] to-black">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mb-4">
              <Film className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-amber-200 mb-2">Koi Reel Uplabdh Nahi Hai</h3>
            <p className="text-xs text-white/60 max-w-xs mb-6">
              Admin panel se nayi short video upload karein.
            </p>
            <button
              onClick={() => router.push("/admin")}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-terracotta text-white text-xs font-bold shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              Admin Panel Kholein
            </button>
          </div>
        )}

        {/* Vertical Reel Items (Each occupies 100% viewport and snaps smoothly) */}
        {allReels.map((reel, idx) => {
          const isActive = idx === currentIndex;
          const isLiked = !!likesState[reel.id]?.liked;
          const likeCount = likesState[reel.id]?.count ?? reel.likes;
          const isSaved = !!savedReels[reel.id];
          const hasError = !!videoLoadErrors[reel.id];

          return (
            <section
              key={reel.id}
              data-index={idx}
              ref={(el) => { reelRefs.current[idx] = el; }}
              className="relative w-full h-[100dvh] sm:h-[92dvh] snap-start snap-always overflow-hidden flex flex-col justify-between flex-shrink-0 bg-black"
            >
              {/* Video Player or Fallback Cosmic Canvas */}
              {reel.videoUrl && !hasError ? (
                <div
                  onClick={handleScreenDoubleTap}
                  className="absolute inset-0 bg-black cursor-pointer flex items-center justify-center overflow-hidden"
                >
                  <video
                    ref={(el) => { videoRefs.current[idx] = el; }}
                    src={reel.videoUrl}
                    loop
                    playsInline
                    preload={idx <= currentIndex + 1 ? "auto" : "none"}
                    muted={isMuted}
                    onTimeUpdate={(e) => {
                      if (isActive) setCurrentTime(e.currentTarget.currentTime);
                    }}
                    onLoadedMetadata={(e) => {
                      if (isActive) setDuration(e.currentTarget.duration);
                    }}
                    onEnded={() => scrollToReel(currentIndex + 1)}
                    onError={() => {
                      setVideoLoadErrors((prev) => ({ ...prev, [reel.id]: true }));
                    }}
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle Gradient Overlays */}
                  <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
                </div>
              ) : (
                <div
                  onClick={handleScreenDoubleTap}
                  className={`absolute inset-0 bg-gradient-to-b ${reel.bgGradient} cursor-pointer flex items-center justify-center overflow-hidden`}
                >
                  <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#FFE5D4_1px,transparent_1px)] [background-size:18px_18px] animate-pulse pointer-events-none" />
                  <div className="relative w-64 h-64 rounded-full border border-white/10 flex items-center justify-center">
                    <span className="text-6xl filter drop-shadow-[0_0_20px_rgba(255,200,100,0.4)]">
                      {reel.symbol}
                    </span>
                  </div>
                  <div className="absolute top-24 left-0 right-0 text-center pointer-events-none">
                    <span className="inline-block px-3.5 py-1 rounded-full bg-black/40 border border-white/15 text-amber-200/90 font-serif text-xs tracking-widest backdrop-blur-md">
                      {reel.mantra}
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
                </div>
              )}

              {/* Large Heart Burst on Double Tap */}
              {isActive && showHeartBurst && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 animate-in zoom-in-50 fade-out duration-700">
                  <Heart className="w-28 h-28 text-rose-500 fill-rose-500 drop-shadow-[0_0_35px_rgba(244,63,94,0.9)] animate-bounce" />
                </div>
              )}

              {/* Play/Pause Feedback Overlay */}
              {isActive && showPlayPauseFeedback && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 animate-in zoom-in-75 fade-out duration-500">
                  <div className="w-20 h-20 rounded-full bg-black/70 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-2xl">
                    {showPlayPauseFeedback === "play" ? (
                      <Play className="w-10 h-10 fill-white translate-x-1" />
                    ) : (
                      <Pause className="w-10 h-10 fill-white" />
                    )}
                  </div>
                </div>
              )}

              {/* 1. TOP HEADER OVERLAY */}
              <div className="relative z-20 flex items-center justify-between p-4 pt-5 bg-gradient-to-b from-black/80 via-black/30 to-transparent">
                <button
                  onClick={() => router.push("/home")}
                  className="w-10 h-10 rounded-full bg-black/40 border border-white/20 flex items-center justify-center text-white active:scale-90 hover:bg-black/60 transition-all backdrop-blur-md cursor-pointer"
                  title="Back to Home"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2">
                  <h1 className="font-serif font-bold text-base sm:text-lg tracking-wide text-white drop-shadow-md">
                    Astro<span className="text-amber-400">Reels</span>
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-600/90 text-white text-[9px] font-black uppercase tracking-wider shadow-sm">
                    <Flame className="w-2.5 h-2.5 fill-white" />
                    LIVE
                  </span>
                </div>

                <button
                  onClick={handleToggleSound}
                  className="w-10 h-10 rounded-full bg-black/40 border border-white/20 flex items-center justify-center text-white active:scale-90 hover:bg-black/60 transition-all backdrop-blur-md cursor-pointer"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-white/70" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-amber-400" />
                  )}
                </button>
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* 2. RIGHT-SIDE ACTION BUTTONS */}
              <div className="absolute right-3 bottom-20 z-30 flex flex-col items-center gap-4">
                {/* Astrologer Avatar + Plus */}
                <div className="relative group">
                  <button
                    onClick={() => handleAstroChatClick({
                      id: reel.id,
                      name: reel.astrologerName,
                      title: reel.astrologerTitle,
                      image: reel.astrologerAvatar,
                      specialty: reel.astrologerSpecialty,
                      experience: reel.astrologerExp,
                    })}
                    className="w-12 h-12 rounded-full p-0.5 border-2 border-amber-400 overflow-hidden shadow-lg hover:scale-105 active:scale-95 transition-all bg-espresso cursor-pointer"
                  >
                    <Image
                      src={reel.astrologerAvatar}
                      alt={reel.astrologerName}
                      width={48}
                      height={48}
                      unoptimized
                      className="object-cover w-full h-full rounded-full"
                    />
                  </button>
                  <button
                    onClick={() => handleAstroChatClick({
                      id: reel.id,
                      name: reel.astrologerName,
                      title: reel.astrologerTitle,
                      image: reel.astrologerAvatar,
                      specialty: reel.astrologerSpecialty,
                      experience: reel.astrologerExp,
                    })}
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-terracotta text-white font-bold flex items-center justify-center text-[10px] shadow-md border border-white cursor-pointer"
                    title="Chat with Astrologer"
                  >
                    +
                  </button>
                </div>

                {/* Like Button */}
                <button
                  onClick={() => handleLikeWithAuth(reel.id)}
                  className="flex flex-col items-center gap-1 active:scale-80 transition-transform cursor-pointer"
                >
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border ${
                    isLiked 
                      ? "bg-rose-500/20 border-rose-500 text-rose-500" 
                      : "bg-black/40 border-white/20 text-white hover:bg-black/60"
                  }`}>
                    <Heart className={`w-6 h-6 transition-all ${isLiked ? "fill-rose-500 text-rose-500 scale-110" : ""}`} />
                  </div>
                  <span className="text-[11px] font-bold text-white drop-shadow-md">
                    {likeCount.toLocaleString()}
                  </span>
                </button>

                {/* Comments Button */}
                <button
                  onClick={handleCommentsDrawerOpen}
                  className="flex flex-col items-center gap-1 active:scale-80 transition-transform cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-full bg-black/40 border border-white/20 flex items-center justify-center backdrop-blur-md text-white hover:bg-black/60">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-white drop-shadow-md">
                    {reel.commentsCount}
                  </span>
                </button>

                {/* Share Button */}
                <button
                  onClick={() => handleShare(reel)}
                  className="flex flex-col items-center gap-1 active:scale-80 transition-transform cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-full bg-black/40 border border-white/20 flex items-center justify-center backdrop-blur-md text-white hover:bg-black/60">
                    <Share2 className="w-5 h-5 -rotate-12" />
                  </div>
                  <span className="text-[11px] font-bold text-white drop-shadow-md">
                    {reel.sharesCount}
                  </span>
                </button>

                {/* Bookmark Button */}
                <button
                  onClick={() => handleSaveToggle(reel.id)}
                  className="flex flex-col items-center gap-1 active:scale-80 transition-transform cursor-pointer"
                >
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border ${
                    isSaved ? "bg-amber-400/20 border-amber-400 text-amber-400" : "bg-black/40 border-white/20 text-white"
                  }`}>
                    <Bookmark className={`w-5 h-5 ${isSaved ? "fill-amber-400" : ""}`} />
                  </div>
                </button>

                {/* Music Disc */}
                <div className={`relative w-10 h-10 rounded-full border-2 border-amber-300/70 p-1 bg-black/70 overflow-hidden shadow-lg ${
                  isActive && isPlaying ? "animate-spin" : ""
                }`}>
                  <div className="w-full h-full rounded-full bg-gradient-to-tr from-terracotta to-amber-500 flex items-center justify-center text-white">
                    <Music2 className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              {/* 3. BOTTOM CAPTION & ASTROLOGER DETAILS */}
              <div className="relative z-20 p-4 pb-4 pr-16 bg-gradient-to-t from-black/95 via-black/70 to-transparent">
                {reel.seriesName && (
                  <div className="mb-2">
                    <button
                      type="button"
                      onClick={() => setShowSeriesDrawer(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 hover:bg-black/80 border border-amber-400/40 text-amber-300 text-xs font-semibold backdrop-blur-md shadow-md active:scale-95 transition-all cursor-pointer"
                    >
                      <Film className="w-3.5 h-3.5 text-amber-400" />
                      <span>Series: {reel.seriesName} {reel.seriesPart ? `• Part ${reel.seriesPart}` : ""}</span>
                      <span className="text-[10px] text-amber-200/80 bg-white/10 px-1.5 py-0.5 rounded-full ml-0.5">▼ Episodes</span>
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-sm text-white flex items-center gap-1 drop-shadow-md">
                    {reel.astrologerName}
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 fill-sky-400 inline" />
                  </span>

                  <button
                    onClick={() => handleAstroChatClick({
                      id: reel.id,
                      name: reel.astrologerName,
                      title: reel.astrologerTitle,
                      image: reel.astrologerAvatar,
                      specialty: reel.astrologerSpecialty,
                      experience: reel.astrologerExp,
                    })}
                    className="px-2.5 py-0.5 rounded-full bg-terracotta/90 hover:bg-terracotta border border-amber-300/40 text-[10px] font-bold tracking-wide uppercase shadow-sm transition-all active:scale-95 text-white cursor-pointer"
                  >
                    Ask Upay
                  </button>
                </div>

                <h2 className="text-sm font-semibold text-white/95 leading-snug drop-shadow-md mb-1.5">
                  {reel.title}
                </h2>

                <p className="text-xs text-white/80 leading-relaxed line-clamp-2 drop-shadow-sm mb-2">
                  {reel.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-2">
                  {reel.tags.map((t) => (
                    <span key={t} className="text-[11px] font-bold text-amber-300/90 hover:underline cursor-pointer">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-white/70 text-xs">
                  <div className="flex items-center gap-2">
                    <Music2 className="w-3.5 h-3.5 text-amber-400 animate-pulse flex-shrink-0" />
                    <div className="overflow-hidden whitespace-nowrap max-w-[200px]">
                      <span className="inline-block text-[11px] font-medium tracking-wide">
                        {reel.audioName}
                      </span>
                    </div>
                  </div>
                  {isActive && duration > 0 && (
                    <span className="text-[10px] font-mono text-white/60">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar for Active Reel */}
              {isActive && (
                <div className="relative z-30 w-full h-1 bg-white/20">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-amber-300 transition-[width] duration-100"
                    style={{
                      width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                    }}
                  />
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Desktop Up/Down Navigation Helpers */}
      <div className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 flex-col gap-3 z-40">
        <button
          onClick={() => scrollToReel(currentIndex - 1)}
          disabled={currentIndex === 0}
          className={`w-12 h-12 rounded-full border border-white/20 flex items-center justify-center transition-all ${
            currentIndex === 0 ? "opacity-30 cursor-not-allowed bg-black/40" : "bg-black/70 hover:bg-terracotta text-white active:scale-95 shadow-xl cursor-pointer"
          }`}
          title="Previous Reel (Up Arrow)"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
        
        <button
          onClick={() => scrollToReel(currentIndex + 1)}
          disabled={currentIndex >= allReels.length - 1}
          className={`w-12 h-12 rounded-full border border-white/20 flex items-center justify-center transition-all ${
            currentIndex >= allReels.length - 1 ? "opacity-30 cursor-not-allowed bg-black/40" : "bg-black/70 hover:bg-terracotta text-white active:scale-95 shadow-xl cursor-pointer"
          }`}
          title="Next Reel (Down Arrow)"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>

      {/* Comments Drawer */}
      {showCommentsDrawer && activeReel && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-200">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md h-[65vh] bg-[#161616] border-t border-white/15 rounded-t-3xl flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300"
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10">
              <div className="w-6" />
              <h3 className="font-bold text-sm text-white">
                Comments ({activeReel.commentsCount})
              </h3>
              <button 
                onClick={() => setShowCommentsDrawer(false)}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeReel.comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-3 text-xs">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 flex-shrink-0 bg-espresso">
                    <Image
                      src={comment.userAvatar}
                      alt={comment.userName}
                      width={32}
                      height={32}
                      unoptimized
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{comment.userName}</span>
                      <span className="text-[10px] text-white/50">{comment.timeAgo}</span>
                    </div>
                    <p className="text-white/85 text-xs mt-0.5 leading-relaxed">
                      {comment.text}
                    </p>
                  </div>
                  <button className="text-white/40 hover:text-rose-500 pt-1">
                    <Heart className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="px-4 py-2 border-t border-white/10 flex items-center justify-between text-lg">
              {["🙏", "✨", "🕉️", "❤️", "🔥", "🪐"].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setNewCommentInput((prev) => prev + emoji)}
                  className="hover:scale-125 transition-transform cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>

            <form onSubmit={handlePostComment} className="p-3 border-t border-white/10 flex items-center gap-2 bg-[#1C1C1C]">
              <input
                type="text"
                value={newCommentInput}
                onChange={(e) => setNewCommentInput(e.target.value)}
                placeholder="Add a comment for Acharya Ji..."
                className="flex-1 bg-white/10 border border-white/15 rounded-full px-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                disabled={!newCommentInput.trim()}
                className="w-8 h-8 rounded-full bg-terracotta text-white flex items-center justify-center disabled:opacity-40 active:scale-95 shadow-md flex-shrink-0 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 translate-x-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Series Episodes Playlist Drawer */}
      {showSeriesDrawer && activeReel && activeReel.seriesName && (
        <div 
          onClick={() => setShowSeriesDrawer(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-end sm:items-center justify-center animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#18181B] border border-amber-400/30 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[75vh] flex flex-col animate-in slide-in-from-bottom-6 duration-300"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">📂</span>
                <div>
                  <h3 className="font-serif font-bold text-sm text-amber-300">
                    {activeReel.seriesName}
                  </h3>
                  <p className="text-[10px] text-white/60">
                    Series Playlist • {allReels.filter((r) => r.seriesName === activeReel.seriesName).length} Episodes
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSeriesDrawer(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-2.5 flex-1 pr-1">
              {allReels
                .filter((r) => r.seriesName === activeReel.seriesName)
                .map((ep, epIdx) => {
                  const isCurrent = ep.id === activeReel.id;
                  return (
                    <button
                      key={ep.id}
                      type="button"
                      onClick={() => {
                        const targetIdx = allReels.findIndex((r) => r.id === ep.id);
                        if (targetIdx !== -1) {
                          scrollToReel(targetIdx);
                        }
                        setShowSeriesDrawer(false);
                      }}
                      className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer ${
                        isCurrent
                          ? "bg-terracotta/30 border-amber-400 text-white"
                          : "bg-white/5 border-white/10 hover:bg-white/10 text-white/90"
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                        isCurrent ? "bg-amber-400 text-black font-extrabold" : "bg-white/10 text-white"
                      }`}>
                        {ep.seriesPart ? `P${ep.seriesPart}` : `${epIdx + 1}`}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold line-clamp-1">{ep.title}</h4>
                        <p className="text-[10px] text-white/60 line-clamp-1">{ep.astrologerName} • {ep.tags.join(" ")}</p>
                      </div>
                      {isCurrent ? (
                        <span className="text-[10px] font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full flex-shrink-0">
                          Playing
                        </span>
                      ) : (
                        <Play className="w-4 h-4 text-white/50 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Astro Consultation Chat Modal */}
      {selectedAstroForChat && (
        <AstroChatModal
          astrologer={selectedAstroForChat}
          onClose={() => setSelectedAstroForChat(null)}
        />
      )}

      {/* Action-Gated Login & Sign Up Modal */}
      <AuthGateModal
        isOpen={showAuthGate}
        featureName={authFeatureName}
        onClose={handleCloseAuth}
        onSuccess={handleAuthSuccess}
      />

    </div>
  );
}
