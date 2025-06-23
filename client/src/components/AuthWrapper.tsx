"use client";

import React, { useEffect, useState } from "react";
import { useAuthFlow } from "@/hooks/useAuthFlow";
import LoadingOverlay from "./ui/LoadingOverlay";
import { isOnboardingRoute } from "@/lib/routes";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { isLoading, isAuthenticated, needsOnboarding, isInitialized, redirectToHome, redirectToOnboarding } = useAuthFlow();
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Failsafe: If loading for more than 10 seconds, show content anyway
  useEffect(() => {
    if (isLoading || !isInitialized) {
      const timeout = setTimeout(() => {
        console.warn("AuthWrapper: Loading timeout reached, showing content");
        setLoadingTimeout(true);
      }, 10000);

      return () => clearTimeout(timeout);
    } else {
      setLoadingTimeout(false);
    }
  }, [isLoading, isInitialized]);

  useEffect(() => {
    // Only proceed if fully initialized and authenticated
    if (!isInitialized || !isAuthenticated || isLoading) {
      return;
    }

    // Add a small delay to prevent race conditions with Clerk
    const timer = setTimeout(() => {
      const currentPath = window.location.pathname;

      // Skip redirects for sign-in/sign-out related paths
      if (currentPath.includes('/sign-in') || currentPath.includes('/sign-out')) {
        return;
      }

      // Only redirect if we're very sure about the state
      if (needsOnboarding === true && !isOnboardingRoute(currentPath)) {
        redirectToOnboarding();
        return;
      }

      // Only redirect from onboarding if we're very sure onboarding is complete
      if (needsOnboarding === false && isOnboardingRoute(currentPath)) {
        // Use direct redirect to avoid state issues
        window.location.href = "/home-page";
        return;
      }

      // If user is on root path, redirect to home-page
      if (currentPath === "/" && needsOnboarding === false) {
        window.location.href = "/home-page";
        return;
      }
    }, 200); // Slightly longer delay

    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated, needsOnboarding, isInitialized, redirectToHome, redirectToOnboarding]);

  // Show loading while auth state is being determined or not initialized
  // But not if we've reached the timeout failsafe
  if ((isLoading || !isInitialized) && !loadingTimeout) {
    return <LoadingOverlay message={isLoading ? "Loading..." : "Initializing..."} />;
  }

  // If loading timeout reached, show warning message
  if (loadingTimeout) {
    console.warn("AuthWrapper: Proceeding despite loading state due to timeout");
  }

  // Render children for authenticated users
  return <>{children}</>;
} 