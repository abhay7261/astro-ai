"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { usersApi } from "../../services/apiClient";

interface AuthGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  featureName?: string;
}

export default function AuthGateModal({
  isOpen,
  onClose,
  onSuccess,
  featureName,
}: AuthGateModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (activeTab === "signup" && !name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }

    if (!email.trim() || !isValidEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const displayName = activeTab === "signup" ? (name.trim() || "Seeker") : cleanEmail.split("@")[0].replace(".", " ");

    // 1. LOGIN TAB — STRICT VALIDATION (DO NOT auto-create user!)
    if (activeTab === "login") {
      try {
        const result = await usersApi.login(cleanEmail, password);
        setIsLoading(false);

        // Account found & login successful
        if (result && result.success && result.user) {
          completeAuth(result.user, result.token);
          return;
        }

        // Backend explicitly returned USER_NOT_FOUND
        if (result && (result.code === "USER_NOT_FOUND" || result.message?.toLowerCase().includes("not found") || result.message?.includes("nahi mila"))) {
          setErrorMessage("No account found with this email. Please Sign Up first.");
          return;
        }

        if (result && result.code === "INVALID_PASSWORD") {
          setErrorMessage("Incorrect password. Please try again.");
          return;
        }

        // Check local registered accounts
        const localAccountsStr = localStorage.getItem("astroai_registered_users");
        const localAccounts: any[] = localAccountsStr ? JSON.parse(localAccountsStr) : [];
        const localFound = localAccounts.find((u) => u.email.toLowerCase() === cleanEmail);

        if (!localFound) {
          // Strictly reject! Account does not exist!
          setErrorMessage("No account found with this email. Please Sign Up first.");
          return;
        }

        if (localFound.password && localFound.password !== password) {
          setErrorMessage("Incorrect password. Please try again.");
          return;
        }

        // Local known user
        const token = `astro_session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        completeAuth(
          {
            id: `u-${Date.now()}`,
            name: localFound.name || displayName,
            email: cleanEmail,
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
            isVIP: false,
          },
          token
        );
      } catch {
        setIsLoading(false);
        setErrorMessage("No account found with this email. Please click Sign Up first.");
      }
    } else {
      // 2. SIGN UP TAB — Check duplicate & create account
      try {
        const localAccountsStr = localStorage.getItem("astroai_registered_users");
        const localAccounts: any[] = localAccountsStr ? JSON.parse(localAccountsStr) : [];

        if (localAccounts.some((u) => u.email.toLowerCase() === cleanEmail)) {
          setIsLoading(false);
          setErrorMessage("Account already exists with this email. Please Login instead.");
          return;
        }

        const result = await usersApi.signup(displayName, cleanEmail, password);
        setIsLoading(false);

        if (result && (result.code === "USER_ALREADY_EXISTS" || result.message?.includes("already exists"))) {
          setErrorMessage("Account already exists with this email. Please Login instead.");
          return;
        }

        // Record account locally
        localAccounts.push({ email: cleanEmail, name: displayName, password });
        localStorage.setItem("astroai_registered_users", JSON.stringify(localAccounts));

        if (result && result.success && result.user) {
          completeAuth(result.user, result.token);
        } else {
          const token = `astro_session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
          completeAuth(
            {
              id: `u-${Date.now()}`,
              name: displayName,
              email: cleanEmail,
              avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
              isVIP: false,
            },
            token
          );
        }
      } catch {
        setIsLoading(false);
        const localAccountsStr = localStorage.getItem("astroai_registered_users");
        const localAccounts: any[] = localAccountsStr ? JSON.parse(localAccountsStr) : [];
        localAccounts.push({ email: cleanEmail, name: displayName, password });
        localStorage.setItem("astroai_registered_users", JSON.stringify(localAccounts));

        const token = `astro_session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        completeAuth(
          {
            id: `u-${Date.now()}`,
            name: displayName,
            email: cleanEmail,
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
            isVIP: false,
          },
          token
        );
      }
    }
  };

  const completeAuth = (user: any, token?: string) => {
    const sessionToken = token || `astro_session_${Date.now()}`;
    const normalizedUser = {
      id: user.userId || user.id || user._id || `u-${Date.now()}`,
      name: user.name,
      email: user.email,
      avatar: user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
      isVip: user.isVIP || user.isVip || false,
    };

    try {
      sessionStorage.setItem("astroai_session_token", sessionToken);
      sessionStorage.setItem("astroai_session_user", JSON.stringify(normalizedUser));
      localStorage.setItem("astroai_auth_user", JSON.stringify(normalizedUser));
    } catch {}

    window.dispatchEvent(new Event("astroai_user_updated"));
    onSuccess();
    onClose();
  };

  const handleQuickDemo = async () => {
    setIsLoading(true);
    try {
      const res = await usersApi.login("demo@astroai.com", "Demo User");
      setIsLoading(false);
      if (res && res.success && res.user) {
        completeAuth(res.user, res.token);
        return;
      }
    } catch {}
    setIsLoading(false);
    completeAuth(
      {
        id: "demo_user_1",
        name: "Demo User",
        email: "demo@astroai.com",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
        isVIP: true,
      },
      "astro_session_demo"
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] w-full max-w-sm sm:max-w-md rounded-3xl p-6 sm:p-7 border-2 border-amber-300/80 shadow-2xl relative text-espresso overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white border border-peach flex items-center justify-center text-espresso/70 hover:text-espresso transition-all shadow-xs"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400/70 shadow-md bg-espresso flex items-center justify-center mb-2">
            <Image
              src="/logo.png"
              alt="AstroAI Logo"
              width={48}
              height={48}
              unoptimized
              priority
              className="object-cover w-full h-full scale-125"
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-espresso tracking-tight">
            Welcome to Astro<span className="text-terracotta">AI</span>
          </h2>
          <p className="text-xs text-espresso/70 mt-0.5 max-w-xs">
            {featureName ? `Please Login or Sign Up to access ${featureName}.` : "Login or create an account to unlock all features."}
          </p>
        </div>

        {/* Segmented Tab Switcher */}
        <div className="flex bg-white/70 p-1 rounded-2xl border border-peach/80 mb-4 shadow-inner">
          <button
            type="button"
            onClick={() => {
              setActiveTab("login");
              setErrorMessage("");
            }}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "login"
                ? "bg-terracotta text-white shadow-sm"
                : "text-espresso/70 hover:text-espresso"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("signup");
              setErrorMessage("");
            }}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "signup"
                ? "bg-terracotta text-white shadow-sm"
                : "text-espresso/70 hover:text-espresso"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {activeTab === "signup" && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-espresso/70 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso/40" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full h-10.5 pl-10 pr-4 rounded-xl border border-peach bg-white text-espresso text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30 transition-all placeholder:text-espresso/35"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-espresso/70 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                autoComplete="email"
                className="w-full h-10.5 pl-10 pr-4 rounded-xl border border-peach bg-white text-espresso text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30 transition-all placeholder:text-espresso/35"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-espresso/70 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso/40" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full h-10.5 pl-10 pr-10 rounded-xl border border-peach bg-white text-espresso text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30 transition-all placeholder:text-espresso/35"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-espresso/40 hover:text-espresso"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11.5 mt-2 rounded-2xl bg-gradient-to-r from-terracotta to-amber-600 hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{activeTab === "login" ? "Login" : "Sign Up"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* 1-Tap Demo Login Button */}
        <div className="mt-3.5 pt-3 border-t border-peach/70 text-center">
          <button
            type="button"
            onClick={handleQuickDemo}
            className="text-xs text-espresso/70 hover:text-terracotta inline-flex items-center gap-1 font-bold transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Instant Demo Login (1-Tap)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
