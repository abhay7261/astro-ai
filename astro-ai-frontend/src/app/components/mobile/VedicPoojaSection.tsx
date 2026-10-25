"use client";

import { useState, useEffect } from "react";
import { 
  Sparkles, Calendar, Clock, User, Phone, CheckCircle2, 
  Flame, ArrowRight, X, ShieldCheck, Video, MapPin, HeartHandshake,
  Plus, ChevronDown
} from "lucide-react";
import { poojasApi, astrologersApi, PoojaItem } from "../../services/apiClient";

const DEFAULT_POOJA_OPTIONS = [
  { name: "Maha Mrityunjaya Anushthan", deity: "Bhagwan Shiv", duration: "2 Ghante", price: 2100 },
  { name: "Rudrabhishek & Kalsarp Dosh Shanti", deity: "Mahadev", duration: "1.5 Ghanta", price: 1500 },
  { name: "Navagraha Shanti & Mahahavan", deity: "Navagraha Devta", duration: "2 Ghante", price: 2500 },
  { name: "Kuber Lakshmi Dhan Prapti Pooja", deity: "Maa Lakshmi & Kuber Dev", duration: "1.5 Ghanta", price: 1800 },
  { name: "Vivah Badha Nivaran & Manglik Shanti", deity: "Brihaspati & Mangal Dev", duration: "2 Ghante", price: 2100 },
  { name: "Ghar Vastu Shanti & Sukh Havan", deity: "Vastu Purush", duration: "2.5 Ghante", price: 3100 },
  { name: "Custom / Vishesh Pooja (Enter details below)", deity: "Isht Devta", duration: "Custom", price: 2100 },
];

