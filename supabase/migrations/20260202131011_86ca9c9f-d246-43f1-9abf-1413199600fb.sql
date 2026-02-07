-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  initials TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Public can view published testimonials
CREATE POLICY "Public can view published testimonials"
ON public.testimonials
FOR SELECT
USING ((published = true) OR is_admin(auth.uid()));

-- Admins can insert testimonials
CREATE POLICY "Admins can insert testimonials"
ON public.testimonials
FOR INSERT
WITH CHECK (is_admin(auth.uid()));

-- Admins can update testimonials
CREATE POLICY "Admins can update testimonials"
ON public.testimonials
FOR UPDATE
USING (is_admin(auth.uid()));

-- Admins can delete testimonials
CREATE POLICY "Admins can delete testimonials"
ON public.testimonials
FOR DELETE
USING (is_admin(auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed with existing testimonials
INSERT INTO public.testimonials (name, role, content, rating, initials, sort_order) VALUES
('Engr. Chukwuma Okonkwo', 'Estate Developer, Abuja', 'STIL transformed our entire estate with reliable solar installations. Their professionalism and attention to detail exceeded our expectations. Highly recommended!', 5, 'CO', 0),
('Mrs. Aisha Mohammed', 'Homeowner, Maitama', 'The CCTV and electric fence installation by STIL gives me peace of mind. The team was punctual, professional, and their after-sales support is excellent.', 5, 'AM', 1),
('Chief Emeka Nwosu', 'Business Owner, Garki', 'We''ve worked with STIL on multiple projects - from automated gates to inverter systems. Consistent quality and fair pricing every single time.', 5, 'EN', 2),
('Dr. Fatima Bello', 'Clinic Director, Wuse', 'Power reliability is critical for our clinic. STIL''s solar and inverter solution has been running flawlessly for 2 years now. Outstanding service!', 5, 'FB', 3);