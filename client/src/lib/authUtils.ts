import { User } from "@clerk/nextjs/server";

/**
 * Initialize firstLogin metadata for new users
 * This should be called after a user signs up
 */
export async function initializeUserMetadata(user: User) {
  try {
    const currentMetadata = user.unsafeMetadata || {};
    
    // Only set firstLogin if it's not already set
    if (currentMetadata.firstLogin === undefined) {
      await user.update({
        unsafeMetadata: {
          ...currentMetadata,
          firstLogin: true,
          signUpDate: new Date().toISOString(),
        },
      });
    }
  } catch (error) {
    console.error("Error initializing user metadata:", error);
    throw error;
  }
}

/**
 * Check if a user needs onboarding
 */
export function needsOnboarding(user: User): boolean {
  const metadata = user.unsafeMetadata || {};
  return metadata.firstLogin === true;
}

/**
 * Check if a user has completed onboarding
 */
export function hasCompletedOnboarding(user: User): boolean {
  const metadata = user.unsafeMetadata || {};
  return metadata.firstLogin === false && metadata.onboardingCompleted === true;
} 