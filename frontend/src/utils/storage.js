export const CHAT_STORAGE_KEY = "chatHistory";

export const getHistory = () => {
    try {
        const data = localStorage.getItem(CHAT_STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("Failed to parse chat history", error);
        return [];
    }
};

export const saveHistory = (history) => {
    try {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
        console.error("Failed to save chat history", error);
    }
};

export const createNewSession = (initialMessage) => {
    return {
        id: Date.now().toString(),
        title: "New Chat",
        messages: initialMessage ? [initialMessage] : [],
        updatedAt: new Date().toISOString()
    };
};
