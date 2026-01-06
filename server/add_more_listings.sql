-- Quick seed script - Run this in pgAdmin Query Tool
-- This will add 5 more sample listings to your marketplace

-- First, ensure we have the categories
INSERT INTO material_categories (category_name, description) 
SELECT * FROM (VALUES 
    ('Grains & Cereals', 'Grain residues'),
    ('Processed Waste', 'Processing waste'),
    ('Biomass', 'Biomass materials'),
    ('Animal Waste', 'Animal byproducts')
) AS v(name, desc)
WHERE NOT EXISTS (SELECT 1 FROM material_categories WHERE category_name = v.name);

-- Add second user if not exists
INSERT INTO users (email, password_hash, role, company_name, verified, active, city, country)
VALUES ('farmer@punjab.com', '$2b$10$hash', 'company', 'Punjab Agro Farms', true, true, 'Ludhiana', 'India')
ON CONFLICT (email) DO NOTHING;

-- Add materials
INSERT INTO materials (category_id, material_name, physical_form, description, recyclable)
SELECT 
    (SELECT category_id FROM material_categories WHERE category_name = 'Grains & Cereals' LIMIT 1),
    'Wheat Straw Bales', 'solid', 'Dry wheat straw', true
WHERE NOT EXISTS (SELECT 1 FROM materials WHERE material_name = 'Wheat Straw Bales');

INSERT INTO materials (category_id, material_name, physical_form, description, recyclable)
SELECT 
    (SELECT category_id FROM material_categories WHERE category_name = 'Processed Waste' LIMIT 1),
    'Apple Pomace', 'solid', 'Apple processing waste', true
WHERE NOT EXISTS (SELECT 1 FROM materials WHERE material_name = 'Apple Pomace');

INSERT INTO materials (category_id, material_name, physical_form, description, recyclable)
SELECT 
    (SELECT category_id FROM material_categories WHERE category_name = 'Grains & Cereals' LIMIT 1),
    'Rice Husks', 'solid', 'Rice processing waste', true
WHERE NOT EXISTS (SELECT 1 FROM materials WHERE material_name = 'Rice Husks');

INSERT INTO materials (category_id, material_name, physical_form, description, recyclable)
SELECT 
    (SELECT category_id FROM material_categories WHERE category_name = 'Biomass' LIMIT 1),
    'Wood Chips', 'solid', 'Wood processing chips', true
WHERE NOT EXISTS (SELECT 1 FROM materials WHERE material_name = 'Wood Chips');

INSERT INTO materials (category_id, material_name, physical_form, description, recyclable)
SELECT 
    (SELECT category_id FROM material_categories WHERE category_name = 'Animal Waste' LIMIT 1),
    'Cow Manure', 'solid', 'Composted manure', true
WHERE NOT EXISTS (SELECT 1 FROM materials WHERE material_name = 'Cow Manure');

-- Add listings
INSERT INTO material_listings (seller_id, material_id, title, description, quantity, unit, price_per_unit, currency, origin_city, origin_country, images, is_active, available_from)
SELECT 
    (SELECT user_id FROM users WHERE email = 'farmer@punjab.com' LIMIT 1),
    (SELECT material_id FROM materials WHERE material_name = 'Wheat Straw Bales' LIMIT 1),
    'High Quality Wheat Straw Bales',
    'Dry and compressed wheat straw bales. Perfect for mushroom cultivation.',
    2000, 'kg', 8.00, 'INR', 'Punjab', 'India',
    ARRAY['https://images.pexels.com/photos/1600139/pexels-photo-1600139.jpeg?auto=compress&cs=tinysrgb&w=600'],
    true, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM material_listings WHERE title = 'High Quality Wheat Straw Bales');

INSERT INTO material_listings (seller_id, material_id, title, description, quantity, unit, price_per_unit, currency, origin_city, origin_country, images, is_active, available_from)
SELECT 
    (SELECT user_id FROM users WHERE email = 'farmer@punjab.com' LIMIT 1),
    (SELECT material_id FROM materials WHERE material_name = 'Apple Pomace' LIMIT 1),
    'Fresh Apple Pomace',
    'High fiber apple pomace from recent juice pressing.',
    300, 'kg', 3.00, 'INR', 'Himachal Pradesh', 'India',
    ARRAY['https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=600'],
    true, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM material_listings WHERE title = 'Fresh Apple Pomace');

INSERT INTO material_listings (seller_id, material_id, title, description, quantity, unit, price_per_unit, currency, origin_city, origin_country, images, is_active, available_from)
SELECT 
    (SELECT user_id FROM users WHERE email = 'farmer@punjab.com' LIMIT 1),
    (SELECT material_id FROM materials WHERE material_name = 'Rice Husks' LIMIT 1),
    'Rice Husks for Biomass',
    'Dry rice husks, low moisture content.',
    1500, 'kg', 6.00, 'INR', 'Andhra Pradesh', 'India',
    ARRAY['https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=600'],
    true, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM material_listings WHERE title = 'Rice Husks for Biomass');

INSERT INTO material_listings (seller_id, material_id, title, description, quantity, unit, price_per_unit, currency, origin_city, origin_country, images, is_active, available_from)
SELECT 
    (SELECT user_id FROM users WHERE email = 'demo@agriloop.com' LIMIT 1),
    (SELECT material_id FROM materials WHERE material_name = 'Wood Chips' LIMIT 1),
    'Forestry Wood Chips',
    'Clean chips, no chemical treatment.',
    1000, 'kg', 10.00, 'INR', 'Kerala', 'India',
    ARRAY['https://images.pexels.com/photos/129733/pexels-photo-129733.jpeg?auto=compress&cs=tinysrgb&w=600'],
    true, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM material_listings WHERE title = 'Forestry Wood Chips');

INSERT INTO material_listings (seller_id, material_id, title, description, quantity, unit, price_per_unit, currency, origin_city, origin_country, images, is_active, available_from)
SELECT 
    (SELECT user_id FROM users WHERE email = 'farmer@punjab.com' LIMIT 1),
    (SELECT material_id FROM materials WHERE material_name = 'Cow Manure' LIMIT 1),
    'Organic Cow Manure Compost',
    'Aged and composted manure.',
    5000, 'kg', 2.00, 'INR', 'Gujarat', 'India',
    ARRAY['https://images.pexels.com/photos/2252584/pexels-photo-2252584.jpeg?auto=compress&cs=tinysrgb&w=600'],
    true, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM material_listings WHERE title = 'Organic Cow Manure Compost');

-- Check results
SELECT COUNT(*) as total_listings FROM material_listings;
