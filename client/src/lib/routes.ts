/**
 * Centralized route configuration for the application
 */

// Public routes that don't require authentication
export const PUBLIC_ROUTES = [
  "/sign-in",
  "/sign-up",
  "/api/webhooks",
] as const;

// Routes that should be accessible during onboarding
export const ONBOARDING_ROUTES = [
  "/onboarding",
] as const;

// Main app routes that require authentication
export const PROTECTED_ROUTES = [
  "/",
  "/home-page",
  "/dashboard", 
  "/fraud-page",
  "/revenue-page",
  "/market-page",
  "/statistics",
  "/sphere",
  "/notifications", 
  "/adminPanel_Notifications",
  "/upload",
  "/continue",
] as const;

// Default redirect routes
export const DEFAULT_HOME_ROUTE = "/home-page";
export const DEFAULT_ONBOARDING_ROUTE = "/onboarding";
export const DEFAULT_SIGNIN_ROUTE = "/sign-in";

// Route groups for easier matching
export const ALL_PUBLIC_ROUTES = [...PUBLIC_ROUTES] as const;
export const ALL_PROTECTED_ROUTES = [...PROTECTED_ROUTES, ...ONBOARDING_ROUTES] as const;

// Helper functions
export function isPublicRoute(pathname: string): boolean {
  // Allow Clerk auth routes and their callbacks
  if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
    return true;
  }
  
  // Allow API routes
  if (pathname.startsWith("/api/")) {
    return true;
  }
  
  // Allow static files and Next.js internals
  if (pathname.startsWith("/_next/") || pathname.includes(".")) {
    return true;
  }
  
  return PUBLIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function isOnboardingRoute(pathname: string): boolean {
  return ONBOARDING_ROUTES.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => 
    pathname === route || 
    pathname.startsWith(`${route}/`) ||
    // Handle catch-all routes like [[...home-page]]
    (route === "/home-page" && pathname.startsWith("/home-page")) ||
    (route === "/fraud-page" && pathname.startsWith("/fraud-page")) ||
    (route === "/revenue-page" && pathname.startsWith("/revenue-page")) ||
    (route === "/continue" && pathname.startsWith("/continue"))
  );
}

export function needsAuthentication(pathname: string): boolean {
  return !isPublicRoute(pathname);
} 