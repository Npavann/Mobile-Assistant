import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send, Bot, Mic, Star, Smartphone, GitCompare, DollarSign, Camera } from "lucide-react";
import Sidebar from "../components/chat/Sidebar";
import ImageUpload from "../components/chat/ImageUpload";
import ChatMessage from "../components/chat/ChatMessage";
import { convertToBase64 } from "../utils/VisionService";
import { getHistory, saveHistory, createNewSession } from "../utils/storage";
import FavoritesModal from "../components/chat/FavoritesModal";

// ---- Professional color themes ----
// A pool of polished light palettes. One is picked at random each time
// the page loads, so the app feels fresh without ever looking garish.
function buildTheme({ pageBg, logoGradient, accent, star, highlight, suggestionColors, glow }) {
    return {
        pageBg,
        topBarBorder: "rgba(0, 0, 0, 0.08)",
        iconMuted: "#6B6B78",
        titleText: "#1A1A2E",
        star,
        logoGradient,
        bodyText: "#1F1F2E",
        subtleText: "#5B5B6B",
        cardBg: "#FFFFFF",
        cardBgHover: "#F7F6FC",
        cardBorder: "rgba(0, 0, 0, 0.08)",
        cardHighlightBorder: highlight,
        inputBarBg: "rgba(255, 255, 255, 0.75)",
        inputPillBg: "#FFFFFF",
        inputPillBorder: "rgba(0, 0, 0, 0.12)",
        inputText: "#1A1A2E",
        placeholder: "#9494A3",
        accent,
        danger: "#DC2626",
        suggestionColors,
        glow, // [colorA, colorB] used for the soft ambient light blobs behind the UI
    };
}

const PALETTES = [
    buildTheme({ // Soft Lavender
        pageBg: "#F5F2FE",
        logoGradient: "linear-gradient(135deg, #7B6FEE, #6C5CE7)",
        accent: "#6C5CE7", star: "#D97706", highlight: "#7B6FEE",
        suggestionColors: ["#6366F1", "#059669", "#D97706", "#DB2777"],
        glow: ["#7B6FEE", "#F472B6"],
    }),
    buildTheme({ // Mint Teal
        pageBg: "#EAFBF6",
        logoGradient: "linear-gradient(135deg, #2DD4BF, #0EA5A0)",
        accent: "#0D9488", star: "#D97706", highlight: "#2DD4BF",
        suggestionColors: ["#0D9488", "#6366F1", "#D97706", "#E11D48"],
        glow: ["#2DD4BF", "#818CF8"],
    }),
    buildTheme({ // Sage Green
        pageBg: "#E9FBF0",
        logoGradient: "linear-gradient(135deg, #34D399, #059669)",
        accent: "#059669", star: "#D97706", highlight: "#34D399",
        suggestionColors: ["#059669", "#2563EB", "#D97706", "#DB2777"],
        glow: ["#34D399", "#FBBF24"],
    }),
    buildTheme({ // Blush Plum
        pageBg: "#FCEDFE",
        logoGradient: "linear-gradient(135deg, #E879F9, #C026D3)",
        accent: "#C026D3", star: "#D97706", highlight: "#E879F9",
        suggestionColors: ["#C026D3", "#4F46E5", "#D97706", "#059669"],
        glow: ["#E879F9", "#34D399"],
    }),
    buildTheme({ // Cream Gold
        pageBg: "#FFF8E5",
        logoGradient: "linear-gradient(135deg, #FBBF24, #D97706)",
        accent: "#D97706", star: "#B45309", highlight: "#FBBF24",
        suggestionColors: ["#D97706", "#2563EB", "#059669", "#DB2777"],
        glow: ["#FBBF24", "#60A5FA"],
    }),
    buildTheme({ // Sky Blue
        pageBg: "#EAF3FE",
        logoGradient: "linear-gradient(135deg, #60A5FA, #3B82F6)",
        accent: "#2563EB", star: "#D97706", highlight: "#60A5FA",
        suggestionColors: ["#2563EB", "#059669", "#D97706", "#DB2777"],
        glow: ["#60A5FA", "#34D399"],
    }),
];

