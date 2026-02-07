-- Create leads table for form submissions and chatbot lead capture
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  service TEXT NOT NULL,
  location TEXT NOT NULL,
  message TEXT NOT NULL,
  source_page TEXT NOT NULL,
  preferred_contact_time TEXT,
  status TEXT NOT NULL DEFAULT 'new'
);

-- Create index on created_at for efficient querying
CREATE INDEX idx_leads_created_at ON public.leads (created_at DESC);

-- Create index on status for filtering
CREATE INDEX idx_leads_status ON public.leads (status);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to INSERT leads (public website visitors)
CREATE POLICY "anon_insert_leads" 
ON public.leads 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- No SELECT/UPDATE/DELETE policies for anon - they cannot read or modify leads
-- Service role has full access by default