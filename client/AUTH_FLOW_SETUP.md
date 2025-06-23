# Post-Login Authentication Flow with Clerk

This implementation provides a comprehensive post-login authentication flow using Clerk in a Next.js + React (App Router) project.

## Features

- ✅ Automatic redirect to onboarding for first-time users
- ✅ Route protection to prevent access to other routes during onboarding
- ✅ Metadata management for tracking onboarding status
- ✅ Clean separation of concerns with custom hooks and components
- ✅ Graceful handling of async operations and race conditions
- ✅ Webhook integration for automatic user initialization

## Implementation Overview

### 1. Middleware (`client/src/middleware.ts`)
- **Purpose**: Server-side route protection with centralized route management
- **Features**:
  - Checks `firstLogin` status from Clerk's `unsafeMetadata`
  - Uses centralized route configuration for consistent handling
  - Redirects to `/onboarding` if `firstLogin` is `true`
  - Prevents access to other routes during onboarding
  - Redirects authenticated users from `/` to `/home-page`
  - Handles all catch-all routes correctly (e.g., `[[...home-page]]`)

### 2. Custom Hook (`client/src/hooks/useAuthFlow.ts`)
- **Purpose**: Central authentication state management
- **Features**:
  - Tracks authentication and onboarding status
  - Provides `completeOnboarding()` function
  - Handles metadata updates
  - Returns loading states and redirect functions

### 3. Auth Wrapper (`client/src/components/AuthWrapper.tsx`)
- **Purpose**: Client-side authentication wrapper
- **Features**:
  - Handles post-login redirects
  - Shows loading state during auth resolution
  - Prevents flash of unauthorized content

### 4. Updated Onboarding Page (`client/src/app/onboarding/page.tsx`)
- **Purpose**: Onboarding flow with proper metadata management
- **Features**:
  - Uses `useAuthFlow` hook for state management
  - Updates `firstLogin` to `false` on completion
  - Automatic redirect to home after completion

### 5. Automatic User Initialization
- **Purpose**: Automatic user initialization on first app access
- **Features**:
  - Detects users without `firstLogin` metadata
  - Sets `firstLogin: true` for new users automatically
  - Handles manual account creation from Clerk dashboard

### 6. Centralized Route Configuration (`client/src/lib/routes.ts`)
- **Purpose**: Single source of truth for all app routes
- **Features**:
  - Defines public, protected, and onboarding routes
  - Provides helper functions for route validation
  - Handles catch-all route patterns
  - Configurable default redirect routes

### 7. Route Validation Utilities (`client/src/lib/routeValidation.ts`)
- **Purpose**: Debug and validate route configurations
- **Features**:
  - Route validation functions
  - Debug utilities for testing
  - Centralized redirect logic

## Setup Instructions

### 1. Install Required Dependencies

Make sure you have the following dependencies installed:

```bash
npm install @clerk/nextjs
```

### 2. Usage Example

The authentication flow is now automatic. Here's how it works:

```typescript
// For new users (firstLogin: true)
// Sign In → Middleware Check → Redirect to /onboarding → Complete Onboarding → Redirect to /home-page

// For returning users (firstLogin: false)  
// Sign In → Middleware Check → Access granted to protected routes
// Root path (/) → Automatic redirect to /home-page

// Supported Routes:
// Public: /sign-in, /sign-up
// Protected: /home-page, /dashboard, /fraud-page, /revenue-page, /market-page, 
//           /statistics, /sphere, /notifications, /adminPanel_Notifications, 
//           /upload, /continue
// Onboarding: /onboarding
```

## API Reference

### useAuthFlow Hook

```typescript
const {
  isLoading,           // boolean: Auth state loading
  isFirstLogin,        // boolean | null: First login status
  needsOnboarding,     // boolean: Whether user needs onboarding
  isAuthenticated,     // boolean: Authentication status
  completeOnboarding,  // () => Promise<boolean>: Complete onboarding
  redirectToHome,      // () => void: Redirect to home
  redirectToOnboarding // () => void: Redirect to onboarding
} = useAuthFlow();
```

### useSignOut Hook

```typescript
const { signOut } = useSignOut();

// Usage in component
const handleLogout = () => {
  signOut(); // Handles sign out and redirect to sign-in page
};
```

### Metadata Structure

```typescript
interface UserMetadata {
  firstLogin?: boolean;           // true for new users, false after onboarding
  onboardingCompleted?: boolean;  // true when onboarding is finished
  onboardingCompletedAt?: string; // ISO timestamp of completion
  signUpDate?: string;           // ISO timestamp of user creation
  filesUploaded?: boolean;       // Specific to your app
  uploadedFileNames?: string[];  // Specific to your app
}
```

## Security Considerations

1. **Server-side Protection**: Middleware runs on the server, preventing client-side bypassing
2. **Race Condition Prevention**: Loading states prevent premature redirects
3. **Metadata Validation**: Webhook ensures proper initialization for all new users
4. **Graceful Error Handling**: Failed operations don't break the user experience

## Troubleshooting

### Issue: Users not redirected to onboarding
- **Solution**: Check that user metadata initialization is working and `firstLogin` is set to `true`

### Issue: Infinite redirect loops
- **Solution**: Verify middleware logic and ensure `firstLogin` is updated correctly

### Issue: Users stuck on loading screen
- **Solution**: Check Clerk configuration and ensure user data is properly loaded

### Issue: Sign-in/Sign-out not working
- **Solution**: Ensure middleware isn't blocking Clerk auth routes and AuthWrapper has delays to prevent race conditions

### Issue: Authentication conflicts
- **Solution**: Use the provided `useSignOut` hook for logout functionality

## Testing

To test the flow:

1. Create a new user account
2. Verify they're redirected to `/onboarding`
3. Complete the onboarding process
4. Verify they're redirected to home and can access other routes
5. Sign out and sign back in
6. Verify they go directly to home (skipping onboarding)

## Migration for Existing Users

If you're adding this to an existing app with users:

```typescript
// Run this script to initialize existing users
import { clerkClient } from '@clerk/nextjs/server';

async function initializeExistingUsers() {
  const users = await clerkClient.users.getUserList();
  
  for (const user of users.data) {
    if (user.unsafeMetadata.firstLogin === undefined) {
      await clerkClient.users.updateUserMetadata(user.id, {
        unsafeMetadata: {
          ...user.unsafeMetadata,
          firstLogin: false, // Existing users skip onboarding
          onboardingCompleted: true,
        },
      });
    }
  }
}
``` 