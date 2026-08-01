const express = require('express');
const router = express.Router();
const { Resend } = require('resend');

const otpStore = {};

// Send OTP
router.post('/send-otp', async (req, res) => {
  console.log("send-otp route hit. Request body:", req.body);
  const { email } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!email || email !== adminEmail) {
    console.log("Email mismatch. Received:", email, "Expected:", adminEmail);
    return res.status(400).json({ error: "Email not found" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };
  console.log("Generated OTP for", email, ":", otp);

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: 'MobileAssist AI <onboarding@resend.dev>',
      to: email,
      subject: 'MobileAssist AI - Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; background: #1a1a2e; color: white; border-radius: 10px;">
          <h2 style="color: #6366f1;">MobileAssist AI</h2>
          <p>Your OTP for password reset is:</p>
          <h1 style="color: #6366f1; letter-spacing: 8px; text-align: center;">${otp}</h1>
          <p>This OTP expires in <strong>5 minutes</strong>.</p>
          <p style="color: #888;">If you didn't request this, ignore this email.</p>
        </div>
      `
    });

    if (error) {
      console.error("❌ Resend error:", error);
      return res.status(500).json({ error: "Failed to send OTP" });
    }

    console.log("✅ Email sent successfully. Resend ID:", data?.id);
    res.json({ success: true, message: "OTP sent to your email" });
  } catch (err) {
    console.error("❌ Email error:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// Verify OTP
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  const stored = otpStore[email];

  if (!stored) {
    return res.status(400).json({ error: "No OTP found. Please request again." });
  }
  if (Date.now() > stored.expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ error: "OTP expired. Please request again." });
  }
  if (stored.otp !== otp) {
    return res.status(400).json({ error: "Invalid OTP. Please try again." });
  }

  delete otpStore[email];
  res.json({ success: true, message: "OTP verified" });
});

module.exports = router;
