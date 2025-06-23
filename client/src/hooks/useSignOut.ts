"use client";

import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { DEFAULT_SIGNIN_ROUTE } from "@/lib/routes";

export function useSignOut() {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect to sign-in page after successful sign-out
      router.push(DEFAULT_SIGNIN_ROUTE);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return { signOut: handleSignOut };
} 