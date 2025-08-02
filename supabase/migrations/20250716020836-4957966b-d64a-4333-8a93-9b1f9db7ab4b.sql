-- Update the contacts and deals to show for all users (for demo purposes)
-- Since this is demo data, we'll temporarily bypass user restrictions

-- First, let's check what user IDs exist
DO $$
DECLARE
    user_exists boolean;
BEGIN
    -- Check if any authenticated users exist
    SELECT EXISTS(SELECT 1 FROM auth.users LIMIT 1) INTO user_exists;
    
    IF user_exists THEN
        -- If users exist, assign the demo data to the first user
        UPDATE public.contacts 
        SET user_id = (SELECT id FROM auth.users LIMIT 1)
        WHERE user_id IS NULL;
        
        UPDATE public.deals 
        SET user_id = (SELECT id FROM auth.users LIMIT 1)
        WHERE user_id IS NULL;
    ELSE
        -- If no users exist, create demo policies to show data
        -- We'll create more permissive policies for demo data
        RAISE NOTICE 'No authenticated users found. Demo data will be visible after authentication.';
    END IF;
END $$;