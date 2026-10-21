"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MobileBottomNav from "./MobileBottomNav";
import AppHeader from "./AppHeader";
import FloatingReelsButton from "./FloatingReelsButton";
import { AuthUser } from "./AuthScreen";
import { usersApi } from "../../services/apiClient";

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
    const verifyAndLoadSession = () => {
      try {
        // Explicit Session Gate:
        // User must have explicitly logged in during this active browser session.
        const sessionToken = sessionStorage.getItem("astroai_session_token");
        const sessionUserStr = sessionStorage.getItem("astroai_session_user");

        if (!sessionToken || !sessionUserStr) {
          // No active session in this tab/window -> enforce explicit login
          router.replace("/");
          return;
        }

        const parsed = JSON.parse(sessionUserStr);
        setUser(parsed);
        setIsHydrated(true);
      } catch {
        router.replace("/");
      }
    };

    verifyAndLoadSession();

    // Listen to profile name updates
    const handleUserUpdate = () => {
      try {
        const sessionUserStr = sessionStorage.getItem("astroai_session_user");
        if (sessionUserStr) {
          setUser(JSON.parse(sessionUserStr));
        }
      } catch (e) {}
    };

    window.addEventListener("astroai_user_updated", handleUserUpdate);
    return () => window.removeEventListener("astroai_user_updated", handleUserUpdate);
  }, [router]);

  // Explicit Secure Logout Handler
  const handleSignOut = async () => {
    try {
      const token = sessionStorage.getItem("astroai_session_token") || undefined;
      // Invalidate active session on server
      if (token) {
        usersApi.logout(token).catch(() => {});
      }
      // Purge client session credentials
      sessionStorage.removeItem("astroai_session_token");
      sessionStorage.removeItem("astroai_session_user");
      localStorage.removeItem("astroai_auth_user");
    } catch (e) {
      console.warn("Storage sign out cleanup error", e);
    }
    // Return to login screen
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
