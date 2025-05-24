"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

export interface MessageAction {
    id: string;
    label: string;
    type: "button" | "link";
    value: string;
}

export interface FileAttachment {
    id: string;
    name: string;
    type: string;
    url: string;
    size: number;
    thumbnailUrl?: string;
}

export interface Message {
    id: string;
    text: string;
    sender: "user" | "assistant";
    timestamp: Date;
    actions?: MessageAction[];
    attachments?: FileAttachment[];
}

interface ChatContextType {
    isChatOpen: boolean;
    messages: Message[];
    openChat: (initialQuery?: string) => void;
    closeChat: () => void;
    sendMessage: (text: string, attachments?: FileAttachment[]) => void;
    isLoading: boolean;
    typingIndicator: boolean;
    draftMessage: string;
    setDraftMessage: (draft: string) => void;
    draftAttachments: FileAttachment[];
    setDraftAttachments: (attachments: FileAttachment[]) => void;
    handleActionClick: (actionId: string, messageId: string) => void;
    showHelpModal: boolean;
    setShowHelpModal: (show: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [typingIndicator, setTypingIndicator] = useState(false);
    const [conversationContext, setConversationContext] = useState<{
        topic?: string;
        lastMentionedEntities?: string[];
    }>({});
    const [draftMessage, setDraftMessage] = useState("");
    const [draftAttachments, setDraftAttachments] = useState<FileAttachment[]>([]);
    const [showHelpModal, setShowHelpModal] = useState(false);

    useEffect(() => {
        const savedMessages = localStorage.getItem("chatMessages");
        const savedContext = localStorage.getItem("chatContext");
        const savedDraft = localStorage.getItem("chatDraft");
        const savedDraftAttachments = localStorage.getItem("chatDraftAttachments");
        
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
        
        if (savedContext) {
            try {
                setConversationContext(JSON.parse(savedContext));
            } catch (error) {
                console.error("Failed to parse saved context:", error);
            }
        }

        if (savedDraft) {
            setDraftMessage(savedDraft);
        }

        if (savedDraftAttachments) {
            try {
                setDraftAttachments(JSON.parse(savedDraftAttachments));
            } catch (error) {
                console.error("Failed to parse saved draft attachments:", error);
            }
        }
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem("chatMessages", JSON.stringify(messages));
        }
        
        if (Object.keys(conversationContext).length > 0) {
            localStorage.setItem("chatContext", JSON.stringify(conversationContext));
        }

        if (draftMessage) {
            localStorage.setItem("chatDraft", draftMessage);
        } else {
            localStorage.removeItem("chatDraft");
        }

        if (draftAttachments.length > 0) {
            localStorage.setItem("chatDraftAttachments", JSON.stringify(draftAttachments));
        } else {
            localStorage.removeItem("chatDraftAttachments");
        }
    }, [messages, conversationContext, draftMessage, draftAttachments]);

    const openChat = (initialQuery?: string) => {
        setIsChatOpen(true);

        if (initialQuery && initialQuery.trim()) {
            if (initialQuery.trim().toLowerCase() === "/help") {
                setShowHelpModal(true);
                return;
            }
            
            const lastUserMessage = [...messages].reverse().find(m => m.sender === "user");
            if (!lastUserMessage || lastUserMessage.text !== initialQuery) {
                const newUserMessage: Message = {
                    id: Date.now().toString(),
                    text: initialQuery,
                    sender: "user",
                    timestamp: new Date(),
                };

                setMessages((prev) => [...prev, newUserMessage]);

                generateAIResponse(initialQuery);
            }
        }
    };

    const closeChat = () => {
        setIsChatOpen(false);
    };

    const updateContext = (userInput: string) => {
        const lowerInput = userInput.toLowerCase();
        
        if (lowerInput.includes("fraud")) {
            setConversationContext(prev => ({ ...prev, topic: "fraud" }));
        } else if (lowerInput.includes("revenue") || lowerInput.includes("sales")) {
            setConversationContext(prev => ({ ...prev, topic: "revenue" }));
        } else if (lowerInput.includes("market")) {
            setConversationContext(prev => ({ ...prev, topic: "market" }));
        }
        
        const entityRegex = /\b(dashboard|report|analysis|chart|metric|KPI|trend)\b/gi;
        const entities = userInput.match(entityRegex) || [];
        
        if (entities.length > 0) {
            setConversationContext(prev => ({
                ...prev,
                lastMentionedEntities: [...new Set([...(prev.lastMentionedEntities || []), ...entities])]
            }));
        }
    };

