import { SignIn, SignUp, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate("/");
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Specter Net
          </h1>
          <p className="text-muted-foreground">
            Business Intelligence Dashboard
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <SignIn 
              fallbackRedirectUrl="/"
              appearance={{
                elements: {
                  card: "shadow-lg",
                  headerTitle: "text-foreground",
                  headerSubtitle: "text-muted-foreground",
                }
              }}
            />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?
              </p>
              <SignUp 
                fallbackRedirectUrl="/"
                appearance={{
                  elements: {
                    card: "shadow-lg",
                    headerTitle: "text-foreground",
                    headerSubtitle: "text-muted-foreground",
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;