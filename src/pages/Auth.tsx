import { SignIn } from "@clerk/clerk-react";

const Auth = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
      <div className="w-full max-w-md">
        <SignIn 
          routing="path" 
          path="/auth" 
          afterSignInUrl="/dashboard"
          appearance={{
            elements: {
              formButtonPrimary: 'bg-primary hover:bg-primary/90',
              card: 'bg-card border border-border shadow-lg'
            }
          }}
        />
      </div>
    </div>
  );
};

export default Auth;