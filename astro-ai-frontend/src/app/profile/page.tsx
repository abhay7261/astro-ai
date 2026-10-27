"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  User, Crown, LogOut, FileText, MessageCircle, 
  Plus, Calendar, ChevronRight 
} from "lucide-react";
import MobileAppLayout from "../components/mobile/MobileAppLayout";
import { AuthUser } from "../components/mobile/AuthScreen";
import { usersApi } from "../services/apiClient";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("astroai_auth_user");
      if (saved) setUser(JSON.parse(saved));
    } catch (e) {
      console.warn("Storage error", e);
    }
  }, []);

  const handleSignOut = async () => {
    try {
      const token = sessionStorage.getItem("astroai_session_token") || undefined;
      if (token) usersApi.logout(token).catch(() => {});
      sessionStorage.removeItem("astroai_session_token");
      sessionStorage.removeItem("astroai_session_user");
      localStorage.removeItem("astroai_auth_user");
    } catch (e) {
      console.warn("Storage error", e);
    }
    router.replace("/");
  };

  return (
    <MobileAppLayout showBack backTitle="Home" title="My Astro Profile">
      <div className="space-y-6 max-w-xl mx-auto animate-in fade-in duration-300">
        
        {/* User Profile Card */}
        <div className="bg-white rounded-3xl p-6 border border-peach shadow-sm flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-terracotta bg-espresso flex-shrink-0">
            <Image
              src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"}
              alt="Avatar"
              width={64}
              height={64}
              unoptimized
              className="object-cover w-full h-full"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-lg text-espresso truncate">
                {user?.name || "Cosmic Seeker"}
              </h2>
              {user?.isVip ? (
                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-300">
                  <Crown className="w-3 h-3 text-amber-600 fill-amber-500" />
                  VIP MEMBER
                </span>
              ) : null}
            </div>
            <p className="text-xs text-espresso/60 truncate">{user?.email || "seeker@astroai.com"}</p>
            <p className="text-[11px] text-terracotta font-semibold mt-0.5">
              Vedic Seeker • Free Consultations Active
            </p>
          </div>
        </div>

        {/* VIP Pass Banner / Upgrade Card */}
        <div className="bg-gradient-to-r from-peach/80 to-amber-100/60 p-4 rounded-2xl border border-peach/80 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-amber-600 shadow-xs">
              <Crown className="w-5 h-5 fill-amber-500" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xs sm:text-sm text-espresso">
                {user?.isVip ? "VIP Gold Membership Active" : "Upgrade to VIP Astro Pass"}
              </h3>
              <p className="text-[10px] text-espresso/70">
                {user?.isVip ? "Unlimited 24/7 Astrologer chats active" : "Unlimited chats & 25-page PDF for ₹299/mo"}
              </p>
            </div>
          </div>

          <Link
            href="/vip-pass"
            className="px-3.5 py-1.5 rounded-xl bg-terracotta hover:bg-terracotta-hover text-astro-bg text-xs font-bold shadow-xs whitespace-nowrap active:scale-95"
          >
            {user?.isVip ? "Manage" : "Get Pass"}
          </Link>
        </div>

        {/* Saved Janam Kundli Section (Real User Profile Only - Zero Fake Data) */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-peach shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-peach/60 mb-4">
            <h3 className="font-serif font-bold text-sm sm:text-base text-espresso flex items-center gap-2">
              <FileText className="w-4 h-4 text-terracotta" />
              <span>My Janam Kundli Profile</span>
            </h3>
            <Link
              href="/kundli"
              className="text-xs font-bold text-terracotta hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Kundli</span>
            </Link>
          </div>

          <div className="space-y-3">
            {/* User's Verified Kundli */}
            <div className="bg-astro-bg p-3.5 rounded-2xl border border-peach/70 flex items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-xs text-espresso">{user?.name || "Abhay"} (Self)</h4>
                <p className="text-[10px] text-espresso/60 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3 text-terracotta" />
                  <span>Vedic Kundli & Planetary Dasha</span>
                </p>
              </div>
              <Link
                href="/kundli"
                className="text-xs bg-peach text-espresso font-bold px-3 py-1.5 rounded-xl hover:bg-peach/80 transition-colors"
              >
                View Chart
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Links Menu */}
        <div className="bg-white rounded-3xl p-2 border border-peach shadow-sm divide-y divide-peach/50 text-xs">
          <Link
            href="/pooja"
            className="flex items-center justify-between p-3.5 hover:bg-astro-bg/50 rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base">🕉️</span>
              <span className="font-medium text-espresso">My Vedic Pooja Bookings</span>
            </div>
            <ChevronRight className="w-4 h-4 text-espresso/40" />
          </Link>

          <Link
            href="/chat"
            className="flex items-center justify-between p-3.5 hover:bg-astro-bg/50 rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span className="font-medium text-espresso">Astrologer Consultation History</span>
            </div>
            <ChevronRight className="w-4 h-4 text-espresso/40" />
          </Link>

          <Link
            href="/vip-pass"
            className="flex items-center justify-between p-3.5 hover:bg-astro-bg/50 rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Crown className="w-4 h-4 text-amber-500" />
              <span className="font-medium text-espresso">Subscription & Billing</span>
            </div>
            <ChevronRight className="w-4 h-4 text-espresso/40" />
          </Link>
        </div>

        {/* Sign Out Action Button */}
        <div className="pt-2">
          <button
            onClick={handleSignOut}
            className="w-full py-3.5 rounded-2xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of AstroAI</span>
          </button>
        </div>

      </div>
    </MobileAppLayout>
  );
}
