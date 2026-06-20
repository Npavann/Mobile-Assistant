import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Eye, EyeOff, User, Mail, Lock, ArrowLeft } from "lucide-react";
import { useUserAuth } from "../context/UserAuthContext";

export default function UserLogin() {
    const [isSignup, setIsSignup] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const { login, signup } = useUserAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (isSignup && !name.trim()) { setError("Name is required"); return; }
        if (!email.trim() || !password.trim()) { setError("Email and password required"); return; }

        setIsSubmitting(true);
        try {
            if (isSignup) {
                await signup(name, email, password);
            } else {
                await login(email, password);
            }
            navigate('/user-upload');
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Inter', sans-serif", padding: "1rem"
        }}>
            <button onClick={() => navigate('/')} style={{
                position: "fixed", top: "1.5rem", left: "1.5rem",
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px", padding: "0.6rem", color: "white", cursor: "pointer", display: "flex"
            }}>
                <ArrowLeft size={18} />
            </button>

            <div style={{
                width: "100%", maxWidth: "420px",
                background: "rgba(15,23,42,0.8)", backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px",
                padding: "2.5rem 2rem", boxShadow: "0 25px 50px rgba(0,0,0,0.5)"
            }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "2rem" }}>
                    <div style={{
                        width: "64px", height: "64px",
                        background: "linear-gradient(135deg, #10b981, #059669)",
                        borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center",
                        marginBottom: "1rem", boxShadow: "0 8px 24px rgba(16,185,129,0.4)"
                    }}>
                        <User size={32} color="white" />
                    </div>
                    <h1 style={{ color: "white", fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
                        {isSignup ? "Create Account" : "Welcome Back"}
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                        Upload phone data to MobileAssist AI
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {isSignup && (
                        <div style={{ position: "relative" }}>
                            <User size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
                            <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)}
                                style={{ width: "100%", padding: "0.875rem 1rem 0.875rem 2.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white", fontSize: "0.95rem", outline: "none", boxSizing: "border-box" }} />
                        </div>
                    )}

                    <div style={{ position: "relative" }}>
                        <Mail size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
                        <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)}
                            style={{ width: "100%", padding: "0.875rem 1rem 0.875rem 2.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white", fontSize: "0.95rem", outline: "none", boxSizing: "border-box" }} />
                    </div>

                    <div style={{ position: "relative" }}>
                        <Lock size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
                        <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                            style={{ width: "100%", padding: "0.875rem 3rem 0.875rem 2.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white", fontSize: "0.95rem", outline: "none", boxSizing: "border-box" }} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer" }}>
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {error && (
                        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", padding: "0.75rem 1rem", borderRadius: "10px", fontSize: "0.875rem" }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" disabled={isSubmitting} style={{
                        width: "100%", padding: "0.875rem",
                        background: "linear-gradient(135deg, #10b981, #059669)",
                        border: "none", borderRadius: "12px", color: "white", fontSize: "1rem", fontWeight: 600,
                        cursor: isSubmitting ? "not-allowed" : "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                        boxShadow: "0 4px 15px rgba(16,185,129,0.4)", opacity: isSubmitting ? 0.7 : 1, marginTop: "0.5rem"
                    }}>
                        {isSubmitting ? <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> : (isSignup ? "Sign Up" : "Sign In")}
                    </button>
                </form>

                <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                    <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem" }}>
                        {isSignup ? "Already have an account?" : "Don't have an account?"}
                    </span>{" "}
                    <span onClick={() => { setIsSignup(!isSignup); setError(""); }} style={{ color: "#34d399", fontSize: "0.875rem", cursor: "pointer", fontWeight: 600 }}>
                        {isSignup ? "Sign In" : "Sign Up"}
                    </span>
                </div>
            </div>

            <style>{`
                input::placeholder { color: rgba(255,255,255,0.25); }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}