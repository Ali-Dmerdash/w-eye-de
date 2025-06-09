"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./redux"; // Assuming redux.tsx is in src/app
import { ThemeProvider } from "@/context/ThemeContext";
import { SidebarProvider } from "@/context/SidebarContext";
import { ChatProvider } from "@/context/ChatContext";
import { NotificationProvider } from "@/context/NotificationContext";
import ChatModal from "@/components/ui/ChatModal";
import GlobalHelpModal from "@/components/ui/GlobalHelpModal";

// This component wraps all client-side providers
export function ClientProviders({ children }: { children: React.ReactNode }) {
  // Initialize magic mouse
  useEffect(() => {
    try {
      // @ts-ignore
      if (window.magicMouse) {
        // @ts-ignore
        window.magicMouse({
          cursorOuter: "circle-basic",
          hoverEffect: "circle-move",
          hoverItemMove: false,
          defaultCursor: false,
          outerWidth: 30,
          outerHeight: 30
        });
        console.log("Magic Mouse initialized successfully");
      } else {
        console.warn("Magic Mouse not found in window object");
      }
    } catch (e) {
      console.error("Magic Mouse initialization error:", e);
    }
  }, []);

  return (
    <Provider store={store}>
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
    </Provider>
  );
}
