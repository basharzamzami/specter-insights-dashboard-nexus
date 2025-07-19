-- Drop all existing policies on disruption_operations
DROP POLICY IF EXISTS "Users can view their own disruption operations" ON public.disruption_operations;
DROP POLICY IF EXISTS "Users can create their own disruption operations" ON public.disruption_operations;
DROP POLICY IF EXISTS "Users can update their own disruption operations" ON public.disruption_operations;
DROP POLICY IF EXISTS "Users can delete their own disruption operations" ON public.disruption_operations;
DROP POLICY IF EXISTS "Allow all actions for testing" ON public.disruption_operations;
DROP POLICY IF EXISTS "Allow all actions" ON public.disruption_operations;

-- Drop all existing policies on operation_history
DROP POLICY IF EXISTS "Users can view their operation history" ON public.operation_history;
DROP POLICY IF EXISTS "Users can insert their operation history" ON public.operation_history;

-- Drop foreign key constraints
ALTER TABLE public.disruption_operations DROP CONSTRAINT IF EXISTS disruption_operations_user_id_fkey;
ALTER TABLE public.operation_history DROP CONSTRAINT IF EXISTS operation_history_user_id_fkey;

-- Now alter column types for Clerk compatibility
ALTER TABLE public.disruption_operations ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.operation_history ALTER COLUMN user_id TYPE TEXT;