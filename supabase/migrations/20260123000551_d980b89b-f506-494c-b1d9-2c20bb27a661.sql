-- ============================================
-- PHASE 1: ADMIN ROLE SYSTEM
-- ============================================

-- Create admin role enum
CREATE TYPE public.admin_role AS ENUM ('super_admin', 'admin', 'editor');

-- Create admin_users table (separate from auth.users for security)
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  role admin_role NOT NULL DEFAULT 'admin',
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Security definer function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = _user_id
  )
$$;

-- Security definer function to check specific admin role
CREATE OR REPLACE FUNCTION public.has_admin_role(_user_id UUID, _role admin_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = _user_id AND role = _role
  )
$$;

-- Admin users policies
CREATE POLICY "Admins can view admin_users"
  ON public.admin_users FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Super admins can manage admin_users"
  ON public.admin_users FOR ALL
  TO authenticated
  USING (public.has_admin_role(auth.uid(), 'super_admin'));

-- ============================================
-- PHASE 2: UPDATE LEADS TABLE
-- ============================================

-- Add admin_note and updated_at to leads
ALTER TABLE public.leads 
  ADD COLUMN IF NOT EXISTS admin_note TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Update function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for leads updated_at
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add policies for admins to manage leads
CREATE POLICY "Admins can view leads"
  ON public.leads FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update leads"
  ON public.leads FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ============================================
-- PHASE 3: MEDIA ASSETS TABLE
-- ============================================

CREATE TABLE public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  title TEXT NOT NULL,
  alt TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  width INT,
  height INT,
  bytes INT,
  is_stock BOOLEAN DEFAULT false,
  source TEXT DEFAULT 'admin upload',
  uploaded_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- Public can read media assets
CREATE POLICY "Public can view media_assets"
  ON public.media_assets FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admins can manage media assets
CREATE POLICY "Admins can insert media_assets"
  ON public.media_assets FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update media_assets"
  ON public.media_assets FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete media_assets"
  ON public.media_assets FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_media_assets_updated_at
  BEFORE UPDATE ON public.media_assets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- PHASE 4: SITE SETTINGS TABLE (single row)
-- ============================================

CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL DEFAULT '+2348064398669',
  email TEXT NOT NULL DEFAULT 'info@stiltech.com.ng',
  address TEXT NOT NULL DEFAULT 'Abuja, FCT, Nigeria',
  primary_cta_label TEXT NOT NULL DEFAULT 'Call Now',
  coverage_statement TEXT NOT NULL DEFAULT 'Abuja (FCT) and surrounding FCT areas',
  site_title TEXT NOT NULL DEFAULT 'STIL Technologies',
  meta_description TEXT DEFAULT 'Professional solar, security, electrical and home improvement services in Abuja',
  social_facebook TEXT,
  social_instagram TEXT,
  social_twitter TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public can read site settings
CREATE POLICY "Public can view site_settings"
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admins can update site settings
CREATE POLICY "Admins can update site_settings"
  ON public.site_settings FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings row
INSERT INTO public.site_settings (id) VALUES (gen_random_uuid());

-- ============================================
-- PHASE 5: PAGE SECTIONS TABLE
-- ============================================

CREATE TABLE public.page_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug TEXT NOT NULL,
  section_key TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  body_text TEXT,
  body_json JSONB,
  ctas_json JSONB DEFAULT '[]',
  image_asset_id UUID REFERENCES public.media_assets(id) ON DELETE SET NULL,
  sort_order INT DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(page_slug, section_key)
);

ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;

-- Public can read published page sections
CREATE POLICY "Public can view published page_sections"
  ON public.page_sections FOR SELECT
  TO anon, authenticated
  USING (published = true OR public.is_admin(auth.uid()));

-- Admins can manage page sections
CREATE POLICY "Admins can insert page_sections"
  ON public.page_sections FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update page_sections"
  ON public.page_sections FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete page_sections"
  ON public.page_sections FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE TRIGGER update_page_sections_updated_at
  BEFORE UPDATE ON public.page_sections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- PHASE 6: SERVICES TABLE (CMS)
-- ============================================

CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  short_description TEXT NOT NULL,
  hero_description TEXT NOT NULL,
  what_we_do TEXT[] DEFAULT '{}',
  benefits TEXT[] DEFAULT '{}',
  faqs JSONB DEFAULT '[]',
  related_slugs TEXT[] DEFAULT '{}',
  image_asset_id UUID REFERENCES public.media_assets(id) ON DELETE SET NULL,
  sort_order INT DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Public can read published services
CREATE POLICY "Public can view published services"
  ON public.services FOR SELECT
  TO anon, authenticated
  USING (published = true OR public.is_admin(auth.uid()));

-- Admins can manage services
CREATE POLICY "Admins can insert services"
  ON public.services FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update services"
  ON public.services FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete services"
  ON public.services FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- PHASE 7: GALLERY ITEMS TABLE
-- ============================================

CREATE TABLE public.gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  alt TEXT,
  image_asset_id UUID REFERENCES public.media_assets(id) ON DELETE CASCADE NOT NULL,
  sort_order INT DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

-- Public can read published gallery items
CREATE POLICY "Public can view published gallery_items"
  ON public.gallery_items FOR SELECT
  TO anon, authenticated
  USING (published = true OR public.is_admin(auth.uid()));

-- Admins can manage gallery items
CREATE POLICY "Admins can insert gallery_items"
  ON public.gallery_items FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update gallery_items"
  ON public.gallery_items FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete gallery_items"
  ON public.gallery_items FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE TRIGGER update_gallery_items_updated_at
  BEFORE UPDATE ON public.gallery_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- PHASE 8: STORAGE BUCKET FOR MEDIA
-- ============================================

-- Create media bucket (public read)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for media bucket
CREATE POLICY "Public can view media files"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'media');

CREATE POLICY "Admins can upload media files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update media files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'media' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete media files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'media' AND public.is_admin(auth.uid()));

-- ============================================
-- SEED DEFAULT PAGE SECTIONS
-- ============================================

INSERT INTO public.page_sections (page_slug, section_key, title, subtitle, body_text, sort_order) VALUES
('home', 'hero', 'Powering Abuja with Smart Security & Solar Solutions', 'Professional Installation • Reliable Service • Trusted Quality', 'STIL Technologies delivers expert solar panel installation, CCTV security systems, inverter solutions, and electrical services across Abuja FCT and surrounding areas.', 1),
('home', 'trust_strip', 'Why Choose STIL?', NULL, NULL, 2),
('home', 'cta_banner', 'Ready to Power Up Your Property?', 'Get a free consultation and quote today', NULL, 10),
('about', 'intro', 'About STIL Technologies', 'Your Trusted Technology Partner in Abuja', 'STIL Technologies is a leading provider of solar energy solutions, security systems, and electrical services in Abuja, FCT. We are committed to delivering excellence through innovative solutions and dedicated service.', 1),
('about', 'mission', 'Our Mission', NULL, 'To empower homes and businesses across Abuja with reliable, sustainable, and innovative technology solutions that enhance security, reduce energy costs, and improve quality of life.', 2),
('contact', 'intro', 'Get In Touch', 'We''d love to hear from you', 'Ready to discuss your project? Reach out to our team for a free consultation and quote.', 1)
ON CONFLICT (page_slug, section_key) DO NOTHING;