"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import MobileBottomNav from "./MobileBottomNav";
import AppHeader from "./AppHeader";
import FloatingReelsButton from "./FloatingReelsButton";
import AuthGateModal from "./AuthGateModal";
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
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [authFeatureName, setAuthFeatureName] = useState<string | undefined>(undefined);
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);

  useEffect(() => {
    const verifyAndLoadSession = () => {
      try {
        const sessionToken = sessionStorage.getItem("astroai_session_token");
        const sessionUserStr = sessionStorage.getItem("astroai_session_user");

        if (sessionToken && sessionUserStr) {
          const parsed = JSON.parse(sessionUserStr);
          setUser(parsed);
        } else {
          setUser(null);
          // If accessing a protected route directly as guest, prompt Login / Sign Up!
          const isHome = pathname === "/" || pathname === "/home";
          if (!isHome) {
            setShowAuthGate(true);
            setAuthFeatureName(title || "this feature");
          }
        }
        setIsHydrated(true);
      } catch {
        setUser(null);
        setIsHydrated(true);
      }
    };

    verifyAndLoadSession();

    // Listen to profile name updates
    const handleUserUpdate = () => {
      try {
        const sessionUserStr = sessionStorage.getItem("astroai_session_user");
        if (sessionUserStr) {
          setUser(JSON.parse(sessionUserStr));
        } else {
          setUser(null);
        }
      } catch (e) {}
    };

    // Listen to global auth requests from anywhere in the app
    const handleOpenAuth = (e: any) => {
      setShowAuthGate(true);
      setAuthFeatureName(e.detail?.featureName || undefined);
      if (typeof e.detail?.callback === "function") {
        setPendingCallback(() => e.detail.callback);
      }
    };

    window.addEventListener("astroai_user_updated", handleUserUpdate);
    window.addEventListener("astroai_open_auth", handleOpenAuth);

    return () => {
      window.removeEventListener("astroai_user_updated", handleUserUpdate);
      window.removeEventListener("astroai_open_auth", handleOpenAuth);
    };
  }, [pathname, title]);

  // Auth Success Callback
  const handleAuthSuccess = () => {
    try {
      const sessionUserStr = sessionStorage.getItem("astroai_session_user");
      if (sessionUserStr) {
        setUser(JSON.parse(sessionUserStr));
      }
    } catch {}
    setShowAuthGate(false);
    if (pendingCallback) {
      pendingCallback();
      setPendingCallback(null);
    }
  };

  // Close Auth Gate Modal
  const handleCloseAuth = () => {
    setShowAuthGate(false);
    setPendingCallback(null);
    // If guest was trying to open a protected page directly, return to /home
    const isHome = pathname === "/" || pathname === "/home";
    if (!isHome) {
      router.replace("/home");
    }
  };

  // Explicit Secure Logout Handler
  const handleSignOut = async () => {
    try {
      const token = sessionStorage.getItem("astroai_session_token") || undefined;
      if (token) {
        usersApi.logout(token).catch(() => {});
      }
      sessionStorage.removeItem("astroai_session_token");
      sessionStorage.removeItem("astroai_session_user");
      localStorage.removeItem("astroai_auth_user");
      setUser(null);
    } catch (e) {
      console.warn("Storage sign out cleanup error", e);
    }
    router.replace("/home");
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
        onOpenAuth={() => setShowAuthGate(true)}
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

      {/* Action-Gated Login & Sign Up Modal */}
      <AuthGateModal
        isOpen={showAuthGate}
        featureName={authFeatureName}
        onClose={handleCloseAuth}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
