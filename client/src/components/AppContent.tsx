"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { useSidebar } from "@/context/SidebarContext";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

export default function AppContent({ children }: { children: React.ReactNode }) {
  const { isLoading: isSidebarLoading } = useSidebar();
  const { isLoading: isThemeLoading } = useTheme();
  
  const isLoading = isSidebarLoading || isThemeLoading;
  
  return (
    <>
      {isLoading && <LoadingOverlay />}
      <main>{children}</main>
    </>
  );
} 