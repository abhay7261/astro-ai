"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingScreen from "./OnboardingScreen";
import SplashScreen from "./SplashScreen";
import HomePage from "../../home/page";

export type ScreenState = "loading" | "onboarding" | "splash" | "home";

export default function AstroMobileApp() {
  const router = useRouter();
  const [screen, setScreen] = useState<ScreenState>("loading");

  useEffect(() => {
    try {
      const activeSession = sessionStorage.getItem("astroai_session_token");
      if (activeSession) {
        // If already logged in, navigate straight to home
        router.replace("/home");
        return;
      }
      
      // Guest / initial visit: Start with the 3 Onboarding Scroller Slides
      setScreen("onboarding");
    } catch {
      setScreen("onboarding");
    }
  }, [router]);

  // Step 1: Onboarding completed (or skipped) -> Transition to Animated Logo Splash
  const handleOnboardingComplete = () => {
    setScreen("splash");
  };

  // Step 2: Animated Logo Splash finished -> Open Home Page
  const handleSplashComplete = () => {
    setScreen("home");
    router.replace("/home");
  };

  // Avoid hydration flicker
  if (screen === "loading") {
    return (
      <div className="min-h-[100dvh] w-full bg-astro-bg flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border-2 border-terracotta border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-serif font-bold text-espresso tracking-wide">
          Aligning Your Stars... ✨
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-[100dvh] w-full bg-astro-bg">
      {/* 1. Onboarding Screen (3 Scroller Slides with Swipe & Next) */}
      {screen === "onboarding" && (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      )}

      {/* 2. Splash Screen (Rotating Celestial Orbit & Glowing Logo Animation) */}
      {screen === "splash" && (
        <SplashScreen onComplete={handleSplashComplete} />
      )}

      {/* 3. Home Page (Action-Gated Auth on Any Feature Click) */}
      {screen === "home" && (
        <HomePage />
      )}
    </div>
  );
}
