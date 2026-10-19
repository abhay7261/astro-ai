// AI Astrologer Vedic Analysis & Live Google Gemini AI Controller
import dns from "dns";

// Ensure reliable DNS resolution for Google API
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

// Fallback Vedic Analysis Rule Engine (Offline & Resilience Mode)
const getVedicAnalysisFallback = (query) => {
  const q = query.toLowerCase();

  // 1. Love & Marriage (Vivah Yog)
  if (q.includes("shaadi") || q.includes("marriage") || q.includes("love") || q.includes("pyaar") || q.includes("rishta")) {
    return {
      reply: "Aapki Janam Kundli ke aadhar par 7th house (Vivah Sthan) par Devguru Brihaspati ki shubh drishti ban rahi hai. Aane wale samay ke bheetar ek yogya jeevansathi se milne ke prabal yog hain.",
      remedy: "Guruvaar (Thursday) ke din peele vastra dharan karein aur Vishnu Sahasranama ka paath karein ya Kesar ka tilak lagayein.",
      mantra: "ॐ नमो भगवते वासुदेवाय नमः"
    };
  }

  // 2. Career, Job & Promotion
  if (q.includes("job") || q.includes("career") || q.includes("naukri") || q.includes("promotion") || q.includes("business")) {
    return {
      reply: "Kundli ke 10th house (Karam Sthan) me Surya aur Budh ki sthiti se Budhaditya Yoga ke shubh sanket hain. Mehnat ka pura fal milega.",
      remedy: "Pratidin suryoday ke samay tambe ke lote se Surya Dev ko arghya dein aur lal chandan ka prayog karein.",
      mantra: "ॐ सूर्याय नमः"
    };
  }

  // 3. Wealth, Money & Finance
  if (q.includes("dhan") || q.includes("money") || q.includes("paisa") || q.includes("karz") || q.includes("finance")) {
    return {
      reply: "Aapke 2nd (Dhan) aur 11th (Labh) house me Shukra Dev ki sthiti aarthik unnti ki taraf sanket kar rahi hai. Purana fasa paisa wapas aane ke yog hain.",
      remedy: "Shukravaar ke din safed mithai ya kheer ka daan kisi zarooratmand ko karein aur diya jalayein.",
      mantra: "ॐ श्रीं ह्रीं क्लीं ग्लौं गं गणपतये वर वरद सर्वजनं मे वशमानय स्वाहा"
    };
  }

  // 4. Shani, Sade Sati & Dosha
  if (q.includes("shani") || q.includes("dosh") || q.includes("manglik") || q.includes("sade sati") || q.includes("problem")) {
    return {
      reply: "Kundli me Shani Dev ki drishti ke kaaran thoda vilamb aur mansik tanaav ho sakta hai, parantu niyamit pooja se ye dosha shubh fal me badal jata hai.",
      remedy: "Shanivaar ki shaam ko peepal ke vriksh ke neeche sarson ke tel ka deepak jalayein aur Hanuman Chalisa ka paath karein.",
      mantra: "ॐ शं शनैश्चराय नमः"
    };
  }

  // 5. General Vedic Blessing
  return {
    reply: `Aapke dwara pooche gaye sawaal "${query}" par grah-nakshatron ka aalan karne par aane wala samay aatmavishwas se aage badhne ka hai. Chandrama shubh sthiti me hai.`,
    remedy: "Subah uthkar mata-pita ke charan sparsh karein aur gay ko guda ya roti khilayein.",
    mantra: "ॐ नमः शिवाय"
  };
};

// Call Google Gemini Live AI with structured Vedic Astrologer Prompt
async function askGoogleGemini(query, context = {}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const prompt = `You are AstroAI's master Vedic Astrologer (ऋषि/विद्वान वैदिक ज्योतिषी).
The user is asking an astrology question: "${query}".
User astrological context: ${JSON.stringify(context || {})}.

Analyze the question according to Vedic Astrology (Parashari system, Rashis, Bhavas, Grahas, Nakshatras).
Write a warm, compassionate, culturally authentic answer in Hindi / Hinglish.

You MUST respond strictly in the following JSON format:
{
  "reply": "Clear, deep astrological prediction and guidance in Hindi/Hinglish",
  "remedy": "Practical Vedic remedy / Upay (fasting, puja, colors, donation)",
  "mantra": "Sanskrit Vedic mantra in Devanagari script with short benefit"
}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn("⚠️ [Gemini AI] API status:", response.status);
      return null;
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;

    // Clean JSON markdown code fences if returned by model
    const cleanedText = rawText.replace(/```json\s*/gi, "").replace(/```\s*$/gi, "").trim();
    const parsed = JSON.parse(cleanedText);

    return {
      reply: parsed.reply,
      remedy: parsed.remedy,
      mantra: parsed.mantra,
      source: "Google Gemini AI (gemini-3.8-flash)",
    };
  } catch (err) {
    console.warn("⚠️ [Gemini AI] Error during generation, falling back:", err.message);
    return null;
  }
}

export const chatWithAIAstrologer = async (req, res) => {
  const { message, context } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({
      success: false,
      message: "Kripya apna sawaal likhein!"
    });
  }

  // Fast-path instant greeting recognition (< 10ms)
  const qClean = message.trim().toLowerCase();
  if (
    qClean === "ram ram" || qClean === "ram ram ji" ||
    qClean === "hari om" || qClean === "hari om ji" ||
    qClean === "namaste" || qClean === "namaste ji" ||
    qClean === "pranam" || qClean === "pranam pandit ji" ||
    qClean.includes("radhe radhe") || qClean.includes("jai shree ram") ||
    qClean === "hello" || qClean === "hi"
  ) {
    return res.json({
      success: true,
      reply: "राम राम! 🙏 प्रणाम। आपका AstroAI में स्वागत है। कहिए, आज ग्रह-नक्षत्र आपके जीवन के किस पहलू (विवाह, करियर, धन, या स्वास्थ्य) पर आपका मार्गदर्शन कर सकते हैं? आप बेझिझक अपना प्रश्न पूछें।",
      remedy: "दिन की शुरुआत सूर्य देव को तांबे के लोटे से अर्घ्य देकर और गायत्री मंत्र के जप से करें।",
      mantra: "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्",
      source: "AstroAI Vedic Engine",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      remainingFreeQuestions: 5
    });
  }

  // 1. Try Live Google Gemini AI First (with 3s timeout)
  let analysis = await askGoogleGemini(message, context);

  // 2. Fallback to In-house Vedic Engine if Gemini API is unreachable
  if (!analysis) {
    analysis = getVedicAnalysisFallback(message);
    analysis.source = "AstroAI Vedic Engine";
  }

  console.log(`🤖 [AI Astrologer] Answered query "${message.substring(0, 30)}..." via ${analysis.source}`);

  res.json({
    success: true,
    reply: analysis.reply,
    remedy: analysis.remedy,
    mantra: analysis.mantra,
    source: analysis.source,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    remainingFreeQuestions: 5
  });
};
