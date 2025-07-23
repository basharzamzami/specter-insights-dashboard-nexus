import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface StrikeRecommendation {
  id: string;
  type: string;
  title: string;
  description: string;
  estimated_budget: number;
  details: {
    target_competitor: string;
    confidence_score: number;
    success_probability: number;
    vulnerabilities_exploited: string[];
    timeline: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    tactics: string[];
    expected_impact: string;
    risk_level: string;
    analysis: {
      seo_weakness: boolean;
      sentiment_vulnerability: boolean;
      recent_threats: number;
      total_vulnerabilities: number;
    };
  };
  status: string;
  created_at: string;
  updated_at: string;
}

export const useStrikePlanner = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<StrikeRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateRecommendations = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      console.log('Generating AI recommendations for user:', user.id);

      const { data, error: functionError } = await supabase.functions.invoke('campaign-ai', {
        body: {
          action: 'generate_recommendations',
          user_id: user.id
        }
      });

      if (functionError) {
        console.error('Edge function error:', functionError);
        throw functionError;
      }

      if (data?.success && data.recommendations) {
        setRecommendations(data.recommendations);
        toast({
          title: 'AI Analysis Complete',
          description: `Generated ${data.count} strategic recommendations`,
        });
      } else {
        throw new Error('Failed to generate recommendations');
      }
    } catch (err) {
      console.error('Error generating recommendations:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate recommendations');
      toast({
        title: 'Generation Failed',
        description: 'Unable to generate AI recommendations. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const analyzeCompetitorVulnerability = async (competitorId: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase.functions.invoke('campaign-ai', {
        body: {
          action: 'analyze_vulnerability',
          user_id: user.id,
          competitor_id: competitorId
        }
      });

      if (error) throw error;
      return data?.analysis || null;
    } catch (err) {
      console.error('Error analyzing vulnerability:', err);
      toast({
        title: 'Analysis Failed',
        description: 'Unable to analyze competitor vulnerability.',
        variant: 'destructive'
      });
      return null;
    }
  };

  const fetchRecommendations = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('campaign_recommendations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData = (data || []).map(item => ({
        ...item,
        details: typeof item.details === 'string' ? JSON.parse(item.details) : item.details
      })) as StrikeRecommendation[];
      
      setRecommendations(transformedData);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };

  const deployRecommendation = async (recommendation: StrikeRecommendation) => {
    if (!user) return;

    try {
      // Update the recommendation status to deployed
      const { error: updateError } = await supabase
        .from('campaign_recommendations')
        .update({ status: 'deployed' })
        .eq('id', recommendation.id);

      if (updateError) throw updateError;

      // Create a campaign entry
      const { error: campaignError } = await supabase
        .from('campaigns')
        .insert({
          type: recommendation.type,
          target_company: recommendation.details.target_competitor,
          objective: recommendation.description,
          actions: {
            tactics: recommendation.details.tactics,
            confidence: recommendation.details.confidence_score,
            timeline: recommendation.details.timeline,
            expected_impact: recommendation.details.expected_impact
          },
          status: 'planned',
          created_by: user.id
        });

      if (campaignError) throw campaignError;

      // Log the deployment
      await supabase
        .from('action_logs')
        .insert({
          action_type: 'strike_deployed',
          triggered_by: user.id,
          target_id: recommendation.id,
          target_type: 'recommendation',
          details: {
            target: recommendation.details.target_competitor,
            type: recommendation.type,
            confidence: recommendation.details.confidence_score
          }
        });

      toast({
        title: 'Strike Deployed!',
        description: `${recommendation.title} has been deployed successfully.`,
      });

      // Target recommendations
      await fetchRecommendations();
    } catch (err) {
      console.error('Error deploying recommendation:', err);
      toast({
        title: 'Deployment Failed',
        description: 'Failed to deploy strike plan. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const dismissRecommendation = async (recommendationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('campaign_recommendations')
        .update({ status: 'dismissed' })
        .eq('id', recommendationId);

      if (error) throw error;

      toast({
        title: 'Recommendation Dismissed',
        description: 'The recommendation has been dismissed.',
      });

      await fetchRecommendations();
    } catch (err) {
      console.error('Error dismissing recommendation:', err);
      toast({
        title: 'Error',
        description: 'Failed to dismiss recommendation.',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchRecommendations();
    }
  }, [user]);

  return {
    recommendations,
    loading,
    error,
    generateRecommendations,
    analyzeCompetitorVulnerability,
    deployRecommendation,
    dismissRecommendation,
    refetchRecommendations: fetchRecommendations
  };
};