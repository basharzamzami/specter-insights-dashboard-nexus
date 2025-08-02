/**
 * 🔥 WARM LEAD SEIZURE SYSTEM - SPECTER NET CORE MODULE
 * 
 * A sophisticated lead intelligence and conversion system that identifies,
 * qualifies, and converts warm leads through automated seizure campaigns.
 * 
 * Built for high-ticket B2B industries (home remodeling, solar, etc.)
 */

export interface WarmLeadProfile {
  readonly id: string;
  readonly email?: string | null;
  readonly phone?: string | null;
  readonly company?: string | null;
  readonly source: LeadSource;
  readonly first_detected: string; // ISO 8601 timestamp
  readonly last_activity: string; // ISO 8601 timestamp
  warmth_score: WarmthScore; // 0-100
  status: LeadStatus;
  readonly behavior_data: LeadBehaviorData;
  seizure_history: readonly SeizureAction[];
}

export type LeadSource = 'website' | 'google_ads' | 'facebook_ads' | 'linkedin' | 'organic' | 'referral' | 'direct' | 'email' | 'social';
export type LeadStatus = 'detected' | 'qualified' | 'seized' | 'converted' | 'cold' | 'unsubscribed';
export type WarmthScore = number; // 0-100, validated at runtime
export type DeviceType = 'desktop' | 'mobile' | 'tablet' | 'unknown';

export interface LeadBehaviorData {
  // Detection Layer Data (all non-negative integers)
  readonly time_on_pricing_page: number; // seconds, 0-3600
  readonly quote_clicks_no_submit: number; // count, 0-100
  readonly emails_opened: number; // count, 0-1000
  readonly calls_not_booked: number; // count, 0-100
  readonly ad_clicks_no_conversion: number; // count, 0-1000

  // Qualification Data
  readonly total_time_on_site: number; // seconds, 0-86400 (24 hours max)
  readonly visits_last_14_days: number; // count, 0-100
  readonly form_completion_rate: number; // percentage, 0.0-1.0
  readonly retargeting_interactions: number; // count, 0-1000
  readonly max_scroll_depth: number; // percentage, 0-100
  readonly pages_visited: readonly string[]; // max 50 pages

  // Tracking Data (all optional and validated)
  readonly utm_source?: string | null; // max 100 chars
  readonly utm_campaign?: string | null; // max 200 chars
  readonly referrer?: string | null; // valid URL or null
  readonly device_type: DeviceType;
  readonly location?: string | null; // max 200 chars
  readonly ip_address?: string | null; // valid IP or null
  readonly user_agent?: string | null; // max 500 chars
}

export interface SeizureAction {
  readonly id: string;
  readonly type: SeizureActionType;
  readonly trigger_day: number; // 0-30 days
  readonly content: string; // max 5000 chars
  status: SeizureActionStatus;
  readonly created_at: string; // ISO 8601 timestamp
  sent_at?: string | null; // ISO 8601 timestamp
  opened_at?: string | null; // ISO 8601 timestamp
  clicked_at?: string | null; // ISO 8601 timestamp
  response_at?: string | null; // ISO 8601 timestamp
  conversion_value?: number | null; // USD amount, 0-1000000
  readonly platform_data?: Record<string, unknown>; // Platform-specific data
  error_message?: string | null; // Error details if failed
}

export type SeizureActionType = 'email' | 'ad' | 'sms' | 'chat' | 'call' | 'push_notification';
export type SeizureActionStatus = 'pending' | 'scheduled' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'converted' | 'failed' | 'cancelled';

export interface WarmthFactors {
  readonly time_on_site_weight: number; // 0-50
  readonly repeat_visits_weight: number; // 0-50
  readonly form_completion_weight: number; // 0-50
  readonly retargeting_weight: number; // 0-50
  readonly scroll_depth_weight: number; // 0-50
  readonly email_engagement_weight: number; // 0-50
  readonly pricing_page_weight: number; // 0-50
  readonly quote_intent_weight: number; // 0-50
}

