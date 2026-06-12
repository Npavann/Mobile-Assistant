import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send, Bot, User, Mic, Star } from "lucide-react";
import Sidebar from "../components/chat/Sidebar";
import ImageUpload from "../components/chat/ImageUpload";
import ChatMessage from "../components/chat/ChatMessage";
import { convertToBase64 } from "../utils/VisionService";
import { getHistory, saveHistory, createNewSession } from "../utils/storage";
import FavoritesModal from "../components/chat/FavoritesModal";

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

    // Sidebar state
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

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

    // Save current chat auto
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
                history.unshift({
                    id: currentChatId,
                    title: title,
                    messages: messages,
                    updatedAt: new Date().toISOString()
                });
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
            if (chatIndex > -1) {
                history[chatIndex].title = newTitle;
                saveHistory(history);
            }
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
        const exists = favorites.find(
            p => p._id === phone._id || p.model === phone.model
        );
        if (!exists) {
            favorites.push(phone);
            localStorage.setItem("favorites", JSON.stringify(favorites));
            alert(" Phone added to favorites");
        } else {
            alert("Phone already in favorites");
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
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
            try {
                imageBase64 = await convertToBase64(imageFile);
            } catch (err) {
                console.error("Error converting image:", err);
            }
        }

        setMessages(prev => [...prev, { role: "user", content: messageText, image: imageBase64 }]);
        setIsLoading(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/chat`,
                { message: messageText, image: imageBase64 }
            );

            const reply = response.data.reply;
            setMessages(prev => [
                ...prev,
                {
                    role: "bot",
                    content: reply,
                    phone: response.data.phone || null,
                    phones: response.data.phones || []
                }
            ]);
            speak(reply);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [
                ...prev,
                {
                    role: "bot",
                    content: "⚠ Error connecting to server."
                }
            ]);
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

        if (!SpeechRecognition) {
            alert("Speech recognition not supported in this browser");
            return;
        }

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

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            if (file.size <= 5 * 1024 * 1024) {
                setSelectedImage(file);
            } else {
                alert("File size should be less than 5MB");
            }
        } else if (file) {
            alert("Only JPG, PNG and WEBP formats are supported");
        }
    };

    return (
        <div className="gpt-layout">

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

            {/* Main Chat Area */}
            <div 
                className="gpt-main chat-container" 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{ position: 'relative' }}
            >
                {isDragging && (
                    <div style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        border: '2px dashed #818cf8',
                        zIndex: 100,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none'
                    }}>
                        <div style={{ background: 'rgba(15, 23, 42, 0.9)', padding: '1rem 2rem', borderRadius: '1rem', color: '#818cf8', fontWeight: 600, fontSize: '1.25rem' }}>
                            Drop image here to upload
                        </div>
                    </div>
                )}

                <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "flex-start", gap: "1rem", alignItems: "center" }}>
                    <h1 className="page-title" style={{ margin: 0, fontWeight: "800", fontSize: "1.5rem", flex: 1 }}>
                        MobileAssist AI
                    </h1>
                    <button 
                        onClick={() => setIsFavoritesOpen(true)}
                        className="icon-btn" 
                        title="View Favorites"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', padding: '0.5rem 1rem' }}
                    >
                        <Star size={20} />
                        <span style={{ fontWeight: 600 }}>Favorites</span>
                    </button>
                </div>

                <div className="chat-messages custom-scrollbar" style={{ flex: 1, padding: "1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1.5rem", transition: "all 0.3s" }}>
                    {messages.map((msg, index) => (
                        <ChatMessage key={index} msg={msg} saveFavorite={saveFavorite} />
                    ))}

                    {isLoading && (
                        <div className="message bot" style={{ display: "flex", gap: "1rem", maxWidth: "85%" }}>
                            <div className="avatar">
                                <Bot size={20} color="white" />
                            </div>
                            <div className="bubble">
                                <div className="typing-indicator" style={{ display: "flex", gap: "4px", padding: "0.5rem 1rem" }}>
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form
  onSubmit={handleSubmit}
  className="chat-input"
  style={{
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px",
    borderTop: "1px solid var(--border)",
    background: "rgba(15,23,42,0.4)",
    position: "sticky",
    bottom: 0,
    width: "100%",
  }}
>
  {/* Image Upload */}
  <ImageUpload
    selectedImage={selectedImage}
    onImageSelect={setSelectedImage}
    onImageRemove={() => setSelectedImage(null)}
  />

  {/* Mic Button */}
  <button
    type="button"
    onClick={startRecording}
    style={{
      width: "48px",
      height: "48px",
      borderRadius: "12px",
      border: "none",
      background: isRecording ? "#ef4444" : "#10b981",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <Mic size={20} />
  </button>

  {/* Input */}
  <input
    type="text"
    value={input}
    onChange={(e) => setInput(e.target.value)}
    placeholder="Ask about phones..."
    disabled={isLoading}
    style={{
      flex: 1,
      minWidth: 0,
      height: "48px",
      borderRadius: "12px",
      padding: "0 14px",
      background: "#1e293b",
      color: "#fff",
      border: "1px solid #334155",
    }}
  />

  {/* Send Button */}
  <button
    type="submit"
    disabled={(!input.trim() && !selectedImage) || isLoading}
    style={{
      width: "48px",
      height: "48px",
      borderRadius: "12px",
      border: "none",
      background: "#6366f1",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      cursor: "pointer",
    }}
  >
    <Send size={20} />
  </button>
</form>
 <FavoritesModal 
 isOpen={isFavoritesOpen} 
 onClose={() => setIsFavoritesOpen(false)} 
 />
  </div>
  </div>
  );
}