import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { 
  isPublicRoute, 
  isOnboardingRoute, 
  DEFAULT_HOME_ROUTE, 
  DEFAULT_ONBOARDING_ROUTE, 
  DEFAULT_SIGNIN_ROUTE 
} from "@/lib/routes";

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const pathname = req.nextUrl.pathname;
  
  // Allow access to public routes (includes Clerk auth, API, and static files)
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Redirect to sign-in if not authenticated
  if (!userId) {
    return NextResponse.redirect(new URL(DEFAULT_SIGNIN_ROUTE, req.url));
  }

  // For authenticated users, optimize common redirects at server level
  const unsafeMetadata = sessionClaims?.unsafeMetadata as Record<string, any> || {};
  const firstLogin = unsafeMetadata.firstLogin;
  
  // Fast server-side redirect for completed users trying to access onboarding
  if (firstLogin === false && isOnboardingRoute(pathname)) {
    console.log('Middleware: Fast redirect to home (firstLogin=false)');
    return NextResponse.redirect(new URL(DEFAULT_HOME_ROUTE, req.url));
  }
  
  // Fast server-side redirect for root path when onboarding is complete
  if (firstLogin === false && pathname === "/") {
    console.log('Middleware: Fast redirect root to home (firstLogin=false)');
    return NextResponse.redirect(new URL(DEFAULT_HOME_ROUTE, req.url));
  }
  

  // Allow all other authenticated requests to proceed
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