// Validation constants
export const VALIDATION_LIMITS = {
  MAX_BEHAVIOR_DATA_ITEMS: 1000,
  MAX_LEADS_PER_REQUEST: 100,
  MAX_EMAIL_LENGTH: 254,
  MAX_PHONE_LENGTH: 20,
  MAX_COMPANY_LENGTH: 100,
  MAX_SOURCE_LENGTH: 50,
  MAX_LOCATION_LENGTH: 200,
  MAX_UTM_SOURCE_LENGTH: 100,
  MAX_UTM_CAMPAIGN_LENGTH: 200,
  MAX_REFERRER_LENGTH: 2048,
  MAX_USER_AGENT_LENGTH: 500,
  MAX_PAGES_VISITED: 50,
  MAX_PAGE_URL_LENGTH: 2048,
  MAX_CONTENT_LENGTH: 5000,
  MAX_ERROR_MESSAGE_LENGTH: 1000,
  MAX_TIME_ON_PRICING_PAGE: 3600, // 1 hour
  MAX_TOTAL_TIME_ON_SITE: 86400, // 24 hours
  MAX_VISITS_LAST_14_DAYS: 100,
  MAX_QUOTE_CLICKS: 100,
  MAX_EMAILS_OPENED: 1000,
  MAX_CALLS_NOT_BOOKED: 100,
  MAX_AD_CLICKS: 1000,
  MAX_RETARGETING_INTERACTIONS: 1000,
  MAX_TRIGGER_DAY: 30,
  MAX_CONVERSION_VALUE: 1000000, // $1M
  WARMTH_SCORE_MIN: 0,
  WARMTH_SCORE_MAX: 100,
  QUALIFICATION_THRESHOLD: 65,
  HIGH_VALUE_THRESHOLD: 85
} as const;

// Error types
export class WarmLeadSeizureError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'WarmLeadSeizureError';
  }
}

export class ValidationError extends WarmLeadSeizureError {
  constructor(message: string, field?: string, value?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, { field, value });
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends WarmLeadSeizureError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTHENTICATION_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends WarmLeadSeizureError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 'AUTHORIZATION_ERROR', 403);
    this.name = 'AuthorizationError';
  }
}

export class RateLimitError extends WarmLeadSeizureError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 'RATE_LIMIT_ERROR', 429);
    this.name = 'RateLimitError';
  }
}

export class WarmLeadSeizureSystem {
  private readonly warmthFactors: WarmthFactors;

  constructor(customWarmthFactors?: Partial<WarmthFactors>) {
    // Default warmth factors with validation
    const defaultFactors: WarmthFactors = {
      time_on_site_weight: 15,
      repeat_visits_weight: 20,
      form_completion_weight: 25,
      retargeting_weight: 10,
      scroll_depth_weight: 8,
      email_engagement_weight: 12,
      pricing_page_weight: 20,
      quote_intent_weight: 30
    };

    // Merge with custom factors and validate
    this.warmthFactors = { ...defaultFactors, ...customWarmthFactors };
    this.validateWarmthFactors();
  }

  private validateWarmthFactors(): void {
    const factors = this.warmthFactors;
    const totalWeight = Object.values(factors).reduce((sum, weight) => sum + weight, 0);

    // Validate individual weights
    for (const [key, weight] of Object.entries(factors)) {
      if (typeof weight !== 'number' || weight < 0 || weight > 50) {
        throw new ValidationError(`Invalid warmth factor ${key}: must be between 0 and 50`, key, weight);
      }
    }

    // Validate total weight doesn't exceed reasonable limits
    if (totalWeight > 200) {
      throw new ValidationError(`Total warmth factors too high: ${totalWeight} (max 200)`);
    }
  }

