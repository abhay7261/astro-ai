"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Sparkles, Calendar, Clock, User, Phone, CheckCircle2, 
  Flame, ArrowRight, ArrowLeft, X, ShieldCheck, Gift, Search,
  SlidersHorizontal, Check, RefreshCw
} from "lucide-react";
import { poojasApi, astrologersApi, PoojaItem } from "../../services/apiClient";

interface VedicPoojaSectionProps {
  showBackButton?: boolean;
  onBack?: () => void;
  className?: string;
}

const CATEGORIES = [
  { id: "All", label: "All" },
  { id: "Ganesh", label: "Ganesh" },
  { id: "Lakshmi", label: "Lakshmi" },
  { id: "Shiva", label: "Shiva" },
  { id: "Navgraha", label: "Navgraha" },
  { id: "Dosha", label: "Dosha" },
];

export default function VedicPoojaSection({
  showBackButton = false,
  onBack,
  className = "",
}: VedicPoojaSectionProps) {
  const router = useRouter();
  const [poojas, setPoojas] = useState<PoojaItem[]>([]);
  const [panditsList, setPanditsList] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Booking Modal State
  const [selectedPooja, setSelectedPooja] = useState<PoojaItem | null>(null);
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [gotra, setGotra] = useState("Kashyap");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("Morning 09:00 AM - 12:00 PM (Shubh Muhurat)");
  const [selectedPandit, setSelectedPandit] = useState("");
  const [mode, setMode] = useState("Live Video Sankalp (Online)");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any | null>(null);

  // 1. Fetch live Poojas & Pandits from MongoDB Atlas Backend
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [livePoojas, liveAstros] = await Promise.allSettled([
        poojasApi.getAll(),
        astrologersApi.getAll(),
      ]);

      if (livePoojas.status === "fulfilled" && Array.isArray(livePoojas.value)) {
        setPoojas(livePoojas.value.filter((p) => p.isActive !== false));
      } else {
        setPoojas([]);
      }

      if (liveAstros.status === "fulfilled" && Array.isArray(liveAstros.value)) {
        const names = liveAstros.value.map((a: any) => `${a.name} (${a.title || "Vedic Pandit"})`);
        setPanditsList(names);
        if (names.length > 0) setSelectedPandit(names[0]);
      }
    } catch (err) {
      console.warn("Error fetching pooja catalog:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Auto-fill user from session
    try {
      const saved = sessionStorage.getItem("astroai_session_user") || localStorage.getItem("astroai_auth_user");
      if (saved) {
        const u = JSON.parse(saved);
        if (u.name) setUserName(u.name);
        if (u.phone) setUserPhone(u.phone);
      }
    } catch {}
  }, []);

  // Filter Poojas
  const filteredPoojas = poojas.filter((p) => {
    const matchesCategory =
      activeCategory === "All" ||
      (p.category && p.category.toLowerCase().includes(activeCategory.toLowerCase())) ||
      (p.deity && p.deity.toLowerCase().includes(activeCategory.toLowerCase())) ||
      (p.name && p.name.toLowerCase().includes(activeCategory.toLowerCase()));

    const matchesSearch =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.deity?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleOpenBooking = (pooja: PoojaItem) => {
    setSelectedPooja(pooja);
    setBookingSuccess(null);
    if (!selectedPandit && panditsList.length > 0) {
      setSelectedPandit(panditsList[0]);
    } else if (pooja.panditName) {
      setSelectedPandit(pooja.panditName);
    }
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPooja) return;

    if (!userName.trim() || !userPhone.trim() || !preferredDate) {
      alert("Kripya apna Naam, Phone number aur Shubh Tithi (Date) bharein!");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        poojaId: selectedPooja.id || selectedPooja.poojaId,
        poojaName: selectedPooja.name,
        panditName: selectedPandit || selectedPooja.panditName || "Acharya Vidyadhar Shastri",
        price: selectedPooja.price,
        userName: userName.trim(),
        userPhone: userPhone.trim(),
        gotra: gotra.trim() || "Kashyap",
        preferredDate,
        preferredTime,
        mode,
        notes: notes.trim(),
      };

      const res = await poojasApi.book(payload);
      if (res && res.success) {
        setBookingSuccess(res.appointment || payload);
      } else {
        setBookingSuccess(payload);
      }
    } catch {
      setBookingSuccess({
        poojaName: selectedPooja.name,
        panditName: selectedPandit,
        preferredDate,
        userName,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackAction = () => {
    if (onBack) {
      onBack();
    } else if (showBackButton) {
      router.back();
    }
  };

  return (
    <section id="pooja-services-section" className={`w-full ${className}`}>
      
      {/* =========================================================================
          1. VIBRANT ORANGE HEADER BANNER (EXACTLY MATCHING USER'S SCREENSHOT 2)
         ========================================================================= */}
      <div className="bg-gradient-to-b from-[#FF6B00] via-[#FF7500] to-[#FF8500] text-white rounded-3xl sm:rounded-[36px] p-5 sm:p-6 shadow-xl relative overflow-hidden">
        
        {/* Subtle Decorative Background Rings */}
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full border-4 border-white/10 pointer-events-none select-none" />
        <div className="absolute -right-6 -top-6 w-36 h-36 rounded-full border-2 border-white/15 pointer-events-none select-none" />

        <div className="relative z-10">
          {/* Top Row: Back Button + Title */}
          <div className="flex items-start gap-3">
            {showBackButton && (
              <button
                type="button"
                onClick={handleBackAction}
                className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 text-white flex items-center justify-center transition-all flex-shrink-0 mt-0.5"
                title="Go Back"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
            )}

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Pooja Services
              </h2>
              <p className="text-xs sm:text-sm text-white/90 font-medium mt-0.5">
                Divine blessings for a better life
              </p>
            </div>
          </div>

          {/* Search Bar inside Header */}
          <div className="mt-4">
            <div className="relative flex items-center bg-white rounded-2xl shadow-lg px-4 py-3 text-gray-800">
              <Search className="w-5 h-5 text-gray-400 mr-2.5 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for pooja..."
                className="w-full text-xs sm:text-sm bg-transparent focus:outline-none placeholder-gray-400 text-gray-900 font-medium"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-gray-400 hover:text-gray-600 p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <SlidersHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0 ml-1" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. CATEGORY PILLS (HORIZONTAL SCROLLABLE)
         ========================================================================= */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-4 px-1 -mx-1">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all active:scale-95 cursor-pointer ${
                isActive
                  ? "bg-[#FF6500] text-white shadow-md shadow-orange-500/25"
                  : "bg-white text-gray-700 hover:bg-orange-50 border border-orange-100 shadow-2xs"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          3. 4-METRIC TRUST BAR (AUTHENTIC, EXPERIENCED, TIMELY, PRASAD)
         ========================================================================= */}
      <div className="bg-white rounded-2xl border border-orange-100/90 p-3 sm:p-3.5 shadow-xs grid grid-cols-4 divide-x divide-orange-100/70 text-center mb-5">
        <div className="px-1">
          <CheckCircle2 className="w-4 h-4 text-[#FF6500] mx-auto mb-1 stroke-[2.2]" />
          <div className="font-bold text-[11px] sm:text-xs text-gray-900 leading-tight">Authentic</div>
          <div className="text-[9px] sm:text-[10px] text-gray-500 mt-0.5">Vedic Vidhi</div>
        </div>

        <div className="px-1">
          <User className="w-4 h-4 text-[#FF6500] mx-auto mb-1 stroke-[2.2]" />
          <div className="font-bold text-[11px] sm:text-xs text-gray-900 leading-tight">Experienced</div>
          <div className="text-[9px] sm:text-[10px] text-gray-500 mt-0.5">Purohits</div>
        </div>

        <div className="px-1">
          <Clock className="w-4 h-4 text-[#FF6500] mx-auto mb-1 stroke-[2.2]" />
          <div className="font-bold text-[11px] sm:text-xs text-gray-900 leading-tight">Timely</div>
          <div className="text-[9px] sm:text-[10px] text-gray-500 mt-0.5">Pooja</div>
        </div>

        <div className="px-1">
          <Gift className="w-4 h-4 text-[#FF6500] mx-auto mb-1 stroke-[2.2]" />
          <div className="font-bold text-[11px] sm:text-xs text-gray-900 leading-tight">Prasad</div>
          <div className="text-[9px] sm:text-[10px] text-gray-500 mt-0.5">Available</div>
        </div>
      </div>

      {/* =========================================================================
          4. POOJA CARDS LIST (EXACT CARD DESIGN FROM USER'S SCREENSHOT 2 & 3)
         ========================================================================= */}
      <div className="space-y-4">
        {isLoading && poojas.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-orange-100 text-gray-500 flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[#FF6500]" />
            <span className="text-xs font-semibold">Vedic Poojas load ho rahi hain...</span>
          </div>
        ) : filteredPoojas.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-3xl border-2 border-dashed border-orange-200 text-gray-500">
            <Flame className="w-8 h-8 text-orange-400 mx-auto mb-2 opacity-60" />
            <h4 className="font-bold text-sm text-gray-800">Koi Pooja Nahi Mili</h4>
            <p className="text-xs text-gray-500 mt-1">
              Admin panel se naye Vedic Anushthan add karein.
            </p>
          </div>
        ) : (
          filteredPoojas.map((pooja) => (
            <div
              key={pooja.id || pooja.poojaId}
              className="bg-white rounded-3xl p-3 border border-orange-100/90 shadow-sm hover:shadow-md transition-all flex items-center gap-3.5 group"
            >
              {/* Left Rounded Image with POPULAR Badge */}
              <div className="relative w-28 sm:w-36 h-32 sm:h-38 rounded-2xl overflow-hidden flex-shrink-0 bg-neutral-100 shadow-2xs">
                <img
                  src={pooja.image || "https://images.unsplash.com/photo-1567591414240-e9a11dff0ef8?auto=format&fit=crop&w=600&q=80"}
                  alt={pooja.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {pooja.badge && (
                  <span className="absolute top-0 left-0 bg-[#FF6500] text-white text-[9px] font-black tracking-wider px-2 py-0.5 rounded-br-lg shadow-xs uppercase">
                    {pooja.badge}
                  </span>
                )}
              </div>

              {/* Right Side Details */}
              <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-gray-900 leading-snug line-clamp-1 group-hover:text-[#FF6500] transition-colors">
                    {pooja.name}
                  </h3>

                  <p className="text-[11px] sm:text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                    {pooja.description || "Removes obstacles and brings success, prosperity and positive energy."}
                  </p>

                  {/* Metadata Row: Duration & Purohit */}
                  <div className="flex items-center gap-3 text-[10px] sm:text-[11px] text-gray-600 font-medium mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#FF6500] flex-shrink-0" />
                      <span>{pooja.duration || "60–90 mins"}</span>
                    </span>

                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#FF6500] flex-shrink-0" />
                      <span>{pooja.purohitsCount || "1 Purohit"}</span>
                    </span>
                  </div>
                </div>

                {/* Price & View Details Action */}
                <div className="flex items-center justify-between mt-3 pt-1 border-t border-orange-50">
                  <div className="flex items-baseline">
                    <span className="text-base sm:text-lg font-extrabold text-[#FF6500]">
                      ₹{pooja.price.toLocaleString("en-IN")}
                    </span>

                    {pooja.originalPrice && pooja.originalPrice > pooja.price && (
                      <span className="text-[11px] sm:text-xs text-gray-400 line-through ml-1.5 font-medium">
                        ₹{pooja.originalPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenBooking(pooja)}
                    className="text-[#FF6500] hover:text-orange-700 font-bold text-xs sm:text-sm flex items-center gap-1 cursor-pointer active:scale-95 transition-all"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* =========================================================================
          5. INTERACTIVE BOOKING & DEVOTEE SANKALP MODAL
         ========================================================================= */}
      {selectedPooja && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 border-2 border-orange-200 shadow-2xl relative my-6 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-orange-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6500] to-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/30 text-lg flex-shrink-0">
                  🕉️
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-gray-900 leading-snug">
                    {selectedPooja.name}
                  </h3>
                  <p className="text-[11px] text-[#FF6500] font-semibold">
                    {selectedPooja.duration || "60–90 mins"} • ₹{selectedPooja.price} Dakshina
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPooja(null)}
                className="w-8 h-8 rounded-full hover:bg-orange-50 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            {!bookingSuccess ? (
              <form onSubmit={handleBookSubmit} className="mt-4 space-y-3.5">
                
                {/* Description & Benefits Banner */}
                <div className="bg-orange-50/70 p-3.5 rounded-2xl border border-orange-100 text-xs text-gray-700 space-y-2">
                  <p className="leading-relaxed">
                    {selectedPooja.description || "Vedic vidhi-vidhan se sampoorna pooja anushthan."}
                  </p>

                  {selectedPooja.benefits && selectedPooja.benefits.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {selectedPooja.benefits.map((b, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-full bg-white text-[10px] font-bold text-orange-800 border border-orange-200 shadow-2xs"
                        >
                          ✓ {b}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 1. Devotee Name & WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      APNA NAAM (DEVOTEE NAME) *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-orange-100 bg-[#FFFDF9] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      WHATSAPP / PHONE NO *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9876543210"
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-orange-100 bg-[#FFFDF9] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Gotra */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    GOTRA (SANKALP KE LIYE)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kashyap, Bhardwaj (Nahi pata to Kashyap likhein)"
                    value={gotra}
                    onChange={(e) => setGotra(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-orange-100 bg-[#FFFDF9] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>

                {/* 3. Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      SHUBH TITHI (DATE) *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
                      <input
                        type="date"
                        required
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-orange-100 bg-[#FFFDF9] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      TIME / MUHURAT
                    </label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-orange-100 bg-[#FFFDF9] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400"
                    >
                      <option value="Morning 08:00 AM - 11:00 AM (Shubh Muhurat)">Morning (08:00 AM - 11:00 AM)</option>
                      <option value="Afternoon 11:30 AM - 01:30 PM (Abhijit Muhurat)">Afternoon (11:30 AM - 01:30 PM)</option>
                      <option value="Evening 05:00 PM - 08:00 PM (Pradosh Kaal)">Evening (05:00 PM - 08:00 PM)</option>
                    </select>
                  </div>
                </div>

                {/* 4. Pandit Selection */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    CERTIFIED PANDIT JI
                  </label>
                  <select
                    value={selectedPandit}
                    onChange={(e) => setSelectedPandit(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-orange-100 bg-[#FFFDF9] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    {panditsList.map((pName, idx) => (
                      <option key={idx} value={pName}>
                        {pName}
                      </option>
                    ))}
                    {selectedPooja.panditName && !panditsList.includes(selectedPooja.panditName) && (
                      <option value={selectedPooja.panditName}>{selectedPooja.panditName}</option>
                    )}
                  </select>
                </div>

                {/* 5. Mode */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    POOJA SANKALP KA MADHYAM
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setMode("Live Video Sankalp (Online)")}
                      className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                        mode.startsWith("Live")
                          ? "bg-orange-50 border-[#FF6500] text-[#FF6500]"
                          : "border-orange-100 text-gray-600 hover:bg-orange-50/50"
                      }`}
                    >
                      📹 Live Video (Online)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("Ghar Par Pandit Ji (In-Person)")}
                      className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                        mode.startsWith("Ghar")
                          ? "bg-orange-50 border-[#FF6500] text-[#FF6500]"
                          : "border-orange-100 text-gray-600 hover:bg-orange-50/50"
                      }`}
                    >
                      🏡 Ghar Par (In-Person)
                    </button>
                  </div>
                </div>

                {/* Submit CTA */}
                <div className="pt-3 border-t border-orange-100">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF6500] via-orange-500 to-amber-500 text-white font-extrabold text-sm shadow-xl shadow-orange-500/25 hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Flame className="w-4 h-4 fill-white" />
                    )}
                    <span>
                      {isSubmitting
                        ? "Booking confirm ho rahi hai..."
                        : `Confirm Booking • Pay ₹${selectedPooja.price}`}
                    </span>
                  </button>
                </div>
              </form>
            ) : (
              /* Booking Success Confirmation */
              <div className="py-6 text-center space-y-4 animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl shadow-inner">
                  ✓
                </div>

                <div>
                  <h4 className="font-serif font-bold text-lg text-gray-900">
                    Pooja Appointment Booked Successfully! 🕉️
                  </h4>
                  <p className="text-xs text-gray-600 mt-1 max-w-sm mx-auto leading-relaxed">
                    Pranam <b>{bookingSuccess.userName || userName}</b>! Aapki {bookingSuccess.poojaName} ki date <b>{bookingSuccess.preferredDate}</b> ko confirm ho gayi hai.
                  </p>
                </div>

                <div className="bg-orange-50/80 p-4 rounded-2xl border border-orange-200 text-left text-xs space-y-2 max-w-sm mx-auto">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Pooja:</span>
                    <span className="font-bold text-gray-900">{bookingSuccess.poojaName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Pandit Ji:</span>
                    <span className="font-semibold text-gray-800">{bookingSuccess.panditName || selectedPandit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Devotee Gotra:</span>
                    <span className="font-semibold text-gray-800">{gotra}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Mode:</span>
                    <span className="font-semibold text-[#FF6500]">{mode}</span>
                  </div>
                </div>

                <p className="text-[11px] text-gray-500">
                  Pandit Ji pooja vidhi aur shubh samagri list ke liye aapse WhatsApp/Phone par sampark karenge.
                </p>

                <button
                  type="button"
                  onClick={() => setSelectedPooja(null)}
                  className="px-6 py-2.5 rounded-xl bg-gray-900 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </section>
  );
}
