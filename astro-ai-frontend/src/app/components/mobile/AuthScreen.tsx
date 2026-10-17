"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Mail, Lock, Eye, EyeOff, User, ArrowRight, ShieldCheck, 
  Sparkles, AlertCircle, CheckCircle2, X 
} from "lucide-react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isVip?: boolean;
}

interface AuthScreenProps {
  onAuthenticated: (user: AuthUser) => void;
}

export default function AuthScreen({ onAuthenticated }: AuthScreenProps) {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showGoogleNotice, setShowGoogleNotice] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Email Validation regex
  const isValidEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Form validations
    if (activeTab === "signup" && !name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!email.trim() || !isValidEmail(email)) {
      setErrorMessage("Please enter a valid email address (e.g. name@example.com).");
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    // Simulate clean authentication response
    setTimeout(() => {
      setIsLoading(false);

      const authenticatedUser: AuthUser = {
        id: `user_${Date.now()}`,
        name: activeTab === "signup" ? name.trim() : email.split("@")[0].replace(".", " "),
        email: email.trim().toLowerCase(),
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
        isVip: false,
      };

      onAuthenticated(authenticatedUser);
    }, 1000);
  };

  const handleGoogleClick = () => {
    // Transparent notification about Google OAuth setup
    setShowGoogleNotice(true);
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

  const handleQuickDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onAuthenticated({
        id: "demo_user_1",
        name: "Rahul Verma",
        email: "rahul.verma@example.com",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
        isVip: true,
      });
    }, 600);
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
          
          {/* Sign In / Sign Up Segmented Tabs */}
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
              Sign In
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
              Create Account
            </button>
          </div>

          {/* Continue with Google Button */}
          <button
            type="button"
            onClick={handleGoogleClick}
            className="w-full h-12 rounded-2xl bg-white hover:bg-zinc-50 border-2 border-peach/80 shadow-sm flex items-center justify-center gap-3 text-xs sm:text-sm font-semibold text-espresso transition-all hover:border-terracotta/40 active:scale-[0.99]"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
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
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-peach/80" />
            <span className="px-3 text-[10px] uppercase font-bold tracking-wider text-espresso/40">
              or continue with email
            </span>
            <div className="flex-1 border-t border-peach/80" />
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
                  <span>{activeTab === "signin" ? "Sign In" : "Create Free Account"}</span>
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
              <span>Instant Test Login (1-Tap Demo)</span>
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

      {/* Google OAuth Configuration Notice Modal */}
      {showGoogleNotice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-astro-bg w-full max-w-sm rounded-3xl p-6 border border-peach shadow-2xl relative">
            <button
              onClick={() => setShowGoogleNotice(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-peach/60 flex items-center justify-center text-espresso hover:bg-peach"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-peach flex items-center justify-center text-terracotta mx-auto mb-3">
              <ShieldCheck className="w-6 h-6 text-terracotta" />
            </div>

            <h3 className="font-serif font-bold text-lg text-espresso text-center">
              Google OAuth Integration Ready
            </h3>
            
            <p className="text-xs text-espresso/75 mt-2 leading-relaxed text-center">
              To enable live production Google sign-in, add your Google OAuth Client ID into <code className="bg-white px-1.5 py-0.5 rounded border border-peach font-mono text-[10px]">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code>.
            </p>

            <div className="mt-4 p-3 rounded-2xl bg-white border border-peach/80 text-xs text-espresso/80">
              <span className="font-semibold text-terracotta block mb-1">Testing Option:</span>
              You can sign in immediately using the <strong>Email / Password</strong> form or the <strong>Instant Test Login</strong> button!
            </div>

            <button
              onClick={() => setShowGoogleNotice(false)}
              className="w-full mt-4 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-hover text-astro-bg text-xs font-semibold shadow-md transition-all"
            >
              Got it, continue with Email
            </button>
          </div>
        </div>
      )}

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