  /**
   * 🧠 DETECTION LAYER - "Thermal Radar"
   * Scans for warm lead signals across multiple touchpoints
   */
  async detectWarmLeads(behaviorData: unknown[]): Promise<WarmLeadProfile[]> {
    // Input validation
    if (!Array.isArray(behaviorData)) {
      throw new ValidationError('behaviorData must be an array', 'behaviorData', typeof behaviorData);
    }

    if (behaviorData.length === 0) {
      return []; // Return empty array for no data
    }

    if (behaviorData.length > VALIDATION_LIMITS.MAX_BEHAVIOR_DATA_ITEMS) {
      throw new ValidationError(
        `behaviorData array too large (max ${VALIDATION_LIMITS.MAX_BEHAVIOR_DATA_ITEMS} items)`,
        'behaviorData.length',
        behaviorData.length
      );
    }

    const detectedLeads: WarmLeadProfile[] = [];
    const errors: Array<{ index: number; error: Error }> = [];

    for (let i = 0; i < behaviorData.length; i++) {
      try {
        const data = behaviorData[i];

        // Sanitize and validate data
        const sanitizedData = this.sanitizeBehaviorData(data);

        // Check for warm signals
        const warmSignals = this.analyzeWarmSignals(sanitizedData);

        if (warmSignals.isWarm) {
          const leadProfile: WarmLeadProfile = {
            id: this.generateLeadId(),
            email: sanitizedData.email || null,
            phone: sanitizedData.phone || null,
            company: sanitizedData.company || null,
            source: sanitizedData.source as LeadSource,
          first_detected: new Date().toISOString(),
          last_activity: sanitizedData.last_activity || new Date().toISOString(),
          warmth_score: 0, // Will be calculated in qualification layer
          status: 'detected',
          behavior_data: this.extractBehaviorData(sanitizedData),
          seizure_history: []
        };

          detectedLeads.push(leadProfile);
        }
      } catch (error) {
        // Log individual item errors but continue processing
        errors.push({ index: i, error: error as Error });
        console.warn(`Failed to process behavior data at index ${i}:`, error);
      }
    }

    // If too many errors, throw
    if (errors.length > behaviorData.length * 0.5) {
      throw new ValidationError(
        `Too many validation errors: ${errors.length}/${behaviorData.length} items failed`,
        'behaviorData',
        errors.slice(0, 5) // Include first 5 errors for debugging
      );
    }

    return detectedLeads;
  }

  /**
   * 🔍 QUALIFICATION & SCORING LAYER - "Warm Index Engine"
   * Assigns Warmth Index Score (0-100) based on engagement factors
   */
  calculateWarmthScore(behaviorData: LeadBehaviorData): WarmthScore {
    // Validate input
    if (!behaviorData || typeof behaviorData !== 'object') {
      throw new ValidationError('behaviorData is required and must be an object', 'behaviorData', behaviorData);
    }

    let score = 0;
    const scoreBreakdown: Record<string, number> = {};

    try {
      // Time on site scoring - normalized to 5 minutes baseline
      const timeScore = Math.min(
        this.warmthFactors.time_on_site_weight,
        (Math.max(0, behaviorData.total_time_on_site) / 300) * this.warmthFactors.time_on_site_weight
      );
      score += timeScore;
      scoreBreakdown.timeScore = timeScore;

      // Repeat visits scoring - normalized to 5 visits baseline
      const visitScore = Math.min(
        this.warmthFactors.repeat_visits_weight,
        (Math.max(0, behaviorData.visits_last_14_days) / 5) * this.warmthFactors.repeat_visits_weight
      );
      score += visitScore;
      scoreBreakdown.visitScore = visitScore;

      // Form completion scoring - direct percentage
      const formScore = Math.max(0, Math.min(1, behaviorData.form_completion_rate)) * this.warmthFactors.form_completion_weight;
      score += formScore;
      scoreBreakdown.formScore = formScore;

      // Retargeting interaction scoring - capped at factor weight
      const retargetScore = Math.min(
        this.warmthFactors.retargeting_weight,
        Math.max(0, behaviorData.retargeting_interactions) * (this.warmthFactors.retargeting_weight / 10)
      );
      score += retargetScore;
      scoreBreakdown.retargetScore = retargetScore;

      // Scroll depth scoring - percentage based
      const scrollScore = (Math.max(0, Math.min(100, behaviorData.max_scroll_depth)) / 100) * this.warmthFactors.scroll_depth_weight;
      score += scrollScore;
      scoreBreakdown.scrollScore = scrollScore;

      // Email engagement scoring - normalized to 5 emails baseline
      const emailScore = Math.min(
        this.warmthFactors.email_engagement_weight,
        (Math.max(0, behaviorData.emails_opened) / 5) * this.warmthFactors.email_engagement_weight
      );
      score += emailScore;
      scoreBreakdown.emailScore = emailScore;

      // Pricing page time scoring - normalized to 45 seconds baseline
      const pricingScore = Math.min(
        this.warmthFactors.pricing_page_weight,
        (Math.max(0, behaviorData.time_on_pricing_page) / 45) * this.warmthFactors.pricing_page_weight
      );
      score += pricingScore;
      scoreBreakdown.pricingScore = pricingScore;

      // Quote intent scoring - high value action
      const quoteScore = Math.min(
        this.warmthFactors.quote_intent_weight,
        Math.max(0, behaviorData.quote_clicks_no_submit) * (this.warmthFactors.quote_intent_weight / 3)
      );
      score += quoteScore;
      scoreBreakdown.quoteScore = quoteScore;

    } catch (error) {
      console.error('Error calculating warmth score:', error);
      throw new ValidationError('Failed to calculate warmth score', 'behaviorData', error);
    }

    // Ensure score is within valid range
    const finalScore = Math.round(Math.min(VALIDATION_LIMITS.WARMTH_SCORE_MAX, Math.max(VALIDATION_LIMITS.WARMTH_SCORE_MIN, score)));

    // Log score breakdown for debugging (in development)
    if (process.env.NODE_ENV === 'development') {
      console.debug('Warmth score breakdown:', { finalScore, scoreBreakdown, behaviorData });
    }

    return finalScore as WarmthScore;
  }

