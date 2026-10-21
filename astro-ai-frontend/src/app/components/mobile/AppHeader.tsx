"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, LogOut, Sparkles } from "lucide-react";
import { AuthUser } from "./AuthScreen";

interface AppHeaderProps {
  user: AuthUser | null;
  onSignOut: () => void;
  onOpenAuth?: () => void;
  showBack?: boolean;
  backTitle?: string;
  title?: string;
}

export default function AppHeader({
  user,
  onSignOut,
  onOpenAuth,
  showBack = false,
  backTitle = "Back",
  title,
}: AppHeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/90 backdrop-blur-xl border-b border-amber-900/10 px-3.5 sm:px-5 py-2.5 shadow-xs transition-all">
      <div className="max-w-xl sm:max-w-2xl mx-auto flex items-center justify-between gap-3">
        
        {/* Left Side: Back button or Logo */}
        <div className="flex items-center gap-2.5 min-w-0">
          {showBack ? (
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-xs font-bold text-espresso/85 hover:text-terracotta bg-white/95 border border-peach px-3 py-1.5 rounded-full transition-all active:scale-95 shadow-xs"
            >
              <ChevronLeft className="w-4 h-4 text-terracotta stroke-[2.5]" />
              <span>{backTitle}</span>
            </button>
          ) : (
            <Link href="/home" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-amber-400/70 shadow-sm shadow-terracotta/20 bg-espresso flex items-center justify-center group-hover:scale-105 group-hover:border-terracotta transition-all ring-2 ring-terracotta/20">
                <Image
                  src="/logo.png"
                  alt="AstroAI Logo"
                  width={40}
                  height={40}
                  unoptimized
                  priority
                  className="object-cover w-full h-full scale-125"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-base sm:text-lg text-espresso tracking-tight leading-none group-hover:text-terracotta transition-colors flex items-center gap-1">
                  <span>Astro<span className="text-terracotta">AI</span></span>
                  <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400 opacity-80" />
                </span>
                <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-terracotta font-extrabold mt-0.5">
                  Vedic Mobile
                </span>
              </div>
            </Link>
          )}

          {title && (
            <span className="text-xs font-bold text-espresso/70 border-l border-peach/80 pl-2.5 ml-1 truncate">
              {title}
            </span>
          )}
        </div>

        {/* Right Side: Profile link & Sign Out OR Login / Sign Up */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {!user ? (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-terracotta to-amber-600 hover:opacity-95 text-white text-xs font-bold shadow-sm shadow-terracotta/20 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Login / Sign Up</span>
            </button>
          ) : (
            <>
              {/* User Profile Avatar Link */}
              <Link
                href="/profile"
                className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-full border border-amber-300/60 bg-white/95 hover:bg-peach/40 transition-all shadow-xs active:scale-95 group"
                title="View Profile"
              >
                <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden border border-terracotta/60 bg-espresso flex-shrink-0">
                  <Image
                    src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"}
                    alt="Profile"
                    width={28}
                    height={28}
                    unoptimized
                    className="object-cover w-full h-full"
                  />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
                </div>
                {user?.name && (
                  <span className="hidden sm:inline text-xs font-bold text-espresso group-hover:text-terracotta pr-1 max-w-[100px] truncate transition-colors">
                    {user.name.split(" ")[0]}
                  </span>
                )}
              </Link>

              {/* Sign Out Button */}
              <button
                onClick={onSignOut}
                title="Sign Out"
                className="w-8 h-8 rounded-full border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 flex items-center justify-center transition-all active:scale-90 shadow-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
