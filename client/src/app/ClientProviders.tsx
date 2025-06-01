"use client";

import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from "./redux"; // Assuming redux.tsx is in src/app
import { ThemeProvider } from "@/context/ThemeContext";
import { SidebarProvider } from "@/context/SidebarContext";
import { ChatProvider } from "@/context/ChatContext";
import { NotificationProvider } from "@/context/NotificationContext";
import ChatModal from "@/components/ui/ChatModal";
import GlobalHelpModal from "@/components/ui/GlobalHelpModal";

// This component wraps all client-side providers
export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <SidebarProvider>
            <ChatProvider>
              <NotificationProvider>
                {/* Place children (main content) inside all providers */}
                {children}
                {/* Modals can also be here if they need provider context */}
                <ChatModal />
                <GlobalHelpModal />
              </NotificationProvider>
            </ChatProvider>
          </SidebarProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
