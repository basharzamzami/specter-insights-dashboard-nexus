-- Step 1: Drop foreign key constraints to allow type changes
ALTER TABLE public.disruption_operations DROP CONSTRAINT IF EXISTS disruption_operations_user_id_fkey;
ALTER TABLE public.operation_history DROP CONSTRAINT IF EXISTS operation_history_user_id_fkey;

-- Now we can alter the column types
ALTER TABLE public.disruption_operations ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.operation_history ALTER COLUMN user_id TYPE TEXT;