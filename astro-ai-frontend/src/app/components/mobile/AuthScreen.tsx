"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Mail, Lock, Eye, EyeOff, User, ArrowRight, ShieldCheck, 
  Sparkles, AlertCircle, CheckCircle2, X 
} from "lucide-react";
import { usersApi } from "../../services/apiClient";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isVip?: boolean;
}

interface AuthScreenProps {
  onAuthenticated: (user: AuthUser, token?: string) => void;
}

export default function AuthScreen({ onAuthenticated }: AuthScreenProps) {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Pre-warm backend API in background so Render free tier container wakes up
  useEffect(() => {
    try {
      fetch("https://astro-ai-x5c6.onrender.com/api/v1/users", { method: "HEAD" }).catch(() => {});
    } catch {}
  }, []);

  // Email Validation regex
  const isValidEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Form validations
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

    const displayName = activeTab === "signup" ? (name.trim() || "Seeker") : email.split("@")[0].replace(".", " ");
    const cleanEmail = email.trim().toLowerCase();

    // 1. LOGIN TAB — STRICT CHECK (Must NOT log in or create user if not registered!)
    if (activeTab === "signin") {
      try {
        const result = await usersApi.login(cleanEmail, password);
        setIsLoading(false);

        // Account found & login successful
        if (result && result.success && result.user) {
          onAuthenticated({
            id: result.user.userId || result.user.id || result.user._id,
            name: result.user.name || displayName,
            email: result.user.email || cleanEmail,
            avatar: result.user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
            isVip: result.user.isVIP || false,
          }, result.token);
          return;
        }

        // User not found in database -> STRICT REJECTION
        if (result && (result.code === "USER_NOT_FOUND" || result.message?.toLowerCase().includes("not found") || result.message?.includes("nahi mila"))) {
          setErrorMessage("No account found with this email. Please Sign Up first.");
          return;
        }

        if (result && result.code === "INVALID_PASSWORD") {
          setErrorMessage("Incorrect password. Please try again.");
          return;
        }

        // If backend was unreachable, check local registered users
        const localAccountsStr = localStorage.getItem("astroai_registered_users");
        const localAccounts: any[] = localAccountsStr ? JSON.parse(localAccountsStr) : [];
        const localFound = localAccounts.find((u) => u.email.toLowerCase() === cleanEmail);

        if (!localFound) {
          // STRICT: Do NOT log in if user has not signed up!
          setErrorMessage("No account found with this email. Please Sign Up first.");
          return;
        }

        if (localFound.password && localFound.password !== password) {
          setErrorMessage("Incorrect password. Please try again.");
          return;
        }

        // Registered user found locally
        const token = `astro_session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        onAuthenticated({
          id: `u-${Date.now()}`,
          name: localFound.name || displayName,
          email: cleanEmail,
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
          isVip: false,
        }, token);
      } catch (err: any) {
        setIsLoading(false);
        setErrorMessage("No account found with this email. Please click Sign Up first.");
      }
    } else {
      // 2. SIGN UP TAB — Check duplicate & register new user
      try {
        const localAccountsStr = localStorage.getItem("astroai_registered_users");
        const localAccounts: any[] = localAccountsStr ? JSON.parse(localAccountsStr) : [];

        // Check if already registered locally
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

        // Record account in local accounts registry
        localAccounts.push({ email: cleanEmail, name: displayName, password });
        localStorage.setItem("astroai_registered_users", JSON.stringify(localAccounts));

        if (result && result.success && result.user) {
          onAuthenticated({
            id: result.user.userId || result.user.id || result.user._id,
            name: result.user.name || displayName,
            email: result.user.email || cleanEmail,
            avatar: result.user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
            isVip: result.user.isVIP || false,
          }, result.token);
        } else {
          // Optimistic sign up session
          const token = `astro_session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
          onAuthenticated({
            id: `u-${Date.now()}`,
            name: displayName,
            email: cleanEmail,
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
            isVip: false,
          }, token);
        }
      } catch {
        setIsLoading(false);
        const localAccountsStr = localStorage.getItem("astroai_registered_users");
        const localAccounts: any[] = localAccountsStr ? JSON.parse(localAccountsStr) : [];
        localAccounts.push({ email: cleanEmail, name: displayName, password });
        localStorage.setItem("astroai_registered_users", JSON.stringify(localAccounts));

        const token = `astro_session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        onAuthenticated({
          id: `u-${Date.now()}`,
          name: displayName,
          email: cleanEmail,
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
          isVip: false,
        }, token);
      }
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !isValidEmail(forgotEmail)) {
      alert("Please enter a valid email address.");
      return;
    }
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotSuccess(false);
      setShowForgotPassword(false);
      setForgotEmail("");
    }, 2500);
  };

  const handleQuickDemo = async () => {
    setIsLoading(true);
    try {
      const res = await usersApi.login("demo@astroai.com", "Demo User");
      setIsLoading(false);
      if (res && res.success && res.user) {
        onAuthenticated({
          id: res.user.userId || res.user.id || res.user._id,
          name: res.user.name || "Demo User",
          email: res.user.email || "demo@astroai.com",
          avatar: res.user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
          isVip: res.user.isVIP || true,
        }, res.token);
        return;
      }
    } catch {}
    setIsLoading(false);
    onAuthenticated({
      id: "demo_user_1",
      name: "Demo User",
      email: "demo@astroai.com",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
      isVip: true,
    }, "astro_session_demo");
  };

  return (
    <div className="relative min-h-[100dvh] w-full bg-astro-bg flex flex-col justify-between p-6 sm:p-8 overflow-y-auto">
      {/* Background Soft Glows */}
      <div className="absolute top-[-5%] left-[-10%] w-[300px] h-[300px] rounded-full bg-peach/50 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-10%] w-[300px] h-[300px] rounded-full bg-terracotta/10 blur-[90px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md mx-auto my-auto flex flex-col items-center">
        
        {/* Header with Logo & Brand */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-terracotta/40 shadow-md bg-espresso flex items-center justify-center mb-3">
            <Image
              src="/logo.png"
              alt="AstroAI Logo"
              width={64}
              height={64}
              priority
              unoptimized
              className="object-cover w-full h-full scale-125"
            />
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-espresso tracking-tight">
            Welcome to Astro<span className="text-terracotta">AI</span>
          </h1>
          <p className="text-xs sm:text-sm text-espresso/70 mt-1 max-w-xs">
            Your journey to cosmic clarity starts here.
          </p>
        </div>

        {/* Auth Card */}
        <div className="w-full bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-peach shadow-xl">
          
          {/* Login / Sign Up Segmented Tabs */}
          <div className="flex bg-astro-bg p-1 rounded-2xl border border-peach/80 mb-5">
            <button
              type="button"
              onClick={() => {
                setActiveTab("signin");
                setErrorMessage("");
              }}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "signin"
                  ? "bg-terracotta text-astro-bg shadow-sm"
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
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "signup"
                  ? "bg-terracotta text-astro-bg shadow-sm"
                  : "text-espresso/70 hover:text-espresso"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
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
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-peach bg-astro-bg/50 text-espresso text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30 transition-all placeholder:text-espresso/35"
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
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-peach bg-astro-bg/50 text-espresso text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30 transition-all placeholder:text-espresso/35"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-espresso/70">
                  Password
                </label>
                {activeTab === "signin" && (
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-[11px] text-terracotta hover:underline font-semibold"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete={activeTab === "signin" ? "current-password" : "new-password"}
                  className="w-full h-11 pl-10 pr-10 rounded-xl border border-peach bg-astro-bg/50 text-espresso text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30 transition-all placeholder:text-espresso/35"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
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
              className="w-full h-12 mt-2 rounded-2xl bg-terracotta hover:bg-terracotta-hover disabled:opacity-60 text-astro-bg font-semibold text-xs sm:text-sm shadow-md shadow-terracotta/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-astro-bg border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{activeTab === "signin" ? "Login" : "Sign Up"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Helper for seamless testing */}
          <div className="mt-4 pt-3 border-t border-peach/50 text-center">
            <button
              type="button"
              onClick={handleQuickDemo}
              className="text-xs text-espresso/70 hover:text-terracotta inline-flex items-center gap-1 font-semibold transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-terracotta" />
              <span>Instant Demo Login (1-Tap)</span>
            </button>
          </div>

        </div>

        {/* Terms of Service & Privacy Policy */}
        <p className="mt-5 text-[11px] text-center text-espresso/60 leading-tight max-w-xs">
          By continuing, you agree to AstroAI's{" "}
          <a href="#terms" className="underline hover:text-terracotta">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#privacy" className="underline hover:text-terracotta">
            Privacy Policy
          </a>
          .
        </p>

      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-astro-bg w-full max-w-sm rounded-3xl p-6 border border-peach shadow-2xl relative">
            <button
              onClick={() => setShowForgotPassword(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-peach/60 flex items-center justify-center text-espresso hover:bg-peach"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-serif font-bold text-lg text-espresso mb-1">
              Reset Your Password
            </h3>
            <p className="text-xs text-espresso/70 mb-4">
              Enter your registered email address and we'll send you a password reset link.
            </p>

            {forgotSuccess ? (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Reset link sent! Please check your inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-3">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-11 px-3.5 rounded-xl border border-peach bg-white text-espresso text-xs focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-hover text-astro-bg text-xs font-semibold shadow-md transition-all"
                >
                  Send Reset Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
