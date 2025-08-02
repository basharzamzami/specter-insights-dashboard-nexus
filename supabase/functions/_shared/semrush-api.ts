/**
 * SEMrush API Integration Service
 * Replaces simulated SEO data with real SEMrush API data
 */

interface SEMrushConfig {
  apiKey: string;
  baseUrl: string;
}

interface SEMrushKeywordData {
  keyword: string;
  position: number;
  previous_position: number;
  search_volume: number;
  keyword_difficulty: number;
  traffic_cost: number;
  url: string;
  traffic: number;
}

interface SEMrushDomainOverview {
  organic_keywords: number;
  organic_traffic: number;
  organic_cost: number;
  adwords_keywords: number;
  adwords_traffic: number;
  adwords_cost: number;
}

interface SEMrushBacklinkData {
  total_backlinks: number;
  referring_domains: number;
  authority_score: number;
  toxic_score: number;
}

export class SEMrushAPI {
  private config: SEMrushConfig;

  constructor(apiKey: string) {
    this.config = {
      apiKey,
      baseUrl: 'https://api.semrush.com'
    };
  }

  /**
   * Get domain overview data
   */
  async getDomainOverview(domain: string, database = 'us'): Promise<SEMrushDomainOverview> {
    const params = new URLSearchParams({
      type: 'domain_overview',
      key: this.config.apiKey,
      domain: domain,
      database: database,
      export_columns: 'Or,Ot,Oc,Ad,At,Ac'
    });

    const response = await fetch(`${this.config.baseUrl}/?${params}`);
    
    if (!response.ok) {
      throw new Error(`SEMrush API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.text();
    const lines = data.trim().split('\n');
    
    if (lines.length < 2) {
      throw new Error('Invalid SEMrush response format');
    }

    const values = lines[1].split(';');
    
    return {
      organic_keywords: parseInt(values[0]) || 0,
      organic_traffic: parseInt(values[1]) || 0,
      organic_cost: parseFloat(values[2]) || 0,
      adwords_keywords: parseInt(values[3]) || 0,
      adwords_traffic: parseInt(values[4]) || 0,
      adwords_cost: parseFloat(values[5]) || 0
    };
  }

  /**
   * Get organic keywords for a domain
   */
  async getOrganicKeywords(domain: string, limit = 100, database = 'us'): Promise<SEMrushKeywordData[]> {
    const params = new URLSearchParams({
      type: 'domain_organic',
      key: this.config.apiKey,
      domain: domain,
      database: database,
      limit: limit.toString(),
      export_columns: 'Ph,Po,Pp,Nq,Kd,Tr,Ur,Tc'
    });

    const response = await fetch(`${this.config.baseUrl}/?${params}`);
    
    if (!response.ok) {
      throw new Error(`SEMrush API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.text();
    const lines = data.trim().split('\n');
    
    if (lines.length < 2) {
      return [];
    }

    return lines.slice(1).map(line => {
      const values = line.split(';');
      return {
        keyword: values[0] || '',
        position: parseInt(values[1]) || 0,
        previous_position: parseInt(values[2]) || 0,
        search_volume: parseInt(values[3]) || 0,
        keyword_difficulty: parseFloat(values[4]) || 0,
        traffic_cost: parseFloat(values[5]) || 0,
        url: values[6] || '',
        traffic: parseInt(values[7]) || 0
      };
    });
  }

  /**
   * Get backlink overview
   */
  async getBacklinkOverview(domain: string): Promise<SEMrushBacklinkData> {
    const params = new URLSearchParams({
      type: 'backlinks_overview',
      key: this.config.apiKey,
      target: domain,
      target_type: 'root_domain',
      export_columns: 'total,domains,score,toxic_score'
    });

    const response = await fetch(`${this.config.baseUrl}/?${params}`);
    
    if (!response.ok) {
      throw new Error(`SEMrush API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.text();
    const lines = data.trim().split('\n');
    
    if (lines.length < 2) {
      return {
        total_backlinks: 0,
        referring_domains: 0,
        authority_score: 0,
        toxic_score: 0
      };
    }

    const values = lines[1].split(';');
    
    return {
      total_backlinks: parseInt(values[0]) || 0,
      referring_domains: parseInt(values[1]) || 0,
      authority_score: parseFloat(values[2]) || 0,
      toxic_score: parseFloat(values[3]) || 0
    };
  }

  /**
   * Get comprehensive SEO analysis combining multiple endpoints
   */
  async getComprehensiveAnalysis(domain: string, database = 'us') {
    try {
      const [overview, keywords, backlinks] = await Promise.all([
        this.getDomainOverview(domain, database),
        this.getOrganicKeywords(domain, 50, database),
        this.getBacklinkOverview(domain)
      ]);

      // Calculate SEO score based on multiple factors
      const seoScore = this.calculateSEOScore(overview, keywords, backlinks);

      // Format keywords to match existing structure
      const formattedKeywords = keywords.map(kw => ({
        keyword: kw.keyword,
        rank: kw.position,
        previousRank: kw.previous_position,
        searchVolume: kw.search_volume,
        difficulty: kw.keyword_difficulty,
        trafficEstimate: kw.traffic,
        rankChange: kw.previous_position - kw.position
      }));

      return {
        domain: domain,
        seoScore: seoScore,
        organicTraffic: overview.organic_traffic,
        paidTraffic: overview.adwords_traffic,
        backlinks: backlinks.total_backlinks,
        keywordCount: overview.organic_keywords,
        marketShare: this.estimateMarketShare(overview.organic_traffic),
        keywords: formattedKeywords,
        authorityScore: backlinks.authority_score,
        toxicScore: backlinks.toxic_score,
        referringDomains: backlinks.referring_domains,
        organicCost: overview.organic_cost,
        paidCost: overview.adwords_cost
      };
    } catch (error) {
      console.error('SEMrush API error:', error);
      throw error;
    }
  }

  /**
   * Calculate SEO score based on multiple metrics
   */
  private calculateSEOScore(overview: SEMrushDomainOverview, keywords: SEMrushKeywordData[], backlinks: SEMrushBacklinkData): number {
    let score = 0;

    // Traffic component (0-30 points)
    const trafficScore = Math.min(30, (overview.organic_traffic / 100000) * 30);
    score += trafficScore;

    // Keywords component (0-25 points)
    const keywordScore = Math.min(25, (overview.organic_keywords / 10000) * 25);
    score += keywordScore;

    // Backlinks component (0-25 points)
    const backlinkScore = Math.min(25, (backlinks.total_backlinks / 10000) * 25);
    score += backlinkScore;

    // Authority component (0-20 points)
    const authorityScore = Math.min(20, (backlinks.authority_score / 100) * 20);
    score += authorityScore;

    return Math.round(Math.max(0, Math.min(100, score)));
  }

  /**
   * Estimate market share based on organic traffic
   */
  private estimateMarketShare(organicTraffic: number): number {
    // Simple estimation - in reality this would require industry data
    const baseShare = (organicTraffic / 1000000) * 5; // 5% per million visits
    return Math.round(Math.max(0.1, Math.min(25, baseShare)) * 100) / 100;
  }

  /**
   * Test API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const params = new URLSearchParams({
        type: 'domain_overview',
        key: this.config.apiKey,
        domain: 'example.com',
        database: 'us',
        export_columns: 'Or'
      });

      const response = await fetch(`${this.config.baseUrl}/?${params}`);
      return response.ok;
    } catch (error) {
      console.error('SEMrush connection test failed:', error);
      return false;
    }
  }
}

/**
 * Helper function to get SEMrush API key from environment
 */
export function getSEMrushAPIKey(): string {
  const apiKey = Deno.env.get('SEMRUSH_API_KEY');
  if (!apiKey) {
    throw new Error('SEMRUSH_API_KEY environment variable is required');
  }
  return apiKey;
}
