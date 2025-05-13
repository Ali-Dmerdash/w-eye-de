"use client"

import React, { createContext, useContext, useState, useEffect } from "react";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileOpen: boolean;
  setIsMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Script to be inserted in the document head to prevent sidebar state flashing
const SidebarScript = () => {
  const codeToRunOnClient = `
    (function() {
      try {
        const savedCollapsedState = localStorage.getItem('sidebarCollapsed');
        if (savedCollapsedState === 'true') {
          document.documentElement.setAttribute('data-sidebar-collapsed', 'true');
        } else {
          document.documentElement.setAttribute('data-sidebar-collapsed', 'false');
        }
      } catch (e) {}
    })();
  `;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: codeToRunOnClient }}
      suppressHydrationWarning
    />
  );
};

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with the correct sidebar state immediately
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // For SSR, default to not collapsed
    if (typeof window === 'undefined') return false;
    
    const savedCollapsedState = localStorage.getItem('sidebarCollapsed');
    return savedCollapsedState === 'true';
  });
  
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load sidebar state from localStorage on initial render
  useEffect(() => {
    const savedCollapsedState = localStorage.getItem('sidebarCollapsed');
    if (savedCollapsedState !== null) {
      setIsCollapsed(savedCollapsedState === 'true');
    }
    // Mark loading as complete after state is loaded
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, []);

  // Save sidebar state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', isCollapsed.toString());
    // Also update the data attribute on document for consistency
    document.documentElement.setAttribute('data-sidebar-collapsed', isCollapsed.toString());
  }, [isCollapsed]);

  return (
    <>
      <SidebarScript />
      <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen, isLoading }}>
        {isLoading ? <LoadingOverlay /> : children}
      </SidebarContext.Provider>
    </>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}; 