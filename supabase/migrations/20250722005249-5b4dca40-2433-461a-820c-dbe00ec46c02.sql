-- Temporarily disable RLS on clients table to allow Clerk auth to work
-- This is for demo purposes - in production you'd want proper Clerk-Supabase integration
ALTER TABLE public.clients DISABLE ROW LEVEL SECURITY;

-- Drop the existing policies since they expect Supabase auth tokens
DROP POLICY IF EXISTS "Users can insert their own client data" ON public.clients;
DROP POLICY IF EXISTS "Users can update their own client data" ON public.clients;  
DROP POLICY IF EXISTS "Users can view their own client data" ON public.clients;