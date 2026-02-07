-- Clean up duplicate site_settings rows, keeping only one with correct values
DELETE FROM public.site_settings WHERE id != (
  SELECT id FROM public.site_settings ORDER BY created_at DESC LIMIT 1
);

-- Update the remaining row with correct values
UPDATE public.site_settings SET
  phone = '+2348064398669',
  email = 'senterbase@gmail.com',
  address = 'No 7 Port Harcourt Crescent, Area 11, Abuja',
  coverage_statement = 'Abuja (FCT) and surrounding FCT areas',
  site_title = 'STIL Technologies',
  primary_cta_label = 'Call Now',
  meta_description = 'Professional solar, security, electrical and home improvement services in Abuja',
  updated_at = now();