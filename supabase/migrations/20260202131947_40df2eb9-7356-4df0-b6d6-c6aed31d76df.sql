-- Insert hero section content into page_sections if it doesn't exist
INSERT INTO public.page_sections (page_slug, section_key, title, subtitle, body_text, sort_order, published)
VALUES (
  'home',
  'hero',
  'Powering Secure, Modern Living',
  'STIL Nigeria',
  'From solar energy to smart security—STIL delivers sustainable solutions across Abuja (FCT) and surrounding FCT areas.',
  0,
  true
)
ON CONFLICT (page_slug, section_key) DO NOTHING;

-- Add unique constraint if not exists (for upsert capability)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'page_sections_page_slug_section_key_key'
  ) THEN
    ALTER TABLE public.page_sections ADD CONSTRAINT page_sections_page_slug_section_key_key UNIQUE (page_slug, section_key);
  END IF;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;