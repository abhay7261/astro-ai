"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Bot, MessageCircle, User } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/home", icon: Home },
  { label: "AI Chat", href: "/ai-chat", icon: Bot },
  { label: "Astrologers", href: "/chat", icon: MessageCircle },
  { label: "Profile", href: "/profile", icon: User },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-amber-900/10 shadow-[0_-10px_30px_rgba(59,42,32,0.08)] select-none"
      style={{
        paddingBottom: "max(env(safe-area-inset-bottom, 0px), 0.75rem)",
      }}
    >
      <div className="max-w-xl sm:max-w-2xl mx-auto px-4 pt-2 pb-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-2xl transition-all duration-200 active:scale-90 ${
                isActive
                  ? "text-terracotta"
                  : "text-espresso/60 hover:text-espresso"
              }`}
            >
              <div
                className={`relative flex items-center justify-center w-12 h-7 rounded-full transition-all duration-300 ${
                  isActive 
                    ? "bg-gradient-to-r from-peach to-amber-100/95 border border-amber-300/60 shadow-xs" 
                    : "bg-transparent"
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? "scale-110 stroke-[2.4] text-terracotta" : "stroke-[1.8]"
                  }`}
                />
              </div>
              <span
                className={`text-[10px] sm:text-[11px] mt-1 leading-tight tracking-tight transition-all block ${
                  isActive ? "font-extrabold text-terracotta" : "font-medium"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
