import { useState, useEffect } from 'react';

export interface ThreatAlert {
  id: string;
  alert_type: string;
  message: string;
  severity: string;
  read_status: boolean;
  created_at: string;
  updated_at: string;
  competitor_id: string | null;
  user_id: string;
}

export const useThreatAlerts = () => {
  const [alerts, setAlerts] = useState<ThreatAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      // Mock data for now
      const mockAlerts: ThreatAlert[] = [
        {
          id: '1',
          alert_type: 'competitor_activity',
          message: 'New competitor campaign detected',
          severity: 'medium',
          read_status: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          competitor_id: 'comp-1',
          user_id: 'user-1'
        }
      ];
      setAlerts(mockAlerts);
    } catch (err) {
      setError('Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, read_status: true } : alert
    ));
  };

  const deleteAlert = async (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const unreadCount = alerts.filter(alert => !alert.read_status).length;

  useEffect(() => {
    fetchAlerts();
  }, []);

  return {
    alerts,
    loading,
    error,
    fetchAlerts,
    markAsRead,
    deleteAlert,
    unreadCount
  };
};