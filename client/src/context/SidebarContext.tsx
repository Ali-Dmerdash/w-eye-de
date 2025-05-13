"use client"

import React, { createContext, useContext, useState, useEffect } from "react";

interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileOpen: boolean;
  setIsMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with the value from localStorage if available
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    // Default to false for SSR
    if (typeof window === 'undefined') return false;
    
    try {
      const savedState = localStorage.getItem('sidebar-collapsed');
      return savedState === 'true';
    } catch (e) {
      return false;
    }
  });
  
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load sidebar state from localStorage on initial render
  useEffect(() => {
    const loadSidebarState = () => {
      try {
        const savedState = localStorage.getItem('sidebar-collapsed');
        if (savedState !== null) {
          setIsCollapsed(savedState === 'true');
          // Update document attribute to maintain consistency
          document.documentElement.setAttribute("data-sidebar-collapsed", savedState);
        }
      } catch (e) {
        console.error("Error loading sidebar state:", e);
      }
      
      // Finish loading after a brief delay
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    };

    loadSidebarState();
  }, []);

  // Save sidebar state to localStorage whenever it changes
  useEffect(() => {
    if (isLoading) return; // Don't save during initial loading
    
    try {
      localStorage.setItem('sidebar-collapsed', String(isCollapsed));
      document.documentElement.setAttribute("data-sidebar-collapsed", String(isCollapsed));
    } catch (e) {
      console.error("Error saving sidebar state:", e);
    }
  }, [isCollapsed, isLoading]);

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen, isLoading }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}; 