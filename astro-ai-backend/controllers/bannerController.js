// Banner Controller for Homepage Hero Carousel & Admin Uploads
import { BannerModel, DEFAULT_BANNERS } from "../models/Banner.js";

// GET /api/v1/banners - Fetch all active banners in order
export const getBanners = async (req, res) => {
  try {
    const banners = await BannerModel.find({});
    // If empty, return defaults
    const result = banners && banners.length > 0 ? banners : DEFAULT_BANNERS;
    res.json({
      success: true,
      count: result.length,
      banners: result,
    });
  } catch (err) {
    console.error("⚠️ [Banners] Error fetching banners:", err.message);
    res.json({
      success: true,
      count: DEFAULT_BANNERS.length,
      banners: DEFAULT_BANNERS,
    });
  }
};

// POST /api/v1/banners - Admin uploads / creates a new banner
export const createBanner = async (req, res) => {
  try {
    const { title, subtitle, badge, imageUrl, type, bgGradient, ctaText, ctaLink, order, isActive } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Banner title is required." });
    }

    const newBanner = await BannerModel.create({
      title: title.trim(),
      subtitle: subtitle ? subtitle.trim() : "",
      badge: badge ? badge.trim() : "SPECIAL ASTRO INSIGHT",
      imageUrl: imageUrl || "",
      type: type || (imageUrl ? "custom_banner" : "animated_card"),
      bgGradient: bgGradient || "from-[#FFF9F2] via-[#FFEEDC] to-[#FFDFC8]",
      ctaText: ctaText ? ctaText.trim() : "Explore Now",
      ctaLink: ctaLink ? ctaLink.trim() : "/chat",
      order: order ? Number(order) : 10,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    console.log(`✨ [Banners] New banner created: ${newBanner.title}`);
    res.status(201).json({
      success: true,
      message: "Banner uploaded and published successfully!",
      banner: newBanner,
    });
  } catch (err) {
    console.error("⚠️ [Banners] Error creating banner:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/v1/banners/:id/status - Toggle active/inactive
export const toggleBannerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const updated = await BannerModel.updateStatus(id, isActive);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Banner not found." });
    }

    res.json({
      success: true,
      message: `Banner ${isActive ? "activated" : "deactivated"} successfully.`,
      banner: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/v1/banners/:id - Delete banner
export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    await BannerModel.deleteById(id);
    res.json({
      success: true,
      message: "Banner deleted successfully.",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
