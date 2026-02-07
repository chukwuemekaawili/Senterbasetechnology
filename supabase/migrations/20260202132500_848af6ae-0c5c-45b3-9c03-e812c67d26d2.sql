-- Seed all page sections for comprehensive CMS editing
-- About Page Sections
INSERT INTO public.page_sections (page_slug, section_key, title, subtitle, body_text, body_json, sort_order, published)
VALUES 
  ('about', 'intro', 'Who We Are', NULL, 'Senterbase Technology & Investment Ltd (STIL) is a leading technical services provider based in Abuja, Nigeria. We specialize in comprehensive solutions spanning smart security systems, solar energy, electrical installations, automated gates, electric fencing, carports, and interior decoration.

With years of experience serving Abuja (FCT) and surrounding FCT areas, we have built a reputation for quality workmanship, reliable service, and sustainable solutions that meet the evolving needs of our diverse clientele.

Our team of skilled technicians and engineers is committed to delivering excellence in every project, from initial consultation through installation and ongoing maintenance support.', NULL, 0, true),
  
  ('about', 'mission', 'Our Mission', NULL, 'To deliver innovative, reliable, and sustainable technology and electrical solutions that empower individuals, businesses, and government institutions to achieve secure, modern living. We are committed to excellence, safety, and customer satisfaction in every project we undertake.', NULL, 1, true),
  
  ('about', 'values', 'Our Values', 'The principles that guide everything we do', NULL, '[{"icon":"Shield","title":"Safety First","description":"We prioritize safety in every installation and service we deliver."},{"icon":"Target","title":"Reliability","description":"Dependable solutions that work when you need them most."},{"icon":"Zap","title":"Innovation","description":"Embracing cutting-edge technology for sustainable living."},{"icon":"Heart","title":"Customer Focus","description":"Your satisfaction drives everything we do."}]', 2, true),
  
  ('about', 'clients', 'Who We Serve', 'Trusted by individuals, businesses, and government clients across Abuja', NULL, '[{"icon":"Home","title":"Residential Clients","description":"Homeowners seeking security, solar, and electrical solutions for their properties."},{"icon":"Building2","title":"Commercial Businesses","description":"Offices, retail spaces, and commercial establishments requiring professional installations."},{"icon":"Users","title":"Government Clients","description":"Government agencies and public institutions with large-scale infrastructure needs."}]', 3, true),
  
  ('about', 'cta', 'Ready to Work With Us?', NULL, 'Contact us today to discuss your project requirements. Our team is ready to deliver solutions that exceed your expectations.', NULL, 4, true),

-- Contact Page Sections
  ('contact', 'intro', 'Get in Touch', NULL, 'Have a project in mind? Need a quote or consultation? We''re here to help. For the fastest response, give us a call.', NULL, 0, true),
  
  ('contact', 'coverage', 'Coverage Area', NULL, 'We serve Abuja (FCT) and surrounding FCT areas. Call to confirm availability for your specific location.', NULL, 1, true),

-- Coverage Areas Page Sections
  ('coverage', 'intro', 'Service Coverage', 'Our team is ready to serve you', NULL, NULL, 0, true),
  
  ('coverage', 'areas', 'Areas We Serve', NULL, NULL, '["Abuja (FCT)","Surrounding FCT areas"]', 1, true),
  
  ('coverage', 'confirm', 'Confirm Availability', NULL, 'Call to confirm availability for your specific location. Our team will verify coverage and schedule a convenient time for consultation or service.', NULL, 2, true),

-- Privacy Page
  ('privacy', 'content', 'Privacy Policy', 'How we collect, use, and protect your information.', NULL, NULL, 0, true),

-- Terms Page
  ('terms', 'content', 'Terms of Service', 'Terms and conditions governing the use of our services.', NULL, NULL, 0, true)

ON CONFLICT (page_slug, section_key) DO NOTHING;