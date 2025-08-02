# 🚀 Real API Integration Setup Guide

## Phase 1: SEMrush API Integration ✅ IMPLEMENTED

### 1. Get SEMrush API Key

1. **Sign up for SEMrush API**: https://www.semrush.com/api-documentation/
2. **Choose a plan**: 
   - **Starter**: $83/month - 3,000 API units/day
   - **Guru**: $166/month - 5,000 API units/day  
   - **Business**: $333/month - 10,000 API units/day

3. **Get your API key** from the SEMrush dashboard

### 2. Configure Environment Variables

Add to your Supabase Edge Functions environment:

```bash
# In Supabase Dashboard > Edge Functions > Environment Variables
SEMRUSH_API_KEY=your_semrush_api_key_here
```

Or locally in `.env`:
```bash
SEMRUSH_API_KEY=your_semrush_api_key_here
```

### 3. Test the Integration

The system will automatically:
- ✅ Try SEMrush API first (if key is available)
- ✅ Fall back to simulated data (if API fails)
- ✅ Log which data source is being used

### 4. What's Now Real vs Simulated

**✅ REAL DATA (when API key is configured):**
- Organic traffic numbers
- Keyword rankings and search volumes
- Backlink counts and authority scores
- Competitor keyword analysis
- Domain authority metrics

**⚠️ STILL SIMULATED:**
- Social media metrics
- Ad intelligence data
- Review sentiment analysis
- Technology stack detection

---

## Phase 2: Facebook Ads Library API ✅ IMPLEMENTED

### 1. Get Facebook Access Token

1. **Go to Facebook Developers**: https://developers.facebook.com/
2. **Create a new app** or use existing app
3. **Add Marketing API** product to your app
4. **Generate Access Token**:
   - Go to Tools > Graph API Explorer
   - Select your app
   - Add permissions: `ads_read`, `pages_read_engagement`
   - Generate token and make it long-lived

5. **Get your access token** from the Graph API Explorer

### 2. Configure Environment Variables

Add to your Supabase Edge Functions environment:

```bash
# In Supabase Dashboard > Edge Functions > Environment Variables
FACEBOOK_ACCESS_TOKEN=your_facebook_access_token_here
```

Or locally in `.env`:
```bash
FACEBOOK_ACCESS_TOKEN=your_facebook_access_token_here
```

### 3. Test the Integration

The system will automatically:
- ✅ Try Facebook Ads Library API first (if token is available)
- ✅ Fall back to simulated data (if API fails)
- ✅ Log which data source is being used

### 4. What's Now Real vs Simulated

**✅ REAL DATA (when access token is configured):**
- Actual competitor Facebook and Instagram ads
- Real ad creative content (text, titles, descriptions)
- Actual spend estimates and impressions
- Real campaign durations and status
- Platform targeting information
- Page names and ad snapshot URLs

**⚠️ STILL SIMULATED:**
- Google Ads data
- Social media metrics (followers, engagement)
- Review sentiment analysis
- Technology stack detection

---

## Phase 3: Next API Integrations (Coming Soon)

### Google Places API  
- **Cost**: $5 per 1,000 requests
- **Setup**: Google Cloud Platform account
- **Data**: Real business reviews and ratings

### Social Media APIs
- **Twitter API**: $100/month for basic access
- **LinkedIn API**: Free (requires app approval)
- **Instagram Basic Display**: Free

---

## 🔧 Implementation Status

### ✅ Completed
- [x] SEMrush API service class
- [x] Real SEO data integration
- [x] Facebook Ads Library API service class
- [x] Real competitor ad data integration
- [x] Fallback to simulated data for both APIs
- [x] Error handling and logging
- [x] Database schema compatibility
- [x] Test functions for both APIs

### 🚧 In Progress
- [ ] Google Places API integration
- [ ] Social media APIs integration

### 📋 Planned
- [ ] Web scraping infrastructure
- [ ] Sentiment analysis with OpenAI
- [ ] Data caching and optimization
- [ ] Cost monitoring and alerts

---

## 💰 Cost Estimation

### Monthly API Costs (Estimated)
- **SEMrush API**: $83-333/month
- **Google Places API**: ~$50/month (10K requests)
- **Twitter API**: $100/month
- **OpenAI API**: ~$20-100/month
- **Total**: ~$253-583/month for full real data

### ROI Considerations
- Real data = better insights = higher customer value
- Can charge premium pricing for real intelligence
- Competitive advantage over demo-data competitors

---

## 🚀 Quick Start

1. **Get SEMrush API key** (start with Starter plan)
2. **Add to Supabase environment variables**
3. **Deploy updated functions**
4. **Test with real competitor domains**
5. **Monitor API usage and costs**

The system is designed to gracefully handle API failures and provide value even with partial real data integration.