  /**
   * ⚔️ SEIZURE TRIGGERS - "Operation Snapback"
   * Triggers smart reconversion campaigns based on Warmth Index
   */
  async planSeizureCampaign(lead: WarmLeadProfile): Promise<readonly SeizureAction[]> {
    // Validate input
    if (!lead || typeof lead !== 'object') {
      throw new ValidationError('lead is required and must be an object', 'lead', lead);
    }

    if (typeof lead.warmth_score !== 'number' || lead.warmth_score < 0 || lead.warmth_score > 100) {
      throw new ValidationError('Invalid warmth score', 'lead.warmth_score', lead.warmth_score);
    }

    if (!lead.id || typeof lead.id !== 'string') {
      throw new ValidationError('lead.id is required', 'lead.id', lead.id);
    }

    const actions: SeizureAction[] = [];
    const currentTime = new Date().toISOString();

    // Check qualification threshold
    if (lead.warmth_score < VALIDATION_LIMITS.QUALIFICATION_THRESHOLD) {
      return Object.freeze(actions); // Not qualified for seizure
    }

    try {
      // Day 1: Personalized email
      actions.push({
        id: this.generateActionId(),
        type: 'email',
        trigger_day: 1,
        content: this.generatePersonalizedEmail(lead),
        status: 'pending',
        created_at: currentTime
      });

      // Day 2: Retargeted short-form ad
      actions.push({
        id: this.generateActionId(),
        type: 'ad',
        trigger_day: 2,
        content: this.generateRetargetingAd(lead),
        status: 'pending',
        created_at: currentTime
      });

      // Day 3: Social proof injection
      actions.push({
        id: this.generateActionId(),
        type: 'email',
        trigger_day: 3,
        content: this.generateSocialProofEmail(lead),
        status: 'pending',
        created_at: currentTime
      });

      // Day 5: Discount or priority slot offer
      actions.push({
        id: this.generateActionId(),
        type: 'email',
        trigger_day: 5,
        content: this.generateUrgencyOffer(lead),
        status: 'pending',
        created_at: currentTime
      });

      // High-value leads get SMS and chat triggers
      if (lead.warmth_score >= VALIDATION_LIMITS.HIGH_VALUE_THRESHOLD) {
        // Only add SMS if phone number is available
        if (lead.phone) {
          actions.push({
            id: this.generateActionId(),
            type: 'sms',
            trigger_day: 1,
            content: this.generateWarmSMS(lead),
            status: 'pending',
            created_at: currentTime
          });
        }

        // Immediate chat prompt for high-value leads
        actions.push({
          id: this.generateActionId(),
          type: 'chat',
          trigger_day: 0, // Immediate
          content: this.generateChatPrompt(lead),
          status: 'pending',
          created_at: currentTime
        });
      }

    } catch (error) {
      console.error('Error planning seizure campaign:', error);
      throw new ValidationError('Failed to plan seizure campaign', 'lead', error);
    }

    // Validate all actions before returning
    for (const action of actions) {
      if (!action.content || action.content.length > VALIDATION_LIMITS.MAX_CONTENT_LENGTH) {
        throw new ValidationError('Invalid action content', 'action.content', action.content?.length);
      }
    }

    return Object.freeze(actions);
  }