const SUGGESTION_ITEMS = [
    { icon: <Smartphone size={20} />, text: "Best phones under ₹20,000" },
    { icon: <GitCompare size={20} />, text: "Compare iPhone 15 vs Samsung S24" },
    { icon: <DollarSign size={20} />, text: "Top 5 flagship phones in India" },
    { icon: <Camera size={20} />, text: "Best camera phones under ₹30,000" },
];

// Convert a hex color like "#818CF8" to "rgba(129,140,248,alpha)" for tinted card backgrounds
function withAlpha(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function Chat() {
    // Theme auto-cycles to the next palette every 12 seconds while the page is open.
    const [themeIndex, setThemeIndex] = useState(() => Math.floor(Math.random() * PALETTES.length));
    const COLORS = PALETTES[themeIndex];
    const SUGGESTIONS = SUGGESTION_ITEMS.map((item, i) => ({ ...item, color: COLORS.suggestionColors[i] }));

    useEffect(() => {
        const interval = setInterval(() => {
            setThemeIndex(prev => (prev + 1) % PALETTES.length);
        }, 12000);
        return () => clearInterval(interval);
    }, []);

    const initialMessage = {
        role: "bot",
        content: "Hi! I am your AI Mobile Assistant. I can help you find phones, compare models, or suggest the best device."
    };

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);
    const inputRef = useRef(null);

    const isNewChat = messages.length <= 1;

    useEffect(() => {
        const history = getHistory();
        setChatHistory(history);
        if (history.length > 0) {
            setCurrentChatId(history[0].id);
            setMessages(history[0].messages);
        } else {
            createNewChat();
        }
    }, []);

    useEffect(() => {
        if (!currentChatId || messages.length === 0) return;
        setChatHistory(prev => {
            const history = [...prev];
            const chatIndex = history.findIndex(c => c.id === currentChatId);
            let title = "New Chat";
            if (messages.length > 1) {
                title = messages[1].content.substring(0, 25) + (messages[1].content.length > 25 ? "..." : "");
            }
            if (chatIndex > -1) {
                history[chatIndex].messages = messages;
                if (history[chatIndex].title === "New Chat" && messages.length > 1) {
                    history[chatIndex].title = title;
                }
                history[chatIndex].updatedAt = new Date().toISOString();
            } else {
                history.unshift({ id: currentChatId, title, messages, updatedAt: new Date().toISOString() });
            }
            saveHistory(history);
            return history;
        });
    }, [messages, currentChatId]);

    const createNewChat = () => {
        const session = createNewSession(initialMessage);
        setCurrentChatId(session.id);
        setMessages(session.messages);
    };

    const switchChat = (id) => {
        const session = chatHistory.find(c => c.id === id);
        if (session) {
            setCurrentChatId(session.id);
            setMessages(session.messages);
            setIsSidebarOpen(false);
        }
    };

    const deleteChat = (id) => {
        const updatedHistory = chatHistory.filter(c => c.id !== id);
        setChatHistory(updatedHistory);
        saveHistory(updatedHistory);
        if (currentChatId === id) {
            if (updatedHistory.length > 0) {
                setCurrentChatId(updatedHistory[0].id);
                setMessages(updatedHistory[0].messages);
            } else {
                createNewChat();
            }
        }
    };

    const renameChat = (id, newTitle) => {
        setChatHistory(prev => {
            const history = [...prev];
            const chatIndex = history.findIndex(c => c.id === id);
            if (chatIndex > -1) { history[chatIndex].title = newTitle; saveHistory(history); }
            return history;
        });
    };

    const clearAllHistory = () => {
        setChatHistory([]);
        saveHistory([]);
        createNewChat();
    };

    const saveFavorite = (phone) => {
        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        const exists = favorites.find(p => p._id === phone._id || p.model === phone.model);
        if (!exists) {
            favorites.push(phone);
            localStorage.setItem("favorites", JSON.stringify(favorites));
            alert("Phone added to favorites");
        } else {
            alert("Phone already in favorites");
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const speak = (text) => {
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = "en-US";
        window.speechSynthesis.speak(speech);
    };

    const sendMessage = async (messageText, imageFile = null) => {
        if (!messageText.trim() && !imageFile) return;
        let imageBase64 = null;
        if (imageFile) {
            try { imageBase64 = await convertToBase64(imageFile); } catch (err) { console.error(err); }
        }
        setMessages(prev => [...prev, { role: "user", content: messageText, image: imageBase64 }]);
        setIsLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/chat`,
                { message: messageText, image: imageBase64 }
            );
            const reply = response.data.reply;
            setMessages(prev => [...prev, { role: "bot", content: reply, phone: response.data.phone || null, phones: response.data.phones || [] }]);
            speak(reply);
        } catch (error) {
            setMessages(prev => [...prev, { role: "bot", content: "⚠ Error connecting to server." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if ((!input.trim() && !selectedImage) || isLoading) return;
        const userMessage = input;
        const currentImage = selectedImage;
        setInput("");
        setSelectedImage(null);
        sendMessage(userMessage, currentImage);
    };

    const startRecording = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) { alert("Speech recognition not supported"); return; }
        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.onstart = () => setIsRecording(true);
        recognition.onresult = (event) => {
            const speechText = event.results[0][0].transcript;
            setInput(speechText);
            sendMessage(speechText);
        };
        recognition.onend = () => setIsRecording(false);
        recognition.start();
        recognitionRef.current = recognition;
    };

    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
    const handleDrop = (e) => {
        e.preventDefault(); setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            if (file.size <= 5 * 1024 * 1024) setSelectedImage(file);
            else alert("File size should be less than 5MB");
        }
    };

    return (
        <div style={{ display: "flex", height: "100vh", background: COLORS.pageBg, color: COLORS.bodyText, fontFamily: "'Inter', sans-serif", overflow: "hidden", transition: "background 1.5s ease", position: "relative" }}>

            {/* Sidebar */}
            <Sidebar
                chatHistory={chatHistory}
                currentChatId={currentChatId}
                createNewChat={createNewChat}
                switchChat={switchChat}
                deleteChat={deleteChat}
                renameChat={renameChat}
                clearAllHistory={clearAllHistory}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div onClick={() => setIsSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(44, 24, 90, 0.4)", zIndex: 40 }} />
            )}

            {/* Main Area */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", position: "relative", zIndex: 1 }}
                onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>

                {/* Top Bar */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", borderBottom: `1px solid ${COLORS.topBarBorder}`, background: "rgba(255, 255, 255, 0.55)", backdropFilter: "blur(8px)" }}>
                    <button onClick={() => setIsSidebarOpen(true)} style={{ background: "none", border: "none", color: COLORS.iconMuted, cursor: "pointer", padding: "0.4rem", borderRadius: "8px" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                    </button>
                    <span style={{ fontWeight: 600, fontSize: "1rem", color: COLORS.titleText }}>MobileAssist AI</span>
                    <button onClick={() => setIsFavoritesOpen(true)} style={{ background: "none", border: "none", color: COLORS.star, cursor: "pointer", padding: "0.4rem", display: "flex" }}>
                        <Star size={20} />
                    </button>
                </div>

                {/* Messages or Welcome Screen */}
                <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
                    {isNewChat ? (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "2rem 1rem" }}>
                            {/* Logo */}
                            <div style={{ width: "64px", height: "64px", background: COLORS.logoGradient, borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)", transition: "background 1.5s ease" }}>
                                <Smartphone size={32} color="white" />
                            </div>
                            <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: "0 0 0.5rem", textAlign: "center", color: COLORS.titleText }}>MobileAssist AI</h1>
                            <p style={{ color: COLORS.subtleText, textAlign: "center", marginBottom: "2rem", fontSize: "0.95rem" }}>Your smart mobile phone assistant</p>

                            {/* Suggestion Cards */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", width: "100%", maxWidth: "480px" }}>
                                {SUGGESTIONS.map((s, i) => (
                                    <button key={i} onClick={() => { setInput(s.text); inputRef.current?.focus(); }}
                                        style={{
                                            background: withAlpha(s.color, 0.55),
                                            border: `1.5px solid ${withAlpha(s.color, 0.75)}`,
                                            borderRadius: "12px",
                                            padding: "1rem",
                                            cursor: "pointer",
                                            textAlign: "left",
                                            color: COLORS.titleText,
                                            transition: "background 0.2s"
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = withAlpha(s.color, 0.7)}
                                        onMouseLeave={e => e.currentTarget.style.background = withAlpha(s.color, 0.55)}
                                    >
                                        <div style={{ color: COLORS.titleText, marginBottom: "0.5rem" }}>{s.icon}</div>
                                        <div style={{ fontSize: "0.8rem", fontWeight: 600, color: COLORS.titleText, lineHeight: 1.4 }}>{s.text}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "720px", margin: "0 auto" }}>
                            {messages.slice(1).map((msg, index) => (
                                <ChatMessage key={index} msg={msg} saveFavorite={saveFavorite} />
                            ))}
                            {isLoading && (
                                <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                                    <div style={{ width: "36px", height: "36px", background: COLORS.logoGradient, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <Bot size={18} color="white" />
                                    </div>
                                    <div style={{ background: COLORS.cardBg, borderRadius: "16px", padding: "1rem", display: "flex", gap: "4px", alignItems: "center" }}>
                                        {[0,1,2].map(i => (
                                            <div key={i} style={{ width: "8px", height: "8px", background: COLORS.accent, borderRadius: "50%", animation: `bounce 1.2s ${i*0.2}s infinite` }} />
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div style={{ padding: "1rem", borderTop: `1px solid ${COLORS.topBarBorder}`, background: COLORS.inputBarBg, transition: "background 1.5s ease, border-color 1.5s ease" }}>
                    <form onSubmit={handleSubmit} style={{ maxWidth: "720px", margin: "0 auto" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: COLORS.inputPillBg, border: `2px solid ${COLORS.inputPillBorder}`, borderRadius: "16px", padding: "8px 12px" }}>
                            <ImageUpload selectedImage={selectedImage} onImageSelect={setSelectedImage} onImageRemove={() => setSelectedImage(null)} />
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about phones..."
                                disabled={isLoading}
                                style={{ flex: 1, background: "none", border: "none", color: COLORS.inputText, fontSize: "0.95rem", outline: "none", padding: "0.4rem 0" }}
                            />
                            <button type="button" onClick={startRecording} style={{ background: "none", border: "none", color: isRecording ? COLORS.danger : COLORS.subtleText, cursor: "pointer", padding: "0.4rem", display: "flex" }}>
                                <Mic size={20} />
                            </button>
                            <button type="submit" disabled={(!input.trim() && !selectedImage) || isLoading}
                                style={{ width: "36px", height: "36px", background: (input.trim() || selectedImage) ? COLORS.accent : "rgba(0,0,0,0.08)", border: "none", borderRadius: "10px", color: (input.trim() || selectedImage) ? "#fff" : COLORS.iconMuted, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "background 0.2s" }}>
                                <Send size={16} />
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <FavoritesModal isOpen={isFavoritesOpen} onClose={() => setIsFavoritesOpen(false)} />

            <style>{`
                @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-8px); } }
                ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 4px; }
                input::placeholder { color: ${COLORS.placeholder}; }
            `}</style>
        </div>
    );
}
