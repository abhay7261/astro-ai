"use client";

import MobileAppLayout from "../components/mobile/MobileAppLayout";
import AstrologerSection from "../components/AstrologerSection";

export default function ChatPage() {
  return (
    <MobileAppLayout showBack backTitle="Home" title="Astrologer Consultation">
      <div className="space-y-4 animate-in fade-in duration-300">
        {/* Verified Human Astrologers Directory (Pure Astrologer Consultation - Separate from AI) */}
        <AstrologerSection />
      </div>
    </MobileAppLayout>
  );
}
