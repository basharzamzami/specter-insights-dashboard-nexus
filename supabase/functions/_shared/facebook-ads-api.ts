/**
 * Facebook Ads Library API Integration Service
 * Replaces simulated ad data with real Facebook/Instagram ad data
 * 
 * The Facebook Ads Library API is FREE and provides access to:
 * - All active ads from any advertiser
 * - Ad creative content (images, videos, text)
 * - Ad spend estimates and impressions
 * - Ad duration and status
 * - Platform targeting (Facebook, Instagram, etc.)
 */

interface FacebookAdsConfig {
  accessToken: string;
  baseUrl: string;
}

interface FacebookAd {
  id: string;
  ad_creation_time: string;
  ad_creative_bodies: string[];
  ad_creative_link_captions: string[];
  ad_creative_link_descriptions: string[];
  ad_creative_link_titles: string[];
  ad_delivery_start_time: string;
  ad_delivery_stop_time?: string;
  ad_snapshot_url: string;
  bylines: string;
  currency: string;
  delivery_by_region: any[];
  demographic_distribution: any[];
  estimated_audience_size: {
    lower_bound: number;
    upper_bound: number;
  };
  impressions: {
    lower_bound: number;
    upper_bound: number;
  };
  languages: string[];
  page_id: string;
  page_name: string;
  publisher_platforms: string[];
  spend: {
    lower_bound: number;
    upper_bound: number;
  };
}

