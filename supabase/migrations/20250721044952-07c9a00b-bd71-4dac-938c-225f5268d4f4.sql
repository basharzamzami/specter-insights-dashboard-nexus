-- Drop the foreign key constraint that's causing the issue
ALTER TABLE clients DROP CONSTRAINT IF EXISTS clients_user_id_fkey;

-- Now change the column type from UUID to text
ALTER TABLE clients ALTER COLUMN user_id TYPE text;

-- Add pain_points column
ALTER TABLE clients ADD COLUMN pain_points text;

-- Recreate the RLS policies with proper text comparison
DROP POLICY IF EXISTS "Users can view their own client data" ON clients;
DROP POLICY IF EXISTS "Users can insert their own client data" ON clients;
DROP POLICY IF EXISTS "Users can update their own client data" ON clients;

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