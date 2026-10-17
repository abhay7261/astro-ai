// Astro Reels Video Controller
import { ReelModel } from "../models/Reel.js";

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
    videoUrl: videoUrl || "https://assets.mixkit.co/videos/preview/mixkit-astrological-signs-rotating-in-the-sky-42997-large.mp4",
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
