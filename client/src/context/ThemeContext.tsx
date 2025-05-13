"use client"
import React, { createContext, useContext, useState, ReactNode } from "react";

export type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  // Initialize with the correct theme immediately
  const [theme, setThemeState] = useState<Theme>(() => {
    // For SSR, default to light
    if (typeof window === 'undefined') return 'light';
    
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) return savedTheme;
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  
=======
  const [theme, setThemeState] = useState<Theme>("light");
>>>>>>> parent of d6074d6 (Updated sidebar and theme storing while navigating)
=======
  const [theme, setThemeState] = useState<Theme>("light");
>>>>>>> parent of d6074d6 (Updated sidebar and theme storing while navigating)
  const [isLoading, setIsLoading] = useState(true);

  // Load theme from localStorage on initial render
  useEffect(() => {
    // Get theme from localStorage
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setThemeState(savedTheme);
    } else {
      // Check for system preference if no saved theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : 'light';
      setThemeState(initialTheme);
      localStorage.setItem('theme', initialTheme);
    }
    
    // Finish loading after a brief delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Apply theme class to document and save to localStorage whenever it changes
  useEffect(() => {
=======
  const [theme, setThemeState] = useState<Theme>("light");

  React.useEffect(() => {
>>>>>>> parent of f2df84d (fixed bugs)
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.style.backgroundColor = '#15191c';
      document.body.style.backgroundColor = '#15191c';
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.backgroundColor = '#FAFAFA';
      document.body.style.backgroundColor = '#FAFAFA';
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setTheme = (theme: Theme) => {
    setThemeState(theme);
  };

  return (
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    <>
      <ThemeScript />
      <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isLoading }}>
        {isLoading ? <LoadingOverlay /> : children}
      </ThemeContext.Provider>
    </>
=======
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
>>>>>>> parent of f2df84d (fixed bugs)
=======
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isLoading }}>
      {isLoading ? <LoadingOverlay /> : children}
    </ThemeContext.Provider>
>>>>>>> parent of d6074d6 (Updated sidebar and theme storing while navigating)
=======
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isLoading }}>
      {isLoading ? <LoadingOverlay /> : children}
    </ThemeContext.Provider>
>>>>>>> parent of d6074d6 (Updated sidebar and theme storing while navigating)
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}; 