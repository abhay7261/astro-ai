"use client";

import MobileAppLayout from "../components/mobile/MobileAppLayout";
import VedicPoojaSection from "../components/mobile/VedicPoojaSection";

export default function PoojaPage() {
  return (
    <MobileAppLayout title="Pooja Services">
      <div className="animate-in fade-in duration-300">
        <VedicPoojaSection showBackButton={true} />
      </div>
    </MobileAppLayout>
  );
}
