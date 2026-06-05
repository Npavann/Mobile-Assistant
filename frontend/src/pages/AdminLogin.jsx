import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Server, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    // Clear error when user types
    if (error) setError("");
  }, [username, password]);

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
      setError("Wrong email or password.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#202123] font-sans selection:bg-[#10a37f] selection:text-white">
      <div className="w-full max-w-[400px] px-8 py-10 flex flex-col items-center">
        
        {/* Logo Icon */}
        <div className="mb-6">
          <Server className="w-10 h-10 text-white" strokeWidth={1.5} />
        </div>

        {/* Title */}
        <h1 className="text-2xl text-white font-semibold mb-8 tracking-tight">
          Welcome back
        </h1>

        <form onSubmit={handleLogin} className="w-full flex flex-col">
          {/* Username Input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-md text-white text-base placeholder-gray-400 focus:outline-none focus:border-[#10a37f] focus:ring-1 focus:ring-[#10a37f] transition-colors"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isSubmitting}
              autoComplete="username"
            />
          </div>

          {/* Password Input */}
          <div className="mb-6 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-md text-white text-base placeholder-gray-400 focus:outline-none focus:border-[#10a37f] focus:ring-1 focus:ring-[#10a37f] transition-colors pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex="-1"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-3 py-2 rounded-md">
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 shrink-0"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#10a37f] hover:bg-[#1a7f64] text-white font-medium text-base py-3 rounded-md transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Continue"
            )}
          </button>
        </form>

        <div className="mt-6 text-sm text-[#10a37f] hover:underline cursor-pointer">
          Forgot password?
        </div>
      </div>
    </div>
  );
}