"use client";

import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { DEFAULT_HOME_ROUTE, DEFAULT_ONBOARDING_ROUTE } from "@/lib/routes";

export interface AuthFlowState {
  isLoading: boolean;
  isFirstLogin: boolean | null;
  needsOnboarding: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

export function useAuthFlow() {
  const { user, isLoaded: userLoaded } = useUser();
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const router = useRouter();
  const [state, setState] = useState<AuthFlowState>({
    isLoading: true,
    isFirstLogin: null,
    needsOnboarding: false,
    isAuthenticated: false,
    isInitialized: false,
  });

  const initializeUser = useCallback(async () => {
    if (!user) return false;

    try {
      const unsafeMetadata = user.unsafeMetadata || {};
      let firstLogin = unsafeMetadata.firstLogin;

      console.log("useAuthFlow - initializeUser:", { 
        userId: user.id, 
        firstLogin, 
        unsafeMetadata 
      });

      // If firstLogin is undefined, this is a new user - initialize it
      if (firstLogin === undefined) {
        console.log("Initializing user metadata for new user...");
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
          // If initialization fails, assume it's a returning user to avoid loops
          firstLogin = false;
        }
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        isFirstLogin: firstLogin === true,
        needsOnboarding: firstLogin === true,
        isAuthenticated: true,
        isInitialized: true,
      }));

      return true;
    } catch (error) {
      console.error("Error in initializeUser:", error);
      // On error, set safe defaults to avoid loops
      setState(prev => ({
        ...prev,
        isLoading: false,
        isFirstLogin: false,
        needsOnboarding: false,
        isAuthenticated: true,
        isInitialized: true,
      }));
      return false;
    }
  }, [user]);

  useEffect(() => {
    // Wait for both auth and user to be loaded
    if (!authLoaded || !userLoaded) {
      setState(prev => ({ ...prev, isLoading: true, isInitialized: false }));
      return;
    }

    // User is not signed in
    if (!isSignedIn || !user) {
      setState({
        isLoading: false,
        isFirstLogin: null,
        needsOnboarding: false,
        isAuthenticated: false,
        isInitialized: true,
      });
      return;
    }

    // User is authenticated, initialize if needed
    initializeUser();
  }, [authLoaded, userLoaded, isSignedIn, user, initializeUser]);

     const completeOnboarding = useCallback(async () => {
     if (!user) {
       console.error("No user found when completing onboarding");
       return false;
     }

     try {
       console.log("Completing onboarding for user:", user.id);
       
       // Update metadata first
       await user.update({
         unsafeMetadata: {
           ...user.unsafeMetadata,
           firstLogin: false,
           onboardingCompleted: true,
           onboardingCompletedAt: new Date().toISOString(),
         },
       });

       console.log("Metadata updated for onboarding completion");

       // Immediately update local state to prevent loading stuck
       setState(prev => ({
         ...prev,
         isLoading: false,
         isFirstLogin: false,
         needsOnboarding: false,
         isAuthenticated: true,
         isInitialized: true,
       }));

       console.log("Onboarding completed successfully - state updated");
       return true;
     } catch (error) {
       console.error("Error completing onboarding:", error);
       return false;
     }
   }, [user]);

  const redirectToHome = useCallback(() => {
    console.log("Redirecting to home page");
    router.push(DEFAULT_HOME_ROUTE);
  }, [router]);

  const redirectToOnboarding = useCallback(() => {
    console.log("Redirecting to onboarding page");
    router.push(DEFAULT_ONBOARDING_ROUTE);
  }, [router]);

     const forceCompleteOnboarding = useCallback(async () => {
     if (!user) return false;
     
     try {
       console.log("Force completing onboarding...");
       
       // First update the metadata
       await user.update({
         unsafeMetadata: {
           ...user.unsafeMetadata,
           firstLogin: false,
           onboardingCompleted: true,
           onboardingCompletedAt: new Date().toISOString(),
           forceCompleted: true,
         },
       });
       
       console.log("Metadata updated successfully");
       
       // Then update the local state immediately
       setState(prev => ({
         ...prev,
         isLoading: false,
         isFirstLogin: false,
         needsOnboarding: false,
         isAuthenticated: true,
         isInitialized: true,
       }));
       
       console.log("State updated, redirecting...");
       
       // Small delay to ensure state is updated before redirect
       setTimeout(() => {
         window.location.href = DEFAULT_HOME_ROUTE;
       }, 100);
       
       return true;
     } catch (error) {
       console.error("Error force completing onboarding:", error);
       // Even on error, try to redirect to prevent being stuck
       setTimeout(() => {
         window.location.href = DEFAULT_HOME_ROUTE;
       }, 100);
       return false;
     }
   }, [user]);

  return {
    ...state,
    completeOnboarding,
    redirectToHome,
    redirectToOnboarding,
    forceCompleteOnboarding,
  };
}

