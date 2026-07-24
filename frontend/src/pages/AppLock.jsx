import { useState, useEffect } from "react";
import { Fingerprint, Lock, Eye, EyeOff, Smartphone } from "lucide-react";

const APP_PASSWORD = "1234"; // Change this to your preferred password

export default function AppLock({ onUnlock }) {
    const [method, setMethod] = useState("fingerprint");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isChecking, setIsChecking] = useState(false);
    const [fingerprintSupported, setFingerprintSupported] = useState(false);

    useEffect(() => {
        // Check if fingerprint/biometric is supported
        if (window.PublicKeyCredential) {
            PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
                .then(available => {
                    setFingerprintSupported(available);
                    if (available) {
                        setMethod("fingerprint");
                    } else {
                        setMethod("password");
                    }
                })
                .catch(() => setMethod("password"));
        } else {
            setMethod("password");
        }
    }, []);

    const handleFingerprint = async () => {
        setIsChecking(true);
        setError("");
        try {
            const credential = await navigator.credentials.get({
                publicKey: {
                    challenge: new Uint8Array(32),
                    rpId: window.location.hostname,
                    userVerification: "required",
                    timeout: 60000
                }
            });
            if (credential) {
                onUnlock();
            }
        } catch (err) {
            if (err.name === "NotAllowedError") {
                setError("Fingerprint not recognized. Try again or use password.");
            } else {
                setError("Biometric authentication failed. Please use password.");
                setMethod("password");
            }
        } finally {
            setIsChecking(false);
        }
    };

    const handlePassword = () => {
        if (password === APP_PASSWORD) {
            onUnlock();
        } else {
            setError("Incorrect password. Please try again.");
            setPassword("");
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Inter', sans-serif", padding: "1rem"
        }}>
            <div style={{
                width: "100%", maxWidth: "380px",
                background: "rgba(15,23,42,0.85)", backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px",
                padding: "2.5rem 2rem", boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
                textAlign: "center"
            }}>
                {/* Logo */}
                <div style={{
                    width: "72px", height: "72px",
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    borderRadius: "20px", display: "flex", alignItems: "center",
                    justifyContent: "center", margin: "0 auto 1.25rem",
                    boxShadow: "0 8px 24px rgba(99,102,241,0.4)"
                }}>
                    <Smartphone size={36} color="white" />
                </div>

                <h1 style={{ color: "white", fontSize: "1.4rem", fontWeight: 700, margin: "0 0 0.4rem" }}>
                    MobileAssist AI
                </h1>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", marginBottom: "2rem" }}>
                    Verify your identity to continue
                </p>

                {/* Toggle buttons */}
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", background: "rgba(255,255,255,0.05)", borderRadius: "12px", padding: "4px" }}>
                    <button onClick={() => { setMethod("fingerprint"); setError(""); }}
                        style={{
                            flex: 1, padding: "0.6rem",
                            background: method === "fingerprint" ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "none",
                            border: "none", borderRadius: "10px", color: "white",
                            cursor: "pointer", fontSize: "0.85rem", fontWeight: 500,
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem"
                        }}>
                        <Fingerprint size={16} /> Fingerprint
                    </button>
                    <button onClick={() => { setMethod("password"); setError(""); }}
                        style={{
                            flex: 1, padding: "0.6rem",
                            background: method === "password" ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "none",
                            border: "none", borderRadius: "10px", color: "white",
                            cursor: "pointer", fontSize: "0.85rem", fontWeight: 500,
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem"
                        }}>
                        <Lock size={16} /> Password
                    </button>
                </div>

                {/* Fingerprint Section */}
                {method === "fingerprint" && (
                    <div>
                        <button onClick={handleFingerprint} disabled={isChecking}
                            style={{
                                width: "100px", height: "100px", borderRadius: "50%",
                                background: isChecking ? "rgba(99,102,241,0.3)" : "rgba(99,102,241,0.15)",
                                border: "2px solid rgba(99,102,241,0.4)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                margin: "0 auto 1rem", cursor: "pointer",
                                transition: "all 0.2s",
                                animation: isChecking ? "pulse 1s infinite" : "none"
                            }}>
                            <Fingerprint size={48} color="#818cf8" />
                        </button>
                        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", marginBottom: "1rem" }}>
                            {isChecking ? "Scanning fingerprint..." : "Tap to scan fingerprint"}
                        </p>
                        {!fingerprintSupported && (
                            <p style={{ color: "#f87171", fontSize: "0.8rem", marginBottom: "1rem" }}>
                                Fingerprint not supported on this device. Use password instead.
                            </p>
                        )}
                    </div>
                )}

                {/* Password Section */}
                {method === "password" && (
                    <div>
                        <div style={{ position: "relative", marginBottom: "1rem" }}>
                            <Lock size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter app password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                                onKeyDown={(e) => e.key === "Enter" && handlePassword()}
                                style={{
                                    width: "100%", padding: "0.875rem 3rem 0.875rem 2.75rem",
                                    background: "rgba(255,255,255,0.05)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: "12px", color: "white",
                                    fontSize: "0.95rem", outline: "none", boxSizing: "border-box"
                                }}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer" }}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <button onClick={handlePassword}
                            style={{
                                width: "100%", padding: "0.875rem",
                                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                border: "none", borderRadius: "12px", color: "white",
                                fontSize: "1rem", fontWeight: 600, cursor: "pointer",
                                boxShadow: "0 4px 15px rgba(99,102,241,0.4)"
                            }}>
                            Unlock
                        </button>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div style={{
                        marginTop: "1rem", background: "rgba(239,68,68,0.1)",
                        border: "1px solid rgba(239,68,68,0.3)", color: "#f87171",
                        padding: "0.75rem 1rem", borderRadius: "10px", fontSize: "0.85rem"
                    }}>
                        {error}
                    </div>
                )}
            </div>

            <style>{`
                input::placeholder { color: rgba(255,255,255,0.25); }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
            `}</style>
        </div>
    );
}