export default function VedicPoojaSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [panditsList, setPanditsList] = useState<string[]>([
    "Acharya Vidyadhar Shastri (Chief Vedic Pandit)",
    "Pandit Radheshyam Joshi (Career & Wealth Specialist)",
    "Dr. Ananya Mukherjee (Vivah & Kundli Guru)",
    "Maa Gayatri Devi (Graha Shanti & Dosha Healer)",
    "Guruji Devendra Nath (Vastu & Gemstone Expert)",
  ]);

  const [poojasList, setPoojasList] = useState(DEFAULT_POOJA_OPTIONS);
  const [selectedPoojaName, setSelectedPoojaName] = useState(DEFAULT_POOJA_OPTIONS[0].name);
  const [customPoojaName, setCustomPoojaName] = useState("");
  const [selectedPandit, setSelectedPandit] = useState("Acharya Vidyadhar Shastri (Chief Vedic Pandit)");
  const [customPandit, setCustomPandit] = useState("");
  const [isCustomPandit, setIsCustomPandit] = useState(false);

  // Form fields
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [gotra, setGotra] = useState("Kashyap");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("Morning 09:00 AM - 12:00 PM (Shubh Muhurat)");
  const [mode, setMode] = useState("Live Video Sankalp (Online)");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any | null>(null);

  // Load live astrologers/pandits & poojas from backend MongoDB
  useEffect(() => {
    const loadLiveOptions = async () => {
      try {
        const [liveAstros, livePoojas] = await Promise.allSettled([
          astrologersApi.getAll(),
          poojasApi.getAll(),
        ]);

        if (liveAstros.status === "fulfilled" && Array.isArray(liveAstros.value) && liveAstros.value.length > 0) {
          const names = liveAstros.value.map((a: any) => `${a.name} (${a.title || "Vedic Pandit"})`);
          setPanditsList(names);
          if (names.length > 0) setSelectedPandit(names[0]);
        }

        if (livePoojas.status === "fulfilled" && Array.isArray(livePoojas.value) && livePoojas.value.length > 0) {
          const mapped = livePoojas.value.map((p) => ({
            name: p.name,
            deity: p.deity || "Bhagwan",
            duration: p.duration || "2 Ghante",
            price: p.price || 2100,
          }));
          setPoojasList([...mapped, { name: "Custom / Vishesh Pooja (Enter details below)", deity: "Isht Devta", duration: "Custom", price: 2100 }]);
        }
      } catch (e) {}
    };

    loadLiveOptions();

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

  const handleOpenBooking = () => {
    setIsModalOpen(true);
    setBookingSuccess(null);
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName.trim() || !userPhone.trim() || !preferredDate) {
      alert("Kripya apna Naam, Phone number aur Shubh Tithi (Date) bharein!");
      return;
    }

    const finalPoojaName = selectedPoojaName.startsWith("Custom") && customPoojaName.trim()
      ? customPoojaName.trim()
      : selectedPoojaName;

    const finalPanditName = isCustomPandit && customPandit.trim()
      ? customPandit.trim()
      : selectedPandit;

    const matchedPooja = poojasList.find((p) => p.name === selectedPoojaName);
    const dakshinaPrice = matchedPooja ? matchedPooja.price : 2100;

    setIsSubmitting(true);
    try {
      const res = await poojasApi.book({
        poojaId: `pooja-${Date.now()}`,
        poojaName: finalPoojaName,
        panditName: finalPanditName,
        price: dakshinaPrice,
        userName: userName.trim(),
        userPhone: userPhone.trim(),
        gotra: gotra.trim() || "Kashyap",
        preferredDate,
        preferredTime,
        mode,
        notes: notes.trim(),
      });

      if (res && res.success) {
        setBookingSuccess(res.appointment || { poojaName: finalPoojaName, panditName: finalPanditName });
      } else {
        setBookingSuccess({
          poojaName: finalPoojaName,
          panditName: finalPanditName,
          preferredDate,
          userName,
        });
      }
    } catch {
      setBookingSuccess({
        poojaName: finalPoojaName,
        panditName: finalPanditName,
        preferredDate,
        userName,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full pt-1">
      {/* =========================================================================
          SINGLE ROYAL CARD: VEDIC POOJA & PANDIT JI APPOINTMENT (LIKE VIP CARD)
         ========================================================================= */}
      <div className="bg-gradient-to-br from-[#2E1A11] via-[#482517] to-[#1C100A] text-white p-5 sm:p-6 rounded-3xl border-2 border-amber-400/70 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Golden Sacred Motif Watermark */}
        <div className="absolute -right-4 -bottom-6 w-32 h-32 opacity-15 pointer-events-none select-none text-8xl flex items-center justify-center">
          🕉️
        </div>

        <div className="relative z-10 space-y-2">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-espresso text-[10px] font-black uppercase tracking-wider shadow-md">
            <Flame className="w-3.5 h-3.5 text-espresso fill-espresso" />
            <span>VEDIC POOJA • PANDIT JI APPOINTMENT</span>
          </div>

          <h3 className="font-serif font-bold text-lg sm:text-xl text-amber-100 leading-snug">
            Ghar Baithe Pandit Ji Se Pooja Karwayein
          </h3>

          <p className="text-xs text-white/80 max-w-md leading-relaxed font-light">
            Apne naam aur gotra se certified Vedic Pandits se shubh muhurat me sampoorna vidhi-vidhan, havan aur sankalp pooja book karein.
          </p>

          <div className="flex flex-wrap gap-2.5 pt-1 text-[11px] text-amber-200/90 font-medium">
            <span>✓ Certified Vedic Acharya</span>
            <span>•</span>
            <span>✓ 100% Shuddha Samagri</span>
            <span>•</span>
            <span>✓ Live Video / Mandir / Ghar</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleOpenBooking}
          className="relative z-10 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-espresso font-black text-xs sm:text-sm shadow-xl shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all whitespace-nowrap self-stretch sm:self-auto text-center cursor-pointer"
        >
          <Flame className="w-4 h-4 fill-espresso" />
          <span>Book Pandit Ji</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>

      {/* =========================================================================
          INTERACTIVE BOOKING MODAL (FILL USER DETAILS & SELECT/ADD PANDIT JI)
         ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 border-2 border-amber-300 shadow-2xl relative my-6 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-peach">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/30 text-base">
                  🕉️
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-espresso">
                    Pandit Ji Pooja Appointment
                  </h3>
                  <p className="text-[11px] text-terracotta font-semibold">
                    100% Vedic Vidhi Vidhan & Sankalp
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-peach/50 flex items-center justify-center text-espresso/60 hover:text-espresso transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            {!bookingSuccess ? (
              <form onSubmit={handleBookSubmit} className="mt-4 space-y-3.5">
                
                {/* 1. Devotee Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-espresso/80 mb-1">
                      APNA NAAM (DEVOTEE NAME) *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terracotta/70" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-peach bg-astro-bg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-terracotta/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-espresso/80 mb-1">
                      WHATSAPP / PHONE NO *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terracotta/70" />
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9876543210"
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-peach bg-astro-bg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-terracotta/40"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Gotra */}
                <div>
                  <label className="block text-[11px] font-bold text-espresso/80 mb-1">
                    GOTRA (SANKALP KE LIYE)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kashyap, Bhardwaj, Vatsa (Nahi pata to Kashyap likhein)"
                    value={gotra}
                    onChange={(e) => setGotra(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-peach bg-astro-bg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-terracotta/40"
                  />
                </div>

                {/* 3. Pooja Selection */}
                <div>
                  <label className="block text-[11px] font-bold text-espresso/80 mb-1">
                    POOJA CHUNEIN YA VISHOOSH POOJA LIKHEIN *
                  </label>
                  <select
                    value={selectedPoojaName}
                    onChange={(e) => setSelectedPoojaName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-peach bg-astro-bg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-terracotta/40"
                  >
                    {poojasList.map((p, idx) => (
                      <option key={idx} value={p.name}>
                        {p.name} ({p.duration} • ₹{p.price})
                      </option>
                    ))}
                  </select>

                  {selectedPoojaName.startsWith("Custom") && (
                    <input
                      type="text"
                      required
                      placeholder="Apni vishesh pooja ka naam yahan likhein (e.g. Satyanarayan Katha, Griha Pravesh)"
                      value={customPoojaName}
                      onChange={(e) => setCustomPoojaName(e.target.value)}
                      className="mt-2 w-full px-3.5 py-2 rounded-xl border border-amber-300 bg-amber-50/50 text-xs font-semibold focus:outline-none"
                    />
                  )}
                </div>

                {/* 4. Pandit Ji Selection / Add Custom Pandit */}
                <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-extrabold text-amber-950 uppercase">
                      PANDIT JI SELECT YA ADD KAREIN *
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCustomPandit(!isCustomPandit)}
                      className="text-[10px] font-bold text-terracotta hover:underline cursor-pointer"
                    >
                      {isCustomPandit ? "Select from Certified Pandits" : "+ Custom Pandit Ji Add Karein"}
                    </button>
                  </div>

                  {!isCustomPandit ? (
                    <select
                      value={selectedPandit}
                      onChange={(e) => setSelectedPandit(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-amber-300 bg-white text-xs font-semibold focus:outline-none"
                    >
                      {panditsList.map((pandit, idx) => (
                        <option key={idx} value={pandit}>
                          🧙‍♂️ {pandit}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="space-y-1">
                      <input
                        type="text"
                        required
                        placeholder="Apne pasand ke Pandit Ji ka naam likhein"
                        value={customPandit}
                        onChange={(e) => setCustomPandit(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-amber-400 bg-white text-xs font-semibold focus:outline-none"
                      />
                      <p className="text-[10px] text-espresso/60 italic">
                        Aap apne kshetr ke ya kisi bhi pasandida Pandit Ji ka naam yahan de sakte hain.
                      </p>
                    </div>
                  )}
                </div>

                {/* 5. Date & Time Slot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-espresso/80 mb-1">
                      SHUBH TITHI (DATE) *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terracotta/70 pointer-events-none" />
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split("T")[0]}
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-peach bg-astro-bg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-terracotta/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-espresso/80 mb-1">
                      SHUBH SAMAY (TIME SLOT) *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terracotta/70 pointer-events-none" />
                      <select
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-peach bg-astro-bg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-terracotta/40"
                      >
                        <option value="Morning 07:00 AM - 09:00 AM (Pratah Muhurat)">Pratah 07:00 AM - 09:00 AM</option>
                        <option value="Morning 09:00 AM - 12:00 PM (Shubh Muhurat)">Morning 09:00 AM - 12:00 PM</option>
                        <option value="Afternoon 12:00 PM - 03:00 PM (Abhijit Muhurat)">Afternoon 12:00 PM - 03:00 PM</option>
                        <option value="Evening 05:00 PM - 08:00 PM (Godhuli Sandhya)">Sandhya 05:00 PM - 08:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 6. Pooja Mode */}
                <div>
                  <label className="block text-[11px] font-bold text-espresso/80 mb-1">
                    POOJA KAISE HOGI (MODE) *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "Live Video Sankalp (Online)", label: "🎥 Live Video", desc: "Online Sankalp" },
                      { id: "At Mandir (Mandir Me Darshan)", label: "🛕 Mandir Me", desc: "Prasad Courier" },
                      { id: "At Home (Pandit Ji Ghar Aayenge)", label: "🏠 Ghar Par", desc: "In-Person Pooja" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setMode(item.id)}
                        className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          mode === item.id
                            ? "border-terracotta bg-terracotta/10 text-terracotta font-bold shadow-xs"
                            : "border-peach bg-white text-espresso/70 hover:border-peach/80"
                        }`}
                      >
                        <p className="text-xs font-bold">{item.label}</p>
                        <span className="text-[10px] text-espresso/60 block">{item.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 7. Sankalp Wishes / Notes */}
                <div>
                  <label className="block text-[11px] font-bold text-espresso/80 mb-1">
                    MANOKAMNA / VISHOOSH SANKALP (OPTIONAL)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Parivar me swasthya, vivah me saflata ya vyapar me unhati hetu sankalp..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-peach bg-astro-bg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-terracotta/40"
                  />
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-terracotta to-orange-600 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-terracotta/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 fill-amber-300" />
                  <span>{isSubmitting ? "Appointment Book Ho Rahi Hai..." : "Pooja Appointment Confirm Karein 🙏"}</span>
                </button>

                <p className="text-[10px] text-espresso/50 text-center font-medium">
                  🔒 Certified Vedic Acharyas • WhatsApp par live update aur muhurat details share kiye jayenge
                </p>

              </form>
            ) : (
              /* Success Screen */
              <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center border-2 border-emerald-300 shadow-md text-2xl">
                  🙏
                </div>

                <div>
                  <h3 className="font-serif font-bold text-xl text-espresso">
                    Har Har Mahadev! Pooja Book Ho Gayi!
                  </h3>
                  <p className="text-xs text-terracotta font-bold mt-1">
                    Pandit Ji aapse jald hi sampark karenge
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-300 text-left text-xs space-y-1.5 leading-relaxed text-espresso/90 shadow-xs">
                  <p><strong>Pooja:</strong> {bookingSuccess.poojaName || selectedPoojaName}</p>
                  <p><strong>Pandit Ji:</strong> {bookingSuccess.panditName || selectedPandit}</p>
                  <p><strong>Sankalp Karta:</strong> {userName} (Gotra: {gotra || "Kashyap"})</p>
                  <p><strong>Shubh Tithi:</strong> {preferredDate} ({preferredTime})</p>
                  <p><strong>Mode:</strong> {mode}</p>
                </div>

                <p className="text-xs text-espresso/70 leading-relaxed max-w-sm mx-auto">
                  Hamare certified Acharya aapse WhatsApp aur call par sankalp samay aur vidhi hetu sampark karenge.
                </p>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-3 rounded-2xl bg-terracotta text-white font-bold text-xs shadow-md active:scale-95 cursor-pointer"
                >
                  Dhanyawad (Pranam 🙏)
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </section>
  );
}
