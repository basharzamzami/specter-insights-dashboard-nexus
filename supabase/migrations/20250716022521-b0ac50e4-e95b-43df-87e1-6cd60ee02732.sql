-- Insert realistic dummy data for email templates
INSERT INTO public.email_templates (name, subject, content, template_type, user_id) VALUES
('Welcome New Users', 'Welcome to our platform!', '<h1>Welcome!</h1><p>Thank you for joining our platform. We are excited to have you on board!</p><p>Get started by exploring our features and setting up your profile.</p><p>Best regards,<br>The Team</p>', 'welcome', 'demo-user'),
('Monthly Newsletter', 'Your Monthly Update - Latest Industry Insights', '<h1>Monthly Newsletter</h1><p>Here are the latest trends and insights from our industry experts.</p><ul><li>Market Analysis: 25% growth in AI adoption</li><li>New Feature: Advanced Analytics Dashboard</li><li>Customer Success Story: TechCorp increases efficiency by 40%</li></ul>', 'newsletter', 'demo-user'),
('Product Launch', 'Introducing Our New Features!', '<h1>New Features Available Now!</h1><p>We are excited to announce new powerful features that will transform your workflow.</p><p>Key highlights:</p><ul><li>AI-powered competitor analysis</li><li>Real-time market intelligence</li><li>Advanced automation tools</li></ul><p>Upgrade today and experience the difference!</p>', 'promotional', 'demo-user'),
('Follow Up Email', 'Did you see our latest update?', '<h1>Following Up</h1><p>We wanted to make sure you saw our recent announcement about new features.</p><p>Many customers have already reported significant improvements in their workflow efficiency.</p><p>Would you like to schedule a demo call?</p>', 'follow_up', 'demo-user'),
('Onboarding Series #1', 'Getting Started - Your First Steps', '<h1>Welcome to Day 1!</h1><p>Let us guide you through your first steps on our platform.</p><p>Today, we will cover:</p><ul><li>Setting up your dashboard</li><li>Configuring your first campaign</li><li>Understanding analytics</li></ul>', 'general', 'demo-user');

-- Insert realistic dummy data for email campaigns  
INSERT INTO public.email_campaigns (name, subject, content, recipient_count, sent_count, opened_count, clicked_count, status, scheduled_at, sent_at, user_id) VALUES
('Q1 Product Launch Campaign', 'Revolutionary AI Tools Now Available', 'Introducing our groundbreaking AI-powered business intelligence suite...', 2847, 2847, 1623, 487, 'sent', NULL, '2024-07-10 09:00:00+00', 'demo-user'),
('Weekly Newsletter #28', 'Weekly Market Intelligence Update', 'This week in competitive intelligence: major shifts in the SaaS landscape...', 3521, 3521, 2114, 634, 'sent', NULL, '2024-07-12 08:00:00+00', 'demo-user'),
('Summer Promotion 2024', 'Limited Time: 30% Off All Premium Features', 'Supercharge your competitive advantage with our summer promotion...', 1892, 1892, 1324, 198, 'sent', NULL, '2024-07-08 10:00:00+00', 'demo-user'),
('Customer Success Stories', 'How TechCorp Increased Revenue by 45%', 'Discover how leading companies are leveraging our platform...', 4156, 4156, 2327, 895, 'sent', NULL, '2024-07-05 14:00:00+00', 'demo-user'),
('Feature Announcement', 'New: Real-time Competitor Tracking', 'Get instant alerts when competitors make strategic moves...', 2945, 2945, 1856, 524, 'sent', NULL, '2024-07-03 11:00:00+00', 'demo-user'),
('Upcoming Webinar', 'Join Our Exclusive Webinar: AI in Business Intelligence', 'Reserve your spot for our upcoming live session...', 1567, 0, 0, 0, 'scheduled', '2024-07-20 15:00:00+00', NULL, 'demo-user'),
('Monthly Report', 'Your July Performance Summary', 'Here is your comprehensive monthly performance analysis...', 892, 0, 0, 0, 'scheduled', '2024-07-25 09:00:00+00', NULL, 'demo-user');

