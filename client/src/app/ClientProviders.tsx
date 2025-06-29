"use client"

import type React from "react"
import { Provider } from "react-redux"
import { store } from "./redux" // Assuming redux.tsx is in src/app
import { ThemeProvider } from "@/context/ThemeContext"
import { SidebarProvider } from "@/context/SidebarContext"
import { ChatProvider } from "@/context/ChatContext"
import { NotificationProvider } from "@/context/NotificationContext"
import { OnboardingProvider } from "@/context/OnboardingContext"
import ChatModal from "@/components/ui/ChatModal"
import GlobalHelpModal from "@/components/ui/GlobalHelpModal"
import NotificationModal from "@/components/ui/NotificationModal"
import { Toaster } from 'react-hot-toast';

// This component wraps all client-side providers
export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <SidebarProvider>
          <ChatProvider>
            <NotificationProvider>
              <OnboardingProvider>
                {/* Place children (main content) inside all providers */}
                {children}
                {/* Modals can also be here if they need provider context */}
                <ChatModal />
                <GlobalHelpModal />
                <Toaster />
              </OnboardingProvider>
            </NotificationProvider>
          </ChatProvider>
        </SidebarProvider>
      </ThemeProvider>
    </Provider>
  )
}

export { NotificationModal }
