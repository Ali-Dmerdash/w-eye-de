"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, ArrowDown, X, Trash } from "lucide-react";
import { useChat, Message } from "@/context/ChatContext";

export default function ChatModal() {
    const { isChatOpen, closeChat, messages, sendMessage, isLoading } = useChat();
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-focus the input when the modal opens
    useEffect(() => {
        if (isChatOpen && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isChatOpen]);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        if (isChatOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isChatOpen]);

    // Handle scroll to show/hide the scroll button
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            // Show button if not scrolled to bottom and has enough content
            setShowScrollButton(
                scrollHeight > clientHeight + 100 && scrollHeight - scrollTop - clientHeight > 100
            );
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSendMessage = () => {
        if (!input.trim()) return;
        sendMessage(input);
        setInput("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    if (!isChatOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm z-50 flex items-center justify-center p-4 shadow-lg">
            <div
                className="bg-white dark:bg-[#1d2328] rounded-lg shadow-xl w-full max-w-3xl h-[80vh] flex flex-col animate-fadeIn relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-800">
                    <div className="flex items-center">
                        <Bot className="w-6 h-6 text-[#4B65AB] dark:text-[#AEC3FF] mr-2" />
                        <div>
                            <h1 className="text-xl font-medium text-[#4B65AB] dark:text-[#AEC3FF]">Eye Master</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">AI assistant providing insights and analytics to help you</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                if (confirm("Are you sure you want to clear all chat history?")) {
                                    localStorage.removeItem("chatMessages");
                                    window.location.reload();
                                }
                            }}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                            title="Clear chat history"
                        >
                            <Trash className="w-5 h-5" />
                        </button>
                        <button
                            onClick={closeChat}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                            title="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Chat Messages */}
                <div
                    ref={containerRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F0F2F5] dark:bg-[#1A1E24] dark:custom-scrollbar"
                >
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <Bot className="w-16 h-16 text-[#4B65AB] dark:text-[#AEC3FF] mb-4" />
                            <h2 className="text-xl font-medium text-[#15191c] dark:text-white mb-2">
                                How can I assist you today?
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 max-w-md">
                                Ask me about fraud detection, revenue analysis, or market insights.
                            </p>
                        </div>
                    ) : (
                        messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"
                                    }`}
                            >
                                <div
                                    className={`flex max-w-3xl ${message.sender === "user" ? "flex-row-reverse" : "flex-row"
                                        }`}
                                >
                                    <div
                                        className={`flex items-center justify-center h-8 w-8 rounded-full flex-shrink-0 ${message.sender === "user"
                                                ? "bg-[#4B65AB] ml-2"
                                                : "bg-[#2a3441] dark:bg-[#AEC3FF]/20 mr-2"
                                            }`}
                                    >
                                        {message.sender === "user" ? (
                                            <User className="h-5 w-5 text-white" />
                                        ) : (
                                            <Bot className="h-5 w-5 text-white dark:text-[#AEC3FF]" />
                                        )}
                                    </div>
                                    <div
                                        className={`rounded-lg px-4 py-3 ${message.sender === "user"
                                                ? "bg-[#4B65AB] text-white"
                                                : "bg-white dark:bg-[#2a3441] text-[#15191c] dark:text-[#FAFAFA]"
                                            }`}
                                    >
                                        <div className="whitespace-pre-wrap">{message.text}</div>
                                        <div
                                            className={`text-xs mt-1 ${message.sender === "user"
                                                    ? "text-blue-100"
                                                    : "text-gray-500 dark:text-gray-400"
                                                }`}
                                        >
                                            {new Date(message.timestamp).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="flex flex-row">
                                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#2a3441] dark:bg-[#AEC3FF]/20 mr-2">
                                    <Bot className="h-5 w-5 text-white dark:text-[#AEC3FF]" />
                                </div>
                                <div className="bg-white dark:bg-[#2a3441] rounded-lg px-4 py-3 text-[#15191c] dark:text-[#FAFAFA]">
                                    <div className="flex space-x-1">
                                        <div className="size-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce"></div>
                                        <div className="size-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce delay-75"></div>
                                        <div className="size-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce delay-150"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {showScrollButton && (
                    <button
                        onClick={scrollToBottom}
                        className="absolute bottom-24 right-4 bg-[#4B65AB] dark:bg-[#2a3441] text-white dark:text-[#AEC3FF] rounded-full p-2 shadow-lg hover:bg-[#3A5095] dark:hover:bg-[#1d2328] transition-all"
                    >
                        <ArrowDown className="h-5 w-5" />
                    </button>
                )}

                {/* Input Area */}
                <div className="p-4 border-t dark:border-gray-800 bg-white dark:bg-[#1d2328]">
                    <div className="flex items-center gap-2 bg-[#F0F2F5] dark:bg-[#2a3441] rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message here..."
                            className="flex-1 bg-transparent border-none outline-none resize-none max-h-32 text-[#15191c] dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                            rows={1}
                            style={{ height: "auto", minHeight: "24px" }}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!input.trim() || isLoading}
                            className={`flex-shrink-0 rounded-full p-2 ${input.trim() && !isLoading
                                    ? "bg-[#4B65AB] text-white hover:bg-[#3A5095]"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                                } transition-colors`}
                        >
                            <Send className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 