import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CampaignRecommendation {
  id: string;
  user_id: string;
  competitor_id?: string | null;
  type: string; // Allow any string from database
  title: string;
  description?: string | null;
  details?: any; // JSON type
  status: string; // Allow any string from database
  estimated_budget?: number | null;
  created_at: string;
  updated_at: string;
}

export const useCampaignRecommendations = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<CampaignRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('campaign_recommendations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      setCampaigns(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch campaign recommendations';
      setError(errorMessage);
      console.error('Error fetching campaign recommendations:', err);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addCampaign = async (campaignData: Omit<CampaignRecommendation, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user?.id) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('campaign_recommendations')
        .insert({
          ...campaignData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setCampaigns(prev => [data, ...prev]);
      
      toast({
        title: "Success",
        description: "Campaign recommendation added successfully",
      });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add campaign recommendation';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw err;
    }
  };

  const updateCampaignStatus = async (id: string, status: string) => {
    try {
      const { data, error } = await supabase
        .from('campaign_recommendations')
        .update({ status })
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;

      setCampaigns(prev => prev.map(campaign => campaign.id === id ? data : campaign));
      
      toast({
        title: "Success",
        description: `Campaign ${status} successfully`,
      });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update campaign status';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw err;
    }
  };

  const updateCampaign = async (id: string, updates: Partial<CampaignRecommendation>) => {
    try {
      const { data, error } = await supabase
        .from('campaign_recommendations')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;

      setCampaigns(prev => prev.map(campaign => campaign.id === id ? data : campaign));
      
      toast({
        title: "Success",
        description: "Campaign updated successfully",
      });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update campaign';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw err;
    }
  };

  const deleteCampaign = async (id: string) => {
    try {
      const { error } = await supabase
        .from('campaign_recommendations')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      setCampaigns(prev => prev.filter(campaign => campaign.id !== id));
      
      toast({
        title: "Success",
        description: "Campaign deleted successfully",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete campaign';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw err;
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [user?.id]);

  return {
    campaigns,
    loading,
    error,
    addCampaign,
    updateCampaignStatus,
    updateCampaign,
    deleteCampaign,
    refetch: fetchCampaigns,
  };
};