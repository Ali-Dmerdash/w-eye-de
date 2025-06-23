import { 
  isPublicRoute, 
  isOnboardingRoute, 
  isProtectedRoute,
  needsAuthentication,
  DEFAULT_HOME_ROUTE,
  DEFAULT_ONBOARDING_ROUTE,
  DEFAULT_SIGNIN_ROUTE
} from "./routes";

/**
 * Utility functions to validate and debug route configurations
 */

export function validateRoute(pathname: string) {
  return {
    pathname,
    isPublic: isPublicRoute(pathname),
    isOnboarding: isOnboardingRoute(pathname),
    isProtected: isProtectedRoute(pathname),
    needsAuth: needsAuthentication(pathname),
  };
}

export function debugRoutes() {
  const testRoutes = [
    "/",
    "/home-page",
    "/home-page/dashboard",
    "/sign-in",
    "/sign-in/callback",
    "/onboarding",
    "/dashboard",
    "/fraud-page",
    "/fraud-page/analytics", 
    "/revenue-page",
    "/revenue-page/reports",
    "/market-page",
    "/statistics",
    "/sphere",
    "/notifications",
    "/adminPanel_Notifications",
    "/upload",
    "/continue",
    "/continue/setup",
  ];

  console.group("🔍 Route Validation Debug");
  testRoutes.forEach(route => {
    const validation = validateRoute(route);
    console.log(`${route}:`, validation);
  });
  console.groupEnd();

  console.group("🎯 Default Routes");
  console.log("Home:", DEFAULT_HOME_ROUTE);
  console.log("Onboarding:", DEFAULT_ONBOARDING_ROUTE);
  console.log("Sign In:", DEFAULT_SIGNIN_ROUTE);
  console.groupEnd();
}

export function getRedirectForRoute(
  pathname: string, 
  isAuthenticated: boolean, 
  needsOnboarding: boolean
): string | null {
  // Public routes - no redirect needed
  if (isPublicRoute(pathname)) {
    return null;
  }

  // Not authenticated - redirect to sign in
  if (!isAuthenticated) {
    return DEFAULT_SIGNIN_ROUTE;
  }

  // Needs onboarding but not on onboarding route
  if (needsOnboarding && !isOnboardingRoute(pathname)) {
    return DEFAULT_ONBOARDING_ROUTE;
  }

  // Doesn't need onboarding but on onboarding route
  if (!needsOnboarding && isOnboardingRoute(pathname)) {
    return DEFAULT_HOME_ROUTE;
  }

  // Root path should redirect to home
  if (pathname === "/") {
    return DEFAULT_HOME_ROUTE;
  }

  // No redirect needed
  return null;
} 