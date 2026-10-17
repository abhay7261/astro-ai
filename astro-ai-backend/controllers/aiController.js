// AI Astrologer Vedic Analysis & Chat Controller

const getVedicAnalysis = (query) => {
  const q = query.toLowerCase();

  // 1. Love & Marriage (Vivah Yog)
  if (q.includes("shaadi") || q.includes("marriage") || q.includes("love") || q.includes("pyaar") || q.includes("rishta")) {
    return {
      reply: "Aapki Janam Kundli ke aadhar par 7th house (Vivah Sthan) par Devguru Brihaspati ki shubh drishti ban rahi hai. Aane wale 6 se 9 mahino ke bheetar ek bahut hi yogya aur sanskari jeevansathi se milne ke prabal yog ban rahe hain.",
      remedy: "Guruvaar (Thursday) ke din peele vastra dharan karein aur Vishnu Sahasranama ka paath karein ya Kesar ka tilak lagayein.",
      mantra: "ॐ नमो भगवते वासुदेवाय नमः"
    };
  }

  // 2. Career, Job & Promotion
  if (q.includes("job") || q.includes("career") || q.includes("naukri") || q.includes("promotion") || q.includes("business")) {
    return {
      reply: "Kundli ke 10th house (Karam Sthan) me Surya aur Budh ki yuti se 'Budhaditya Yoga' ka nirmaan ho raha hai. Is samay aapke career me nayi opportunities aur sthirta ke shubh yog hain. Mehnat ka pura fal milega.",
      remedy: "Pratidin suryoday ke samay tambe ke lote se Surya Dev ko arghya dein aur lal chandan ka prayog karein.",
      mantra: "ॐ सूर्याय नमः"
    };
  }

  // 3. Wealth, Money & Finance (Dhan Labh)
  if (q.includes("dhan") || q.includes("money") || q.includes("paisa") || q.includes("karz") || q.includes("finance")) {
    return {
      reply: "Aapke 2nd (Dhan) aur 11th (Labh) house me Shukra Dev ki sthiti aarthik unnti ki taraf sanket kar rahi hai. Purana fasa hua paisa wapas aane ke yog hain.",
      remedy: "Shukravaar ke din safed mithai ya kheer ka daan kisi zarooratmand ko karein aur ghar ke uttar-purva me diya jalayein.",
      mantra: "ॐ श्रीं ह्रीं क्लीं ग्लौं गं गणपतये वर वरद सर्वजनं मे वशमानय स्वाहा"
    };
  }

  // 4. Shani, Sade Sati & Dosha
  if (q.includes("shani") || q.includes("dosh") || q.includes("manglik") || q.includes("sade sati") || q.includes("problem")) {
    return {
      reply: "Kundli me Shani Dev ki drishti ke kaaran thoda vilamb aur mansik tanaav ho sakta hai, parantu niyamit pooja se ye dosha shubh fal me badal jata hai.",
      remedy: "Shanivaar ki shaam ko peepal ke vriksh ke neeche sarson ke tel ka deepak jalayein aur Hanuman Chalisa ka niyamit paath karein.",
      mantra: "ॐ शं शनैश्चराय नमः"
    };
  }

  // 5. General Vedic Blessing (Default)
  return {
    reply: `Aapke dwara pooche gaye sawaal "${query}" par grah-nakshatron ka aalan karne par aane wala samay aatmavishwas aur saahas se aage badhne ka hai. Chandrama ki sthiti shubh hai.`,
    remedy: "Subah uthkar mata-pita ke charan sparsh karein aur gay ko guda ya roti khilayein.",
    mantra: "ॐ नमः शिवाय"
  };
};

export const chatWithAIAstrologer = (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({
      success: false,
      message: "Kripya apna sawaal likhein!"
    });
  }

  const analysis = getVedicAnalysis(message);

  res.json({
    success: true,
    reply: analysis.reply,
    remedy: analysis.remedy,
    mantra: analysis.mantra,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    remainingFreeQuestions: 2
  });
};
