-- Fix RLS and user data isolation for Specter Net (Step 1: Drop existing policies)

-- Drop all existing policies on disruption_operations and operation_history
DROP POLICY IF EXISTS "Users can view their own disruption operations" ON public.disruption_operations;
DROP POLICY IF EXISTS "Users can create their own disruption operations" ON public.disruption_operations;
DROP POLICY IF EXISTS "Users can update their own disruption operations" ON public.disruption_operations;
DROP POLICY IF EXISTS "Users can delete their own disruption operations" ON public.disruption_operations;
DROP POLICY IF EXISTS "Allow all actions" ON public.disruption_operations;
DROP POLICY IF EXISTS "Allow all actions for testing" ON public.disruption_operations;

DROP POLICY IF EXISTS "Users can view their operation history" ON public.operation_history;
DROP POLICY IF EXISTS "Users can insert their operation history" ON public.operation_history;
DROP POLICY IF EXISTS "Users can view their own operation history" ON public.operation_history;
DROP POLICY IF EXISTS "Users can insert their own operation history" ON public.operation_history;

-- Now we can safely alter the column types to TEXT for Clerk compatibility
ALTER TABLE public.disruption_operations ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.operation_history ALTER COLUMN user_id TYPE TEXT;