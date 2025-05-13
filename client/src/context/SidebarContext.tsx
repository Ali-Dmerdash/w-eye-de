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
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    
    const savedCollapsedState = localStorage.getItem('sidebarCollapsed');
    return savedCollapsedState === 'true';
  });
  
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedCollapsedState = localStorage.getItem('sidebarCollapsed');
    if (savedCollapsedState !== null) {
      setIsCollapsed(savedCollapsedState === 'true');
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', isCollapsed.toString());
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