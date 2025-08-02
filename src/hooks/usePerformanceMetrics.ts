import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PerformanceMetric {
  id: string;
  user_id: string;
  competitor_id?: string | null;
  metric_type: string;
  value: number;
  period_start: string;
  period_end: string;
  metadata?: any; // JSON type
  created_at: string;
}

export const usePerformanceMetrics = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async (startDate?: string, endDate?: string) => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('performance_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('period_start', { ascending: false });

      if (startDate) {
        query = query.gte('period_start', startDate);
      }
      
      if (endDate) {
        query = query.lte('period_end', endDate);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      
      setMetrics(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch performance metrics';
      setError(errorMessage);
      console.error('Error fetching performance metrics:', err);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addMetric = async (metricData: Omit<PerformanceMetric, 'id' | 'user_id' | 'created_at'>) => {
    if (!user?.id) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('performance_metrics')
        .insert({
          ...metricData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setMetrics(prev => [data, ...prev]);
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add performance metric';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw err;
    }
  };

  const getMetricsByType = (type: string) => {
    return metrics.filter(metric => metric.metric_type === type);
  };

  const getMetricsForCompetitor = (competitorId: string) => {
    return metrics.filter(metric => metric.competitor_id === competitorId);
  };

  const getMetricsSummary = () => {
    const metricTypes = [...new Set(metrics.map(m => m.metric_type))];
    
    return metricTypes.map(type => {
      const typeMetrics = getMetricsByType(type);
      const latestMetric = typeMetrics[0]; // Already sorted by period_start desc
      const previousMetric = typeMetrics[1];
      
      const change = previousMetric 
        ? ((latestMetric?.value || 0) - previousMetric.value) / previousMetric.value * 100
        : 0;
      
      return {
        type,
        currentValue: latestMetric?.value || 0,
        previousValue: previousMetric?.value || 0,
        change,
        trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
      };
    });
  };

  useEffect(() => {
    fetchMetrics();
  }, [user?.id]);

  return {
    metrics,
    loading,
    error,
    addMetric,
    getMetricsByType,
    getMetricsForCompetitor,
    getMetricsSummary,
    refetch: fetchMetrics,
  };
};