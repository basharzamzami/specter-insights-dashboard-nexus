-- Create temporary demo policies to show data without authentication
-- This will allow users to see the demo data immediately

-- Drop existing restrictive policies temporarily  
DROP POLICY IF EXISTS "Users can manage their own deals" ON public.deals;
DROP POLICY IF EXISTS "Users can manage their own contacts" ON public.contacts;
DROP POLICY IF EXISTS "Users can manage their own pipelines" ON public.pipelines;

-- Create permissive demo policies
CREATE POLICY "Demo - Anyone can view deals" ON public.deals
FOR SELECT USING (true);

CREATE POLICY "Demo - Anyone can view contacts" ON public.contacts  
FOR SELECT USING (true);

CREATE POLICY "Demo - Anyone can view pipelines" ON public.pipelines
FOR SELECT USING (true);

-- Still require authentication for modifications
CREATE POLICY "Authenticated users can manage deals" ON public.deals
FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage contacts" ON public.contacts
FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage pipelines" ON public.pipelines
FOR ALL USING (auth.uid() IS NOT NULL);