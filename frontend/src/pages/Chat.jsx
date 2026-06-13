import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send, Bot, Mic, Star, Smartphone, GitCompare, DollarSign, Camera } from "lucide-react";
import Sidebar from "../components/chat/Sidebar";
import ImageUpload from "../components/chat/ImageUpload";
import ChatMessage from "../components/chat/ChatMessage";
import { convertToBase64 } from "../utils/VisionService";
import { getHistory, saveHistory, createNewSession } from "../utils/storage";
import FavoritesModal from "../components/chat/FavoritesModal";

const SUGGESTIONS = [
    { icon: <Smartphone size={20} />, text: "Best phones under ₹20,000", color: "#6366f1" },
    { icon: <GitCompare size={20} />, text: "Compare iPhone 15 vs Samsung S24", color: "#10b981" },
    { icon: <DollarSign size={20} />, text: "Top 5 flagship phones in India", color: "#f59e0b" },
    { icon: <Camera size={20} />, text: "Best camera phones under ₹30,000", color: "#ec4899" },
];

export default function Chat() {
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
        <div style={{ display: "flex", height: "100vh", background: "#0f0f0f", color: "white", fontFamily: "'Inter', sans-serif", overflow: "hidden" }}>

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

            {isSidebarOpen && (
                <div onClick={() => setIsSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }} />
            )}

            <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", position: "relative" }}
                onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>

                {/* Professional Top Bar */}
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "0.75rem 1.25rem",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(10,10,10,0.95)",
                    backdropFilter: "blur(20px)",
                    position: "sticky", top: 0, zIndex: 10
                }}>
                    {/* Menu Button */}
                    <button onClick={() => setIsSidebarOpen(true)} style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.6)", cursor: "pointer",
                        padding: "0.5rem", borderRadius: "10px", display: "flex",
                        transition: "all 0.2s"
                    }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <line x1="3" y1="12" x2="21" y2="12"/>
                            <line x1="3" y1="18" x2="21" y2="18"/>
                        </svg>
                    </button>

                    {/* Center Logo */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <div style={{
                            width: "34px", height: "34px",
                            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                            borderRadius: "10px",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: "0 4px 15px rgba(99,102,241,0.4)"
                        }}>
                            <Smartphone size={18} color="white" />
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "white", lineHeight: 1.2 }}>MobileAssist AI</div>
                            <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.3)", lineHeight: 1 }}>Your phone expert</div>
                        </div>
                    </div>

                    {/* Favorites Button */}
                    <button onClick={() => setIsFavoritesOpen(true)} style={{
                        background: "rgba(251,191,36,0.08)",
                        border: "1px solid rgba(251,191,36,0.15)",
                        color: "#fbbf24", cursor: "pointer",
                        padding: "0.5rem", borderRadius: "10px", display: "flex",
                        transition: "all 0.2s"
                    }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(251,191,36,0.15)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(251,191,36,0.08)"}
                    >
                        <Star size={18} />
                    </button>
                </div>

                {/* Messages or Welcome Screen */}
                <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
                    {isNewChat ? (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "2rem 1rem" }}>
                            {/* Big Logo */}
                            <div style={{
                                width: "80px", height: "80px",
                                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                borderRadius: "24px",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                marginBottom: "1.25rem",
                                boxShadow: "0 12px 40px rgba(99,102,241,0.35)"
                            }}>
                                <Smartphone size={40} color="white" />
                            </div>
                            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: "0 0 0.4rem", textAlign: "center", background: "linear-gradient(135deg, #fff, rgba(255,255,255,0.6))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                MobileAssist AI
                            </h1>
                            <p style={{ color: "rgba(255,255,255,0.35)", textAlign: "center", marginBottom: "2rem", fontSize: "0.9rem" }}>
                                Your smart mobile phone expert
                            </p>

                            {/* Suggestion Cards */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", width: "100%", maxWidth: "480px" }}>
                                {SUGGESTIONS.map((s, i) => (
                                    <button key={i} onClick={() => { setInput(s.text); inputRef.current?.focus(); }}
                                        style={{
                                            background: "rgba(255,255,255,0.03)",
                                            border: "1px solid rgba(255,255,255,0.07)",
                                            borderRadius: "14px", padding: "1rem",
                                            cursor: "pointer", textAlign: "left",
                                            color: "white", transition: "all 0.2s"
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
                                    >
                                        <div style={{ color: s.color, marginBottom: "0.5rem" }}>{s.icon}</div>
                                        <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.4 }}>{s.text}</div>
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
                                <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                                    <div style={{ width: "34px", height: "34px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <Bot size={16} color="white" />
                                    </div>
                                    <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "0.875rem 1rem", display: "flex", gap: "5px", alignItems: "center" }}>
                                        {[0,1,2].map(i => (
                                            <div key={i} style={{ width: "7px", height: "7px", background: "#6366f1", borderRadius: "50%", animation: `bounce 1.2s ${i*0.2}s infinite` }} />
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div style={{ padding: "0.875rem 1rem", borderTop: "1px solid rgba(255,255,255,0.06)", background: "#0a0a0a" }}>
                    <form onSubmit={handleSubmit} style={{ maxWidth: "720px", margin: "0 auto" }}>
                        <div style={{
                            display: "flex", alignItems: "center", gap: "8px",
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.09)",
                            borderRadius: "16px", padding: "8px 12px",
                            transition: "border-color 0.2s"
                        }}>
                            <ImageUpload selectedImage={selectedImage} onImageSelect={setSelectedImage} onImageRemove={() => setSelectedImage(null)} />
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about phones..."
                                disabled={isLoading}
                                style={{ flex: 1, background: "none", border: "none", color: "white", fontSize: "0.95rem", outline: "none", padding: "0.4rem 0" }}
                            />
                            <button type="button" onClick={startRecording} style={{
                                background: isRecording ? "rgba(239,68,68,0.15)" : "none",
                                border: "none",
                                color: isRecording ? "#ef4444" : "rgba(255,255,255,0.35)",
                                cursor: "pointer", padding: "0.4rem", display: "flex", borderRadius: "8px"
                            }}>
                                <Mic size={19} />
                            </button>
                            <button type="submit" disabled={(!input.trim() && !selectedImage) || isLoading}
                                style={{
                                    width: "34px", height: "34px",
                                    background: (input.trim() || selectedImage) ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(255,255,255,0.08)",
                                    border: "none", borderRadius: "10px", color: "white",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    cursor: (input.trim() || selectedImage) ? "pointer" : "not-allowed",
                                    flexShrink: 0, transition: "all 0.2s",
                                    boxShadow: (input.trim() || selectedImage) ? "0 4px 12px rgba(99,102,241,0.35)" : "none"
                                }}>
                                <Send size={15} />
                            </button>
                        </div>
                        <p style={{ textAlign: "center", fontSize: "0.7rem", color: "rgba(255,255,255,0.18)", margin: "0.5rem 0 0" }}>
                            MobileAssist AI can make mistakes. Verify important info.
                        </p>
                    </form>
                </div>
            </div>

            <FavoritesModal isOpen={isFavoritesOpen} onClose={() => setIsFavoritesOpen(false)} />

            <style>{`
                @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-8px); } }
                ::-webkit-scrollbar { width: 4px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
                input::placeholder { color: rgba(255,255,255,0.22); }
            `}</style>
        </div>
    );
}