  /**
   * 🧬 CONVERSION INFRASTRUCTURE - "The Closer Grid"
   * Generates conversion-optimized content and landing pages
   */
  generateCloserGrid(lead: WarmLeadProfile): Readonly<{
    landing_page_url: string;
    testimonials: readonly unknown[];
    scarcity_countdown: Readonly<{ message: string; expires_at: string }>;
    calendar_booking: Readonly<{ calendar_url: string; priority_booking: boolean }>;
    case_studies: readonly unknown[];
    auto_dialer_trigger: boolean;
    generated_at: string;
  }> {
    // Validate input
    if (!lead || typeof lead !== 'object') {
      throw new ValidationError('lead is required and must be an object', 'lead', lead);
    }

    if (!lead.id || typeof lead.id !== 'string') {
      throw new ValidationError('lead.id is required', 'lead.id', lead.id);
    }

    try {
      return Object.freeze({
        landing_page_url: this.generatePersonalizedLandingPage(lead),
        testimonials: Object.freeze(this.getRelevantTestimonials(lead)),
        scarcity_countdown: Object.freeze(this.generateScarcityCountdown()),
        calendar_booking: Object.freeze(this.getCalendarBookingWidget(lead)),
        case_studies: Object.freeze(this.generateAICaseStudies(lead)),
        auto_dialer_trigger: lead.warmth_score >= VALIDATION_LIMITS.HIGH_VALUE_THRESHOLD && this.shouldTriggerAutoDialer(lead),
        generated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error generating closer grid:', error);
      throw new ValidationError('Failed to generate closer grid', 'lead', error);
    }
  }

  // Helper methods for content generation
  private analyzeWarmSignals(data: unknown): {
    readonly isWarm: boolean;
    readonly signals: Readonly<Record<string, boolean>>;
    readonly signalCount: number;
  } {
    // Validate input
    if (!data || typeof data !== 'object') {
      return { isWarm: false, signals: Object.freeze({}), signalCount: 0 };
    }

    const typedData = data as Record<string, unknown>;

    const signals = Object.freeze({
      pricingPageTime: typeof typedData.time_on_pricing_page === 'number' && typedData.time_on_pricing_page > 45,
      quoteClickNoSubmit: typeof typedData.quote_clicks_no_submit === 'number' && typedData.quote_clicks_no_submit > 0,
      emailEngagement: typeof typedData.emails_opened === 'number' && typedData.emails_opened > 2,
      adClickNoConversion: typeof typedData.ad_clicks_no_conversion === 'number' && typedData.ad_clicks_no_conversion > 0,
      repeatVisitor: typeof typedData.visits_last_14_days === 'number' && typedData.visits_last_14_days > 1,
      highFormCompletion: typeof typedData.form_completion_rate === 'number' && typedData.form_completion_rate > 0.5,
      deepScrolling: typeof typedData.max_scroll_depth === 'number' && typedData.max_scroll_depth > 80
    });

    const warmSignalCount = Object.values(signals).filter(Boolean).length;

    return Object.freeze({
      isWarm: warmSignalCount >= 2, // Require at least 2 warm signals
      signals,
      signalCount: warmSignalCount
    });
  }

  private extractBehaviorData(data: unknown): LeadBehaviorData {
    // This method should use the sanitized data from sanitizeBehaviorData
    // It's kept for backward compatibility but should be called after sanitization
    if (!data || typeof data !== 'object') {
      throw new ValidationError('Behavior data must be an object', 'data', data);
    }

    const typedData = data as Record<string, unknown>;

    return Object.freeze({
      time_on_pricing_page: typeof typedData.time_on_pricing_page === 'number' ? typedData.time_on_pricing_page : 0,
      quote_clicks_no_submit: typeof typedData.quote_clicks_no_submit === 'number' ? typedData.quote_clicks_no_submit : 0,
      emails_opened: typeof typedData.emails_opened === 'number' ? typedData.emails_opened : 0,
      calls_not_booked: typeof typedData.calls_not_booked === 'number' ? typedData.calls_not_booked : 0,
      ad_clicks_no_conversion: typeof typedData.ad_clicks_no_conversion === 'number' ? typedData.ad_clicks_no_conversion : 0,
      total_time_on_site: typeof typedData.total_time_on_site === 'number' ? typedData.total_time_on_site : 0,
      visits_last_14_days: typeof typedData.visits_last_14_days === 'number' ? typedData.visits_last_14_days : 1,
      form_completion_rate: typeof typedData.form_completion_rate === 'number' ? typedData.form_completion_rate : 0,
      retargeting_interactions: typeof typedData.retargeting_interactions === 'number' ? typedData.retargeting_interactions : 0,
      max_scroll_depth: typeof typedData.max_scroll_depth === 'number' ? typedData.max_scroll_depth : 0,
      pages_visited: Array.isArray(typedData.pages_visited) ? Object.freeze(typedData.pages_visited as string[]) : Object.freeze([]),
      utm_source: typeof typedData.utm_source === 'string' ? typedData.utm_source : null,
      utm_campaign: typeof typedData.utm_campaign === 'string' ? typedData.utm_campaign : null,
      referrer: typeof typedData.referrer === 'string' ? typedData.referrer : null,
      device_type: this.validateDeviceType(typedData.device_type),
      location: typeof typedData.location === 'string' ? typedData.location : null,
      ip_address: typeof typedData.ip_address === 'string' ? typedData.ip_address : null,
      user_agent: typeof typedData.user_agent === 'string' ? typedData.user_agent : null
    });
  }

  private validateDeviceType(deviceType: unknown): DeviceType {
    const validTypes: DeviceType[] = ['desktop', 'mobile', 'tablet', 'unknown'];
    return validTypes.includes(deviceType as DeviceType) ? (deviceType as DeviceType) : 'unknown';
  }

  private generateLeadId(): string {
    // Use crypto.randomUUID if available, fallback to timestamp + random
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return `wl_${crypto.randomUUID()}`;
    }

    // Fallback for environments without crypto.randomUUID
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 15);
    const extraRandom = Math.random().toString(36).substring(2, 15);
    return `wl_${timestamp}_${randomPart}_${extraRandom}`;
  }

