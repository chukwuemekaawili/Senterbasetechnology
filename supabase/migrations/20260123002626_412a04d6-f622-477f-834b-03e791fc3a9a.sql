-- Seed default site settings
INSERT INTO site_settings (id, phone, email, address, primary_cta_label, coverage_statement, site_title, meta_description)
VALUES (
  gen_random_uuid(),
  '+2348064398669',
  'senterbase@gmail.com',
  'No 7 Port Harcourt Crescent, Area 11, Abuja',
  'Call Now',
  'Abuja (FCT) and surrounding FCT areas',
  'STIL Technologies',
  'Professional solar, security, electrical and home improvement services in Abuja'
)
ON CONFLICT DO NOTHING;