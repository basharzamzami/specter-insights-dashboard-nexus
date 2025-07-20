-- Add soft delete functionality with deleted_at timestamp columns
-- This allows for "undo delete" functionality instead of permanent deletion

-- Add deleted_at columns to key tables
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE public.competitor_profiles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE public.email_campaigns ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE public.email_templates ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE public.personas ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Create indexes for better performance when filtering out deleted records
CREATE INDEX IF NOT EXISTS idx_campaigns_deleted_at ON public.campaigns(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_competitor_profiles_deleted_at ON public.competitor_profiles(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_contacts_deleted_at ON public.contacts(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_deals_deleted_at ON public.deals(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_tasks_deleted_at ON public.tasks(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_email_campaigns_deleted_at ON public.email_campaigns(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_email_templates_deleted_at ON public.email_templates(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_personas_deleted_at ON public.personas(deleted_at) WHERE deleted_at IS NULL;

-- Create a view for active (non-deleted) records
CREATE OR REPLACE VIEW public.active_campaigns AS
SELECT * FROM public.campaigns WHERE deleted_at IS NULL;

CREATE OR REPLACE VIEW public.active_contacts AS
SELECT * FROM public.contacts WHERE deleted_at IS NULL;

CREATE OR REPLACE VIEW public.active_deals AS
SELECT * FROM public.deals WHERE deleted_at IS NULL;

CREATE OR REPLACE VIEW public.active_tasks AS
SELECT * FROM public.tasks WHERE deleted_at IS NULL;