"use client"

import React, { useEffect, useState } from 'react';

export default function LoadingOverlay() {
  // Initialize with system preference or stored theme to prevent flash
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      // Fall back to system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false; // Default for SSR
  });

  useEffect(() => {
    // This ensures we're using the correct theme after hydration
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 ${isDarkMode ? 'bg-[#15191c]' : 'bg-[#FAFAFA]'}`}>
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4B65AB] mb-4"></div>
        <div className={`${isDarkMode ? 'text-white' : 'text-[#4B65AB]'} font-mulish`}>Loading...</div>
      </div>
    </div>
  );
} 