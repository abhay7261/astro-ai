"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingScreen from "./OnboardingScreen";
import SplashScreen from "./SplashScreen";
import AuthScreen, { AuthUser } from "./AuthScreen";
import { RotateCcw, Smartphone } from "lucide-react";

export type ScreenState = "loading" | "onboarding" | "splash" | "auth";

export default function AstroMobileApp() {
  const router = useRouter();
  const [screen, setScreen] = useState<ScreenState>("loading");

  useEffect(() => {
    // Explicit Login Enforcement:
    // Opening the app must NOT automatically log the user in.
    // An active session is only preserved if explicitly authenticated in this tab's sessionStorage.
    try {
      const activeSession = sessionStorage.getItem("astroai_session_token");
      const isCompleted = localStorage.getItem("astroai_onboarding_completed") === "true";

      if (activeSession) {
        // Active explicit session within current browser session
        router.replace("/home");
      } else if (!isCompleted) {
        // First-time user onboarding
        setScreen("onboarding");
      } else {
        // Require explicit login every time app is opened/reopened
        setScreen("auth");
      }
    } catch {
      setScreen("auth");
    }
  }, [router]);

  // Onboarding completion handler
  const handleOnboardingComplete = () => {
    try {
      localStorage.setItem("astroai_onboarding_completed", "true");
    } catch (e) {
      console.warn("Storage error", e);
    }
    setScreen("splash");
  };

  // Splash Screen completion handler
  const handleSplashComplete = () => {
    setScreen("auth");
  };

  // Auth success handler: session explicitly established
  const handleAuthenticated = (user: AuthUser, token?: string) => {
    try {
      const sessionToken = token || `astro_session_${Date.now()}`;
      sessionStorage.setItem("astroai_session_token", sessionToken);
      sessionStorage.setItem("astroai_session_user", JSON.stringify(user));
      localStorage.setItem("astroai_auth_user", JSON.stringify(user));
    } catch (e) {
      console.warn("Session storage error", e);
    }
    router.replace("/home");
  };

  // Reset entire flow for reviewer/developer testing
  const handleResetFlow = () => {
    try {
      sessionStorage.removeItem("astroai_session_token");
      sessionStorage.removeItem("astroai_session_user");
      localStorage.removeItem("astroai_onboarding_completed");
      localStorage.removeItem("astroai_auth_user");
    } catch (e) {
      console.warn("Storage error", e);
    }
    setScreen("onboarding");
  };

  // Loading state (avoids hydration flicker)
  if (screen === "loading") {
    return (
      <div className="min-h-[100dvh] w-full bg-astro-bg flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border-2 border-terracotta border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-serif font-bold text-espresso tracking-wide">
          Aligning Your Stars...
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-[100dvh] w-full bg-astro-bg">
      {/* 1. Onboarding Screen (First-time user) */}
      {screen === "onboarding" && (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      )}

      {/* 2. Splash Screen (Post-onboarding animated transition) */}
      {screen === "splash" && (
        <SplashScreen onComplete={handleSplashComplete} />
      )}

      {/* 3. Authentication Screen (Sign In / Sign Up) */}
      {screen === "auth" && (
        <AuthScreen onAuthenticated={handleAuthenticated} />
      )}

      {/* Persistent Developer / Reviewer Flow Tester Pill (Bottom Floating) */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 bg-espresso/90 text-astro-bg backdrop-blur-md px-3.5 py-1.5 rounded-full border border-peach/30 shadow-2xl flex items-center gap-2 text-[11px] font-mono pointer-events-auto">
        <span className="flex items-center gap-1 font-sans font-semibold text-amber-300">
          <Smartphone className="w-3 h-3" />
          Flow:
        </span>
        <span className="capitalize font-bold text-peach">{screen}</span>
        <span className="text-white/30">|</span>
        <button
          onClick={handleResetFlow}
          title="Reset onboarding & logout to test first-time user flow from start"
          className="inline-flex items-center gap-1 text-[10px] text-terracotta bg-white px-2 py-0.5 rounded-full font-bold hover:bg-peach transition-colors shadow-sm cursor-pointer"
        >
          <RotateCcw className="w-2.5 h-2.5" />
          Reset Demo
        </button>
      </div>
    </div>
  );
}