interface FacebookAdsResponse {
  data: FacebookAd[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

interface ProcessedAdData {
  ad_id: string;
  creative_text: string;
  creative_title: string;
  creative_description: string;
  status: string;
  platform: string[];
  impressions_estimate: number;
  spend_estimate: number;
  duration_days: number;
  start_date: string;
  end_date?: string;
  page_name: string;
  ad_snapshot_url: string;
}

export class FacebookAdsAPI {
  private config: FacebookAdsConfig;

  constructor(accessToken: string) {
    this.config = {
      accessToken,
      baseUrl: 'https://graph.facebook.com/v18.0'
    };
  }

  /**
   * Search for ads by advertiser name or page name
   */
  async searchAdsByAdvertiser(
    searchTerm: string, 
    limit = 50,
    adActiveStatus = 'ALL'
  ): Promise<FacebookAd[]> {
    const params = new URLSearchParams({
      access_token: this.config.accessToken,
      search_terms: searchTerm,
      ad_reached_countries: 'US', // Can be made configurable
      ad_active_status: adActiveStatus,
      limit: limit.toString(),
      fields: [
        'id',
        'ad_creation_time',
        'ad_creative_bodies',
        'ad_creative_link_captions',
        'ad_creative_link_descriptions', 
        'ad_creative_link_titles',
        'ad_delivery_start_time',
        'ad_delivery_stop_time',
        'ad_snapshot_url',
        'bylines',
        'currency',
        'estimated_audience_size',
        'impressions',
        'languages',
        'page_id',
        'page_name',
        'publisher_platforms',
        'spend'
      ].join(',')
    });

    const response = await fetch(`${this.config.baseUrl}/ads_archive?${params}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Facebook Ads API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data: FacebookAdsResponse = await response.json();
    return data.data || [];
  }

  /**
   * Get comprehensive ad intelligence for a company
   */
  async getCompetitorAdIntelligence(companyName: string, domain?: string) {
    try {
      console.log(`Fetching Facebook ads for: ${companyName}`);
      
      // Search by company name
      const ads = await this.searchAdsByAdvertiser(companyName, 100);
      
      if (ads.length === 0 && domain) {
        // Try searching by domain if company name yields no results
        const domainName = domain.split('.')[0];
        const domainAds = await this.searchAdsByAdvertiser(domainName, 100);
        ads.push(...domainAds);
      }

      // Process and analyze the ads
      const processedAds = this.processAdData(ads);
      const adAnalytics = this.calculateAdAnalytics(processedAds);

      return {
        total_ads_found: ads.length,
        active_ads: processedAds.filter(ad => ad.status === 'active').length,
        estimated_monthly_spend: adAnalytics.estimatedMonthlySpend,
        active_platforms: adAnalytics.activePlatforms,
        ad_copies: adAnalytics.topAdCopies,
        top_keywords: this.extractKeywords(processedAds),
        facebook_ads: processedAds.slice(0, 20), // Limit to top 20 for storage
        spend_range: adAnalytics.spendRange,
        impressions_range: adAnalytics.impressionsRange,
        campaign_duration_avg: adAnalytics.avgCampaignDuration,
        last_updated: new Date().toISOString()
      };

    } catch (error) {
      console.error('Facebook Ads API error:', error);
      throw error;
    }
  }

  /**
   * Process raw Facebook ad data into our format
   */
  private processAdData(ads: FacebookAd[]): ProcessedAdData[] {
    return ads.map(ad => {
      const startDate = new Date(ad.ad_delivery_start_time);
      const endDate = ad.ad_delivery_stop_time ? new Date(ad.ad_delivery_stop_time) : null;
      const durationDays = endDate 
        ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        : Math.ceil((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      return {
        ad_id: ad.id,
        creative_text: ad.ad_creative_bodies?.[0] || '',
        creative_title: ad.ad_creative_link_titles?.[0] || '',
        creative_description: ad.ad_creative_link_descriptions?.[0] || '',
        status: ad.ad_delivery_stop_time ? 'inactive' : 'active',
        platform: ad.publisher_platforms || [],
        impressions_estimate: ad.impressions ? 
          Math.round((ad.impressions.lower_bound + ad.impressions.upper_bound) / 2) : 0,
        spend_estimate: ad.spend ? 
          Math.round((ad.spend.lower_bound + ad.spend.upper_bound) / 2) : 0,
        duration_days: durationDays,
        start_date: ad.ad_delivery_start_time,
        end_date: ad.ad_delivery_stop_time,
        page_name: ad.page_name,
        ad_snapshot_url: ad.ad_snapshot_url
      };
    });
  }

  /**
   * Calculate analytics from processed ad data
   */
  private calculateAdAnalytics(ads: ProcessedAdData[]) {
    const activeAds = ads.filter(ad => ad.status === 'active');
    
    // Estimate monthly spend based on active ads
    const totalDailySpend = activeAds.reduce((sum, ad) => {
      const dailySpend = ad.duration_days > 0 ? ad.spend_estimate / ad.duration_days : 0;
      return sum + dailySpend;
    }, 0);
    
    const estimatedMonthlySpend = Math.round(totalDailySpend * 30);

    // Get unique platforms
    const allPlatforms = ads.flatMap(ad => ad.platform);
    const activePlatforms = [...new Set(allPlatforms)];

    // Get top ad copies (creative text)
    const topAdCopies = ads
      .filter(ad => ad.creative_text)
      .map(ad => ad.creative_text)
      .slice(0, 10);

    // Calculate spend and impressions ranges
    const spends = ads.map(ad => ad.spend_estimate).filter(s => s > 0);
    const impressions = ads.map(ad => ad.impressions_estimate).filter(i => i > 0);

    return {
      estimatedMonthlySpend,
      activePlatforms,
      topAdCopies,
      spendRange: {
        min: Math.min(...spends) || 0,
        max: Math.max(...spends) || 0,
        avg: spends.length > 0 ? Math.round(spends.reduce((a, b) => a + b, 0) / spends.length) : 0
      },
      impressionsRange: {
        min: Math.min(...impressions) || 0,
        max: Math.max(...impressions) || 0,
        avg: impressions.length > 0 ? Math.round(impressions.reduce((a, b) => a + b, 0) / impressions.length) : 0
      },
      avgCampaignDuration: ads.length > 0 ? 
        Math.round(ads.reduce((sum, ad) => sum + ad.duration_days, 0) / ads.length) : 0
    };
  }

  /**
   * Extract keywords from ad creative content
   */
  private extractKeywords(ads: ProcessedAdData[]): string[] {
    const allText = ads
      .map(ad => `${ad.creative_text} ${ad.creative_title} ${ad.creative_description}`)
      .join(' ')
      .toLowerCase();

    // Simple keyword extraction (in production, use more sophisticated NLP)
    const words = allText.match(/\b\w{4,}\b/g) || [];
    const wordCount = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  /**
   * Test API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const params = new URLSearchParams({
        access_token: this.config.accessToken,
        search_terms: 'test',
        limit: '1',
        fields: 'id'
      });

      const response = await fetch(`${this.config.baseUrl}/ads_archive?${params}`);
      return response.ok;
    } catch (error) {
      console.error('Facebook Ads API connection test failed:', error);
      return false;
    }
  }
}

/**
 * Helper function to get Facebook access token from environment
 */
export function getFacebookAccessToken(): string {
  const token = Deno.env.get('FACEBOOK_ACCESS_TOKEN');
  if (!token) {
    throw new Error('FACEBOOK_ACCESS_TOKEN environment variable is required');
  }
  return token;
}
