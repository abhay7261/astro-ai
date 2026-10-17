// Payment Gateway & UPI Auto-Pay Mandate Configuration
export const paymentConfig = {
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || "rzp_test_astroai_2026",
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || "rzp_secret_astroai_key",
  defaultTrialFee: 4, // ₹4 Initial Mandate Setup Fee
  defaultTrialDays: 3, // 3-Day Free Trial
  defaultMonthlyDebit: 299, // ₹299 Monthly Auto-Debit
};
