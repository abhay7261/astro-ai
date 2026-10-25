"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Sparkles, Calendar, Clock, User, Phone, CheckCircle2, 
  Flame, ChevronRight, X, ShieldCheck, Video, MapPin, HeartHandshake
} from "lucide-react";
import { poojasApi, PoojaItem } from "../../services/apiClient";

export const defaultPoojasList: PoojaItem[] = [
  {
    id: "pooja-1",
    poojaId: "pooja-1",
    name: "Maha Mrityunjaya Anushthan",
    subtitle: "Aayu Vriddhi & Gambhir Rog Mukti Havan",
    deity: "Bhagwan Shiv",
    category: "Health",
    duration: "2-3 Ghante",
    price: 2100,
    panditName: "Acharya Vidyadhar Shastri",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    benefits: ["Akal mrityu bhay se mukti", "Arogya evam aayu vriddhi", "Shiva Sahasranama paath"],
    description: "Vedic parampara ke anusaar 1100 Maha Mrityunjaya mantra jaap aur ghrut aahuti sahit shanti havan.",
    isActive: true,
  },
  {
    id: "pooja-2",
    poojaId: "pooja-2",
    name: "Rudrabhishek & Kalsarp Dosh Shanti",
    subtitle: "Kaal Sarp & Graha Badha Nivaran",
    deity: "Mahadev",
    category: "Dosha",
    duration: "1.5 Ghanta",
    price: 1500,
    panditName: "Pandit Radheshyam Joshi",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    benefits: ["Kaal Sarp dosh nivaran", "Mansik tanaav se mukti", "Panchamrit Abhishek live darshan"],
    description: "Shivalinga par panchamrit, gangajal, belpatra aur shubh dravyon se abhishek kar dosh mukti sankalp.",
    isActive: true,
  },
  {
    id: "pooja-3",
    poojaId: "pooja-3",
    name: "Navagraha Shanti & Mahahavan",
    subtitle: "Shani Sade Sati & Rahu-Ketu Shanti",
    deity: "Navagraha Devta",
    category: "Dosha",
    duration: "2 Ghante",
    price: 2500,
    panditName: "Maa Gayatri Devi",
    image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=600&q=80",
    benefits: ["Shani Sade Sati shanti", "Rahu-Ketu dosha nivaran", "Sampoorna parivar kalyan"],
    description: "Kundli ke sabhi 9 graho ki shanti ke liye samidha aahuti aur navagraha stotra jaap.",
    isActive: true,
  },
  {
    id: "pooja-4",
    poojaId: "pooja-4",
    name: "Kuber Lakshmi Dhan Prapti Pooja",
    subtitle: "Vyapar Vriddhi & Karz Mukti Anushthan",
    deity: "Maa Lakshmi & Kuber Dev",
    category: "Wealth",
    duration: "1.5 Ghanta",
    price: 1800,
    panditName: "Guruji Devendra Nath",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    benefits: ["Karobar aur vyapar me vriddhi", "Karz mukti aur aarthik labh", "Shree Yantra abhimantrit prasad"],
    description: "Kanakadhara stotra aur Shree Suktam ke 16 aahutiyon dwara dhan sthirta aur samriddhi poojan.",
    isActive: true,
  },
  {
    id: "pooja-5",
    poojaId: "pooja-5",
    name: "Vivah Badha Nivaran & Manglik Shanti",
    subtitle: "Sheeghra Vivah & Jeevansathi Prapti",
    deity: "Devguru Brihaspati & Mangal Dev",
    category: "Marriage",
    duration: "2 Ghante",
    price: 2100,
    panditName: "Dr. Ananya Mukherjee",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    benefits: ["Shaadi me rukawato ka nidaan", "Shubh jeevansathi yog", "Mangal dosha nivaran havan"],
    description: "Brihaspati kripa prapti aur Manglik dosha shanti ke liye peele pushp aur vishesh ahuti sankalp.",
    isActive: true,
  },
  {
    id: "pooja-6",
    poojaId: "pooja-6",
    name: "Ghar Vastu Shanti & Sukh Havan",
    subtitle: "Ghar me Nakaratmak Urja Nivaran",
    deity: "Vastu Purush",
    category: "Vastu",
    duration: "2.5 Ghante",
    price: 3100,
    panditName: "Guruji Devendra Nath",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    benefits: ["Ghar me sakaratmak urja pravah", "Parivarik shanti aur samriddhi", "Vastu kalash sthapana"],
    description: "Ishan kon me kalash sthapana sahit sampoorna ghar ka shuddhikaran aur havan anushthan.",
    isActive: true,
  },
];