-- Insert realistic dummy data for social media posts
INSERT INTO public.social_posts (platform, content, scheduled_at, published_at, status, engagement_metrics, user_id) VALUES
('linkedin', 'Excited to share our latest insights on AI-driven competitive analysis. The future of business intelligence is here! 🚀 #AI #BusinessIntelligence #CompetitiveAnalysis', NULL, '2024-07-15 09:00:00+00', 'published', '{"likes": 156, "comments": 23, "shares": 34, "views": 2847}', 'demo-user'),
('twitter', 'Just published: How to identify competitor weaknesses using AI 🧠 \n\nKey takeaways:\n✅ Real-time sentiment analysis\n✅ Market positioning insights\n✅ Strategic opportunity mapping\n\nRead more: bit.ly/ai-competitor-analysis', NULL, '2024-07-14 14:30:00+00', 'published', '{"likes": 89, "comments": 12, "shares": 45, "views": 1234}', 'demo-user'),
('instagram', 'Behind the scenes at our AI lab 🔬 Our data scientists are working on revolutionary new features that will change how businesses understand their competition. Stay tuned! #BehindTheScenes #AI #Innovation', NULL, '2024-07-13 11:00:00+00', 'published', '{"likes": 234, "comments": 18, "shares": 12, "views": 3456}', 'demo-user'),
('facebook', 'CASE STUDY: How TechCorp increased their market share by 25% using our competitive intelligence platform 📈\n\nKey strategies:\n• Real-time competitor monitoring\n• AI-powered market analysis\n• Strategic opportunity identification\n\nInterested in similar results? Let''s talk!', NULL, '2024-07-12 16:00:00+00', 'published', '{"likes": 67, "comments": 8, "shares": 15, "views": 892}', 'demo-user'),
('linkedin', 'The competitive landscape is evolving faster than ever. Companies that leverage AI for market intelligence are seeing 40% better strategic outcomes. Are you keeping up? 💡', NULL, '2024-07-11 10:30:00+00', 'published', '{"likes": 198, "comments": 31, "shares": 52, "views": 4123}', 'demo-user'),
('twitter', 'New feature alert! 🚨 Real-time competitor pricing tracking is now live. Get instant notifications when competitors change their pricing strategy. Game-changer! 💰', NULL, '2024-07-10 13:00:00+00', 'published', '{"likes": 143, "comments": 28, "shares": 67, "views": 2156}', 'demo-user'),
('youtube', 'NEW VIDEO: "5 Competitor Analysis Mistakes That Are Costing You Customers" - Watch now to avoid these common pitfalls and gain a competitive edge! Link in bio 📺', '2024-07-18 15:00:00+00', NULL, 'scheduled', '{}', 'demo-user'),
('linkedin', 'Thrilled to announce our partnership with leading industry experts to bring you the most comprehensive competitive intelligence platform. Big things coming! 🤝', '2024-07-19 12:00:00+00', NULL, 'scheduled', '{}', 'demo-user'),
('instagram', 'Customer spotlight: Meet Sarah, Head of Strategy at InnovateCorp, who discovered 3 new market opportunities in just one week using our platform! 🌟 #CustomerSpotlight #Success', '2024-07-17 14:00:00+00', NULL, 'scheduled', '{}', 'demo-user');

-- Insert more realistic appointments
INSERT INTO public.appointments (title, description, start_time, end_time, status, location, meeting_link, user_id) VALUES
('Strategy Session with TechCorp', 'Quarterly business review and competitive positioning discussion', '2024-07-18 10:00:00+00', '2024-07-18 11:30:00+00', 'scheduled', 'Conference Room A', 'https://meet.google.com/abc-defg-hij', 'demo-user'),
('Product Demo - DataSolutions', 'Showcase new AI analytics features to potential enterprise client', '2024-07-19 14:00:00+00', '2024-07-19 15:00:00+00', 'scheduled', 'Virtual', 'https://zoom.us/j/123456789', 'demo-user'),
('Competitive Analysis Workshop', 'Internal team training on advanced competitive intelligence methods', '2024-07-22 09:00:00+00', '2024-07-22 12:00:00+00', 'scheduled', 'Training Room B', NULL, 'demo-user'),
('Client Onboarding - FinanceFirst', 'Initial setup and configuration session for new enterprise client', '2024-07-23 13:30:00+00', '2024-07-23 15:00:00+00', 'scheduled', 'Virtual', 'https://meet.google.com/xyz-uvw-rst', 'demo-user'),
('Market Research Review', 'Weekly review of market trends and competitor activities', '2024-07-24 16:00:00+00', '2024-07-24 17:00:00+00', 'scheduled', 'Conference Room C', NULL, 'demo-user'),
('Partnership Discussion - AIVentures', 'Exploring strategic partnership opportunities in AI market', '2024-07-25 11:00:00+00', '2024-07-25 12:30:00+00', 'scheduled', 'Executive Boardroom', NULL, 'demo-user'),
('Customer Success Check-in', 'Monthly check-in with high-value client to ensure satisfaction', '2024-07-26 10:30:00+00', '2024-07-26 11:30:00+00', 'scheduled', 'Virtual', 'https://teams.microsoft.com/l/meetup-join/19%3a...', 'demo-user');

