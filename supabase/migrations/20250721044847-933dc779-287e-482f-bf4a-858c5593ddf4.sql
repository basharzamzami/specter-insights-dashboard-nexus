-- Fix user_id column to accept text instead of UUID for Clerk compatibility
ALTER TABLE clients ALTER COLUMN user_id TYPE text;

-- Add pain_points column to store client business struggles  
ALTER TABLE clients ADD COLUMN pain_points text;