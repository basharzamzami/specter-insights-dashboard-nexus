import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Custom hook to bridge Clerk authentication with Supabase
 * This allows us to use Clerk for auth while maintaining Supabase data access
 */
export function useClerkSupabaseAuth() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      setIsReady(true);
    }
  }, [isLoaded]);

  // Create a mock user object that matches Supabase auth format
  const mockSupabaseUser = isSignedIn && user ? {
    id: user.id, // Use Clerk user ID
    email: user.emailAddresses[0]?.emailAddress,
    // Add other properties as needed
  } : null;

  // Override supabase.auth.getUser to return our Clerk user
  const getUser = async () => {
    if (!isSignedIn || !user) {
      return { data: { user: null }, error: new Error('Not authenticated') };
    }
    
    return {
      data: { user: mockSupabaseUser },
      error: null
    };
  };

  return {
    user: mockSupabaseUser,
    isLoaded,
    isSignedIn,
    isReady,
    getUser
  };
}