import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Eye, EyeOff, ShieldCheck, Mail, Lock, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const COLORS = {
  pageBg: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
  cardBg: "rgba(15, 23, 42, 0.8)",
  cardBorder: "rgba(255,255,255,0.1)",
  iconGradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  titleText: "#FFFFFF",
  subtitleText: "#B0ADD1",
  inputBg: "rgba(255,255,255,0.06)",
  inputBorder: "rgba(255,255,255,0.14)",
  inputBorderFocus: "rgba(129,140,248,0.7)",
  inputText: "#F5F4FC",
  inputIcon: "#9C99C2",
  placeholder: "#7A78A0",
  errorBg: "rgba(239,68,68,0.12)",
  errorBorder: "rgba(239,68,68,0.35)",
  errorText: "#FCA5A5",
  successBg: "rgba(16,185,129,0.14)",
  successBorder: "rgba(16,185,129,0.4)",
  successText: "#6EE7B7",
  submitGradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  submitText: "#FFFFFF",
  linkText: "#A5B4FC",
  backBtnBg: "rgba(255,255,255,0.07)",
  backBtnBorder: "rgba(255,255,255,0.14)",
  backBtnIcon: "#E4E2F5",
};

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      await login(username, password, false);
      navigate("/admin");
    } catch (err) {
      setError("Wrong username or password.");
      setIsSubmitting(false);
    }
  };

  const handleSendOtp = async () => {
    if (!forgotEmail.trim()) { setForgotError("Please enter your email."); return; }
    setForgotError("");
    setForgotLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/send-otp`,
        { email: forgotEmail }
      );
      setOtpSent(true);
      setForgotMsg(res.data.message || "OTP sent to your email");
    } catch (err) {
      setForgotError(err.response?.data?.error || "Failed to send OTP. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) { setForgotError("Please enter the OTP."); return; }
    setForgotError("");
    setForgotLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/verify-otp`,
        { email: forgotEmail, otp }
      );
      setOtpVerified(true);
      setForgotMsg(res.data.message || "OTP verified successfully. Please contact the admin to complete your password reset.");
    } catch (err) {
      setForgotError(err.response?.data?.error || "Invalid or expired OTP. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const resetForgot = () => { setShowForgot(false); setOtpSent(false); setOtpVerified(false); setForgotMsg(""); setForgotError(""); setForgotEmail(""); setOtp(""); };

  return (
    <div style={{
      minHeight: "100vh",
      background: COLORS.pageBg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', sans-serif",
      padding: "1rem"
    }}>
      {/* Glowing background circles */}
      <div style={{ position: "fixed", top: "10%", left: "10%", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "10%", right: "10%", width: "250px", height: "250px", background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

      <div style={{
        width: "100%",
        maxWidth: "420px",
        background: COLORS.cardBg,
        backdropFilter: "blur(20px)",
        border: `1px solid ${COLORS.cardBorder}`,
        borderRadius: "24px",
        padding: "2.5rem 2rem",
        boxShadow: "0 25px 50px rgba(0,0,0,0.5)"
      }}>

        {!showForgot ? (
          <>
            {/* Logo */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "2rem" }}>
              <div style={{
                width: "64px", height: "64px",
                background: COLORS.iconGradient,
                borderRadius: "16px",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "1rem",
                boxShadow: "0 8px 24px rgba(99,102,241,0.4)"
              }}>
                <ShieldCheck size={32} color="white" />
              </div>
              <h1 style={{ color: COLORS.titleText, fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>Admin Portal</h1>
              <p style={{ color: COLORS.subtitleText, fontSize: "0.875rem", marginTop: "0.25rem" }}>MobileAssist AI Dashboard</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Username */}
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: COLORS.inputIcon }}>
                  <Lock size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isSubmitting}
                  style={{
                    width: "100%", padding: "0.875rem 1rem 0.875rem 2.75rem",
                    background: COLORS.inputBg,
                    border: `1px solid ${COLORS.inputBorder}`,
                    borderRadius: "12px", color: COLORS.inputText, fontSize: "0.95rem",
                    outline: "none", boxSizing: "border-box",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={e => e.target.style.borderColor = COLORS.inputBorderFocus}
                  onBlur={e => e.target.style.borderColor = COLORS.inputBorder}
                />
              </div>

              {/* Password */}
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: COLORS.inputIcon }}>
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  style={{
                    width: "100%", padding: "0.875rem 3rem 0.875rem 2.75rem",
                    background: COLORS.inputBg,
                    border: `1px solid ${COLORS.inputBorder}`,
                    borderRadius: "12px", color: COLORS.inputText, fontSize: "0.95rem",
                    outline: "none", boxSizing: "border-box"
                  }}
                  onFocus={e => e.target.style.borderColor = COLORS.inputBorderFocus}
                  onBlur={e => e.target.style.borderColor = COLORS.inputBorder}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: COLORS.inputIcon, cursor: "pointer" }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Error */}
              {error && (
                <div style={{ background: COLORS.errorBg, border: `1px solid ${COLORS.errorBorder}`, color: COLORS.errorText, padding: "0.75rem 1rem", borderRadius: "10px", fontSize: "0.875rem" }}>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={isSubmitting} style={{
                width: "100%", padding: "0.875rem",
                background: COLORS.submitGradient,
                border: "none", borderRadius: "12px",
                color: COLORS.submitText, fontSize: "1rem", fontWeight: 600,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                boxShadow: "0 4px 15px rgba(99,102,241,0.4)",
                opacity: isSubmitting ? 0.7 : 1,
                marginTop: "0.5rem"
              }}>
                {isSubmitting ? <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> : "Sign In"}
              </button>
            </form>

            {/* Forgot */}
            <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
              <span onClick={() => setShowForgot(true)} style={{ color: COLORS.linkText, fontSize: "0.875rem", cursor: "pointer", textDecoration: "underline" }}>
                Forgot password?
              </span>
            </div>
          </>
        ) : (
          <>
            {/* Forgot Password */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <button onClick={resetForgot} style={{ background: COLORS.backBtnBg, border: `1px solid ${COLORS.backBtnBorder}`, borderRadius: "8px", padding: "0.5rem", cursor: "pointer", color: COLORS.backBtnIcon, display: "flex" }}>
                <ArrowLeft size={18} />
              </button>
              <h2 style={{ color: COLORS.titleText, fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>Reset Password</h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {!otpSent ? (
                <>
                  <p style={{ color: COLORS.subtitleText, fontSize: "0.875rem", margin: 0 }}>Enter your admin email to receive an OTP.</p>
                  <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: COLORS.inputIcon }}>
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      placeholder="Admin email address"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      style={{
                        width: "100%", padding: "0.875rem 1rem 0.875rem 2.75rem",
                        background: COLORS.inputBg,
                        border: `1px solid ${COLORS.inputBorder}`,
                        borderRadius: "12px", color: COLORS.inputText, fontSize: "0.95rem",
                        outline: "none", boxSizing: "border-box"
                      }}
                    />
                  </div>
                  <button onClick={handleSendOtp} disabled={forgotLoading} style={{
                    width: "100%", padding: "0.875rem",
                    background: COLORS.submitGradient,
                    border: "none", borderRadius: "12px",
                    color: COLORS.submitText, fontSize: "1rem", fontWeight: 600, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    {forgotLoading ? <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> : "Send OTP"}
                  </button>
                </>
              ) : !otpVerified ? (
                <>
                  <div style={{ background: COLORS.successBg, border: `1px solid ${COLORS.successBorder}`, color: COLORS.successText, padding: "0.75rem 1rem", borderRadius: "10px", fontSize: "0.875rem", textAlign: "center" }}>
                    {forgotMsg}
                  </div>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    style={{
                      width: "100%", padding: "0.875rem",
                      background: COLORS.inputBg,
                      border: `1px solid ${COLORS.inputBorder}`,
                      borderRadius: "12px", color: COLORS.inputText, fontSize: "1.5rem",
                      fontWeight: 700, letterSpacing: "0.5rem",
                      textAlign: "center", outline: "none", boxSizing: "border-box"
                    }}
                  />
                  <button onClick={handleVerifyOtp} disabled={forgotLoading} style={{
                    width: "100%", padding: "0.875rem",
                    background: COLORS.submitGradient,
                    border: "none", borderRadius: "12px",
                    color: COLORS.submitText, fontSize: "1rem", fontWeight: 600, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    {forgotLoading ? <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> : "Verify OTP"}
                  </button>
                </>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
                  <div style={{ background: COLORS.successBg, border: `1px solid ${COLORS.successBorder}`, color: COLORS.successText, padding: "1rem", borderRadius: "12px", fontSize: "0.95rem", marginBottom: "1rem" }}>
                    {forgotMsg}
                  </div>
                  <button onClick={resetForgot} style={{
                    width: "100%", padding: "0.875rem",
                    background: COLORS.submitGradient,
                    border: "none", borderRadius: "12px",
                    color: COLORS.submitText, fontSize: "1rem", fontWeight: 600, cursor: "pointer"
                  }}>
                    Back to Login
                  </button>
                </div>
              )}

              {forgotError && (
                <div style={{ background: COLORS.errorBg, border: `1px solid ${COLORS.errorBorder}`, color: COLORS.errorText, padding: "0.75rem 1rem", borderRadius: "10px", fontSize: "0.875rem", textAlign: "center" }}>
                  {forgotError}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <style>{`
        input::placeholder { color: ${COLORS.placeholder}; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
