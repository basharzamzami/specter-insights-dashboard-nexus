import { NavigateFunction } from "react-router-dom";

export interface FunnelAction {
  type: 'navigate' | 'modal' | 'action' | 'external';
  target?: string;
  payload?: any;
  onSuccess?: (result?: any) => void;
  onError?: (error: any) => void;
}

export const createFunnelAction = (
  navigate: NavigateFunction,
  toast: any
) => {
  return (action: FunnelAction) => {
    switch (action.type) {
      case 'navigate':
        if (action.target) {
          navigate(action.target);
          action.onSuccess?.();
        }
        break;
        
      case 'external':
        if (action.target) {
          window.open(action.target, '_blank');
          action.onSuccess?.();
        }
        break;
        
      case 'action':
        try {
          // Simulate action completion
          setTimeout(() => {
            toast({
              title: action.payload?.title || "Action Completed",
              description: action.payload?.description || "Operation executed successfully.",
            });
            action.onSuccess?.(action.payload);
          }, 500);
        } catch (error) {
          action.onError?.(error);
        }
        break;
        
      case 'modal':
        // Handle modal opening
        action.onSuccess?.(action.payload);
        break;
        
      default:
        console.warn('Unknown funnel action type:', action.type);
    }
  };
};

export const commonFunnelActions = {
  viewCampaignDetails: (campaignName: string): FunnelAction => ({
    type: 'navigate',
    target: `/campaign-details?name=${encodeURIComponent(campaignName)}`
  }),
  
  createCampaign: (): FunnelAction => ({
    type: 'navigate',
    target: '/campaigns/new'
  }),
  
  exportReport: (reportType: string = 'general'): FunnelAction => ({
    type: 'action',
    payload: {
      title: 'Report Exported',
      description: `${reportType} report has been generated and downloaded.`,
      reportType
    }
  }),
  
  analyzeCompetitor: (competitorName: string): FunnelAction => ({
    type: 'action',
    payload: {
      title: 'Analysis Started',
      description: `Competitive analysis initiated for ${competitorName}.`,
      competitor: competitorName
    }
  }),
  
  schedulePost: (platform: string): FunnelAction => ({
    type: 'action',
    payload: {
      title: 'Post Scheduled',
      description: `Content scheduled for ${platform}.`,
      platform
    }
  }),
  
  openDocumentation: (section?: string): FunnelAction => ({
    type: 'external',
    target: section ? `https://docs.example.com/${section}` : 'https://docs.example.com'
  }),
  
  contactSupport: (): FunnelAction => ({
    type: 'external',
    target: 'mailto:support@spectersecretsales.com'
  })
};