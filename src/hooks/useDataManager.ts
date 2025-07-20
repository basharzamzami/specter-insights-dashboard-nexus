import { useToast } from '@/hooks/use-toast';
import { useUser } from '@clerk/clerk-react';

export const useDataManager = () => {
  const { user } = useUser();
  const { toast } = useToast();

  const showSuccess = (message: string) => {
    toast({
      title: "Success",
      description: message,
    });
  };

  const showError = (message: string) => {
    toast({
      title: "Error",
      description: message,
      variant: "destructive"
    });
  };

  const ensureAuthenticated = () => {
    if (!user?.id) {
      showError("User not authenticated");
      throw new Error("User not authenticated");
    }
    return user.id;
  };

  return {
    showSuccess,
    showError,
    ensureAuthenticated,
    userId: user?.id
  };
};