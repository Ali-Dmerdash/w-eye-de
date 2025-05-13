"use client"
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isLoading?: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Loading overlay component
const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-white dark:bg-[#15191c] z-50 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Initialize with the correct theme immediately
  const [theme, setThemeState] = useState<Theme>(() => {
    // For SSR, default to light
    if (typeof window === 'undefined') return 'light';
    
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) return savedTheme;
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  
  const [isLoading, setIsLoading] = useState(true);

  // Apply theme class to document and save to localStorage whenever it changes
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.style.backgroundColor = '#15191c';
      document.body.style.backgroundColor = '#15191c';
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.backgroundColor = '#FAFAFA';
      document.body.style.backgroundColor = '#FAFAFA';
    }
    
    // Save theme to localStorage
    localStorage.setItem('theme', theme);
    
    // Finish loading after a brief delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setTheme = (theme: Theme) => {
    setThemeState(theme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isLoading }}>
      {isLoading ? <LoadingOverlay /> : children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}; 