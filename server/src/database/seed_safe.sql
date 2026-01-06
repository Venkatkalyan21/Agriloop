-- SAFE SEED DATA SCRIPT
-- Copy and paste this into pgAdmin Query Tool
-- Execute it ONCE to fill your database.

-- 1. Categories
INSERT INTO material_categories (category_name, description) VALUES
    ('Vegetables', 'Organic vegetable waste'),
    ('Fruits', 'Organic fruit waste and pomace'),
    ('Grains & Cereals', 'Straw, husks, and other grain residues'),
    ('Biomass', 'Wood chips, sawdust, and plant matter'),
    ('Animal Waste', 'Manure and other animal byproducts'),
    ('Processed Waste', 'Industrial food processing residues'),
    ('Plastics', 'Recyclable plastic materials'),
    ('Metals', 'Scrap metals'),
    ('Glass', 'Recyclable glass cullet');

-- 2. Sellers
INSERT INTO users (email, password_hash, role, company_name, verified, active, city, country)
VALUES 
    ('demo@agriloop.com', '$2b$10$wT.f/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p', 'company', 'Green Earth Organics', true, true, 'Hamburg', 'Germany'),
    ('farmer@punjab.com', '$2b$10$wT.f/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p', 'company', 'Punjab Agro Farms', true, true, 'Ludhiana', 'India');

-- 3. Materials
-- Using sub-selects to get IDs dynamically (safe method)
INSERT INTO materials (category_id, material_name, physical_form, description, recyclable)
VALUES 
    ((SELECT category_id FROM material_categories WHERE category_name = 'Vegetables' LIMIT 1), 'Organic Tomato Waste', 'solid', 'Fresh tomato waste suitable for composting.', true),
    ((SELECT category_id FROM material_categories WHERE category_name = 'Grains & Cereals' LIMIT 1), 'Wheat Straw Bales', 'solid', 'Dry wheat straw for bedding or biomass.', true),
    ((SELECT category_id FROM material_categories WHERE category_name = 'Processed Waste' LIMIT 1), 'Apple Pomace', 'solid', 'Leftover pulp from apple juice production.', true),
    ((SELECT category_id FROM material_categories WHERE category_name = 'Grains & Cereals' LIMIT 1), 'Rice Husks', 'solid', 'Rice husks for energy or insulation.', true),
    ((SELECT category_id FROM material_categories WHERE category_name = 'Biomass' LIMIT 1), 'Wood Chips', 'solid', 'Clean wood chips from forestry.', true),
    ((SELECT category_id FROM material_categories WHERE category_name = 'Animal Waste' LIMIT 1), 'Cow Manure', 'solid', 'Composted cow manure fertilizer.', true);

-- 4. Listings
INSERT INTO material_listings 
    (seller_id, material_id, title, description, quantity, unit, price_per_unit, currency, origin_city, origin_country, images, is_active, available_from)
VALUES 
    (
        (SELECT user_id FROM users WHERE email = 'demo@agriloop.com' LIMIT 1), 
        (SELECT material_id FROM materials WHERE material_name = 'Organic Tomato Waste' LIMIT 1), 
        'Bulk Organic Tomato Waste', 
        'Fresh tomato waste available for immediate pickup. Suitable for composting or biogas.', 
        500, 'kg', 5.00, 'INR', 
        'Hamburg', 'Germany', 
        ARRAY['https://images.pexels.com/photos/533360/pexels-photo-533360.jpeg?auto=compress&cs=tinysrgb&w=600'], 
        true,
        CURRENT_DATE
    ),
    (
        (SELECT user_id FROM users WHERE email = 'farmer@punjab.com' LIMIT 1), 
        (SELECT material_id FROM materials WHERE material_name = 'Wheat Straw Bales' LIMIT 1), 
        'High Quality Wheat Straw Bales', 
        'Dry and compressed wheat straw bales. Perfect for mushroom cultivation.', 
        2000, 'kg', 8.00, 'INR', 
        'Punjab', 'India', 
        ARRAY['https://images.pexels.com/photos/1600139/pexels-photo-1600139.jpeg?auto=compress&cs=tinysrgb&w=600'], 
        true,
        CURRENT_DATE
    ),
    (
        (SELECT user_id FROM users WHERE email = 'farmer@punjab.com' LIMIT 1), 
        (SELECT material_id FROM materials WHERE material_name = 'Apple Pomace' LIMIT 1), 
        'Fresh Apple Pomace', 
        'High fiber apple pomace from recent juice pressing.', 
        300, 'kg', 3.00, 'INR', 
        'Himachal Pradesh', 'India', 
        ARRAY['https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=600'], 
        true,
        CURRENT_DATE
    ),
    (
        (SELECT user_id FROM users WHERE email = 'farmer@punjab.com' LIMIT 1), 
        (SELECT material_id FROM materials WHERE material_name = 'Rice Husks' LIMIT 1), 
        'Rice Husks for Biomass', 
        'Dry rice husks, low moisture content.', 
        1500, 'kg', 6.00, 'INR', 
        'Andhra Pradesh', 'India', 
        ARRAY['https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=600'], 
        true,
        CURRENT_DATE
    ),
    (
        (SELECT user_id FROM users WHERE email = 'demo@agriloop.com' LIMIT 1), 
        (SELECT material_id FROM materials WHERE material_name = 'Wood Chips' LIMIT 1), 
        'Forestry Wood Chips', 
        'Clean chips, no chemical treatment.', 
        1000, 'kg', 10.00, 'INR', 
        'Kerala', 'India', 
        ARRAY['https://images.pexels.com/photos/129733/pexels-photo-129733.jpeg?auto=compress&cs=tinysrgb&w=600'], 
        true,
        CURRENT_DATE
    ),
    (
        (SELECT user_id FROM users WHERE email = 'farmer@punjab.com' LIMIT 1), 
        (SELECT material_id FROM materials WHERE material_name = 'Cow Manure' LIMIT 1), 
        'Organic Cow Manure Compost', 
        'Aged and composted manure.', 
        5000, 'kg', 2.00, 'INR', 
        'Gujarat', 'India', 
        ARRAY['https://images.pexels.com/photos/2252584/pexels-photo-2252584.jpeg?auto=compress&cs=tinysrgb&w=600'], 
        true,
        CURRENT_DATE
    );
