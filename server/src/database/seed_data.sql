-- SAMPLE DATA SEED SCRIPT
-- Run this in pgAdmin Query Tool or via npm run seed

-- 1. Insert Categories (if they don't exist)
INSERT INTO material_categories (category_name, description) VALUES
    ('Vegetables', 'Organic vegetable waste'),
    ('Fruits', 'Organic fruit waste and pomace'),
    ('Grains & Cereals', 'Straw, husks, and other grain residues'),
    ('Biomass', 'Wood chips, sawdust, and plant matter'),
    ('Animal Waste', 'Manure and other animal byproducts'),
    ('Processed Waste', 'Industrial food processing residues'),
    ('Plastics', 'Recyclable plastic materials'),
    ('Metals', 'Scrap metals'),
    ('Glass', 'Recyclable glass cullet')
ON CONFLICT DO NOTHING;

-- 2. Insert a Demo Seller (if not exists)
-- Password is 'password123' (hashed)
INSERT INTO users (email, password_hash, role, company_name, verified, active, city, country)
VALUES 
    ('demo@agriloop.com', '$2b$10$wT.f/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p', 'company', 'Green Earth Organics', true, true, 'Hamburg', 'Germany'),
    ('farmer@punjab.com', '$2b$10$wT.f/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p', 'company', 'Punjab Agro Farms', true, true, 'Ludhiana', 'India')
ON CONFLICT (email) DO NOTHING;

-- 3. Insert Materials
-- We first need to get IDs. In a script without PL/pgSQL variables, we can use subqueries.

INSERT INTO materials (category_id, material_name, physical_form, description, recyclable)
VALUES 
    ((SELECT category_id FROM material_categories WHERE category_name = 'Vegetables'), 'Organic Tomato Waste', 'solid', 'Fresh tomato waste suitable for composting.', true),
    ((SELECT category_id FROM material_categories WHERE category_name = 'Grains & Cereals'), 'Wheat Straw Bales', 'solid', 'Dry wheat straw for bedding or biomass.', true),
    ((SELECT category_id FROM material_categories WHERE category_name = 'Processed Waste'), 'Apple Pomace', 'solid', 'Leftover pulp from apple juice production.', true),
    ((SELECT category_id FROM material_categories WHERE category_name = 'Grains & Cereals'), 'Rice Husks', 'solid', 'Rice husks for energy or insulation.', true),
    ((SELECT category_id FROM material_categories WHERE category_name = 'Biomass'), 'Wood Chips', 'solid', 'Clean wood chips from forestry.', true),
    ((SELECT category_id FROM material_categories WHERE category_name = 'Animal Waste'), 'Cow Manure', 'solid', 'Composted cow manure fertilizer.', true)
ON CONFLICT (material_name) DO NOTHING; 

-- 4. Insert Listings
INSERT INTO material_listings 
    (seller_id, material_id, title, description, quantity, unit, price_per_unit, currency, origin_city, origin_country, images, is_active)
VALUES 
    (
        (SELECT user_id FROM users WHERE email = 'demo@agriloop.com'), 
        (SELECT material_id FROM materials WHERE material_name = 'Organic Tomato Waste'), 
        'Bulk Organic Tomato Waste', 
        'Fresh tomato waste available for immediate pickup. Suitable for composting or biogas.', 
        500, 'kg', 5.00, 'INR', 
        'Hamburg', 'Germany', 
        ARRAY['https://images.pexels.com/photos/533360/pexels-photo-533360.jpeg?auto=compress&cs=tinysrgb&w=600'], 
        true
    ),
    (
        (SELECT user_id FROM users WHERE email = 'farmer@punjab.com'), 
        (SELECT material_id FROM materials WHERE material_name = 'Wheat Straw Bales'), 
        'High Quality Wheat Straw Bales', 
        'Dry and compressed wheat straw bales. Perfect for mushroom cultivation.', 
        2000, 'kg', 8.00, 'INR', 
        'Punjab', 'India', 
        ARRAY['https://images.pexels.com/photos/1600139/pexels-photo-1600139.jpeg?auto=compress&cs=tinysrgb&w=600'], 
        true
    ),
    (
        (SELECT user_id FROM users WHERE email = 'farmer@punjab.com'), 
        (SELECT material_id FROM materials WHERE material_name = 'Apple Pomace'), 
        'Fresh Apple Pomace', 
        'High fiber apple pomace from recent juice pressing.', 
        300, 'kg', 3.00, 'INR', 
        'Himachal Pradesh', 'India', 
        ARRAY['https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=600'], 
        true
    ),
    (
        (SELECT user_id FROM users WHERE email = 'farmer@punjab.com'), 
        (SELECT material_id FROM materials WHERE material_name = 'Rice Husks'), 
        'Rice Husks for Biomass', 
        'Dry rice husks, low moisture content.', 
        1500, 'kg', 6.00, 'INR', 
        'Andhra Pradesh', 'India', 
        ARRAY['https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=600'], 
        true
    ),
    (
        (SELECT user_id FROM users WHERE email = 'demo@agriloop.com'), 
        (SELECT material_id FROM materials WHERE material_name = 'Wood Chips'), 
        'Forestry Wood Chips', 
        'Clean chips, no chemical treatment.', 
        1000, 'kg', 10.00, 'INR', 
        'Kerala', 'India', 
        ARRAY['https://images.pexels.com/photos/129733/pexels-photo-129733.jpeg?auto=compress&cs=tinysrgb&w=600'], 
        true
    ),
    (
        (SELECT user_id FROM users WHERE email = 'farmer@punjab.com'), 
        (SELECT material_id FROM materials WHERE material_name = 'Cow Manure'), 
        'Organic Cow Manure Compost', 
        'Aged and composted manure.', 
        5000, 'kg', 2.00, 'INR', 
        'Gujarat', 'India', 
        ARRAY['https://images.pexels.com/photos/2252584/pexels-photo-2252584.jpeg?auto=compress&cs=tinysrgb&w=600'], 
        true
    );
