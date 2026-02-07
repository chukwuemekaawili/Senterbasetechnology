-- Create team_members table for CMS-editable team section
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  image_asset_id UUID REFERENCES public.media_assets(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Public can view published team members
CREATE POLICY "Public can view published team_members"
ON public.team_members
FOR SELECT
USING ((published = true) OR is_admin(auth.uid()));

-- Admins can insert team members
CREATE POLICY "Admins can insert team_members"
ON public.team_members
FOR INSERT
WITH CHECK (is_admin(auth.uid()));

-- Admins can update team members
CREATE POLICY "Admins can update team_members"
ON public.team_members
FOR UPDATE
USING (is_admin(auth.uid()));

-- Admins can delete team members
CREATE POLICY "Admins can delete team_members"
ON public.team_members
FOR DELETE
USING (is_admin(auth.uid()));

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_team_members_updated_at
BEFORE UPDATE ON public.team_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();