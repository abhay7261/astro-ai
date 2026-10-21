"use client";

import { useState } from "react";
import { X, Sparkles, Shield, CheckCircle2 } from "lucide-react";
import { usersApi } from "../services/apiClient";

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  isVip: boolean;
  savedKundlisCount: number;
}

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export default function AuthModal({ onClose, onLoginSuccess }: AuthModalProps) {
  const [loading, setLoading] = useState(false);

  const handleQuickLogin = async () => {
    setLoading(true);

    try {
      const res = await usersApi.login("seeker@astroai.com", "Seeker User");
      setLoading(false);
      const user = res?.user;
      onLoginSuccess({
        name: user?.name || "Seeker User",
        email: user?.email || "seeker@astroai.com",
        avatar: user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
        isVip: user?.isVIP ?? true,
        savedKundlisCount: 2,
      });
      onClose();
    } catch {
      setLoading(false);
      onLoginSuccess({
        name: "Seeker User",
        email: "seeker@astroai.com",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
        isVip: true,
        savedKundlisCount: 2,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-astro-bg w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-peach relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-peach/60 flex items-center justify-center text-espresso hover:bg-peach transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-terracotta text-astro-bg flex items-center justify-center font-bold text-2xl shadow-md mx-auto mb-3">
            ✨
          </div>
          <h3 className="font-serif font-bold text-2xl text-espresso">
            Welcome to Astro<span className="text-terracotta">AI</span>
          </h3>
          <p className="text-xs text-espresso/70 mt-1">
            Sign in to unlock personalized predictions & save your Kundli
          </p>
        </div>

        {/* Benefits List */}
        <div className="bg-white/70 p-4 rounded-2xl border border-peach/80 mb-6 space-y-2.5 text-xs text-espresso/80">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Save multiple family Kundlis in one account</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>24/7 Chat History with verified Astrologers</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Manage your ₹299/mo VIP Pass & PDF reports</span>
          </div>
        </div>

        {/* Quick Sign In Button */}
        <button
          onClick={handleQuickLogin}
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-2xl bg-terracotta hover:bg-terracotta-hover text-white shadow-md flex items-center justify-center gap-3 text-sm font-semibold transition-all active:scale-[0.99]"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
          <span>{loading ? "Signing in..." : "Continue to AstroAI"}</span>
        </button>

        {/* Security Footer */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-espresso/50">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>100% Safe & Secure. We respect your privacy.</span>
        </div>

      </div>
    </div>
  );
}
