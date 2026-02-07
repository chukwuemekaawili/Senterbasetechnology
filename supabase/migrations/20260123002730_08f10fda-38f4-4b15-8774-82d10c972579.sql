-- Seed media_assets with stock images for each service category
-- Using Unsplash URLs for realistic installation photos

INSERT INTO media_assets (id, title, alt, category, storage_path, public_url, is_stock, source, tags) VALUES
-- Security Category
('11111111-1111-1111-1111-111111111001', 'CCTV Installation', 'Professional CCTV camera installation on building exterior', 'Security', 'stock/security-cctv-1.jpg', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', true, 'Unsplash', ARRAY['security', 'cctv', 'featured']),
('11111111-1111-1111-1111-111111111002', 'Security Camera System', 'Modern security camera mounted on wall', 'Security', 'stock/security-cctv-2.jpg', 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800', true, 'Unsplash', ARRAY['security', 'cctv']),

-- Solar Category  
('11111111-1111-1111-1111-111111111003', 'Solar Panel Installation', 'Solar panels installed on residential roof', 'Solar', 'stock/solar-panel-1.jpg', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800', true, 'Unsplash', ARRAY['solar', 'featured']),
('11111111-1111-1111-1111-111111111004', 'Solar Farm Project', 'Large scale solar panel array', 'Solar', 'stock/solar-panel-2.jpg', 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800', true, 'Unsplash', ARRAY['solar', 'featured']),
('11111111-1111-1111-1111-111111111005', 'Solar Street Light', 'Solar-powered street light pole', 'Solar', 'stock/solar-street-light.jpg', 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800', true, 'Unsplash', ARRAY['solar', 'street-light']),

-- Electrical Category
('11111111-1111-1111-1111-111111111006', 'Electrical Panel Installation', 'Professional electrical panel with organized wiring', 'Electrical', 'stock/electrical-1.jpg', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800', true, 'Unsplash', ARRAY['electrical', 'featured']),
('11111111-1111-1111-1111-111111111007', 'Electrical Wiring Work', 'Technician working on electrical installation', 'Electrical', 'stock/electrical-2.jpg', 'https://images.unsplash.com/photo-1555963966-b7ae5404b6ed?w=800', true, 'Unsplash', ARRAY['electrical']),

-- Gates/Fencing Category
('11111111-1111-1111-1111-111111111008', 'Automated Gate System', 'Modern automated sliding gate installation', 'Gates/Fencing', 'stock/gate-1.jpg', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', true, 'Unsplash', ARRAY['gates', 'automation', 'featured']),
('11111111-1111-1111-1111-111111111009', 'Electric Fence Installation', 'Electric fence on perimeter wall', 'Gates/Fencing', 'stock/fence-1.jpg', 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800', true, 'Unsplash', ARRAY['fence', 'security']),

-- Inverter Category
('11111111-1111-1111-1111-111111111010', 'Inverter System Installation', 'Professional inverter and battery installation', 'Inverter', 'stock/inverter-1.jpg', 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=800', true, 'Unsplash', ARRAY['inverter', 'power', 'featured']),

-- Interiors Category
('11111111-1111-1111-1111-111111111011', 'Office Partitioning', 'Modern office partition installation', 'Interiors/Partitioning', 'stock/interior-1.jpg', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', true, 'Unsplash', ARRAY['interior', 'partition', 'featured']),
('11111111-1111-1111-1111-111111111012', 'Interior Painting', 'Professional interior painting work', 'Interiors/Partitioning', 'stock/interior-2.jpg', 'https://images.unsplash.com/photo-1562663474-6cbb3eaa4d14?w=800', true, 'Unsplash', ARRAY['interior', 'painting']),

-- Carports Category
('11111111-1111-1111-1111-111111111013', 'Steel Carport', 'Custom steel carport installation', 'Carports', 'stock/carport-1.jpg', 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?w=800', true, 'Unsplash', ARRAY['carport', 'featured']),

-- Satellite Category
('11111111-1111-1111-1111-111111111014', 'Satellite Dish Installation', 'Professional satellite dish installation', 'Satellite', 'stock/satellite-1.jpg', 'https://images.unsplash.com/photo-1573152143286-0c422b4d2175?w=800', true, 'Unsplash', ARRAY['satellite', 'featured'])

ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  alt = EXCLUDED.alt,
  category = EXCLUDED.category,
  public_url = EXCLUDED.public_url,
  updated_at = now();

-- Seed gallery_items linked to media_assets
INSERT INTO gallery_items (id, title, alt, category, image_asset_id, sort_order, featured, published) VALUES
('22222222-2222-2222-2222-222222222001', 'CCTV Installation Project', 'Professional CCTV camera installation on building exterior', 'Security', '11111111-1111-1111-1111-111111111001', 1, true, true),
('22222222-2222-2222-2222-222222222002', 'Security Camera System', 'Modern security camera mounted on wall', 'Security', '11111111-1111-1111-1111-111111111002', 2, false, true),
('22222222-2222-2222-2222-222222222003', 'Residential Solar Installation', 'Solar panels installed on residential roof', 'Solar', '11111111-1111-1111-1111-111111111003', 3, true, true),
('22222222-2222-2222-2222-222222222004', 'Commercial Solar Project', 'Large scale solar panel array', 'Solar', '11111111-1111-1111-1111-111111111004', 4, true, true),
('22222222-2222-2222-2222-222222222005', 'Solar Street Light Installation', 'Solar-powered street light pole', 'Solar', '11111111-1111-1111-1111-111111111005', 5, false, true),
('22222222-2222-2222-2222-222222222006', 'Electrical Panel Upgrade', 'Professional electrical panel with organized wiring', 'Electrical', '11111111-1111-1111-1111-111111111006', 6, true, true),
('22222222-2222-2222-2222-222222222007', 'Automated Gate Installation', 'Modern automated sliding gate installation', 'Gates/Fencing', '11111111-1111-1111-1111-111111111008', 7, true, true),
('22222222-2222-2222-2222-222222222008', 'Inverter System Setup', 'Professional inverter and battery installation', 'Inverter', '11111111-1111-1111-1111-111111111010', 8, true, true),
('22222222-2222-2222-2222-222222222009', 'Office Partitioning Project', 'Modern office partition installation', 'Interiors/Partitioning', '11111111-1111-1111-1111-111111111011', 9, true, true),
('22222222-2222-2222-2222-222222222010', 'Custom Carport Build', 'Custom steel carport installation', 'Carports', '11111111-1111-1111-1111-111111111013', 10, true, true),
('22222222-2222-2222-2222-222222222011', 'Satellite Dish Setup', 'Professional satellite dish installation', 'Satellite', '11111111-1111-1111-1111-111111111014', 11, true, true)

ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  alt = EXCLUDED.alt,
  category = EXCLUDED.category,
  image_asset_id = EXCLUDED.image_asset_id,
  sort_order = EXCLUDED.sort_order,
  featured = EXCLUDED.featured,
  published = EXCLUDED.published;