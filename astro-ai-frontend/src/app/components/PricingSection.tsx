"use client";

import { useState, useEffect } from "react";
import { 
  Check, Sparkles, Crown, Zap, Shield, ArrowRight, X, 
  Smartphone, CreditCard, Clock, AlertCircle, CheckCircle2, RefreshCw
} from "lucide-react";

export default function PricingSection() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedUpiApp, setSelectedUpiApp] = useState("phonepe");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMandateSuccess, setIsMandateSuccess] = useState(false);

  // Mandate Configuration (Synced with Admin or Default)
  const [mandateConfig, setMandateConfig] = useState({
    trialSetupFee: 4,
    trialDays: 3,
    recurringAutoDebitAmount: 299,
  });

  // Active Trial State for the current user
  const [isTrialActive, setIsTrialActive] = useState(false);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/v1/subscriptions/config");
        if (res.ok) {
          const data = await res.json();
          if (data.config) {
            setMandateConfig(data.config);
            return;
          }
        }
      } catch (e) {
        // Fallback to localStorage
      }

      try {
        const savedConfig = localStorage.getItem("astroai_mandate_config");
        if (savedConfig) {
          setMandateConfig(JSON.parse(savedConfig));
        }
      } catch (e) {
        console.warn("Storage read error", e);
      }
    };

    loadConfig();
    window.addEventListener("astroai_mandate_updated", loadConfig);

    const trialStatus = localStorage.getItem("astroai_vip_trial_active");
    if (trialStatus === "true") {
      setIsTrialActive(true);
    }

    return () => window.removeEventListener("astroai_mandate_updated", loadConfig);
  }, []);

  const handleAuthorizeMandate = () => {
    setIsProcessing(true);

    // Call live backend API to verify & register mandate
    fetch("http://localhost:5000/api/v1/subscriptions/verify-mandate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mandateId: `mandate_${Date.now()}`,
        upiApp: selectedUpiApp,
        userId: "u-1",
      }),
    }).catch((e) => console.warn("Backend mandate sync error", e));

    setTimeout(() => {
      setIsProcessing(false);
      setIsMandateSuccess(true);
      setIsTrialActive(true);

      // Save VIP status and trial expiry (3 days from now)
      const expiry = Date.now() + mandateConfig.trialDays * 24 * 60 * 60 * 1000;
      localStorage.setItem("astroai_vip_trial_active", "true");
      localStorage.setItem("astroai_trial_expires_at", expiry.toString());

      // Update current user if logged in
      try {
        const authUser = localStorage.getItem("astroai_auth_user");
        if (authUser) {
          const parsed = JSON.parse(authUser);
          parsed.isVIP = true;
          localStorage.setItem("astroai_auth_user", JSON.stringify(parsed));
          window.dispatchEvent(new Event("astroai_user_updated"));
        }
      } catch (e) {
        console.warn("User update error", e);
      }
    }, 1200);
  };

  const handleCancelAutoDebit = () => {
    if (confirm("Kya aap sach me apna UPI Auto-Debit Mandate cancel karna chahte hain? Aapka 3-day trial khatam ho jayega.")) {
      fetch("http://localhost:5000/api/v1/subscriptions/cancel-mandate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mandateId: "mandate_active" }),
      }).catch((e) => console.warn("Backend cancel sync error", e));

      setIsTrialActive(false);
      setIsMandateSuccess(false);
      setShowPaymentModal(false);
      localStorage.removeItem("astroai_vip_trial_active");
      localStorage.removeItem("astroai_trial_expires_at");

      try {
        const authUser = localStorage.getItem("astroai_auth_user");
        if (authUser) {
          const parsed = JSON.parse(authUser);
          parsed.isVIP = false;
          localStorage.setItem("astroai_auth_user", JSON.stringify(parsed));
          window.dispatchEvent(new Event("astroai_user_updated"));
        }
      } catch (e) {
        console.warn("User update error", e);
      }

      alert("Aapka UPI Auto-Debit Mandate safalta-poorvak cancel kar diya gaya hai. Aage se koi paisa nahi katega.");
    }
  };

  return (
    <section id="pricing" className="w-full py-8 sm:py-16 bg-white/70 border-t border-peach/80 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-terracotta to-amber-600 text-white text-xs font-extrabold mb-3 shadow-xs uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5 fill-amber-200 text-amber-200" />
            <span>StoryTV Style 3-Day Free VIP Trial</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-espresso leading-tight">
            VIP Astro Pass: Shuru Karein Sirf{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-terracotta via-[#C84524] to-amber-600">
              ₹{mandateConfig.trialSetupFee} Me!
            </span>
          </h2>

          <p className="mt-2 text-espresso/75 text-xs sm:text-sm max-w-xl mx-auto font-medium">
            Bank account verification ke liye sirf ₹{mandateConfig.trialSetupFee} cut honge. Agle {mandateConfig.trialDays} din bilkul FREE enjoy karein! Day 4 se ₹{mandateConfig.recurringAutoDebitAmount}/mahina auto-debit (Kabhi bhi 1-click me cancel karein).
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto items-stretch">
          
          {/* Card 1: Free Basic Plan */}
          <div className="bg-astro-bg rounded-3xl p-6 sm:p-8 border border-peach flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-serif font-bold text-lg text-espresso">Free Seeker</h3>
                <span className="text-[10px] bg-peach/80 text-espresso px-2.5 py-1 rounded-full font-bold">Standard</span>
              </div>
              
              <div className="mb-4">
                <span className="text-3xl sm:text-4xl font-serif font-bold text-espresso">₹0</span>
                <span className="text-xs text-espresso/60 ml-2 font-medium">hamesha ke liye</span>
              </div>

              <p className="text-xs text-espresso/70 pb-5 border-b border-peach/60 mb-5">
                Vedic astrology ka basic anubhav lein, bina kisi subscription ke.
              </p>

              {/* Features List */}
              <ul className="space-y-3 text-xs text-espresso/80 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>3 Free AI Astrologer Questions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Basic Janam Kundli Overview</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Daily Trending Astro Reels (Standard)</span>
                </li>
                <li className="flex items-center gap-2 text-espresso/40">
                  <span className="w-3.5 h-3.5 flex items-center justify-center text-xs">✕</span>
                  <span className="line-through">Unlimited 24/7 AI Kundli Guidance</span>
                </li>
                <li className="flex items-center gap-2 text-espresso/40">
                  <span className="w-3.5 h-3.5 flex items-center justify-center text-xs">✕</span>
                  <span className="line-through">Verified Astrologers 50% Off Consultations</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-peach/50 text-center">
              <span className="text-xs text-espresso/60 font-semibold">Active Default Plan</span>
            </div>
          </div>

          {/* Card 2: UPI Auto-Pay Trial VIP Pass */}
          <div className="bg-gradient-to-b from-white via-[#FFF9F3] to-[#FAF1E6] rounded-3xl p-6 sm:p-8 border-2 border-amber-400 relative flex flex-col justify-between shadow-xl hover:shadow-2xl transition-all">
            
            {/* Top Hook Ribbon */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-terracotta via-[#C84524] to-amber-600 text-white text-[11px] font-extrabold px-4 py-1 rounded-full shadow-md flex items-center gap-1.5 uppercase tracking-wider whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5 fill-amber-200 text-amber-200" />
              <span>{mandateConfig.trialDays}-Day Free Trial @ ₹{mandateConfig.trialSetupFee} Only</span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3 mt-1">
                <h3 className="font-serif font-bold text-xl text-espresso flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span>VIP Astro Pass</span>
                </h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-black uppercase">
                  98% OFF TODAY
                </span>
              </div>

              {/* Price Tag with Mandate Details */}
              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-serif font-black text-terracotta">
                    ₹{mandateConfig.trialSetupFee}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    Aaj Sirf Itne Katenge
                  </span>
                </div>
                <p className="text-[11px] text-espresso/70 mt-1 font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-terracotta" />
                  <span>{mandateConfig.trialDays} Din Bilkul FREE. Day 4 se ₹{mandateConfig.recurringAutoDebitAmount}/month auto-debit.</span>
                </p>
              </div>

              <p className="text-xs text-espresso/80 pb-4 border-b border-peach mb-4 leading-relaxed font-medium">
                UPI Auto-Pay setup karein. Trial ke dauran kabhi bhi cancel karein, aage se ek bhi rupya nahi katega!
              </p>

              {/* VIP Benefits */}
              <ul className="space-y-2.5 text-xs text-espresso/90 font-medium">
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span><strong>Unlimited 24/7 AI Kundli Guidance</strong> (Bina rukaawat)</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span><strong>Senior Astrologers Consultation</strong> par Flat 50% Off</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span><strong>Detailed Kundli & Dosha PDF Report</strong> Instant Download</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span><strong>100% Ad-Free Experience</strong> & Priority Support</span>
                </li>
              </ul>
            </div>

            {/* Action Button */}
            <div className="mt-6">
              {!isTrialActive ? (
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-terracotta via-[#C84524] to-amber-600 hover:opacity-95 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-terracotta/30 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>₹{mandateConfig.trialSetupFee} Pay Karein & {mandateConfig.trialDays}-Day Free Trial Shuru Karein</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Aapka 3-Day VIP Trial Active Hai! 🎉</span>
                  </div>
                  <p className="text-[10px] text-emerald-700 mt-0.5">
                    Day 4 se ₹{mandateConfig.recurringAutoDebitAmount}/mo auto-debit shuru hoga.
                  </p>
                  <button
                    onClick={handleCancelAutoDebit}
                    className="mt-2 text-[10px] font-bold text-rose-700 underline hover:text-rose-900 cursor-pointer"
                  >
                    Cancel Auto-Pay Mandate Anytime
                  </button>
                </div>
              )}

              <p className="text-[10px] text-center text-espresso/60 mt-2">
                🔒 Safe UPI Auto-Pay • PhonePe, GPay, Paytm • Instant 1-Click Cancel
              </p>
            </div>
          </div>
        </div>

        {/* Security Trust Badges */}
        <div className="mt-10 sm:mt-14 flex flex-wrap items-center justify-center gap-6 text-espresso/60 text-xs text-center">
          <span className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-600" />
            NPCI Certified UPI Auto-Pay
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            Instant Mandate Approval in 5 Seconds
          </span>
          <span>⚡ No Hidden Charges • Cancel Anytime</span>
        </div>

      </div>

      {/* =========================================================================
          UPI AUTO-PAY E-MANDATE CHECKOUT MODAL (STORYTV / KUKU FM FLOW)
         ========================================================================= */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border-2 border-amber-300/80 relative overflow-hidden">
            
            {/* Close Button */}
            <button
              onClick={() => {
                setShowPaymentModal(false);
                setIsMandateSuccess(false);
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-peach/50 flex items-center justify-center text-espresso hover:bg-peach cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {!isMandateSuccess ? (
              <div>
                {/* Modal Header */}
                <div className="text-center mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-terracotta to-amber-500 flex items-center justify-center mx-auto mb-2 text-white shadow-md">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-espresso">
                    UPI Auto-Pay e-Mandate Setup
                  </h3>
                  <p className="text-xs text-espresso/65 mt-0.5">
                    Account verify karein aur 3-Day Free Trial payein
                  </p>
                </div>

                {/* Mandate Summary Breakdown Box */}
                <div className="bg-gradient-to-br from-[#FFF9F3] to-[#FFEEDC] p-4 rounded-2xl border border-amber-300 mb-5 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-espresso/75 font-semibold">1. Aaj Cut Hoga (Today's Deduction):</span>
                    <span className="font-black text-terracotta text-sm">₹{mandateConfig.trialSetupFee}.00</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-espresso/75 font-semibold">2. Free Trial Period:</span>
                    <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      {mandateConfig.trialDays} Din (72 Ghante)
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-amber-200">
                    <span className="text-espresso/75 font-semibold">3. Day 4 Se Auto-Debit:</span>
                    <span className="font-black text-espresso">₹{mandateConfig.recurringAutoDebitAmount}.00 / month</span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-espresso/60 pt-1">
                    <span>Frequency: Monthly Recurring</span>
                    <span className="text-emerald-700 font-bold">Cancel Anytime</span>
                  </div>
                </div>

                {/* Select UPI App */}
                <div className="space-y-2 mb-5">
                  <label className="block text-[11px] font-bold text-espresso/70 mb-1">
                    SELECT YOUR UPI APP FOR AUTO-PAY:
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    {/* PhonePe */}
                    <button
                      type="button"
                      onClick={() => setSelectedUpiApp("phonepe")}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                        selectedUpiApp === "phonepe"
                          ? "border-purple-600 bg-purple-50/80 shadow-xs ring-2 ring-purple-500/20"
                          : "border-peach hover:border-peach/80"
                      }`}
                    >
                      <span className="text-xl">🟣</span>
                      <div>
                        <p className="font-bold text-xs text-espresso">PhonePe</p>
                        <span className="text-[10px] text-espresso/60">UPI AutoPay</span>
                      </div>
                    </button>

                    {/* Google Pay */}
                    <button
                      type="button"
                      onClick={() => setSelectedUpiApp("gpay")}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                        selectedUpiApp === "gpay"
                          ? "border-blue-600 bg-blue-50/80 shadow-xs ring-2 ring-blue-500/20"
                          : "border-peach hover:border-peach/80"
                      }`}
                    >
                      <span className="text-xl">🔵</span>
                      <div>
                        <p className="font-bold text-xs text-espresso">Google Pay</p>
                        <span className="text-[10px] text-espresso/60">UPI Mandate</span>
                      </div>
                    </button>

                    {/* Paytm */}
                    <button
                      type="button"
                      onClick={() => setSelectedUpiApp("paytm")}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                        selectedUpiApp === "paytm"
                          ? "border-sky-600 bg-sky-50/80 shadow-xs ring-2 ring-sky-500/20"
                          : "border-peach hover:border-peach/80"
                      }`}
                    >
                      <span className="text-xl">🔷</span>
                      <div>
                        <p className="font-bold text-xs text-espresso">Paytm</p>
                        <span className="text-[10px] text-espresso/60">UPI AutoPay</span>
                      </div>
                    </button>

                    {/* BHIM / Other */}
                    <button
                      type="button"
                      onClick={() => setSelectedUpiApp("bhim")}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                        selectedUpiApp === "bhim"
                          ? "border-emerald-600 bg-emerald-50/80 shadow-xs ring-2 ring-emerald-500/20"
                          : "border-peach hover:border-peach/80"
                      }`}
                    >
                      <span className="text-xl">🟢</span>
                      <div>
                        <p className="font-bold text-xs text-espresso">BHIM UPI</p>
                        <span className="text-[10px] text-espresso/60">Any UPI ID</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Authorize Button */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleAuthorizeMandate}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-terracotta via-[#C84524] to-amber-600 hover:opacity-95 text-white font-extrabold text-sm shadow-xl shadow-terracotta/30 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-70 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>NPCI Mandate Authorize Ho Raha Hai...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      <span>₹{mandateConfig.trialSetupFee} Pay Karein & Auto-Pay Approve Karein</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-espresso/50 mt-3">
                  🔒 Bank e-Mandate Terms: Pehle {mandateConfig.trialDays} din cancel karne par aage ka koi deduction nahi hoga.
                </p>
              </div>
            ) : (
              /* Success Celebration State */
              <div className="text-center py-4 space-y-4 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center border-2 border-emerald-300">
                  <CheckCircle2 className="w-10 h-10 animate-bounce" />
                </div>

                <div>
                  <h3 className="font-serif font-bold text-xl text-espresso">
                    🎉 Mubarak! 3-Day VIP Free Trial Active Ho Gaya!
                  </h3>
                  <p className="text-xs text-emerald-800 font-semibold mt-1">
                    ₹{mandateConfig.trialSetupFee} UPI Mandate safalta-poorvak setup ho gaya hai.
                  </p>
                </div>

                <div className="bg-astro-bg p-4 rounded-2xl border border-peach text-left text-xs space-y-1.5">
                  <p className="text-espresso font-bold">📋 Mandate Details:</p>
                  <p className="text-espresso/70">• Aaj kate: <strong>₹{mandateConfig.trialSetupFee}.00</strong></p>
                  <p className="text-espresso/70">• Free Access: <strong>Agla 3 din (72 ghante)</strong></p>
                  <p className="text-espresso/70">• Next Auto-Debit: <strong>Day 4 se ₹{mandateConfig.recurringAutoDebitAmount}/month</strong></p>
                  <p className="text-emerald-700 font-semibold">• Cancel: Profile se kabhi bhi 1-click me cancel kar sakte hain.</p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="w-full py-3 rounded-2xl bg-terracotta text-white font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  VIP Astrologer Chat Shuru Karein ➔
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </section>
  );
}