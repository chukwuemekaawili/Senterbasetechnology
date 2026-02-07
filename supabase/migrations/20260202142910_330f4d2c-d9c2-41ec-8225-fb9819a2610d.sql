-- Insert missing default sections for all pages
-- These are the sections that should be editable via CMS

-- Home Page sections (many already exist)
INSERT INTO public.page_sections (page_slug, section_key, title, subtitle, published, sort_order)
VALUES 
  ('home', 'services_grid', 'Our Services', 'Comprehensive solutions for your home and business', true, 3),
  ('home', 'featured_highlights', 'Why STIL Technologies?', 'Professional service you can trust', true, 4),
  ('home', 'project_showcase', '500+ Projects Completed', 'Trusted by families and businesses across Abuja FCT', true, 5),
  ('home', 'stats', 'Our Impact', 'Numbers that speak for themselves', true, 6),
  ('home', 'testimonials', 'What Our Clients Say', 'Real reviews from real customers', true, 7),
  ('home', 'how_we_work', 'How We Work', 'Simple, transparent process from consultation to completion', true, 8),
  ('home', 'coverage_preview', 'Areas We Cover', 'Serving Abuja FCT and surrounding areas', true, 9),
  ('home', 'gallery_preview', 'Our Recent Projects', 'See our work in action', true, 10),
  ('home', 'chatbot_promo', 'Need Quick Answers?', 'Chat with our assistant anytime', true, 11)
ON CONFLICT DO NOTHING;

-- Services page sections
INSERT INTO public.page_sections (page_slug, section_key, title, subtitle, published, sort_order)
VALUES 
  ('services', 'intro', 'Our Services', 'Professional installation and maintenance solutions', true, 0),
  ('services', 'categories', 'Service Categories', 'Browse by category', true, 1)
ON CONFLICT DO NOTHING;

-- Gallery page sections
INSERT INTO public.page_sections (page_slug, section_key, title, subtitle, published, sort_order)
VALUES 
  ('gallery', 'intro', 'Projects Gallery', 'See our completed installations across Abuja', true, 0),
  ('gallery', 'categories', 'Browse by Category', 'Filter projects by service type', true, 1)
ON CONFLICT DO NOTHING;

-- About page - add team section
INSERT INTO public.page_sections (page_slug, section_key, title, subtitle, published, sort_order)
VALUES 
  ('about', 'team', 'Meet Our Team', 'The experts behind STIL Technologies', true, 3)
ON CONFLICT DO NOTHING;

-- Contact page - add form and faq sections
INSERT INTO public.page_sections (page_slug, section_key, title, subtitle, published, sort_order)
VALUES 
  ('contact', 'form', 'Send Us a Message', 'Fill out the form and we will get back to you', true, 2),
  ('contact', 'faq', 'Frequently Asked Questions', 'Common questions about our services', true, 3)
ON CONFLICT DO NOTHING;

-- Coverage page - add CTA section
INSERT INTO public.page_sections (page_slug, section_key, title, subtitle, published, sort_order)
VALUES 
  ('coverage', 'cta', 'Ready to Get Started?', 'Contact us today for a free consultation', true, 3)
ON CONFLICT DO NOTHING;