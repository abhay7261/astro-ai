/**
 * AstroAI — AI Astrologer Service Layer
 * 
 * NOTE FOR BACKEND INTEGRATION:
 * When your friend's backend is ready, simply change `USE_REAL_BACKEND` to `true`
 * and update `BACKEND_API_URL` to your friend's API endpoint (e.g., http://localhost:5000/api/ai-chat).
 */

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  remedy?: string;
  mantra?: string;
  timestamp: string;
}

export interface UserAstrologicalContext {
  name?: string;
  dob?: string;
  tob?: string;
  pob?: string;
  rashi?: string;
  lagna?: string;
}

// CONNECTED TO LIVE NODE.JS BACKEND
export const USE_REAL_BACKEND = true;
export const getBackendApiUrl = () => {
  if (typeof window !== "undefined") {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1") + "/ai/chat";
    }
  }
  return "https://astro-ai-x5c6.onrender.com/api/v1/ai/chat";
};
export const BACKEND_API_URL = getBackendApiUrl();

/**
 * Sends a question to the AI Astrologer.
 * Automatically switches between intelligent client-side Vedic simulation and real backend API.
 */
export async function sendAIAstrologerMessage(
  userQuery: string,
  context?: UserAstrologicalContext
): Promise<{ text: string; remedy?: string; mantra?: string }> {
  const qClean = userQuery.trim().toLowerCase();
  const userName = context?.name || "Seeker";

  // Fast-path instant response for Vedic Greetings (< 200ms)
  if (
    qClean === "ram ram" || qClean === "ram ram ji" ||
    qClean === "hari om" || qClean === "hari om ji" ||
    qClean === "namaste" || qClean === "namaste ji" ||
    qClean === "pranam" || qClean === "pranam pandit ji" ||
    qClean.includes("radhe radhe") || qClean.includes("jai shree ram") ||
    qClean === "hello" || qClean === "hi"
  ) {
    return {
      text: `राम राम! 🙏 प्रणाम ${userName}। आपका AstroAI में स्वागत है। कहिए, आज ग्रह-नक्षत्र आपके जीवन के किस पहलू (विवाह, करियर, धन, या स्वास्थ्य) पर आपका मार्गदर्शन कर सकते हैं? आप बेझिझक अपना प्रश्न पूछें।`,
      remedy: "दिन की शुरुआत सूर्य देव को तांबे के लोटे से अर्घ्य देकर और गायत्री मंत्र के जप से करें।",
      mantra: "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्",
    };
  }

  // If live backend is enabled, make real HTTP POST request with 15s timeout
  if (USE_REAL_BACKEND) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      const targetUrl = getBackendApiUrl();

      const response = await fetch(targetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          message: userQuery,
          context: context || {},
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      return {
        text: data.reply || data.text,
        remedy: data.remedy,
        mantra: data.mantra,
      };
    } catch (err) {
      console.warn("Backend API timeout/error, falling back to instant Vedic engine:", err);
      // Fallback to local high-speed Vedic engine if server is cold or slow
    }
  }

  // Simulate realistic AI planetary thinking delay (1.4 seconds)
  await new Promise((resolve) => setTimeout(resolve, 1400));

  const query = userQuery.toLowerCase();

  // 1. Marriage / Love / Relationship
  if (
    query.includes("shaadi") || 
    query.includes("shadi") || 
    query.includes("marriage") || 
    query.includes("love") || 
    query.includes("prem") ||
    query.includes("vivah")
  ) {
    return {
      text: `Pranam ${userName}! 🙏 Aapki kundli ke Saptam Bhaav (7th House) aur Vivah Karaka grah 'Brihaspati' (Guru) aur 'Shukra' ka vishleshan karne par pata chalta hai ki agle 8 se 14 mahine ke beech vivah ke prabal yog ban rahe hain. \n\nAgar kisi rishte me delay ya rukawat aa rahi hai, toh Shukra aur Guru ki drishti ko anukool banana hoga. Vivah me parivar ka poora sahyog milega.`,
      remedy: "Guruwar (Thursday) ko peele vastra dharan karein, kela ke ped par jal arpit karein aur chane ki daal ka daan karein.",
      mantra: "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः",
    };
  }

  // 2. Career / Job / Promotion / Business
  if (
    query.includes("job") || 
    query.includes("naukri") || 
    query.includes("career") || 
    query.includes("promotion") || 
    query.includes("business") || 
    query.includes("vyapar")
  ) {
    return {
      text: `Karyakshetra me aashirwad ke yog ban rahe hain ${userName}! 💼 \n\nAapke Dasham Bhaav (10th House) me Surya aur Budh ki 'Budhaditya Yog' sthiti karobaar aur nayi naukri me sthirta layegi. Aane wale 45 se 90 dinon me nayi opportunity ya promotion ke aasaar dikh rahe hain. \n\nSenior officers ya partners se baatcheet me dhairya rakhein.`,
      remedy: "Pratidin subah taambe ke lote se Surya Dev ko arghya dein aur karyasthal par Uttar-Purva (North-East) disha me baithne ki koshish karein.",
      mantra: "ॐ घृणिः सूर्याय नमः",
    };
  }

  // 3. Wealth / Money / Property / Karz
  if (
    query.includes("money") || 
    query.includes("paisa") || 
    query.includes("dhan") || 
    query.includes("wealth") || 
    query.includes("karz") || 
    query.includes("property")
  ) {
    return {
      text: `Dhan aur Samriddhi ke sandarbh me grah-nakshatra anukool sanket de rahe hain. 🪙 \n\nAapke Dwitiya Bhaav (Dhan Bhaav) aur Ekadash Bhaav (Labh Bhaav) me Kuber Dev ki kripa se aarthik aawak me sudhaar aayega. Purana ruka hua paisa wapas milne ke yog hain. \n\nBina soche samjhe kisi bade speculative investment se bachein.`,
      remedy: "Shukrawar ko Kanyao ko safed mithai ya kheer khilayein aur ghar ki tijori Uttar (North) disha me rakhein.",
      mantra: "ॐ श्रीं ह्रीं क्लीं श्रीं सिद्ध लक्ष्म्यै नमः",
    };
  }

  // 4. Shani / Sade Sati / Manglik / Dosha
  if (
    query.includes("shani") || 
    query.includes("sade sati") || 
    query.includes("dhayya") || 
    query.includes("manglik") || 
    query.includes("dosha") ||
    query.includes("nadi")
  ) {
    return {
      text: `Ghabrayein nahi ${userName}, har dosha ka Vedic shanti upay hota hai! 🪐 \n\nShani Dev karmfal daata hain, wo parishram ka fal dete hain. Agar Sade Sati ya Dhaiya ka prabhav hai, toh dharmi bane rahein aur kisi ka apmaan na karein. Niyamit Hanuman sadhana se Shani aur Manglik dosha ka prabhav samapt ho jata hai.`,
      remedy: "Shanivaar ko suryast ke baad peepal ke ped ke paas sarson ke tel ka deepak jalayein aur Hanuman Chalisa ka paath karein.",
      mantra: "ॐ शं शनैश्चराय नमः • ॐ हं हनुमते नमः",
    };
  }

  // 5. Health / Mental Peace / Overthinking / Depression
  if (
    query.includes("health") || 
    query.includes("sehat") || 
    query.includes("tension") || 
    query.includes("peace") || 
    query.includes("neend") ||
    query.includes("anxiety")
  ) {
    return {
      text: `Man ki bechaini aur overthinking Chandrama (Moon) ke prabhav se hoti hai. 🌙 \n\nSomvaar ka din aapke man aur urja ke santulan ke liye shubh hai. Shiv ji ki upasana se Chandrama bali hota hai aur man ko alokik shanti milti hai. Rog-nashak grah Shani aur Guru ka prabhav sharirik urja me vriddhi karega.`,
      remedy: "Somvaar ko shivling par kacha doodh aur jal arpit karein, aur chandi ka kada ya chhalla dharan karein.",
      mantra: "ॐ नमः शिवाय • ॐ सों सोमाय नमः",
    };
  }

  // 6. General / Default Astrological Query
  return {
    text: `Pranam ${userName}! Grah-gochar ke aadhar par aapke jeevan me naye parivartan ka daur shuru ho raha hai. ✨ \n\nJupiter (Brihaspati) ka aashirwad aapke chart par shubh fal de raha hai. Aane wale mahine me adhyatmik aur aarthik donon roop se aage badhne ke raste khulenge. Apne lakshya par dhyan kendrit rakhein.`,
    remedy: "Pratidin Gayatri Mantra ka 11 baar jaap karein aur subah mata-pita ka aashirwad zaroor lein.",
    mantra: "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्",
  };
}
