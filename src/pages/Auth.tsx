import { SignIn, SignUp, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  useEffect(() => {
    if (isSignedIn && user) {
      // Check if this is a new user (simplified check - in production you'd check a database)
      const isNewUser = user.createdAt && new Date(user.createdAt).getTime() > Date.now() - 120000; // Created within last 2 minutes
      
      if (isNewUser) {
        // Redirect new users to onboarding
        navigate('/onboarding');
      } else {
        // Redirect existing users to dashboard
        navigate(`/dashboard/${user.id}`);
      }
    }
  }, [isSignedIn, user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Specter Net
            </h1>
          </div>
          <p className="text-muted-foreground">
            Business Intelligence Dashboard
          </p>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => setMode('signin')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                mode === 'signin' 
                  ? 'bg-primary text-primary-foreground shadow-glow' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                mode === 'signup' 
                  ? 'bg-primary text-primary-foreground shadow-glow' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign Up
            </button>
          </div>
          
          {mode === 'signin' ? (
            <SignIn 
              fallbackRedirectUrl="/"
              appearance={{
                elements: {
                  card: "shadow-none border-0",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "bg-secondary hover:bg-accent",
                  formButtonPrimary: "bg-primary hover:bg-primary/90",
                }
              }}
            />
          ) : (
            <SignUp 
              fallbackRedirectUrl="/"
              appearance={{
                elements: {
                  card: "shadow-none border-0",
                  headerTitle: "hidden", 
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "bg-secondary hover:bg-accent",
                  formButtonPrimary: "bg-primary hover:bg-primary/90",
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;