-- Insert more realistic tasks
INSERT INTO public.tasks (title, description, status, priority, due_date, user_id) VALUES
('Analyze competitor pricing strategy', 'Deep dive analysis of top 5 competitors pricing models and identify opportunities', 'in_progress', 'high', '2024-07-20 17:00:00+00', 'demo-user'),
('Prepare Q3 market intelligence report', 'Compile comprehensive quarterly report on market trends and competitive landscape', 'pending', 'high', '2024-07-25 17:00:00+00', 'demo-user'),
('Update competitor profiles database', 'Refresh all competitor profiles with latest product updates and strategic moves', 'in_progress', 'medium', '2024-07-22 17:00:00+00', 'demo-user'),
('Review social media sentiment analysis', 'Analyze sentiment trends for our brand and top competitors across all platforms', 'pending', 'medium', '2024-07-19 17:00:00+00', 'demo-user'),
('Optimize email campaign performance', 'A/B test subject lines and content to improve open and click rates', 'pending', 'low', '2024-07-28 17:00:00+00', 'demo-user'),
('Conduct market positioning workshop', 'Lead internal workshop on competitive positioning and differentiation strategies', 'pending', 'high', '2024-07-30 17:00:00+00', 'demo-user'),
('Research emerging market trends', 'Identify and analyze emerging trends that could impact our competitive position', 'completed', 'medium', '2024-07-15 17:00:00+00', 'demo-user'),
('Update competitor tracking dashboard', 'Enhance real-time dashboard with new metrics and visualization improvements', 'in_progress', 'medium', '2024-07-24 17:00:00+00', 'demo-user'),
('Prepare client presentation materials', 'Create compelling presentation showcasing competitive intelligence ROI for prospects', 'pending', 'high', '2024-07-21 17:00:00+00', 'demo-user'),
('Audit competitor SEO strategies', 'Comprehensive audit of competitor SEO tactics and keyword strategies', 'pending', 'low', '2024-08-05 17:00:00+00', 'demo-user');

-- Insert more realistic deals 
INSERT INTO public.deals (title, value, stage, probability, contact_id, description, expected_close_date, status, user_id) VALUES
('TechCorp Enterprise License', 125000, 'Proposal', 75, (SELECT id FROM contacts LIMIT 1), 'Multi-year enterprise license for competitive intelligence platform with advanced AI features', '2024-08-15', 'open', 'demo-user'),
('DataSolutions Premium Package', 85000, 'Negotiation', 90, (SELECT id FROM contacts LIMIT 1 OFFSET 1), 'Premium package including real-time monitoring and custom analytics dashboard', '2024-07-30', 'open', 'demo-user'),
('FinanceFirst Starter Plan', 35000, 'Qualified', 60, (SELECT id FROM contacts LIMIT 1 OFFSET 2), 'Annual subscription for competitive market analysis and reporting tools', '2024-08-20', 'open', 'demo-user'),
('InnovateCorp Custom Solution', 180000, 'Proposal', 80, (SELECT id FROM contacts LIMIT 1 OFFSET 3), 'Custom competitive intelligence solution with API integration and dedicated support', '2024-09-10', 'open', 'demo-user'),
('StartupTech Growth Plan', 45000, 'Discovery', 40, (SELECT id FROM contacts LIMIT 1 OFFSET 4), 'Growth plan subscription with social media monitoring and brand analysis', '2024-08-25', 'open', 'demo-user'),
('GlobalCorp Strategic Package', 250000, 'Negotiation', 85, (SELECT id FROM contacts LIMIT 1), 'Strategic package with global market intelligence and executive reporting', '2024-08-05', 'open', 'demo-user'),
('AgencyCorp Team License', 65000, 'Qualified', 70, (SELECT id FROM contacts LIMIT 1 OFFSET 1), 'Team license for digital marketing agency with client reporting features', '2024-09-01', 'open', 'demo-user'),
('RetailChain Analytics Suite', 95000, 'Proposal', 65, (SELECT id FROM contacts LIMIT 1 OFFSET 2), 'Retail-focused analytics suite with competitor pricing and promotion tracking', '2024-08-18', 'open', 'demo-user'),
('ConsultingFirm Partnership', 320000, 'Discovery', 45, (SELECT id FROM contacts LIMIT 1 OFFSET 3), 'Strategic partnership deal with revenue sharing for white-label solution', '2024-09-30', 'open', 'demo-user'),
('EcommercePlus Standard Plan', 28000, 'Closed Won', 100, (SELECT id FROM contacts LIMIT 1 OFFSET 4), 'Standard plan with ecommerce competitor tracking and price monitoring', '2024-07-10', 'closed', 'demo-user');

-- Update contacts with more realistic lead scores and information
UPDATE public.contacts SET 
  lead_score = CASE 
    WHEN id = (SELECT id FROM contacts LIMIT 1) THEN 95
    WHEN id = (SELECT id FROM contacts LIMIT 1 OFFSET 1) THEN 88
    WHEN id = (SELECT id FROM contacts LIMIT 1 OFFSET 2) THEN 72
    WHEN id = (SELECT id FROM contacts LIMIT 1 OFFSET 3) THEN 91
    WHEN id = (SELECT id FROM contacts LIMIT 1 OFFSET 4) THEN 67
    ELSE FLOOR(RANDOM() * 40 + 50)
  END,
  lead_status = CASE 
    WHEN RANDOM() < 0.3 THEN 'hot'
    WHEN RANDOM() < 0.6 THEN 'warm'
    ELSE 'cold'
  END,
  last_contacted_at = NOW() - (RANDOM() * INTERVAL '30 days')
WHERE user_id IS NOT NULL;