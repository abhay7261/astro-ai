"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MobileBottomNav from "./MobileBottomNav";
import AppHeader from "./AppHeader";
import FloatingReelsButton from "./FloatingReelsButton";
import { AuthUser } from "./AuthScreen";

interface MobileAppLayoutProps {
  children: React.ReactNode;
  showBack?: boolean;
  backTitle?: string;
  title?: string;
}

export default function MobileAppLayout({
  children,
  showBack,
  backTitle,
  title,
}: MobileAppLayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUserStr = localStorage.getItem("astroai_auth_user");
        if (savedUserStr) {
          setUser(JSON.parse(savedUserStr));
        } else {
          router.replace("/");
          return;
        }
      } catch {
        router.replace("/");
        return;
      }
      setIsHydrated(true);
    };

    loadUser();

    // Listen to custom name changes or storage updates from any component
    window.addEventListener("astroai_user_updated", loadUser);
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("astroai_user_updated", loadUser);
      window.removeEventListener("storage", loadUser);
    };
  }, [router]);

  const handleSignOut = () => {
    try {
      localStorage.removeItem("astroai_auth_user");
    } catch (e) {
      console.warn("Storage error", e);
    }
    router.replace("/");
  };

  // Avoid hydration flicker
  if (!isHydrated) {
    return (
      <div className="min-h-[100dvh] bg-[#FAF7F2] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-3 border-terracotta border-t-transparent rounded-full animate-spin mb-3 shadow-md" />
        <p className="text-sm font-serif font-bold text-espresso tracking-wide">
          Aligning Your Stars... ✨
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FFFDF9] via-[#FAF6F0] to-[#F5EFEB] text-espresso flex flex-col relative overflow-x-hidden selection:bg-peach selection:text-terracotta">
      <AppHeader
        user={user}
        onSignOut={handleSignOut}
        showBack={showBack}
        backTitle={backTitle}
        title={title}
      />

      {/* Floating Action Buttons (Ask AI & Reels stacked on bottom-right) */}
      <FloatingReelsButton />

      {/* Main Page Content constrained to compact app width with safe bottom clearance */}
      <main className="flex-1 w-full max-w-xl sm:max-w-2xl mx-auto px-3.5 sm:px-5 py-4 pb-32">
        {children}
      </main>

      {/* Mobile Bottom Navigation (4 Core Tabs) */}
      <MobileBottomNav />
    </div>
  );
}
