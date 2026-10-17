"use client";

import Image from "next/image";
import { X, Crown, LogOut, FileText, MessageCircle, Plus, Calendar } from "lucide-react";
import { UserProfile } from "./AuthModal";

interface UserProfileModalProps {
  user: UserProfile;
  onClose: () => void;
  onLogout: () => void;
}

export default function UserProfileModal({ user, onClose, onLogout }: UserProfileModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-astro-bg w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-peach relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-peach/60 flex items-center justify-center text-espresso hover:bg-peach transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* User Card */}
        <div className="flex items-center gap-4 pb-6 border-b border-peach/70 mb-6">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-terracotta relative">
            <Image
              src={user.avatar}
              alt={user.name}
              width={64}
              height={64}
              unoptimized
              className="object-cover w-full h-full"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-xl text-espresso">{user.name}</h3>
              {user.isVip && (
                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300">
                  <Crown className="w-3 h-3 text-amber-600 fill-amber-500" />
                  VIP MEMBER
                </span>
              )}
            </div>
            <p className="text-xs text-espresso/60 mt-0.5">{user.email}</p>
            <p className="text-[11px] text-terracotta font-semibold mt-1">₹299/mo Active Subscription</p>
          </div>
        </div>

        {/* Saved Kundlis Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-serif font-bold text-base text-espresso flex items-center gap-2">
              <FileText className="w-4 h-4 text-terracotta" />
              Saved Family Kundlis ({user.savedKundlisCount})
            </h4>
            <button
              onClick={() => alert("Birth Details form open hoga!")}
              className="text-xs font-semibold text-terracotta hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Kundli
            </button>
          </div>

          <div className="space-y-2.5">
            {/* Kundli 1 */}
            <div className="bg-white p-3.5 rounded-2xl border border-peach/70 flex items-center justify-between shadow-sm">
              <div>
                <h5 className="font-semibold text-xs text-espresso">Rahul Verma (Self)</h5>
                <p className="text-[11px] text-espresso/60 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3" />
                  15 Aug 1995 • 10:32 AM • Mumbai
                </p>
              </div>
              <button
                onClick={() => alert("Kundli D1 Lagna Chart open ho raha hai...")}
                className="text-xs bg-peach text-espresso font-semibold px-3 py-1.5 rounded-xl hover:bg-peach/80 transition-colors"
              >
                View Chart
              </button>
            </div>

            {/* Kundli 2 */}
            <div className="bg-white p-3.5 rounded-2xl border border-peach/70 flex items-center justify-between shadow-sm">
              <div>
                <h5 className="font-semibold text-xs text-espresso">Pooja Sharma (Spouse)</h5>
                <p className="text-[11px] text-espresso/60 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3" />
                  22 Dec 1997 • 04:15 PM • Delhi
                </p>
              </div>
              <button
                onClick={() => alert("Kundli Milan Score calculate ho raha hai...")}
                className="text-xs bg-peach text-espresso font-semibold px-3 py-1.5 rounded-xl hover:bg-peach/80 transition-colors"
              >
                Match Kundli
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions & Logout */}
        <div className="pt-4 border-t border-peach/70 flex items-center justify-between">
          <button
            onClick={() => alert("Chat History loading...")}
            className="text-xs font-semibold text-espresso/80 flex items-center gap-1.5 hover:text-terracotta"
          >
            <MessageCircle className="w-4 h-4 text-terracotta" />
            Chat History
          </button>

          <button
            onClick={onLogout}
            className="text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}