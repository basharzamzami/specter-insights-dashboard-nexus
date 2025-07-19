-- Create disruption_operations table
CREATE TABLE public.disruption_operations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  target TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('seo', 'ads', 'social', 'content', 'technical')),
  priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'completed', 'paused')),
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  estimated_duration TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.disruption_operations ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own disruption operations" 
ON public.disruption_operations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own disruption operations" 
ON public.disruption_operations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own disruption operations" 
ON public.disruption_operations 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own disruption operations" 
ON public.disruption_operations 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_disruption_operations_updated_at
BEFORE UPDATE ON public.disruption_operations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();