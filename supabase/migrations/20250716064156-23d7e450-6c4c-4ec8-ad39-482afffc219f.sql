-- Update RLS policies to be more permissive for demo purposes
-- This allows the app to work without strict user authentication

-- Create more permissive policies for tasks
DROP POLICY IF EXISTS "Users can manage their own tasks" ON public.tasks;
CREATE POLICY "Demo - Anyone can view tasks" ON public.tasks
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage tasks" ON public.tasks
FOR ALL USING (auth.uid() IS NOT NULL);

-- Create more permissive policies for email campaigns  
DROP POLICY IF EXISTS "Users can manage their own email campaigns" ON public.email_campaigns;
CREATE POLICY "Demo - Anyone can view email campaigns" ON public.email_campaigns
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage email campaigns" ON public.email_campaigns
FOR ALL USING (auth.uid() IS NOT NULL);

-- Create more permissive policies for email templates
DROP POLICY IF EXISTS "Users can manage their own email templates" ON public.email_templates;
CREATE POLICY "Demo - Anyone can view email templates" ON public.email_templates
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage email templates" ON public.email_templates
FOR ALL USING (auth.uid() IS NOT NULL);

-- Create more permissive policies for social posts
DROP POLICY IF EXISTS "Users can manage their own social posts" ON public.social_posts;
CREATE POLICY "Demo - Anyone can view social posts" ON public.social_posts
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage social posts" ON public.social_posts
FOR ALL USING (auth.uid() IS NOT NULL);

-- Create more permissive policies for appointments
DROP POLICY IF EXISTS "Users can manage their own appointments" ON public.appointments;
CREATE POLICY "Demo - Anyone can view appointments" ON public.appointments
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage appointments" ON public.appointments
FOR ALL USING (auth.uid() IS NOT NULL);

-- Create more permissive policies for workflows
DROP POLICY IF EXISTS "Users can manage their own workflows" ON public.workflows;
CREATE POLICY "Demo - Anyone can view workflows" ON public.workflows
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage workflows" ON public.workflows
FOR ALL USING (auth.uid() IS NOT NULL);