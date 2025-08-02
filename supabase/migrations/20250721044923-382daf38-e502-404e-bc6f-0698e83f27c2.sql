-- Drop policies that depend on user_id column
DROP POLICY IF EXISTS "Users can view their own client data" ON clients;
DROP POLICY IF EXISTS "Users can insert their own client data" ON clients;
DROP POLICY IF EXISTS "Users can update their own client data" ON clients;

-- Change user_id column from UUID to text for Clerk compatibility
ALTER TABLE clients ALTER COLUMN user_id TYPE text;

-- Add pain_points column
ALTER TABLE clients ADD COLUMN pain_points text;

-- Recreate policies with text user_id
CREATE POLICY "Users can view their own client data" 
ON clients 
FOR SELECT 
USING (user_id = (auth.jwt() ->> 'sub'::text));

CREATE POLICY "Users can insert their own client data" 
ON clients 
FOR INSERT 
WITH CHECK (user_id = (auth.jwt() ->> 'sub'::text));

CREATE POLICY "Users can update their own client data" 
ON clients 
FOR UPDATE 
USING (user_id = (auth.jwt() ->> 'sub'::text));