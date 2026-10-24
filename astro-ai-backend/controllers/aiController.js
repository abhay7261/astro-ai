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

// Call Google Gemini Live AI with structured Vedic Astrologer Prompt and Auto-Model Fallback
async function askGoogleGemini(query, context = {}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const candidateModels = [
    "gemini-flash-lite-latest",
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-3.8-flash"
  ];

  const astroName = context.astrologerName || "Acharya Vidyadhar";
  const astroSpecialty = context.specialty || context.astrologerSpecialty || "Vedic Kundli & Graha Shanti";
  const astroTitle = context.title || "Senior Vedic Astrologer";

  const prompt = `You are AstroAI's revered master astrologer: ${astroName} (${astroTitle}), specialist in ${astroSpecialty}.
The user (${context.name || "Seeker"}) is asking an astrology question: "${query}".
User astrological context: ${JSON.stringify(context || {})}.

Analyze the question according to traditional Vedic Astrology (Parashari system, Prashna Shastra, Rashis, Bhavas, Grahas, Nakshatras) with deep expertise in ${astroSpecialty}.
Write a warm, compassionate, culturally authentic, deeply personalized guidance in Hindi / Hinglish as ${astroName}.

You MUST respond strictly in valid JSON format:
{
  "reply": "Clear, deep astrological prediction and guidance in Hindi/Hinglish (2-4 thoughtful sentences) speaking as ${astroName}",
  "remedy": "Practical Vedic remedy / Upay (fasting, puja, colors, donation)",
  "mantra": "Sanskrit Vedic mantra in Devanagari script with short benefit"
}`;

  for (const model of candidateModels) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
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
        console.warn(`⚠️ [Gemini AI] Model ${model} returned status:`, response.status);
        continue;
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) continue;

      // Clean JSON markdown code fences if returned by model
      const cleanedText = rawText.replace(/```json\s*/gi, "").replace(/```\s*$/gi, "").trim();
      let parsed;
      try {
        parsed = JSON.parse(cleanedText);
      } catch (parseErr) {
        // Fallback extract if JSON was slightly malformed
        const match = cleanedText.match(/\{[\s\S]*\}/);
        if (match) {
          parsed = JSON.parse(match[0]);
        } else {
          parsed = { reply: cleanedText, remedy: "सूर्य देव को अर्घ्य दें।", mantra: "ॐ नमः शिवाय" };
        }
      }

      return {
        reply: parsed.reply || cleanedText,
        remedy: parsed.remedy || "Subah suryoday ke samay Surya Dev ko arghya dein aur mantra jap karein.",
        mantra: parsed.mantra || "ॐ नमः शिवाय",
        source: `Google Gemini AI (${model})`,
      };
    } catch (err) {
      console.warn(`⚠️ [Gemini AI] Error with model ${model}:`, err.message);
    }
  }

  return null;
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
