"use client";

import MobileAppLayout from "../components/mobile/MobileAppLayout";
import KundliMatchingSection from "../components/KundliMatchingSection";

export default function KundliMilanPage() {
  return (
    <MobileAppLayout showBack backTitle="Home" title="Kundli Milan & Gun Matching">
      <div className="space-y-4 animate-in fade-in duration-300">
        <KundliMatchingSection />
      </div>
    </MobileAppLayout>
  );
}
