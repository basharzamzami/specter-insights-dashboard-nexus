-- Disable RLS and drop all policies first
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own client data" ON clients;
DROP POLICY IF EXISTS "Users can insert their own client data" ON clients;
DROP POLICY IF EXISTS "Users can update their own client data" ON clients;

-- Drop and recreate the clients table with proper structure
DROP TABLE IF EXISTS clients CASCADE;

CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  business_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  city TEXT,
  state TEXT,
  zipcode TEXT,
  business_goals TEXT NOT NULL,
  pain_points TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for the clients table
CREATE POLICY "Users can view their own client data" 
ON public.clients 
FOR SELECT 
USING (user_id = (auth.jwt() ->> 'sub'::text));

CREATE POLICY "Users can insert their own client data" 
ON public.clients 
FOR INSERT 
WITH CHECK (user_id = (auth.jwt() ->> 'sub'::text));

CREATE POLICY "Users can update their own client data" 
ON public.clients 
FOR UPDATE 
USING (user_id = (auth.jwt() ->> 'sub'::text));

-- Create trigger for updating updated_at
CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();