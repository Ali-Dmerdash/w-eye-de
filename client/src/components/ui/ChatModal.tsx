"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"

import {
    Send,
    Bot,
    User,
    ArrowDown,
    X,
    Trash,
    Search,
    Paperclip,
    ImageIcon,
    FileText,
    File,
    HelpCircle,
    Menu,
    Clock,
} from "lucide-react"
import { useChat, type Message, type FileAttachment } from "@/context/ChatContext"

export const HelpModal = ({ onClose }: { onClose: () => void }) => {
    const { setShowHelpModal, setDraftMessage } = useChat()
    const helpKeywords = [
        { keyword: "fraud", description: "Information about fraud detection and prevention" },
        { keyword: "revenue", description: "Revenue analysis and forecasts" },
        { keyword: "sales", description: "Sales performance and metrics" },
        { keyword: "market", description: "Market analysis and competitor information" },
        { keyword: "competitor", description: "Details about competitor companies" },
        { keyword: "hello", description: "Start a conversation with a greeting" },
        { keyword: "clear", description: "Reset the conversation history" },
        { keyword: "reset", description: "Clear conversation context and history" },
        { keyword: "upload", description: "Information about file uploads" },
        { keyword: "file", description: "File handling capabilities" },
        { keyword: "export", description: "Export data to CSV or other formats" },
        { keyword: "help", description: "Get assistance with using the chat" },
    ]

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-purple-100 dark:border-gray-700 w-full max-w-2xl max-h-[80vh] flex flex-col transform animate-in zoom-in-95 duration-200 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                    <div className="w-full h-full bg-purple-300 rounded-full transform translate-x-12 -translate-y-12"></div>
                </div>

                {/* Header */}
                <div className="p-6 border-b border-purple-100 dark:border-gray-700 relative z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-xl shadow-sm">
                                <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chat Help</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 dark:custom-scrollbar relative z-10">
                    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
                        <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Pro Tips</h3>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                            <li>Try combining keywords for more specific responses (e.g., "revenue forecast")</li>
                            <li>Use the interactive buttons that appear in responses for quick follow-ups</li>
                            <li>You can upload files for analysis using the attachment button</li>
                            <li>
                                Type <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">/help</span> anytime to see
                                this help screen
                            </li>
                        </ul>
                    </div>

                    <p className="text-gray-900 dark:text-white mb-4">
                        You can type these keywords to get specific responses from the AI assistant:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {helpKeywords.map((item, index) => (
                            <div
                                key={index}
                                className="border border-purple-100 dark:border-gray-700 rounded-xl p-3 bg-white dark:bg-gray-800/50 cursor-pointer hover:bg-purple-50 dark:hover:bg-gray-700/50 transition-colors shadow-sm hover:shadow-md"
                                onClick={() => {
                                    setDraftMessage(item.keyword)
                                    onClose()
                                    setTimeout(() => {
                                        const chatInput = document.querySelector('textarea[placeholder*="help"]') as HTMLTextAreaElement
                                        if (chatInput) {
                                            chatInput.value = item.keyword
                                            chatInput.focus()
                                        }
                                    }, 100)
                                }}
                            >
                                <div className="font-medium text-purple-600 dark:text-purple-400 mb-1">{item.keyword}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">{item.description}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-purple-100 dark:border-gray-700 flex justify-end relative z-10">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function ChatModal() {
    const {
        isChatOpen,
        closeChat,
        messages,
        sendMessage,
        isLoading,
        typingIndicator,
        draftMessage,
        setDraftMessage,
        draftAttachments,
        setDraftAttachments,
        handleActionClick,
        showHelpModal,
        setShowHelpModal,
    } = useChat()
    const [input, setInput] = useState("")
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [showScrollButton, setShowScrollButton] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const [searchVisible, setSearchVisible] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<Message[]>([])
    const [currentResultIndex, setCurrentResultIndex] = useState(-1)
    const searchResultRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

    const [showOptionsMenu, setShowOptionsMenu] = useState(false)
    const [showAttachmentMenu, setShowAttachmentMenu] = useState(false)

    useEffect(() => {
        if (isChatOpen && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus()
            }, 100)
        }
    }, [isChatOpen])

    useEffect(() => {
        if (isChatOpen && draftMessage) {
            setInput(draftMessage)
        }
    }, [isChatOpen, draftMessage])

    useEffect(() => {
        if (isChatOpen) {
            setDraftMessage(input)
        }
    }, [input, isChatOpen, setDraftMessage])

    useEffect(() => {
        if (isChatOpen && !searchVisible) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages, isChatOpen, searchVisible])

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container
            setShowScrollButton(scrollHeight > clientHeight + 100 && scrollHeight - scrollTop - clientHeight > 100)
        }

        container.addEventListener("scroll", handleScroll)
        return () => container.removeEventListener("scroll", handleScroll)
    }, [])

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setSearchResults([])
            setCurrentResultIndex(-1)
            return
        }

        const query = searchQuery.toLowerCase()
        const results = messages.filter((message) => message.text.toLowerCase().includes(query))

        setSearchResults(results)
        setCurrentResultIndex(results.length > 0 ? 0 : -1)
    }, [searchQuery, messages])

    useEffect(() => {
        if (currentResultIndex >= 0 && searchResults.length > 0) {
            const currentMessage = searchResults[currentResultIndex]
            const element = searchResultRefs.current[currentMessage.id]

            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" })
            }
        }
    }, [currentResultIndex, searchResults])

    const handleSendMessage = () => {
        if ((!input.trim() && draftAttachments.length === 0) || isLoading) return
        sendMessage(input, draftAttachments)
        setInput("")
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            if (input.trim() === "/help") {
                setShowHelpModal(true)
                setInput("")
            } else {
                handleSendMessage()
            }
        }
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const toggleSearch = () => {
        setSearchVisible(!searchVisible)
        if (searchVisible) {
            setSearchQuery("")
            setSearchResults([])
            setCurrentResultIndex(-1)
        }
    }

    const navigateSearchResults = (direction: "next" | "prev") => {
        if (searchResults.length === 0) return

        if (direction === "next") {
            setCurrentResultIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0))
        } else {
            setCurrentResultIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1))
        }
    }

    const highlightSearchText = (text: string) => {
        if (!searchQuery.trim()) return text

        const parts = text.split(new RegExp(`(${searchQuery})`, "gi"))
        return parts.map((part, i) =>
                part.toLowerCase() === searchQuery.toLowerCase() ? (
                    <span key={i} className="bg-yellow-200 dark:bg-yellow-700">
          {part}
        </span>
                ) : (
                    part
                ),
        )
    }

    const handleFileSelect = () => {
        fileInputRef.current?.click()
        setShowOptionsMenu(false)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        const newAttachments: FileAttachment[] = []

        Array.from(files).forEach((file) => {
            const fileUrl = URL.createObjectURL(file)
            let thumbnailUrl

            if (file.type.startsWith("image/")) {
                thumbnailUrl = fileUrl
            }

            const newAttachment: FileAttachment = {
                id: Date.now() + Math.random().toString(),
                name: file.name,
                type: file.type,
                url: fileUrl,
                size: file.size,
                thumbnailUrl,
            }

            newAttachments.push(newAttachment)
        })

        setDraftAttachments([...draftAttachments, ...newAttachments])

        e.target.value = ""
    }

    const removeAttachment = (id: string) => {
        const attachmentToRemove = draftAttachments.find((a) => a.id === id)

        if (attachmentToRemove) {
            URL.revokeObjectURL(attachmentToRemove.url)
            if (attachmentToRemove.thumbnailUrl) {
                URL.revokeObjectURL(attachmentToRemove.thumbnailUrl)
            }
        }

        const updatedAttachments = draftAttachments.filter((a) => a.id !== id)
        setDraftAttachments(updatedAttachments)
    }

    const getFileIcon = (fileType: string) => {
        if (fileType.startsWith("image/")) {
            return <ImageIcon className="w-4 h-4" />
        } else if (fileType.includes("pdf") || fileType.includes("document") || fileType.includes("text")) {
            return <FileText className="w-4 h-4" />
        } else {
            return <File className="w-4 h-4" />
        }
    }

    const formatFileSize = (size: number) => {
        if (size < 1024) {
            return `${size} B`
        } else if (size < 1024 * 1024) {
            return `${(size / 1024).toFixed(1)} KB`
        } else {
            return `${(size / (1024 * 1024)).toFixed(1)} MB`
        }
    }

    const renderAttachments = (attachments: FileAttachment[]) => {
        if (!attachments || attachments.length === 0) return null

        return (
            <div className="flex flex-wrap gap-2 mt-2">
                {attachments.map((attachment) => (
                    <div
                        key={attachment.id}
                        className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 shadow-sm"
                    >
                        {attachment.thumbnailUrl ? (
                            <div className="w-full">
                                <img
                                    src={attachment.thumbnailUrl || "/placeholder.svg"}
                                    alt={attachment.name}
                                    className="max-h-32 object-cover w-full"
                                    onClick={() => window.open(attachment.url, "_blank")}
                                />
                            </div>
                        ) : (
                            <div
                                className="flex items-center p-2 cursor-pointer"
                                onClick={() => window.open(attachment.url, "_blank")}
                            >
                                <div className="mr-2 text-gray-500 dark:text-gray-400">{getFileIcon(attachment.type)}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs truncate font-medium">{attachment.name}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(attachment.size)}</div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )
    }

    if (!isChatOpen) return null

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-purple-100 dark:border-gray-700 w-full max-w-3xl h-[80vh] flex flex-col transform animate-in zoom-in-95 duration-200 relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                    <div className="w-full h-full bg-purple-300 rounded-full transform translate-x-12 -translate-y-12"></div>
                </div>

                {/* Header */}
                <div className="p-6 border-b border-purple-100 dark:border-gray-700 relative z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-xl shadow-sm">
                                <Bot className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Eye Master</h1>
                                <p className="hidden md:block text-sm text-gray-500 dark:text-gray-400">
                                    AI assistant providing insights and analytics to help you
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={toggleSearch}
                                className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                    searchVisible
                                        ? "bg-gray-100 dark:bg-gray-700 text-purple-600 dark:text-purple-400"
                                        : "text-gray-500 dark:text-gray-400"
                                }`}
                                title="Search messages"
                            >
                                <Search className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => {
                                    if (messages.length > 0) {
                                        const exportData = JSON.stringify(messages, null, 2)
                                        const blob = new Blob([exportData], { type: "application/json" })
                                        const url = URL.createObjectURL(blob)
                                        const a = document.createElement("a")
                                        a.href = url
                                        a.download = `chat-history-${new Date().toISOString().split("T")[0]}.json`
                                        document.body.appendChild(a)
                                        a.click()
                                        document.body.removeChild(a)
                                        URL.revokeObjectURL(url)
                                    }
                                }}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                                title="Export chat history"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                            </button>
                            <button
                                onClick={() => {
                                    if (confirm("Are you sure you want to clear all chat history?")) {
                                        localStorage.removeItem("chatMessages")
                                        localStorage.removeItem("chatContext")
                                        localStorage.removeItem("chatDraft")
                                        localStorage.removeItem("chatDraftAttachments")
                                        window.location.reload()
                                    }
                                }}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                                title="Clear chat history"
                            >
                                <Trash className="w-5 h-5" />
                            </button>
                            <button
                                onClick={closeChat}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                                title="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                {searchVisible && (
                    <div className="px-6 py-3 border-b border-purple-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center gap-2 relative z-10">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search messages..."
                                autoFocus
                                className="w-full py-2 px-4 pr-16 bg-gray-50 dark:bg-gray-700 border border-purple-100 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                {searchResults.length > 0 && (
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                    {currentResultIndex + 1}/{searchResults.length}
                  </span>
                                )}
                                <button
                                    onClick={() => navigateSearchResults("prev")}
                                    disabled={searchResults.length === 0}
                                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Previous result"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-gray-500 dark:text-gray-400"
                                    >
                                        <polyline points="18 15 12 9 6 15"></polyline>
                                    </svg>
                                </button>
                                <button
                                    onClick={() => navigateSearchResults("next")}
                                    disabled={searchResults.length === 0}
                                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Next result"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-gray-500 dark:text-gray-400"
                                    >
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={toggleSearch}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                            title="Close search"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Chat Messages */}
                <div
                    ref={containerRef}
                    className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 dark:custom-scrollbar"
                >
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-6">
                                <Bot className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">How can I assist you today?</h2>
                            <p className="text-gray-600 dark:text-gray-300 max-w-md mb-8">
                                Ask me about fraud detection, revenue analysis, or market insights.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
                                {[
                                    "Tell me about fraud trends",
                                    "Analyze revenue data",
                                    "Show market insights",
                                    "Help me with SWOT",
                                ].map((suggestion, index) => (
                                    <button
                                        key={index}
                                        className="px-4 py-3 bg-white dark:bg-gray-700 border border-purple-100 dark:border-gray-600 rounded-xl text-left hover:bg-purple-50 dark:hover:bg-gray-600 transition-colors shadow-sm hover:shadow-md"
                                        onClick={() => {
                                            setInput(suggestion)
                                            setTimeout(() => {
                                                handleSendMessage()
                                            }, 100)
                                        }}
                                    >
                                        <span className="text-gray-900 dark:text-white font-medium">{suggestion}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        messages.map((message) => {
                            const isSearchResult =
                                searchVisible &&
                                searchResults.length > 0 &&
                                searchResults.findIndex((m) => m.id === message.id) === currentResultIndex

                            return (
                                <div
                                    key={message.id}
                                    ref={(el: HTMLDivElement | null) => {
                                        searchResultRefs.current[message.id] = el
                                        return undefined
                                    }}
                                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`flex max-w-3xl ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                        <div
                                            className={`flex items-center justify-center h-10 w-10 rounded-full flex-shrink-0 ${
                                                message.sender === "user" ? "bg-purple-600 ml-3" : "bg-gray-700 dark:bg-purple-900/50 mr-3"
                                            }`}
                                        >
                                            {message.sender === "user" ? (
                                                <User className="h-5 w-5 text-white" />
                                            ) : (
                                                <Bot className="h-5 w-5 text-white dark:text-purple-300" />
                                            )}
                                        </div>
                                        <div
                                            className={`rounded-2xl px-5 py-3 shadow-sm ${
                                                isSearchResult ? "ring-2 ring-purple-500 dark:ring-purple-400" : ""
                                            } ${
                                                message.sender === "user"
                                                    ? "bg-purple-600 text-white"
                                                    : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            }`}
                                        >
                                            <div className="whitespace-pre-wrap">
                                                {searchVisible ? highlightSearchText(message.text) : message.text}
                                            </div>

                                            {/* Render attachments if any */}
                                            {message.attachments && renderAttachments(message.attachments)}

                                            {/* Render interactive actions if available */}
                                            {message.actions && message.actions.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {message.actions.map((action) => (
                                                        <button
                                                            key={action.id}
                                                            onClick={() => handleActionClick(action.id, message.id)}
                                                            className="text-xs px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-gray-600 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-gray-500 transition-colors font-medium shadow-sm"
                                                        >
                                                            {action.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}

                                            <div
                                                className={`text-xs mt-1.5 flex items-center gap-1 ${
                                                    message.sender === "user"
                                                        ? "text-purple-200 dark:text-purple-300"
                                                        : "text-gray-500 dark:text-gray-400"
                                                }`}
                                            >
                                                <Clock className="w-3 h-3" />
                                                {new Date(message.timestamp).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                    {typingIndicator && (
                        <div className="flex justify-start">
                            <div className="flex flex-row">
                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-700 dark:bg-purple-900/50 mr-3">
                                    <Bot className="h-5 w-5 text-white dark:text-purple-300" />
                                </div>
                                <div className="bg-white dark:bg-gray-700 rounded-2xl px-5 py-4 text-gray-900 dark:text-white shadow-sm">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-gray-300 dark:bg-gray-500 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-300 dark:bg-gray-500 rounded-full animate-bounce delay-75"></div>
                                        <div className="w-2 h-2 bg-gray-300 dark:bg-gray-500 rounded-full animate-bounce delay-150"></div>
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
                        className="absolute bottom-28 right-6 bg-purple-600 dark:bg-purple-700 text-white rounded-full p-3 shadow-lg hover:bg-purple-700 dark:hover:bg-purple-800 transition-all hover:shadow-xl"
                    >
                        <ArrowDown className="h-5 w-5" />
                    </button>
                )}

                {/* Draft Attachments */}
                {draftAttachments.length > 0 && (
                    <div className="px-6 py-3 border-t border-purple-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex gap-3 overflow-x-auto">
                        {draftAttachments.map((attachment) => (
                            <div
                                key={attachment.id}
                                className="relative flex-shrink-0 bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 group shadow-sm"
                                style={{ maxWidth: "120px" }}
                            >
                                <button
                                    onClick={() => removeAttachment(attachment.id)}
                                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Remove attachment"
                                >
                                    <X className="h-3 w-3" />
                                </button>

                                {attachment.thumbnailUrl ? (
                                    <img
                                        src={attachment.thumbnailUrl || "/placeholder.svg"}
                                        alt={attachment.name}
                                        className="w-full h-16 object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-16 w-16 p-2">
                                        <div className="text-gray-500 dark:text-gray-400">{getFileIcon(attachment.type)}</div>
                                    </div>
                                )}
                                <div className="p-2">
                                    <div className="text-xs truncate font-medium max-w-[110px]">{attachment.name}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(attachment.size)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Help Modal */}
                {showHelpModal && <HelpModal onClose={() => setShowHelpModal(false)} />}

                {/* Input Area */}
                <div className="p-6 border-t border-purple-100 dark:border-gray-700 bg-white dark:bg-gray-800 relative z-10">
                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 rounded-xl p-3 border border-purple-100 dark:border-gray-600 shadow-sm">
                        {/* Unified options menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400"
                                title="Chat options"
                            >
                                <Menu className="h-5 w-5" />
                            </button>

                            {/* Hidden file input */}
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden" />

                            {/* Options dropdown menu */}
                            {showOptionsMenu && (
                                <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-purple-100 dark:border-gray-600 p-2 w-56 z-10">
                                    <button
                                        onClick={() => {
                                            fileInputRef.current?.click()
                                            setShowOptionsMenu(false)
                                        }}
                                        className="flex items-center gap-2 p-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg"
                                    >
                                        <Paperclip className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        <span className="text-sm text-gray-900 dark:text-white">Upload file or image</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowHelpModal(true)
                                            setShowOptionsMenu(false)
                                        }}
                                        className="flex items-center gap-2 p-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg"
                                    >
                                        <HelpCircle className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        <span className="text-sm text-gray-900 dark:text-white">Chat help</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type '/help' for assistance"
                            className="flex-1 bg-transparent border-none outline-none resize-none max-h-32 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                            rows={1}
                            style={{ height: "auto", minHeight: "24px" }}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={(!input.trim() && draftAttachments.length === 0) || isLoading}
                            className={`flex-shrink-0 rounded-lg p-2.5 ${
                                (input.trim() || draftAttachments.length > 0) && !isLoading
                                    ? "bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg transform hover:scale-105"
                                    : "bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                            } transition-all duration-200`}
                        >
                            <Send className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
