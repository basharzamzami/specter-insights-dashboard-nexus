import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';

interface ClientData {
  id: string;
  user_id: string;
  business_name: string;
  industry: string;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  business_goals: string;
  created_at: string;
  updated_at: string;
}

export const useClientData = () => {
  const { user } = useUser();
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
          throw error;
        }

        setClientData(data);
      } catch (err) {
        console.error('Error fetching client data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch client data');
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [user?.id]);

  const hasCompletedOnboarding = Boolean(clientData);

  return {
    clientData,
    loading,
    error,
    hasCompletedOnboarding,
    refetch: () => {
      if (user?.id) {
        setLoading(true);
        // Re-trigger the effect by updating a dependency
      }
    }
  };
};