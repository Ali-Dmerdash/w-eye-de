"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "./redux"; // Assuming redux.tsx is in src/app
import { ThemeProvider } from "@/context/ThemeContext";
import { SidebarProvider } from "@/context/SidebarContext";
import { ChatProvider } from "@/context/ChatContext";
import ChatModal from "@/components/ui/ChatModal";
import GlobalHelpModal from "@/components/ui/GlobalHelpModal";

// This component wraps all client-side providers
export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <SidebarProvider>
          <ChatProvider>
            {/* Place children (main content) inside all providers */}
            {children}
            {/* Modals can also be here if they need provider context */}
            <ChatModal />
            <GlobalHelpModal />
          </ChatProvider>
        </SidebarProvider>
      </ThemeProvider>
    </Provider>
  );
}
