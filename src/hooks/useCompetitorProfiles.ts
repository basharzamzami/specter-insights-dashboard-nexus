import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Use the existing competitor_profiles table schema
export interface CompetitorProfile {
  id: string;
  company_name: string;
  website?: string | null;
  seo_score?: number | null;
  sentiment_score?: number | null;
  vulnerabilities?: string[] | null;
  top_keywords?: string[] | null;
  estimated_ad_spend?: number | null;
  ad_activity?: any; // JSON type
  social_sentiment?: any; // JSON type
  customer_complaints?: any; // JSON type
  created_by?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  is_deleted?: boolean | null;
  deleted_at?: string | null;
}

export const useCompetitorProfiles = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [competitors, setCompetitors] = useState<CompetitorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompetitors = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('competitor_profiles')
        .select('*')
        .eq('created_by', user.id)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      setCompetitors(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch competitors';
      setError(errorMessage);
      console.error('Error fetching competitors:', err);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addCompetitor = async (competitorData: {
    company_name: string;
    website?: string;
    seo_score?: number;
    sentiment_score?: number;
    vulnerabilities?: string[];
    top_keywords?: string[];
    estimated_ad_spend?: number;
    ad_activity?: any;
    social_sentiment?: any;
    customer_complaints?: any;
  }) => {
    if (!user?.id) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('competitor_profiles')
        .insert({
          ...competitorData,
          created_by: user.id,
          is_deleted: false,
        })
        .select()
        .single();

      if (error) throw error;

      setCompetitors(prev => [data, ...prev]);
      
      toast({
        title: "Success",
        description: "Competitor added successfully",
      });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add competitor';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw err;
    }
  };

  const updateCompetitor = async (id: string, updates: Partial<CompetitorProfile>) => {
    try {
      const { data, error } = await supabase
        .from('competitor_profiles')
        .update(updates)
        .eq('id', id)
        .eq('created_by', user?.id)
        .select()
        .single();

      if (error) throw error;

      setCompetitors(prev => prev.map(comp => comp.id === id ? data : comp));
      
      toast({
        title: "Success",
        description: "Competitor updated successfully",
      });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update competitor';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw err;
    }
  };

  const deleteCompetitor = async (id: string) => {
    try {
      // Soft delete by setting is_deleted to true
      const { error } = await supabase
        .from('competitor_profiles')
        .update({ 
          is_deleted: true, 
          deleted_at: new Date().toISOString() 
        })
        .eq('id', id)
        .eq('created_by', user?.id);

      if (error) throw error;

      setCompetitors(prev => prev.filter(comp => comp.id !== id));
      
      toast({
        title: "Success",
        description: "Competitor deleted successfully",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete competitor';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw err;
    }
  };

  useEffect(() => {
    fetchCompetitors();
  }, [user?.id]);

  return {
    competitors,
    loading,
    error,
    addCompetitor,
    updateCompetitor,
    deleteCompetitor,
    refetch: fetchCompetitors,
  };
};