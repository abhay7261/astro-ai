// UPI Auto-Pay Mandate & 3-Day Trial Controller
import { MandateModel } from "../models/Mandate.js";

// 1. GET Mandate Config
export const getMandateConfig = (req, res) => {
  res.json({
    success: true,
    config: MandateModel.getConfig(),
  });
};

// 2. PUT Update Mandate Config
export const updateMandateConfig = (req, res) => {
  const updated = MandateModel.updateConfig(req.body);
  res.json({
    success: true,
    message: "Mandate configuration updated successfully!",
    config: updated,
  });
};

// 3. POST Create Mandate Order
export const createMandateOrder = (req, res) => {
  const { upiApp } = req.body;
  const config = MandateModel.getConfig();

  const order = {
    mandateId: `mandate_${Date.now()}`,
    orderId: `order_upi_${Date.now()}`,
    setupFee: config.trialSetupFee,
    trialDays: config.trialDays,
    recurringAmount: config.recurringAutoDebitAmount,
    currency: "INR",
    upiApp: upiApp || "phonepe",
    status: "pending_authorization",
    createdAt: new Date().toISOString(),
  };

  res.status(201).json({
    success: true,
    message: `Mandate order for ₹${config.trialSetupFee} created!`,
    mandate: order,
  });
};

// 4. POST Verify & Activate Mandate
export const verifyMandate = (req, res) => {
  const { mandateId, upiApp, userId, userName } = req.body;

  const subscription = MandateModel.createSubscription({
    mandateId: mandateId || `mandate_${Date.now()}`,
    userId: userId || "u-1",
    userName: userName || "Seeker",
    upiApp: upiApp || "phonepe",
  });

  res.json({
    success: true,
    message: "🎉 Mubarak! Aapka 3-Day VIP Free Trial Active Ho Gaya!",
    subscription,
  });
};

// 5. POST Cancel Auto-Debit
export const cancelMandate = (req, res) => {
  const { mandateId } = req.body;
  MandateModel.cancelSubscription(mandateId);

  res.json({
    success: true,
    message: "Aapka UPI Auto-Debit Mandate cancel kar diya gaya hai. Agla koi deduction nahi hoga.",
  });
};
