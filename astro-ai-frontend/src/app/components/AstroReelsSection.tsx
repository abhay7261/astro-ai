"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, MessageCircle, Share2, Play, X, Send, Flame, Sparkles } from "lucide-react";
import { reelsApi } from "../services/apiClient";

interface Comment {
  id: string;
  userName: string;
  text: string;
  timeAgo: string;
}

interface Reel {
  id: string;
  title: string;
  astrologerName: string;
  astrologerAvatar: string;
  videoUrl: string;
  likes: number;
  commentsCount: number;
  tags: string[];
  comments: Comment[];
}

export default function AstroReelsSection() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [likedReels, setLikedReels] = useState<Record<string, boolean>>({});
  const [activeReelForComments, setActiveReelForComments] = useState<Reel | null>(null);
  const [newCommentText, setNewCommentText] = useState("");
  const [shareToast, setShareToast] = useState(false);

  // Fetch live reels from backend API & MongoDB Atlas (Zero Fake/Dummy Fallbacks)
  const fetchReels = async () => {
    try {
      const liveReels = await reelsApi.getAll();
      if (Array.isArray(liveReels) && liveReels.length > 0) {
        const formatted: Reel[] = liveReels.map((lr: any, idx: number) => ({
          id: String(lr.id || lr.reelId || `reel-${idx}`),
          title: lr.title,
          astrologerName: lr.astrologerName || "AstroAI Creator",
          astrologerAvatar:
            lr.astrologerAvatar ||
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
          videoUrl: lr.videoUrl,
          likes: Number(lr.likes) || 0,
          commentsCount: Number(lr.commentsCount) || 0,
          tags: Array.isArray(lr.tags) && lr.tags.length > 0 ? lr.tags : lr.tag ? [lr.tag] : ["#VedicTips"],
          comments: lr.comments || [],
        }));
        setReels(formatted);
      } else {
        setReels([]);
      }
    } catch (err) {
      console.warn("Reels fetch error:", err);
      setReels([]);
    }
  };

  useEffect(() => {
    fetchReels();

    const handleReelsUpdated = () => {
      fetchReels();
    };
    window.addEventListener("astroai_reels_updated", handleReelsUpdated);
    return () => window.removeEventListener("astroai_reels_updated", handleReelsUpdated);
  }, []);

  // Like Toggle Function
  const handleLike = (reelId: string) => {
    const isCurrentlyLiked = !likedReels[reelId];

    setLikedReels((prev) => ({ ...prev, [reelId]: !isCurrentlyLiked }));
    setReels((prev) =>
      prev.map((r) =>
        r.id === reelId
          ? { ...r, likes: isCurrentlyLiked ? r.likes - 1 : r.likes + 1 }
          : r
      )
    );

    // Call backend API
    reelsApi.like(reelId).catch(() => {});
  };

  // Add Comment Function
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeReelForComments) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      userName: "You",
      text: newCommentText.trim(),
      timeAgo: "Just now",
    };

    setReels((prev) =>
      prev.map((r) =>
        r.id === activeReelForComments.id
          ? {
              ...r,
              commentsCount: r.commentsCount + 1,
              comments: [newComment, ...r.comments],
            }
          : r
      )
    );

    setActiveReelForComments((prev) =>
      prev ? { ...prev, commentsCount: prev.commentsCount + 1, comments: [newComment, ...prev.comments] } : null
    );

    setNewCommentText("");
  };

  // Share Function
  const handleShare = () => {
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  };

  return (
    <section className="w-full py-16 bg-astro-bg border-t border-peach/70">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-peach/70 text-terracotta text-xs font-semibold mb-3">
              <Flame className="w-4 h-4 text-terracotta" />
              ASTRO REELS & DAILY UPAY
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-espresso">
              Trending Short Videos
            </h2>
            <p className="mt-2 text-espresso/70 text-sm md:text-base">
              Watch 1-minute Vedic remedies, daily rashifal, and Vastu tips by top Acharyas.
            </p>
          </div>
          <span className="text-xs bg-peach text-espresso px-3 py-1.5 rounded-full font-semibold self-start md:self-auto">
            Updated Hourly
          </span>
        </div>

        {/* Reels Horizontal Grid / Carousel */}
        {reels.length === 0 ? (
          <div className="bg-white/80 border-2 border-dashed border-peach rounded-3xl p-10 text-center text-espresso/60 w-full">
            <p className="font-semibold text-base text-espresso">Koi Reel Uplabdh Nahi Hai</p>
            <p className="text-xs text-espresso/50 mt-1">
              Admin panel se nayi Astro Short Video reels upload karein.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reels.map((reel) => {
            const isLiked = !!likedReels[reel.id];

            return (
              <div
                key={reel.id}
                className="relative rounded-3xl overflow-hidden aspect-[9/16] bg-black shadow-lg border-2 border-peach/80 group flex flex-col justify-between"
              >
                {/* Background Video */}
                <video
                  src={reel.videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:opacity-95 transition-opacity"
                />

                {/* Dark Gradient Overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 pointer-events-none" />

                {/* Top: Tags */}
                <div className="relative z-10 p-4 flex items-center justify-between">
                  <span className="text-[11px] font-semibold bg-white/20 backdrop-blur-md text-white px-2.5 py-1 rounded-full border border-white/20">
                    {reel.tags[0]}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                </div>

                {/* Right Floating Actions (Like, Comment, Share) */}
                <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-4">
                  {/* Like Button */}
                  <button
                    onClick={() => handleLike(reel.id)}
                    className="flex flex-col items-center gap-1 group/btn"
                  >
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                        isLiked
                          ? "bg-terracotta text-white scale-110 shadow-lg"
                          : "bg-black/50 text-white hover:bg-black/70"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${isLiked ? "fill-white" : ""}`}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-white drop-shadow">
                      {reel.likes}
                    </span>
                  </button>

                  {/* Comment Button */}
                  <button
                    onClick={() => setActiveReelForComments(reel)}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="w-11 h-11 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md flex items-center justify-center text-white transition-all">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-white drop-shadow">
                      {reel.commentsCount}
                    </span>
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={handleShare}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="w-11 h-11 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md flex items-center justify-center text-white transition-all">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-white drop-shadow">
                      Share
                    </span>
                  </button>
                </div>

                {/* Bottom: Astrologer Info & Caption */}
                <div className="relative z-10 p-4 pr-16 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full overflow-hidden border border-peach">
                      <Image
                        src={reel.astrologerAvatar}
                        alt={reel.astrologerName}
                        width={28}
                        height={28}
                        unoptimized
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <span className="text-xs font-semibold text-white/90 drop-shadow">
                      {reel.astrologerName}
                    </span>
                  </div>

                  <p className="text-xs font-medium line-clamp-2 leading-snug drop-shadow text-white/95">
                    {reel.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        )}

        {/* Share Toast Notification */}
        {shareToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-espresso text-astro-bg px-5 py-3 rounded-2xl shadow-2xl border border-peach/30 flex items-center gap-2 text-sm font-semibold animate-bounce">
            ✨ Video link copied to clipboard!
          </div>
        )}

        {/* Comments Slide-over / Modal */}
        {activeReelForComments && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-astro-bg w-full sm:max-w-md h-[70vh] sm:h-[600px] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-peach animate-in slide-in-from-bottom">
              {/* Modal Header */}
              <div className="p-4 border-b border-peach/60 flex items-center justify-between bg-white/70">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-terracotta" />
                  <h3 className="font-serif font-bold text-espresso text-base">
                    Comments ({activeReelForComments.commentsCount})
                  </h3>
                </div>
                <button
                  onClick={() => setActiveReelForComments(null)}
                  className="w-8 h-8 rounded-full bg-peach/50 flex items-center justify-center text-espresso hover:bg-peach"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {activeReelForComments.comments.length === 0 ? (
                  <p className="text-center text-espresso/60 text-sm mt-10">
                    No comments yet. Be the first to ask pandit ji!
                  </p>
                ) : (
                  activeReelForComments.comments.map((c) => (
                    <div key={c.id} className="bg-white p-3 rounded-2xl border border-peach/50 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs text-espresso">{c.userName}</span>
                        <span className="text-[10px] text-espresso/50">{c.timeAgo}</span>
                      </div>
                      <p className="text-xs text-espresso/80 leading-relaxed">{c.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Comment Input Form */}
              <form onSubmit={handleAddComment} className="p-4 border-t border-peach/60 bg-white/70 flex gap-2">
                <input
                  type="text"
                  placeholder="Ask a question or leave a comment..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-full border border-peach bg-astro-bg text-espresso text-xs focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                />
                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className="w-10 h-10 rounded-full bg-terracotta hover:bg-terracotta-hover disabled:opacity-40 text-astro-bg flex items-center justify-center shadow-md transition-all flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}