-- Create stats table for the Stats Counter section
CREATE TABLE public.stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  icon TEXT NOT NULL DEFAULT 'Zap',
  value INTEGER NOT NULL,
  suffix TEXT NOT NULL DEFAULT '+',
  label TEXT NOT NULL,
  subtext TEXT,
  sort_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;

-- Public can view published stats
CREATE POLICY "Public can view published stats"
ON public.stats
FOR SELECT
USING ((published = true) OR is_admin(auth.uid()));

-- Admins can insert stats
CREATE POLICY "Admins can insert stats"
ON public.stats
FOR INSERT
WITH CHECK (is_admin(auth.uid()));

-- Admins can update stats
CREATE POLICY "Admins can update stats"
ON public.stats
FOR UPDATE
USING (is_admin(auth.uid()));

-- Admins can delete stats
CREATE POLICY "Admins can delete stats"
ON public.stats
FOR DELETE
USING (is_admin(auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_stats_updated_at
BEFORE UPDATE ON public.stats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed with existing stats
INSERT INTO public.stats (icon, value, suffix, label, subtext, sort_order) VALUES
('Home', 500, '+', 'Projects Delivered', 'since 2014', 0),
('Users', 850, '+', 'Satisfied Clients', 'across FCT', 1),
('Clock', 10, '+', 'Years Experience', 'in the field', 2),
('Zap', 24, '/7', 'Support Available', 'always ready', 3);