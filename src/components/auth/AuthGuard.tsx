import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useClientData } from "@/hooks/useClientData";

interface AuthGuardProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

export const AuthGuard = ({ children, requireOnboarding = true }: AuthGuardProps) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { hasCompletedOnboarding, loading } = useClientData();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate("/auth", { replace: true });
      return;
    }

    if (isLoaded && isSignedIn && !loading && requireOnboarding) {
      if (!hasCompletedOnboarding) {
        navigate("/onboarding", { replace: true });
      }
    }
  }, [isLoaded, isSignedIn, hasCompletedOnboarding, loading, requireOnboarding, navigate]);

  if (!isLoaded || (requireOnboarding && loading)) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">
            {!isLoaded ? "Authenticating..." : "Loading profile..."}
          </p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (requireOnboarding && !hasCompletedOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Redirecting to onboarding...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};