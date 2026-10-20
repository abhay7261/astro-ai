// Astro Reels Video Controller & Cloudinary Media Upload
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { ReelModel } from "../models/Reel.js";

// Multer in-memory storage for high-speed streaming
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB max video size
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
    return res.status(400).json({
      success: false,
      message: "Cloudinary credentials missing in .env. Kripya CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY aur CLOUDINARY_API_SECRET configure karein.",
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

export const getAllReels = (req, res) => {
  const reels = ReelModel.find();
  res.json({ success: true, count: reels.length, reels });
};

export const publishReel = (req, res) => {
  const { title, astrologerName, videoUrl, tag } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, message: "Title is required" });
  }

  const newReel = ReelModel.create({
    title,
    astrologerName: astrologerName || "Vedic Astrologer",
    videoUrl: videoUrl || "",
    tag: tag ? (tag.startsWith("#") ? tag : `#${tag}`) : "#DailyUpay",
  });

  res.status(201).json({ success: true, message: "Reel published successfully!", reel: newReel });
};

export const deleteReel = (req, res) => {
  const { id } = req.params;
  ReelModel.deleteById(id);
  res.json({ success: true, message: `Reel ${id} deleted successfully.` });
};

export const likeReel = (req, res) => {
  const { id } = req.params;
  const reel = ReelModel.like(id);
  if (reel) return res.json({ success: true, likes: reel.likes });
  res.status(404).json({ success: false, message: "Reel not found" });
};
