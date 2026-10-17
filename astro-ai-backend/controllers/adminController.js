// Master Admin Controller
let masterPin = process.env.ADMIN_MASTER_PIN || "7788";

let aiPersonasStore = [
  {
    id: "ai-1",
    name: "Acharya AI (Chief Vedic Pandit)",
    role: "Vedic Kundli & Dosha Specialist",
    category: "Kundli",
    avatar: "🧙‍♂️",
    tone: "Traditional Vedic & Sanskrit Mantras",
    isActive: true,
    queriesAnswered: 4890,
  },
  {
    id: "ai-2",
    name: "Dr. Ananya AI",
    role: "Love & Marriage Compatibility Guru",
    category: "Love",
    avatar: "🧝‍♀️",
    tone: "Empathetic, Relationship Counseling",
    isActive: true,
    queriesAnswered: 3410,
  },
  {
    id: "ai-3",
    name: "Dev Guru AI",
    role: "Career, Wealth & Business Dhan Yog",
    category: "Career",
    avatar: "👨‍🏫",
    tone: "Practical, Career Timings & Remedies",
    isActive: true,
    queriesAnswered: 2950,
  },
  {
    id: "ai-4",
    name: "Prashna Shastra AI",
    role: "Instant Yes/No & Horary Astrology",
    category: "Prashna",
    avatar: "🔮",
    tone: "Concise, Direct & Planetary Muhurat",
    isActive: false,
    queriesAnswered: 1220,
  },
];

export const adminLogin = (req, res) => {
  const { pin } = req.body;
  if (pin === masterPin) {
    return res.json({
      success: true,
      token: "master_admin_jwt_token_9918",
      message: "Admin unlocked successfully!",
    });
  }
  res.status(401).json({ success: false, message: "Invalid Security PIN!" });
};

export const getAdminAnalytics = (req, res) => {
  res.json({
    success: true,
    metrics: {
      totalAstrologers: 6,
      totalAIPersonas: aiPersonasStore.length,
      totalReels: 3,
      totalUsers: 4,
      activeUpiMandates: 184,
      totalRevenue: 54816,
    },
  });
};

export const getAIPersonas = (req, res) => {
  res.json({ success: true, count: aiPersonasStore.length, aiPersonas: aiPersonasStore });
};

export const addAIPersona = (req, res) => {
  const { name, role, tone, avatar } = req.body;
  const newBot = {
    id: `ai-${Date.now()}`,
    name: name || "New Vedic AI",
    role: role || "Astrology Specialist",
    category: "Vedic",
    avatar: avatar || "🤖",
    tone: tone || "Traditional Vedic",
    isActive: true,
    queriesAnswered: 0,
  };
  aiPersonasStore.unshift(newBot);
  res.status(201).json({ success: true, bot: newBot });
};

export const deleteAIPersona = (req, res) => {
  const { id } = req.params;
  aiPersonasStore = aiPersonasStore.filter((p) => p.id !== id);
  res.json({ success: true, message: `AI Bot ${id} deleted successfully.` });
};

export const broadcastNotification = (req, res) => {
  const { title, body } = req.body;
  res.json({
    success: true,
    message: "Notification broadcasted successfully to all active device tokens!",
    broadcast: { title, body, sentAt: new Date().toISOString() },
  });
};