  private generateActionId(): string {
    // Use crypto.randomUUID if available, fallback to timestamp + random
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return `sa_${crypto.randomUUID()}`;
    }

    // Fallback for environments without crypto.randomUUID
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 15);
    const extraRandom = Math.random().toString(36).substring(2, 15);
    return `sa_${timestamp}_${randomPart}_${extraRandom}`;
  }

  private generatePersonalizedEmail(lead: WarmLeadProfile): string {
    // Sanitize inputs to prevent injection
    const company = this.sanitizeText(lead.company || 'your business', 50) || 'your business';
    const pagesVisited = lead.behavior_data.pages_visited
      .slice(0, 3) // Limit to 3 pages
      .map(page => this.sanitizeText(page, 50))
      .filter(Boolean)
      .join(', ') || 'our website';

    // Use template with safe interpolation
    return `Hi there! I noticed you were checking out ${company} and visited ${pagesVisited}. Still looking for the right solution? I'd love to help you get exactly what you need. Reply to this email and I'll personally make sure you get priority attention.`;
  }

  private generateRetargetingAd(lead: WarmLeadProfile): string {
    return `Still thinking it over? Get your personalized quote in 60 seconds - no forms, no hassle. Click to continue where you left off.`;
  }

  private generateSocialProofEmail(lead: WarmLeadProfile): string {
    return `Here's what other businesses in ${lead.behavior_data.location || 'your area'} are saying about working with us... [Include testimonials and before/after results]`;
  }

  private generateUrgencyOffer(lead: WarmLeadProfile): string {
    return `Last chance: We have 2 priority slots left this month. Book now and save 15% on your project. This offer expires in 48 hours.`;
  }

  private generateWarmSMS(lead: WarmLeadProfile): string {
    return `Hey! Still need that quote? Skip the forms - just reply YES and I'll call you in 5 minutes with your personalized pricing.`;
  }

  private generateChatPrompt(lead: WarmLeadProfile): string {
    return `Still looking for a quote? I can get you personalized pricing in 2 minutes - no forms required!`;
  }

  private generatePersonalizedLandingPage(lead: WarmLeadProfile): string {
    return `/warm-lead-lp/${lead.id}?utm_source=seizure&warmth=${lead.warmth_score}`;
  }

  private getRelevantTestimonials(lead: WarmLeadProfile): any[] {
    // Return testimonials based on lead's location, industry, or behavior
    return [];
  }

  private generateScarcityCountdown(): any {
    return {
      message: "Only 2 slots left this month",
      expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
    };
  }

  private getCalendarBookingWidget(lead: WarmLeadProfile): any {
    return {
      calendar_url: `/book-call?lead_id=${lead.id}`,
      priority_booking: lead.warmth_score >= 85
    };
  }

  private generateAICaseStudies(lead: WarmLeadProfile): any[] {
    // Generate relevant case studies based on lead behavior
    return [];
  }

  private shouldTriggerAutoDialer(lead: WarmLeadProfile): boolean {
    const daysSinceDetection = Math.floor(
      (Date.now() - new Date(lead.first_detected).getTime()) / (1000 * 60 * 60 * 24)
    );

    return daysSinceDetection >= 3 && lead.phone && lead.seizure_history.length > 0;
  }

  /**
   * Sanitize and validate behavior data input
   */
  private sanitizeBehaviorData(data: any): any {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid behavior data: must be an object');
    }

    // Email validation and sanitization
    const email = data.email ? this.sanitizeEmail(data.email) : undefined;

    // Phone validation and sanitization
    const phone = data.phone ? this.sanitizePhone(data.phone) : undefined;

    // Company name sanitization
    const company = data.company ? this.sanitizeText(data.company, 100) : undefined;

    // Source validation
    const allowedSources = ['website', 'google_ads', 'facebook_ads', 'linkedin', 'organic', 'referral', 'direct'];
    const source = allowedSources.includes(data.source) ? data.source : 'website';

    // Numeric field validation
    const numericFields = [
      'time_on_pricing_page', 'quote_clicks_no_submit', 'emails_opened',
      'calls_not_booked', 'ad_clicks_no_conversion', 'total_time_on_site',
      'visits_last_14_days', 'retargeting_interactions', 'max_scroll_depth'
    ];

    const sanitizedNumericData: any = {};
    for (const field of numericFields) {
      const value = data[field];
      if (typeof value === 'number' && !isNaN(value) && value >= 0 && value <= 10000) {
        sanitizedNumericData[field] = Math.floor(value);
      } else {
        sanitizedNumericData[field] = 0;
      }
    }

    // Form completion rate validation (0-1)
    const form_completion_rate = typeof data.form_completion_rate === 'number' &&
      data.form_completion_rate >= 0 && data.form_completion_rate <= 1
      ? data.form_completion_rate : 0;

    // Pages visited sanitization
    const pages_visited = Array.isArray(data.pages_visited)
      ? data.pages_visited.slice(0, 20).map((page: any) => this.sanitizeUrl(page)).filter(Boolean)
      : [];

    // Device type validation
    const allowedDeviceTypes = ['desktop', 'mobile', 'tablet'];
    const device_type = allowedDeviceTypes.includes(data.device_type) ? data.device_type : 'desktop';

    // Location sanitization
    const location = data.location ? this.sanitizeText(data.location, 100) : undefined;

    // UTM parameters sanitization
    const utm_source = data.utm_source ? this.sanitizeText(data.utm_source, 50) : undefined;
    const utm_campaign = data.utm_campaign ? this.sanitizeText(data.utm_campaign, 100) : undefined;
    const referrer = data.referrer ? this.sanitizeUrl(data.referrer) : undefined;

    return {
      email,
      phone,
      company,
      source,
      ...sanitizedNumericData,
      form_completion_rate,
      pages_visited,
      device_type,
      location,
      utm_source,
      utm_campaign,
      referrer,
      last_activity: data.last_activity || new Date().toISOString()
    };
  }

  private sanitizeEmail(email: string): string | undefined {
    if (typeof email !== 'string') return undefined;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedEmail.length > 254 || !emailRegex.test(trimmedEmail)) {
      return undefined;
    }

    return trimmedEmail;
  }

  private sanitizePhone(phone: string): string | undefined {
    if (typeof phone !== 'string') return undefined;

    // Remove all non-digit characters except + and -
    const cleanPhone = phone.replace(/[^\d+\-\s()]/g, '');

    if (cleanPhone.length < 7 || cleanPhone.length > 20) {
      return undefined;
    }

    return cleanPhone;
  }

  private sanitizeText(text: string, maxLength: number): string | undefined {
    if (typeof text !== 'string') return undefined;

    // Remove potentially dangerous characters and trim
    const sanitized = text
      .replace(/[<>\"'&]/g, '') // Remove HTML/script injection chars
      .trim()
      .substring(0, maxLength);

    return sanitized.length > 0 ? sanitized : undefined;
  }

  private sanitizeUrl(url: string): string | undefined {
    if (typeof url !== 'string') return undefined;

    try {
      // Only allow http/https URLs
      if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
        return undefined;
      }

      // Limit URL length
      if (url.length > 2048) {
        return undefined;
      }

      return url;
    } catch {
      return undefined;
    }
  }
}
