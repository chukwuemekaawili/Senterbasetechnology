-- Admin Audit Log table for tracking CMS changes
CREATE TABLE public.admin_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  entity_name text,
  before_summary jsonb,
  after_summary jsonb,
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_audit ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
ON public.admin_audit
FOR SELECT
USING (is_admin(auth.uid()));

-- Only admins can insert audit logs
CREATE POLICY "Admins can insert audit logs"
ON public.admin_audit
FOR INSERT
WITH CHECK (is_admin(auth.uid()));

-- Create index for faster queries
CREATE INDEX idx_admin_audit_created_at ON public.admin_audit(created_at DESC);
CREATE INDEX idx_admin_audit_entity ON public.admin_audit(entity_type, entity_id);

-- Update site_settings with legal date column
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS legal_last_updated date DEFAULT CURRENT_DATE;