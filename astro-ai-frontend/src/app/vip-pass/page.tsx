"use client";

import MobileAppLayout from "../components/mobile/MobileAppLayout";
import PricingSection from "../components/PricingSection";

export default function VipPassPage() {
  return (
    <MobileAppLayout showBack backTitle="Home" title="VIP Astro Pass (₹299)">
      <div className="space-y-4 animate-in fade-in duration-300">
        <PricingSection />
      </div>
    </MobileAppLayout>
  );
}
