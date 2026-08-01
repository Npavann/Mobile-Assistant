const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const otpStore = {};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send OTP
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!email || email !== adminEmail) {
    return res.status(400).json({ error: "Email not found" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

  try {
    await transporter.sendMail({
      from: `"MobileAssist AI" <${process.env.EMAIL_USER}>`,
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

    res.json({ success: true, message: "OTP sent to your email" });
  } catch (err) {
    console.error("Email error:", err);
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