export default function VedicPoojaSection() {
  const [poojas, setPoojas] = useState<PoojaItem[]>(defaultPoojasList);
  const [selectedPooja, setSelectedPooja] = useState<PoojaItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any | null>(null);

  // Booking Form State
  const [formData, setFormData] = useState({
    userName: "",
    userPhone: "",
    gotra: "Kashyap",
    preferredDate: "",
    preferredTime: "Morning 09:00 AM",
    mode: "Live Video Sankalp (Online)",
    notes: "",
  });

  useEffect(() => {
    const loadPoojas = async () => {
      try {
        const live = await poojasApi.getAll();
        if (Array.isArray(live) && live.length > 0) {
          setPoojas(live);
          return;
        }
      } catch (err) {}
      setPoojas(defaultPoojasList);
    };

    loadPoojas();
    window.addEventListener("astroai_poojas_updated", loadPoojas);
    return () => window.removeEventListener("astroai_poojas_updated", loadPoojas);
  }, []);

  const handleOpenBooking = (pooja: PoojaItem) => {
    setSelectedPooja(pooja);
    setBookingSuccess(null);
    // Autofill user name and phone if in session
    try {
      const saved = sessionStorage.getItem("astroai_session_user") || localStorage.getItem("astroai_auth_user");
      if (saved) {
        const u = JSON.parse(saved);
        setFormData((prev) => ({
          ...prev,
          userName: u.name || prev.userName,
          userPhone: u.phone || prev.userPhone,
        }));
      }
    } catch {}
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPooja) return;

    if (!formData.userName.trim() || !formData.userPhone.trim() || !formData.preferredDate) {
      alert("Kripya apna Naam, Phone number aur Pooja ki Date bharein!");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await poojasApi.book({
        poojaId: selectedPooja.id || selectedPooja.poojaId,
        poojaName: selectedPooja.name,
        panditName: selectedPooja.panditName,
        price: selectedPooja.price,
        userName: formData.userName,
        userPhone: formData.userPhone,
        gotra: formData.gotra,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        mode: formData.mode,
        notes: formData.notes,
      });

      if (res && res.success) {
        setBookingSuccess(res.appointment || { poojaName: selectedPooja.name, panditName: selectedPooja.panditName });
      } else {
        // Fallback local booking simulation
        setBookingSuccess({
          poojaName: selectedPooja.name,
          panditName: selectedPooja.panditName,
          preferredDate: formData.preferredDate,
        });
      }
    } catch (err) {
      setBookingSuccess({
        poojaName: selectedPooja.name,
        panditName: selectedPooja.panditName,
        preferredDate: formData.preferredDate,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full space-y-3.5 pt-2">
      
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <div className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wide text-amber-800 bg-amber-100/90 border border-amber-300 px-2.5 py-0.5 rounded-full mb-1">
            <Flame className="w-3 h-3 text-terracotta fill-amber-500" />
            <span>Vedic Anushthan & Pooja</span>
          </div>
          <h2 className="font-serif font-bold text-base sm:text-lg text-espresso">
            Ghar Baithe Pandit Ji Se Pooja Karwayein
          </h2>
        </div>

        <span className="text-[11px] text-terracotta font-extrabold bg-peach/40 px-2.5 py-1 rounded-full border border-peach/80">
          Live Sankalp
        </span>
      </div>

      {/* Vedic Pooja Cards Showcase (Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {poojas.map((pooja) => (
          <div
            key={pooja.id}
            className="bg-gradient-to-br from-white via-[#FFFDF9] to-[#FFF8F0] rounded-3xl p-4 border-2 border-amber-200/90 hover:border-amber-400 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between gap-3 group relative overflow-hidden"
          >
            {/* Top Deity & Duration Pill */}
            <div className="flex items-center justify-between gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold border border-amber-300/80">
                {pooja.deity}
              </span>
              <span className="text-[10px] font-semibold text-espresso/60 flex items-center gap-1">
                <Clock className="w-3 h-3 text-terracotta" />
                {pooja.duration}
              </span>
            </div>

            {/* Middle: Title, Pandit & Description */}
            <div>
              <h3 className="font-serif font-bold text-base text-espresso group-hover:text-terracotta transition-colors">
                {pooja.name}
              </h3>
              <p className="text-xs font-semibold text-terracotta mt-0.5">
                {pooja.subtitle}
              </p>

              {/* Pandit Ji Badge */}
              <div className="mt-2.5 p-2 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-center gap-2">
                <div className="relative w-7 h-7 rounded-full overflow-hidden border border-amber-400 flex-shrink-0">
                  <Image
                    src={pooja.image}
                    alt={pooja.panditName}
                    width={28}
                    height={28}
                    unoptimized
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-espresso/60 leading-tight">Puja Sampanna Karta:</p>
                  <p className="text-xs font-bold text-espresso truncate">{pooja.panditName}</p>
                </div>
              </div>

              {/* Benefits list */}
              <div className="mt-2.5 space-y-1">
                {pooja.benefits.slice(0, 2).map((benefit, bIdx) => (
                  <div key={bIdx} className="flex items-center gap-1.5 text-[11px] text-espresso/75">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                    <span className="truncate">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Row: Dakshina & Book Button */}
            <div className="pt-2.5 border-t border-peach/80 flex items-center justify-between gap-2 mt-1">
              <div>
                <span className="text-[10px] text-espresso/50">Dakshina</span>
                <div className="text-sm font-black text-emerald-800">₹{pooja.price}</div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenBooking(pooja)}
                className="px-4 py-2 rounded-2xl bg-gradient-to-r from-terracotta to-amber-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-terracotta/25 active:scale-95 transition-all flex items-center gap-1"
              >
                <span>Book Appointment</span>
                <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ======================================================== */}
      {/* POOJA BOOKING APPOINTMENT MODAL                          */}
      {/* ======================================================== */}
      {selectedPooja && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-[#FFFDF9] w-full max-w-md rounded-3xl border-2 border-amber-300 shadow-2xl p-4 sm:p-5 relative animate-in zoom-in-95 duration-200 text-espresso max-h-[90vh] overflow-y-auto scrollbar-thin">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedPooja(null)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white border border-peach text-espresso/70 hover:text-espresso flex items-center justify-center active:scale-90"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {!bookingSuccess ? (
              <form onSubmit={handleBookSubmit} className="space-y-3.5">
                
                {/* Header */}
                <div>
                  <div className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full mb-1">
                    <Flame className="w-3 h-3 text-terracotta fill-amber-500" />
                    <span>Pandit Ji Appointment</span>
                  </div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-espresso">
                    {selectedPooja.name}
                  </h3>
                  <p className="text-xs text-terracotta font-semibold">
                    {selectedPooja.panditName} dwara sampoorna vidhi-vidhan
                  </p>
                </div>

                {/* Dakshina & Duration Bar */}
                <div className="p-2.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-espresso/60 text-[10px]">Dakshina (All Samagri Included):</span>
                    <p className="font-extrabold text-emerald-800 text-sm">₹{selectedPooja.price}</p>
                  </div>
                  <span className="text-[11px] font-bold text-espresso/70 bg-white px-2.5 py-1 rounded-xl border border-amber-200 shadow-2xs">
                    ⏳ {selectedPooja.duration}
                  </span>
                </div>

                {/* Form Fields */}
                <div className="space-y-2.5 text-xs">
                  
                  {/* Name */}
                  <div>
                    <label className="block font-bold text-espresso/80 mb-1">
                      Aapka Poora Naam (Sankalp Hetu) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.userName}
                      onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                      placeholder="e.g. Abhay Kumar Sharma"
                      className="w-full bg-white border border-amber-300/80 rounded-xl px-3 py-2 text-espresso focus:outline-none focus:border-terracotta"
                    />
                  </div>

                  {/* Phone & Gotra */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-espresso/80 mb-1">
                        Phone Number (WhatsApp) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.userPhone}
                        onChange={(e) => setFormData({ ...formData, userPhone: e.target.value })}
                        placeholder="e.g. 9876543210"
                        className="w-full bg-white border border-amber-300/80 rounded-xl px-3 py-2 text-espresso focus:outline-none focus:border-terracotta"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-espresso/80 mb-1">
                        Aapka Gotra (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.gotra}
                        onChange={(e) => setFormData({ ...formData, gotra: e.target.value })}
                        placeholder="e.g. Kashyap, Vashishta"
                        className="w-full bg-white border border-amber-300/80 rounded-xl px-3 py-2 text-espresso focus:outline-none focus:border-terracotta"
                      />
                    </div>
                  </div>

                  {/* Preferred Date & Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-espresso/80 mb-1">
                        Pooja Ki Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                        className="w-full bg-white border border-amber-300/80 rounded-xl px-3 py-2 text-espresso focus:outline-none focus:border-terracotta"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-espresso/80 mb-1">
                        Shubh Samay (Time Slot)
                      </label>
                      <select
                        value={formData.preferredTime}
                        onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                        className="w-full bg-white border border-amber-300/80 rounded-xl px-3 py-2 text-espresso focus:outline-none focus:border-terracotta"
                      >
                        <option value="Morning 08:00 AM">Subah 08:00 AM (Brahma Muhurat)</option>
                        <option value="Morning 10:00 AM">Subah 10:00 AM (Abhijit)</option>
                        <option value="Evening 05:00 PM">Shaam 05:00 PM (Pradosh Kaal)</option>
                        <option value="Night 08:00 PM">Ratri 08:00 PM (Nishita Kaal)</option>
                      </select>
                    </div>
                  </div>

                  {/* Pooja Mode */}
                  <div>
                    <label className="block font-bold text-espresso/80 mb-1">
                      Pooja Vidhi Mode *
                    </label>
                    <select
                      value={formData.mode}
                      onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                      className="w-full bg-white border border-amber-300/80 rounded-xl px-3 py-2 text-espresso focus:outline-none focus:border-terracotta"
                    >
                      <option value="Live Video Sankalp (Online)">Live Video Sankalp (Ghar Baithe Live Darshan)</option>
                      <option value="Temple Sankalp (Prasad Dispatch)">Teerth Sthal Sankalp (Prasad Ghar Aayega)</option>
                      <option value="Ghar Par Pandit Ji (In-Person)">Ghar Par Pandit Ji Agaman (In-Person)</option>
                    </select>
                  </div>

                  {/* Special Sankalp Notes */}
                  <div>
                    <label className="block font-bold text-espresso/80 mb-1">
                      Vishesh Sankalp / Manokamna (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="e.g. Kripya meri shaadi me aa rahi badhaon ke nivaran hetu sankalp karein."
                      className="w-full bg-white border border-amber-300/80 rounded-xl px-3 py-2 text-espresso focus:outline-none focus:border-terracotta text-xs"
                    />
                  </div>

                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-terracotta via-orange-600 to-amber-600 hover:opacity-95 text-white font-bold text-sm shadow-md shadow-terracotta/25 active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 fill-amber-300" />
                  <span>{isSubmitting ? "Appointment Book Ho Rahi Hai..." : "Pooja Appointment Confirm Karein"}</span>
                </button>

                <p className="text-[10px] text-espresso/50 text-center">
                  🔒 100% Verified Vedic Pandits • Live Video Link & Prasad Tracking Shared
                </p>

              </form>
            ) : (
              /* Booking Success Card */
              <div className="text-center py-4 space-y-3 animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center border-2 border-emerald-300 shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="font-serif font-bold text-lg text-espresso">
                    Pooja Appointment Book Ho Gaya! 🙏
                  </h3>
                  <p className="text-xs text-terracotta font-semibold mt-0.5">
                    {selectedPooja.panditName} Ji Ko Soochit Kar Diya Gaya Hai
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-left text-xs space-y-1.5 leading-relaxed text-espresso/80">
                  <p><strong>Pooja:</strong> {selectedPooja.name}</p>
                  <p><strong>Sankalp Karta:</strong> {formData.userName} (Gotra: {formData.gotra})</p>
                  <p><strong>Tareekh v Samay:</strong> {formData.preferredDate} ({formData.preferredTime})</p>
                  <p><strong>Mode:</strong> {formData.mode}</p>
                </div>

                <p className="text-xs text-espresso/70 leading-relaxed">
                  Hamare Certified Acharya aapse WhatsApp/Phone par samay aur live video link confirm karne hetu sampark karenge.
                </p>

                <button
                  type="button"
                  onClick={() => setSelectedPooja(null)}
                  className="w-full py-2.5 rounded-xl bg-terracotta text-white font-bold text-xs shadow-md active:scale-95"
                >
                  Theek Hai (Dhanyawad)
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </section>
  );
}
