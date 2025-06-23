"use client";

import React, { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import LoadingOverlay from "./ui/LoadingOverlay";
import { isOnboardingRoute, isPublicRoute, DEFAULT_HOME_ROUTE, DEFAULT_ONBOARDING_ROUTE, DEFAULT_SIGNIN_ROUTE } from "@/lib/routes";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoaded: userLoaded } = useUser();
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [previousSignedInState, setPreviousSignedInState] = useState<boolean | null>(null);

  useEffect(() => {
    console.log("ProtectedRoute effect:", {
      authLoaded,
      userLoaded,
      isSignedIn,
      userId: user?.id?.slice(0, 8),
      pathname,
      isInitialized,
      isRedirecting
    });

    // Don't do anything until both auth and user are loaded
    if (!authLoaded || !userLoaded) {
      console.log("Waiting for auth/user to load...");
      return;
    }

    // Track sign-out events to prevent unnecessary redirects
    if (previousSignedInState === true && isSignedIn === false) {
      console.log("User signed out, resetting state");
      setIsInitialized(false);
      setIsRedirecting(false);
      setPreviousSignedInState(false);
      return;
    }

    // Update previous state
    setPreviousSignedInState(isSignedIn);

    // Since ProtectedRoute is now only used within SignedIn, user should always be signed in
    // But we still check as a safety measure
    if (!isSignedIn) {
      console.warn("ProtectedRoute: User not signed in - this shouldn't happen within SignedIn wrapper");
      setIsInitialized(true);
      return;
    }

    // If user is signed in AND we have a user object, handle the firstLogin flow
    if (isSignedIn && user) {
      handleAuthenticatedUser();
    } else if (isSignedIn && !user) {
      // Signed in but no user object yet - wait for it to load
      console.log("Waiting for user object to load...");
      return;
    } else {
      setIsInitialized(true);
    }
  }, [authLoaded, userLoaded, isSignedIn, user, pathname, previousSignedInState]);

  const handleAuthenticatedUser = async () => {
    if (!user) return;

    try {
      const unsafeMetadata = user.unsafeMetadata || {};
      let firstLogin = unsafeMetadata.firstLogin;

      console.log("ProtectedRoute Debug:", {
        pathname,
        userId: user.id,
        firstLogin,
        unsafeMetadata
      });

      // EARLY REDIRECT: If we already know firstLogin status, redirect immediately
      if (firstLogin === false) {
        // User has completed onboarding - redirect immediately without processing
        if (isOnboardingRoute(pathname)) {
          console.log("Early redirect: home (firstLogin=false)");
          window.location.href = DEFAULT_HOME_ROUTE;
          return;
        }
        
        // Redirect root path to home immediately
        if (pathname === "/") {
          console.log("Early redirect: root to home");
          window.location.href = DEFAULT_HOME_ROUTE;
          return;
        }
      }

      // Initialize firstLogin if undefined (new user)
      if (firstLogin === undefined) {
        console.log("Initializing new user metadata...");
        try {
          await user.update({
            unsafeMetadata: {
              ...unsafeMetadata,
              firstLogin: true,
              signUpDate: new Date().toISOString(),
            },
          });
          firstLogin = true;
          console.log("User metadata initialized successfully");
        } catch (error) {
          console.error("Error initializing user metadata:", error);
          // If initialization fails, assume returning user to avoid loops
          firstLogin = false;
        }
      }

      // Handle routing based on firstLogin status
      if (firstLogin === true) {
        // User needs onboarding
        if (!isOnboardingRoute(pathname)) {
          console.log("Redirecting to onboarding (firstLogin=true)");
          setIsRedirecting(true);
          window.location.href = DEFAULT_ONBOARDING_ROUTE;
          return;
        }
      } else {
        // User has completed onboarding (fallback check)
        if (isOnboardingRoute(pathname)) {
          console.log("Fallback redirect to home (firstLogin=false)");
          setIsRedirecting(true);
          window.location.href = DEFAULT_HOME_ROUTE;
          return;
        }
        
        // Redirect root path to home (fallback check)
        if (pathname === "/") {
          console.log("Fallback redirect root to home");
          setIsRedirecting(true);
          window.location.href = DEFAULT_HOME_ROUTE;
          return;
        }
      }

      setIsInitialized(true);
    } catch (error) {
      console.error("Error in handleAuthenticatedUser:", error);
      // On error, set safe defaults to avoid loops
      setIsInitialized(true);
    }
  };

  // Show loading while determining auth state or during redirects
  if (!authLoaded || !userLoaded || !isInitialized || isRedirecting) {
    return <LoadingOverlay message="Loading..." />;
  }

  // Since we're within SignedIn wrapper, user should be signed in
  // Render children for authenticated users
    return <>{children}</>;
}

