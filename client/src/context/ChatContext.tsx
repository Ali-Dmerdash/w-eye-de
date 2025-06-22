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
  const [draftAttachments, setDraftAttachments] = useState<FileAttachment[]>(
    []
  );
  const [showHelpModal, setShowHelpModal] = useState(false);

  // API endpoint
  const API_ENDPOINT = "http://localhost:3001/api/chat";

  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    const savedContext = localStorage.getItem("chatContext");
    const savedDraft = localStorage.getItem("chatDraft");
    const savedDraftAttachments = localStorage.getItem("chatDraftAttachments");

    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
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
      localStorage.setItem(
        "chatDraftAttachments",
        JSON.stringify(draftAttachments)
      );
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

      const lastUserMessage = [...messages]
        .reverse()
        .find((m) => m.sender === "user");
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
      setConversationContext((prev) => ({ ...prev, topic: "fraud" }));
    } else if (lowerInput.includes("revenue") || lowerInput.includes("sales")) {
      setConversationContext((prev) => ({ ...prev, topic: "revenue" }));
    } else if (lowerInput.includes("market")) {
      setConversationContext((prev) => ({ ...prev, topic: "market" }));
    }

    const entityRegex =
      /\b(dashboard|report|analysis|chart|metric|KPI|trend)\b/gi;
    const entities = userInput.match(entityRegex) || [];

    if (entities.length > 0) {
      setConversationContext((prev) => ({
        ...prev,
        lastMentionedEntities: [
          ...new Set([...(prev.lastMentionedEntities || []), ...entities]),
        ],
      }));
    }
  };

  // Modified generateAIResponse function to use API
  const generateAIResponse = async (userInput: string) => {
    setIsLoading(true);
    setTypingIndicator(true);

    try {
      updateContext(userInput);

      // Make API call to the chatbot endpoint
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: userInput,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Extract the response text from the API response
      let responseText = "";
      if (typeof data === "string") {
        responseText = data;
      } else if (data.response) {
        responseText = data.response;
      } else if (data.message) {
        responseText = data.message;
      } else if (data.text) {
        responseText = data.text;
      } else {
        responseText = JSON.stringify(data);
      }

      const newAssistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newAssistantMessage]);
      setTypingIndicator(false);
      setIsLoading(false);
    } catch (error) {
      console.error("Error generating AI response:", error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting to the chatbot service. Please try again in a moment.",
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
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    setMessages((prev) => [...prev, newUserMessage]);

    setDraftMessage("");
    setDraftAttachments([]);
    localStorage.removeItem("chatDraft");
    localStorage.removeItem("chatDraftAttachments");

    generateAIResponse(text);
  };

  const handleActionClick = (actionId: string, messageId: string) => {
    const message = messages.find((m) => m.id === messageId);
    if (!message || !message.actions) return;

    const action = message.actions.find((a) => a.id === actionId);
    if (!action) return;

    if (action.id === "export-csv") {
      const csvData = [
        "Category,Amount,Growth",
        "Digital Services,1200000,15.2",
        "Hardware Products,845000,3.7",
        "Professional Services,567000,12.1",
        "Subscription Plans,1500000,8.9",
      ].join("\n");

      const blob = new Blob([csvData], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `revenue-data-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      const newMessage: Message = {
        id: Date.now().toString(),
        text: "Revenue data has been exported as CSV.",
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
      return;
    } else if (action.id === "export-revenue") {
      const csvData = [
        "Category,Amount,Growth",
        "Digital Services,1200000,15.2",
        "Hardware Products,845000,3.7",
        "Professional Services,567000,12.1",
        "Subscription Plans,1500000,8.9",
      ].join("\n");

      const blob = new Blob([csvData], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `revenue-data-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      const newMessage: Message = {
        id: Date.now().toString(),
        text: "I've exported your revenue data as a CSV file. It includes category breakdowns with growth percentages.",
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
      return;
    } else if (action.id === "export-fraud") {
      const csvData = [
        "Case ID,Date,Transaction Amount,Risk Score,Location",
        "F-1001,2023-06-01,127.45,0.89,Eastern Europe",
        "F-1002,2023-06-01,98.23,0.92,Eastern Europe",
        "F-1003,2023-06-02,75.10,0.85,Southeast Asia",
        "F-1004,2023-06-02,250.00,0.78,Eastern Europe",
        "F-1005,2023-06-03,310.50,0.94,South America",
      ].join("\n");

      const blob = new Blob([csvData], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fraud-reports-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      const newMessage: Message = {
        id: Date.now().toString(),
        text: "I've exported the fraud reports as a CSV file containing case IDs, dates, amounts, risk scores, and locations.",
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
      return;
    }

    if (action.type === "button") {
      sendMessage(action.value);
    } else if (action.type === "link") {
      window.open(action.value, "_blank");
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
        setShowHelpModal,
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
