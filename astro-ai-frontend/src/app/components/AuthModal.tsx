"use client";

import { useState } from "react";
import { X, Sparkles, Shield, CheckCircle2 } from "lucide-react";

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

  const handleGoogleLogin = () => {
    setLoading(true);

    // Simulate Google Sign In
    setTimeout(() => {
      const mockUser: UserProfile = {
        name: "Rahul Verma",
        email: "rahul.verma@gmail.com",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
        isVip: true,
        savedKundlisCount: 2,
      };
      onLoginSuccess(mockUser);
      setLoading(false);
      onClose();
    }, 1200);
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

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-zinc-50 border-2 border-peach shadow-md flex items-center justify-center gap-3 text-sm font-semibold text-espresso transition-all hover:border-terracotta/40 group active:scale-[0.99]"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-terracotta border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
          )}
          <span>{loading ? "Signing in with Google..." : "Continue with Google"}</span>
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