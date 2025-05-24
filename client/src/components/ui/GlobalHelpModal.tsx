"use client";

import { useChat } from "@/context/ChatContext";
import { HelpModal } from "./ChatModal";

export default function GlobalHelpModal() {
    const { showHelpModal, setShowHelpModal } = useChat();
    
    if (!showHelpModal) return null;
    
    return (
        <HelpModal onClose={() => setShowHelpModal(false)} />
    );
} 