    const generateAIResponse = async (userInput: string) => {
        setIsLoading(true);
        setTypingIndicator(true);
        
        const typingDelay = Math.min(1000 + userInput.length * 10, 3000);
        
        try {
            updateContext(userInput);
            
            setTimeout(() => {
                const { text, actions } = getAIResponse(userInput);
                
                const newAssistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    text,
                    sender: "assistant",
                    timestamp: new Date(),
                    actions: actions
                };
                
                setMessages((prev) => [...prev, newAssistantMessage]);
                setTypingIndicator(false);
                setIsLoading(false);
            }, typingDelay);
        } catch (error) {
            console.error("Error generating AI response:", error);
            
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "I'm having trouble connecting to my knowledge base. Please try again in a moment.",
                sender: "assistant",
                timestamp: new Date(),
            };
            
            setMessages((prev) => [...prev, errorMessage]);
            setTypingIndicator(false);
            setIsLoading(false);
        }
    };

    const sendMessage = (text: string, attachments: FileAttachment[] = []) => {
        if (!text.trim() && attachments.length === 0) return;

        const newUserMessage: Message = {
            id: Date.now().toString(),
            text,
            sender: "user",
            timestamp: new Date(),
            attachments: attachments.length > 0 ? attachments : undefined
        };

        setMessages((prev) => [...prev, newUserMessage]);
        
        setDraftMessage("");
        setDraftAttachments([]);
        localStorage.removeItem("chatDraft");
        localStorage.removeItem("chatDraftAttachments");
        
        generateAIResponse(text);
    };

    const handleActionClick = (actionId: string, messageId: string) => {
        const message = messages.find(m => m.id === messageId);
        if (!message || !message.actions) return;
        
        const action = message.actions.find(a => a.id === actionId);
        if (!action) return;
        
        if (action.id === "export-csv") {
            const csvData = [
                "Category,Amount,Growth",
                "Digital Services,1200000,15.2",
                "Hardware Products,845000,3.7",
                "Professional Services,567000,12.1",
                "Subscription Plans,1500000,8.9"
            ].join("\n");
            
            const blob = new Blob([csvData], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `revenue-data-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            const newMessage: Message = {
                id: Date.now().toString(),
                text: "Revenue data has been exported as CSV.",
                sender: "assistant",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, newMessage]);
            return;
        } else if (action.id === "export-revenue") {
            const csvData = [
                "Category,Amount,Growth",
                "Digital Services,1200000,15.2",
                "Hardware Products,845000,3.7",
                "Professional Services,567000,12.1",
                "Subscription Plans,1500000,8.9"
            ].join("\n");
            
            const blob = new Blob([csvData], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `revenue-data-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            const newMessage: Message = {
                id: Date.now().toString(),
                text: "I've exported your revenue data as a CSV file. It includes category breakdowns with growth percentages.",
                sender: "assistant",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, newMessage]);
            return;
        } else if (action.id === "export-fraud") {
            const csvData = [
                "Case ID,Date,Transaction Amount,Risk Score,Location",
                "F-1001,2023-06-01,127.45,0.89,Eastern Europe",
                "F-1002,2023-06-01,98.23,0.92,Eastern Europe",
                "F-1003,2023-06-02,75.10,0.85,Southeast Asia",
                "F-1004,2023-06-02,250.00,0.78,Eastern Europe",
                "F-1005,2023-06-03,310.50,0.94,South America"
            ].join("\n");
            
            const blob = new Blob([csvData], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `fraud-reports-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            const newMessage: Message = {
                id: Date.now().toString(),
                text: "I've exported the fraud reports as a CSV file containing case IDs, dates, amounts, risk scores, and locations.",
                sender: "assistant",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, newMessage]);
            return;
        }
        
        if (action.type === "button") {
            sendMessage(action.value);
        } else if (action.type === "link") {
            window.open(action.value, "_blank");
        }
    };

    const getAIResponse = (userInput: string): { text: string, actions?: MessageAction[] } => {
        const lowerInput = userInput.toLowerCase();
        const { topic } = conversationContext;

        if (topic === "fraud" && lowerInput.includes("more detail")) {
            return {
                text: "Looking at the fraud details, we detected unusual patterns in transactions originating from IP addresses in Eastern Europe. These transactions showed a 230% increase compared to our baseline, with an average transaction value of $127.45. Our system flagged these based on velocity rules and geographic anomalies.",
                actions: [
                    {
                        id: "view-fraud-report",
                        label: "View Full Report",
                        type: "button",
                        value: "Show me the complete fraud analysis report"
                    },
                    {
                        id: "affected-accounts",
                        label: "Show Affected Accounts",
                        type: "button",
                        value: "List the accounts affected by fraud"
                    }
                ]
            };
        }
        
        if (topic === "revenue" && lowerInput.includes("breakdown")) {
            return {
                text: "Here's the revenue breakdown by category:\n\n- Digital Services: $1.2M (↑15.2%)\n- Hardware Products: $845K (↑3.7%)\n- Professional Services: $567K (↑12.1%)\n- Subscription Plans: $1.5M (↑8.9%)",
                actions: [
                    {
                        id: "revenue-details",
                        label: "Detailed Breakdown",
                        type: "button",
                        value: "Show me detailed revenue breakdown by region"
                    },
                    {
                        id: "export-csv",
                        label: "Export as CSV",
                        type: "button",
                        value: "Export revenue data as CSV"
                    }
                ]
            };
        }
        
        if (topic === "market" && lowerInput.includes("competitor")) {
            return {
                text: "Your main competitor, TechVision Inc., has gained 2.3% market share in the SMB sector over Q1, while your enterprise market share remains strong at 27.4% (↑1.2%).",
                actions: [
                    {
                        id: "competitor-analysis",
                        label: "Full Competitor Analysis",
                        type: "button",
                        value: "Show complete competitor analysis"
                    },
                    {
                        id: "market-trends",
                        label: "Market Trends",
                        type: "button",
                        value: "What are the current market trends?"
                    }
                ]
            };
        }


        if (lowerInput.includes("fraud") || lowerInput.includes("detection")) {
            return {
                text: "Our fraud detection systems have identified 17 potential cases in the last 24 hours. The most common pattern involves multiple small transactions from different geographic locations using the same identifying information.",
                actions: [
                    {
                        id: "fraud-details",
                        label: "View Details",
                        type: "button",
                        value: "Show me more details about these fraud cases"
                    },
                    {
                        id: "prevention-measures",
                        label: "Prevention Measures",
                        type: "button",
                        value: "What measures can we take to prevent fraud?"
                    }
                ]
            };
        } else if (lowerInput.includes("revenue") || lowerInput.includes("sales")) {
            return {
                text: "Revenue has increased by 8.3% compared to the same period last year. The highest performing segment is digital services, which saw a 15.2% increase.",
                actions: [
                    {
                        id: "revenue-breakdown",
                        label: "Show Breakdown",
                        type: "button",
                        value: "Show me the revenue breakdown"
                    },
                    {
                        id: "forecast",
                        label: "Revenue Forecast",
                        type: "button",
                        value: "What's our revenue forecast for next quarter?"
                    }
                ]
            };
        } else if (lowerInput.includes("market") || lowerInput.includes("competitor")) {
            return {
                text: "Current market analysis shows your main competitors gaining traction in the SMB sector, while your enterprise solutions maintain a strong market share.",
                actions: [
                    {
                        id: "market-details",
                        label: "Market Details",
                        type: "button",
                        value: "Tell me more about our market position"
                    },
                    {
                        id: "competitor-info",
                        label: "Competitor Info",
                        type: "button",
                        value: "Who is our main competitor?"
                    }
                ]
            };
        } else if (lowerInput.includes("hello") || lowerInput.includes("hi") || lowerInput.includes("hey")) {
            return {
                text: "Hello! I'm your AI assistant. I can help you with fraud detection, revenue analysis, market intelligence, and more. How can I assist you today?",
                actions: [
                    {
                        id: "fraud-overview",
                        label: "Fraud Overview",
                        type: "button",
                        value: "Show me fraud overview"
                    },
                    {
                        id: "revenue-overview",
                        label: "Revenue Overview",
                        type: "button",
                        value: "Show me revenue overview"
                    },
                    {
                        id: "market-overview",
                        label: "Market Analysis",
                        type: "button",
                        value: "Show me market analysis"
                    }
                ]
            };
        } else if (lowerInput.includes("clear") || lowerInput.includes("reset") || lowerInput.includes("start over")) {

            setConversationContext({});
            return {
                text: "I've cleared our conversation history and context. How else can I help you today?"
            };
        } else if (lowerInput.includes("upload") || lowerInput.includes("file") || lowerInput.includes("attachment")) {
            return {
                text: "You can upload files by clicking the attachment button in the message input area. I can help analyze documents, images, and data files.",
                actions: [
                    {
                        id: "upload-help",
                        label: "Upload Help",
                        type: "button",
                        value: "What file types do you support?"
                    }
                ]
            };
        } else if (lowerInput.includes("export") || lowerInput.includes("csv")) {
            return {
                text: "I can help you export data in various formats. What kind of data would you like to export?",
                actions: [
                    {
                        id: "export-revenue",
                        label: "Revenue Data",
                        type: "button",
                        value: "Export revenue data"
                    },
                    {
                        id: "export-fraud",
                        label: "Fraud Reports",
                        type: "button",
                        value: "Export fraud reports"
                    }
                ]
            };
        } else {
            return {
                text: "I've analyzed your request and gathered some insights. Based on our data, this appears to be an emerging trend that warrants further monitoring."
            };
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
                isLoading,
                typingIndicator,
                draftMessage,
                setDraftMessage,
                draftAttachments,
                setDraftAttachments,
                handleActionClick,
                showHelpModal,
                setShowHelpModal
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