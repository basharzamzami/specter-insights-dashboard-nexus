import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ThreatAlert {
  id: string;
  user_id: string;
  competitor_id?: string | null;
  alert_type: string;
  message: string;
  severity: string; // Allow any string from database
  read_status: boolean;
  created_at: string;
  updated_at: string;
}

export const useThreatAlerts = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<ThreatAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('threat_alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      setAlerts(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch threat alerts';
      setError(errorMessage);
      console.error('Error fetching threat alerts:', err);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addAlert = async (alertData: Omit<ThreatAlert, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'read_status'>) => {
    if (!user?.id) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('threat_alerts')
        .insert({
          ...alertData,
          user_id: user.id,
          read_status: false,
        })
        .select()
        .single();

      if (error) throw error;

      setAlerts(prev => [data, ...prev]);
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add threat alert';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw err;
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('threat_alerts')
        .update({ read_status: true })
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;

      setAlerts(prev => prev.map(alert => alert.id === id ? data : alert));
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark alert as read';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw err;
    }
  };

  const deleteAlert = async (id: string) => {
    try {
      const { error } = await supabase
        .from('threat_alerts')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      setAlerts(prev => prev.filter(alert => alert.id !== id));
      
      toast({
        title: "Success",
        description: "Alert deleted successfully",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete alert';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw err;
    }
  };

  const unreadCount = alerts.filter(alert => !alert.read_status).length;

  useEffect(() => {
    fetchAlerts();
  }, [user?.id]);

  return {
    alerts,
    loading,
    error,
    unreadCount,
    addAlert,
    markAsRead,
    deleteAlert,
    refetch: fetchAlerts,
  };
};