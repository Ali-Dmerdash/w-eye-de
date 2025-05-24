"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

export interface Message {
    id: string;
    text: string;
    sender: "user" | "assistant";
    timestamp: Date;
}

interface ChatContextType {
    isChatOpen: boolean;
    messages: Message[];
    openChat: (initialQuery?: string) => void;
    closeChat: () => void;
    sendMessage: (text: string) => void;
    isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Load messages from localStorage on initial render
    useEffect(() => {
        const savedMessages = localStorage.getItem("chatMessages");
        if (savedMessages) {
            try {
                const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp)
                }));
                setMessages(parsedMessages);
            } catch (error) {
                console.error("Failed to parse saved messages:", error);
            }
        }
    }, []);

    // Save messages to localStorage whenever they change
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem("chatMessages", JSON.stringify(messages));
        }
    }, [messages]);

    const openChat = (initialQuery?: string) => {
        setIsChatOpen(true);

        if (initialQuery && initialQuery.trim()) {
            // Add the initial query as a user message if it's not already the last user message
            const lastUserMessage = [...messages].reverse().find(m => m.sender === "user");
            if (!lastUserMessage || lastUserMessage.text !== initialQuery) {
                const newUserMessage: Message = {
                    id: Date.now().toString(),
                    text: initialQuery,
                    sender: "user",
                    timestamp: new Date(),
                };

                setMessages((prev) => [...prev, newUserMessage]);

                // Generate AI response
                generateAIResponse(initialQuery);
            }
        }
    };

    const closeChat = () => {
        setIsChatOpen(false);
    };

    const generateAIResponse = (userInput: string) => {
        setIsLoading(true);

        // Simulate AI response after a delay
        setTimeout(() => {
            const newAssistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: getAIResponse(userInput),
                sender: "assistant",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, newAssistantMessage]);
            setIsLoading(false);
        }, 1500);
    };

    const sendMessage = (text: string) => {
        if (!text.trim()) return;

        // Add user message
        const newUserMessage: Message = {
            id: Date.now().toString(),
            text,
            sender: "user",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, newUserMessage]);

        generateAIResponse(text);
    };

    const getAIResponse = (userInput: string): string => {
        const lowerInput = userInput.toLowerCase();

        if (lowerInput.includes("fraud") || lowerInput.includes("detection")) {
            return "Our fraud detection systems have identified 17 potential cases in the last 24 hours. The most common pattern involves multiple small transactions from different geographic locations using the same identifying information. Would you like me to show the detailed analysis?";
        } else if (lowerInput.includes("revenue") || lowerInput.includes("sales")) {
            return "Revenue has increased by 8.3% compared to the same period last year. The highest performing segment is digital services, which saw a 15.2% increase. Would you like to see the breakdown by product category or region?";
        } else if (lowerInput.includes("market") || lowerInput.includes("competitor")) {
            return "Current market analysis shows your main competitors gaining traction in the SMB sector, while your enterprise solutions maintain a strong market share. There's an opportunity to expand in the education vertical where competitor presence is weakening. Shall I prepare a detailed market positioning report?";
        } else if (lowerInput.includes("hello") || lowerInput.includes("hi") || lowerInput.includes("hey")) {
            return "Hello! I'm your AI assistant. I can help you with fraud detection, revenue analysis, market intelligence, and more. How can I assist you today?";
        } else if (lowerInput.includes("clear") || lowerInput.includes("reset") || lowerInput.includes("start over")) {
            return "I've cleared our conversation history. How else can I help you today?";
        } else {
            return "I've analyzed your request and gathered some insights. Based on our data, this appears to be an emerging trend that warrants further monitoring. Would you like me to generate a more detailed report on this topic or analyze any specific metrics related to it?";
        }
    };

    return (
        <ChatContext.Provider
            value={{
                isChatOpen,
                messages,
                openChat,
                closeChat,
                sendMessage,
                isLoading
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
}; 