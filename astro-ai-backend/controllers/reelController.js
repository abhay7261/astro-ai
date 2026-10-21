// Astro Reels Video Controller & Cloudinary Media Upload
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { ReelModel } from "../models/Reel.js";

// Multer in-memory storage for high-speed streaming
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB max video size
  fileFilter: (req, file, cb) => {
    const allowed = ["video/mp4", "video/webm", "video/quicktime", "video/x-m4v"];
    if (allowed.includes(file.mimetype) || file.originalname.match(/\.(mp4|webm|mov|m4v)$/i)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only MP4, WebM, and MOV video formats are allowed."));
    }
  },
});

// Configure Cloudinary if credentials provided
const configureCloudinary = () => {
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    return true;
  }
  return false;
};

export const uploadVideoToCloudinary = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Kripya video file select karein (.mp4)!" });
  }

  const isConfigured = configureCloudinary();
  if (!isConfigured) {
    return res.status(500).json({
      success: false,
      message: "Cloudinary credentials missing in server environment.",
    });
  }

  console.log(`🎬 [Cloudinary] Uploading video: ${req.file.originalname} (${(req.file.size / 1024 / 1024).toFixed(2)} MB)...`);

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      resource_type: "video",
      folder: "astroai_reels",
      format: "mp4",
      transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
    },
    (error, result) => {
      if (error) {
        console.error("⚠️ [Cloudinary] Upload error:", error);
        return res.status(500).json({ success: false, message: error.message });
      }

      console.log(`✅ [Cloudinary] Video uploaded successfully: ${result.secure_url}`);
      return res.json({
        success: true,
        message: "Video uploaded to Cloudinary successfully!",
        videoUrl: result.secure_url,
        duration: result.duration,
        publicId: result.public_id,
      });
    }
  );

  uploadStream.end(req.file.buffer);
};

export const getAllReels = async (req, res) => {
  try {
    const { page = 1, limit = 50, series } = req.query;
    const query = series ? { seriesName: series } : {};
    const reels = await ReelModel.find(query, { page, limit });
    res.json({
      success: true,
      count: reels.length,
      page: Number(page),
      limit: Number(limit),
      reels,
    });
  } catch (err) {
    console.error("⚠️ [Reels API] getAllReels error:", err);
    res.status(500).json({ success: false, message: "Failed to retrieve reels." });
  }
};

export const publishReel = async (req, res) => {
  try {
    const { title, astrologerName, videoUrl, tag, seriesName, seriesPart, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const newReel = await ReelModel.create({
      id: req.body.id || `reel-${Date.now()}`,
      title: title.trim(),
      description: description ? description.trim() : "Daily astrological guidance & Vedic insights.",
      astrologerName: astrologerName || "AstroAI Creator",
      videoUrl: videoUrl || "",
      tag: tag ? (tag.startsWith("#") ? tag : `#${tag}`) : "#DailyUpay",
      seriesName: seriesName ? seriesName.trim() : "",
      seriesPart: seriesPart ? Number(seriesPart) || 1 : null,
      createdAt: new Date(),
    });

    res.status(201).json({ success: true, message: "Reel published successfully!", reel: newReel });
  } catch (err) {
    console.error("⚠️ [Reels API] publishReel error:", err);
    res.status(500).json({ success: false, message: "Failed to publish reel." });
  }
};

export const deleteReel = async (req, res) => {
  try {
    const { id } = req.params;
    await ReelModel.deleteById(id);
    res.json({ success: true, message: `Reel ${id} deleted successfully.` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteSeries = async (req, res) => {
  try {
    const { seriesName } = req.params;
    const decoded = decodeURIComponent(seriesName);
    await ReelModel.deleteBySeries(decoded);
    res.json({ success: true, message: `Series "${decoded}" deleted successfully.` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const likeReel = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ReelModel.like(id);
    res.json({ success: true, likes: result.likes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
