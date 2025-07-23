-- Remove all demo/dummy data from production database
-- This migration cleans up all placeholder data to prepare for real user data

-- Remove dummy contacts with fake user IDs
DELETE FROM public.contacts 
WHERE user_id IN (
  '00000000-0000-0000-0000-000000000001',
  'demo',
  'test'
) OR email LIKE '%@example.com' 
  OR email LIKE '%@demo.com'
  OR email LIKE '%@test.com'
  OR first_name = 'John' AND last_name = 'Doe'
  OR first_name = 'Jane' AND last_name = 'Smith';

-- Remove dummy deals
DELETE FROM public.deals 
WHERE user_id IN (
  '00000000-0000-0000-0000-000000000001',
  'demo',
  'test'
) OR title LIKE '%Demo%'
  OR title LIKE '%Test%'
  OR title LIKE '%Sample%';

-- Remove dummy email templates
DELETE FROM public.email_templates 
WHERE user_id IN (
  '00000000-0000-0000-0000-000000000001',
  'demo',
  'test'
) OR name LIKE '%Demo%'
  OR name LIKE '%Test%'
  OR name LIKE '%Sample%'
  OR subject LIKE '%Demo%'
  OR subject LIKE '%Test%';

-- Remove dummy email campaigns
DELETE FROM public.email_campaigns 
WHERE user_id IN (
  '00000000-0000-0000-0000-000000000001',
  'demo',
  'test'
) OR name LIKE '%Demo%'
  OR name LIKE '%Test%'
  OR name LIKE '%Sample%'
  OR subject LIKE '%Demo%'
  OR subject LIKE '%Test%';

-- Remove dummy tasks
DELETE FROM public.tasks 
WHERE user_id IN (
  '00000000-0000-0000-0000-000000000001',
  'demo',
  'test'
) OR title LIKE '%Demo%'
  OR title LIKE '%Test%'
  OR title LIKE '%Sample%';

-- Remove dummy social posts
DELETE FROM public.social_posts 
WHERE user_id IN (
  '00000000-0000-0000-0000-000000000001',
  'demo',
  'test'
) OR content LIKE '%demo%'
  OR content LIKE '%test%'
  OR content LIKE '%sample%';

-- Remove dummy appointments
DELETE FROM public.appointments 
WHERE user_id IN (
  '00000000-0000-0000-0000-000000000001',
  'demo',
  'test'
) OR title LIKE '%Demo%'
  OR title LIKE '%Test%'
  OR title LIKE '%Sample%';

-- Remove dummy pipelines
DELETE FROM public.pipelines 
WHERE user_id IN (
  '00000000-0000-0000-0000-000000000001',
  'demo',
  'test'
) OR name LIKE '%Demo%'
  OR name LIKE '%Test%'
  OR name LIKE '%Sample%';

-- Remove dummy competitor profiles
DELETE FROM public.competitor_profiles 
WHERE user_id IN (
  '00000000-0000-0000-0000-000000000001',
  'demo',
  'test'
) OR name LIKE '%Demo%'
  OR name LIKE '%Test%'
  OR name LIKE '%Sample%'
  OR website LIKE '%example.com'
  OR website LIKE '%demo.com'
  OR website LIKE '%test.com';

-- Remove dummy campaigns
DELETE FROM public.campaigns 
WHERE created_by IN (
  '00000000-0000-0000-0000-000000000001',
  'demo',
  'test'
) OR target_company LIKE '%Demo%'
  OR target_company LIKE '%Test%'
  OR target_company LIKE '%Sample%';

-- Remove dummy intelligence feeds
DELETE FROM public.intelligence_feeds 
WHERE source LIKE '%demo%'
  OR source LIKE '%test%'
  OR source LIKE '%sample%'
  OR title LIKE '%Demo%'
  OR title LIKE '%Test%'
  OR title LIKE '%Sample%';

-- Remove dummy threat alerts
DELETE FROM public.threat_alerts 
WHERE user_id IN (
  '00000000-0000-0000-0000-000000000001',
  'demo',
  'test'
) OR message LIKE '%demo%'
  OR message LIKE '%test%'
  OR message LIKE '%sample%';

-- Remove dummy campaign recommendations
DELETE FROM public.campaign_recommendations 
WHERE user_id IN (
  '00000000-0000-0000-0000-000000000001',
  'demo',
  'test'
) OR title LIKE '%Demo%'
  OR title LIKE '%Test%'
  OR title LIKE '%Sample%';

-- Remove dummy performance metrics
DELETE FROM public.performance_metrics 
WHERE user_id IN (
  '00000000-0000-0000-0000-000000000001',
  'demo',
  'test'
);

-- Remove dummy competitor tracking data
DELETE FROM public.competitor_tracking 
WHERE created_by IN (
  '00000000-0000-0000-0000-000000000001',
  'demo',
  'test'
) OR domain LIKE '%example.com'
  OR domain LIKE '%demo.com'
  OR domain LIKE '%test.com'
  OR company_name LIKE '%Demo%'
  OR company_name LIKE '%Test%'
  OR company_name LIKE '%Sample%';

-- Remove any remaining dummy users
DELETE FROM public.users 
WHERE id IN (
  '00000000-0000-0000-0000-000000000001',
  'demo',
  'test'
) OR email LIKE '%@example.com'
  OR email LIKE '%@demo.com'
  OR email LIKE '%@test.com'
  OR name LIKE '%Demo%'
  OR name LIKE '%Test%';

-- Add comment to track cleanup
COMMENT ON SCHEMA public IS 'Demo data removed on 2025-07-23 - Production ready';

-- Log the cleanup
DO $$
BEGIN
  RAISE NOTICE 'Demo data cleanup completed successfully';
  RAISE NOTICE 'Database is now ready for production use';
END $$;
