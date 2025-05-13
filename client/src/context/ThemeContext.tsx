"use client"
import React, { createContext, useContext, useState, ReactNode } from "react";

export type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Script to be inserted in the document head to prevent theme flashing
const ThemeScript = () => {
  const codeToRunOnClient = `
    (function() {
      try {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else if (savedTheme === 'light') {
          document.documentElement.classList.remove('dark');
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add('dark');
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

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
<<<<<<< HEAD
  // Initialize with the correct theme immediately
  const [theme, setThemeState] = useState<Theme>(() => {
    // For SSR, default to light
    if (typeof window === 'undefined') return 'light';
    
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) return savedTheme;
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  
  const [isLoading, setIsLoading] = useState(true);

  // Load theme from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setThemeState(savedTheme);
    } else {
      // Check for system preference if no saved theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeState(prefersDark ? 'dark' : 'light');
    }
    
    // Add a small delay to ensure smooth transition
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, []);

  // Apply theme class to document and save to localStorage whenever it changes
  useEffect(() => {
=======
  const [theme, setThemeState] = useState<Theme>("light");

  React.useEffect(() => {
>>>>>>> parent of f2df84d (fixed bugs)
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
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
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}; 