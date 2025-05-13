"use client"

import React, { useEffect, useState } from 'react';

export default function LoadingOverlay() {
  // Initialize with the current theme from localStorage or document class
  const [currentTheme, setCurrentTheme] = useState<string>('light');
  
  useEffect(() => {
    // Check if document has dark class or localStorage has theme
    const isDark = 
      document.documentElement.classList.contains('dark') || 
      localStorage.getItem('theme') === 'dark';
    
    setCurrentTheme(isDark ? 'dark' : 'light');
  }, []);
  
  // Use inline styles to ensure theme consistency during transitions
  const styles = {
    overlay: {
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: currentTheme === 'dark' ? '#15191c' : '#FAFAFA',
      zIndex: 50,
    },
    spinner: {
      height: '3rem',
      width: '3rem',
      borderRadius: '9999px',
      borderTop: '2px solid #4B65AB',
      borderBottom: '2px solid #4B65AB',
      animation: 'spin 1s linear infinite',
      marginBottom: '1rem',
    },
    text: {
      color: currentTheme === 'dark' ? '#ffffff' : '#4B65AB',
      fontFamily: 'var(--font-mulish), sans-serif',
    }
  };
  
  return (
    <div style={styles.overlay as React.CSSProperties}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={styles.spinner as React.CSSProperties} className="animate-spin" />
        <div style={styles.text}>Loading...</div>
      </div>
    </div>
  );
} 