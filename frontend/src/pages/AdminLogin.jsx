import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Server, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password states
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
    if (!forgotEmail.trim()) {
      setForgotError("Please enter your email.");
      return;
    }
    setForgotLoading(true);
    setForgotError("");
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/send-otp`,
        { email: forgotEmail }
      );
      setOtpSent(true);
      setForgotMsg("OTP sent to your email! Check inbox.");
    } catch (err) {
      setForgotError(err.response?.data?.error || "Failed to send OTP.");
    }
    setForgotLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setForgotError("Please enter the OTP.");
      return;
    }
    setForgotLoading(true);
    setForgotError("");
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/verify-otp`,
        { email: forgotEmail, otp }
      );
      setOtpVerified(true);
      setForgotMsg(`✅ OTP Verified! Your password is: admin123`);
    } catch (err) {
      setForgotError(err.response?.data?.error || "Invalid OTP.");
    }
    setForgotLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#202123] font-sans">
      <div className="w-full max-w-[400px] px-8 py-10 flex flex-col items-center">
        
        <div className="mb-6">
          <Server className="w-10 h-10 text-white" strokeWidth={1.5} />
        </div>

        {!showForgot ? (
          <>
            <h1 className="text-2xl text-white font-semibold mb-8 tracking-tight">
              Welcome back
            </h1>

            <form onSubmit={handleLogin} className="w-full flex flex-col">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-md text-white text-base placeholder-gray-400 focus:outline-none focus:border-[#10a37f] focus:ring-1 focus:ring-[#10a37f] transition-colors"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="mb-6 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-md text-white text-base placeholder-gray-400 focus:outline-none focus:border-[#10a37f] focus:ring-1 focus:ring-[#10a37f] transition-colors pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {error && (
                <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-3 py-2 rounded-md">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#10a37f] hover:bg-[#1a7f64] text-white font-medium text-base py-3 rounded-md transition-colors flex justify-center items-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue"}
              </button>
            </form>

            <div
              className="mt-6 text-sm text-[#10a37f] hover:underline cursor-pointer"
              onClick={() => setShowForgot(true)}
            >
              Forgot password?
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl text-white font-semibold mb-8 tracking-tight">
              Reset Password
            </h1>

            <div className="w-full flex flex-col gap-4">
              {!otpSent ? (
                <>
                  <input
                    type="email"
                    placeholder="Enter your admin email"
                    className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-[#10a37f] focus:ring-1 focus:ring-[#10a37f]"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />
                  <button
                    onClick={handleSendOtp}
                    disabled={forgotLoading}
                    className="w-full bg-[#10a37f] hover:bg-[#1a7f64] text-white font-medium py-3 rounded-md flex justify-center items-center"
                  >
                    {forgotLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send OTP"}
                  </button>
                </>
              ) : !otpVerified ? (
                <>
                  <p className="text-green-400 text-sm text-center">{forgotMsg}</p>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-[#10a37f] focus:ring-1 focus:ring-[#10a37f] text-center text-2xl tracking-widest"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                  />
                  <button
                    onClick={handleVerifyOtp}
                    disabled={forgotLoading}
                    className="w-full bg-[#10a37f] hover:bg-[#1a7f64] text-white font-medium py-3 rounded-md flex justify-center items-center"
                  >
                    {forgotLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify OTP"}
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <p className="text-green-400 text-lg mb-4">{forgotMsg}</p>
                  <button
                    onClick={() => { setShowForgot(false); setOtpSent(false); setOtpVerified(false); setForgotMsg(""); }}
                    className="w-full bg-[#10a37f] hover:bg-[#1a7f64] text-white font-medium py-3 rounded-md"
                  >
                    Back to Login
                  </button>
                </div>
              )}

              {forgotError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-3 py-2 rounded-md text-center">
                  {forgotError}
                </div>
              )}

              {!otpVerified && (
                <div
                  className="text-sm text-gray-400 hover:text-white cursor-pointer text-center"
                  onClick={() => { setShowForgot(false); setOtpSent(false); setForgotError(""); setForgotMsg(""); }}
                >
                  Back to login
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}