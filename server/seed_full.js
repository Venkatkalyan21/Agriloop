const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'circular_economy_marketplace',
    password: 'kalyan@2005',
    port: 5432,
});

const seed = async () => {
    try {
        console.log('Adding 6 sample listings...');

        // Categories
        const categories = ['Vegetables', 'Grains & Cereals', 'Processed Waste', 'Biomass', 'Animal Waste'];
        for (const cat of categories) {
            await pool.query(`
                INSERT INTO material_categories (category_name, description) 
                SELECT $1, $2
                WHERE NOT EXISTS (SELECT 1 FROM material_categories WHERE category_name = $1)
            `, [cat, `${cat} description`]);
        }

        // Users
        await pool.query(`
            INSERT INTO users (email, password_hash, role, company_name, verified, active, city, country)
            VALUES 
            ('demo@agriloop.com', '$2b$10$hash', 'company', 'Green Earth Organics', true, true, 'Hamburg', 'Germany'),
            ('farmer@punjab.com', '$2b$10$hash', 'company', 'Punjab Agro Farms', true, true, 'Ludhiana', 'India')
            ON CONFLICT (email) DO NOTHING
        `);

        // Materials and Listings
        const items = [
            { cat: 'Vegetables', mat: 'Organic Tomato Waste', user: 'demo@agriloop.com', title: 'Bulk Organic Tomato Waste', q: 500, p: 5, img: 'https://images.pexels.com/photos/533360/pexels-photo-533360.jpeg?auto=compress&cs=tinysrgb&w=600' },
            { cat: 'Grains & Cereals', mat: 'Wheat Straw Bales', user: 'farmer@punjab.com', title: 'High Quality Wheat Straw Bales', q: 2000, p: 8, img: 'https://images.pexels.com/photos/1600139/pexels-photo-1600139.jpeg?auto=compress&cs=tinysrgb&w=600' },
            { cat: 'Processed Waste', mat: 'Apple Pomace', user: 'farmer@punjab.com', title: 'Fresh Apple Pomace', q: 300, p: 3, img: 'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=600' },
            { cat: 'Grains & Cereals', mat: 'Rice Husks', user: 'farmer@punjab.com', title: 'Rice Husks for Biomass', q: 1500, p: 6, img: 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=600' },
            { cat: 'Biomass', mat: 'Wood Chips', user: 'demo@agriloop.com', title: 'Forestry Wood Chips', q: 1000, p: 10, img: 'https://images.pexels.com/photos/129733/pexels-photo-129733.jpeg?auto=compress&cs=tinysrgb&w=600' },
            { cat: 'Animal Waste', mat: 'Cow Manure', user: 'farmer@punjab.com', title: 'Organic Cow Manure Compost', q: 5000, p: 2, img: 'https://images.pexels.com/photos/2252584/pexels-photo-2252584.jpeg?auto=compress&cs=tinysrgb&w=600' }
        ];

        for (const item of items) {
            // Get category ID
            const catRes = await pool.query('SELECT category_id FROM material_categories WHERE category_name = $1', [item.cat]);
            if (catRes.rows.length === 0) continue;
            const catId = catRes.rows[0].category_id;

            // Get user ID
            const userRes = await pool.query('SELECT user_id FROM users WHERE email = $1', [item.user]);
            if (userRes.rows.length === 0) continue;
            const userId = userRes.rows[0].user_id;

            // Insert or get material
            let matId;
            const matCheck = await pool.query('SELECT material_id FROM materials WHERE material_name = $1', [item.mat]);
            if (matCheck.rows.length > 0) {
                matId = matCheck.rows[0].material_id;
            } else {
                const matRes = await pool.query(
                    'INSERT INTO materials (category_id, material_name, physical_form, description, recyclable) VALUES ($1, $2, $3, $4, true) RETURNING material_id',
                    [catId, item.mat, 'solid', `${item.mat} description`]
                );
                matId = matRes.rows[0].material_id;
            }

            // Insert listing
            const listCheck = await pool.query('SELECT listing_id FROM material_listings WHERE title = $1', [item.title]);
            if (listCheck.rows.length === 0) {
                await pool.query(`
                    INSERT INTO material_listings 
                    (seller_id, material_id, title, description, quantity, unit, price_per_unit, currency, origin_city, origin_country, images, is_active, available_from)
                    VALUES ($1, $2, $3, $4, $5, 'kg', $6, 'INR', 'City', 'Country', $7, true, CURRENT_DATE)
                `, [userId, matId, item.title, item.title, item.q, item.p, [item.img]]);
                console.log(`✓ Added: ${item.title}`);
            }
        }

        console.log('\n✅ All 6 sample listings added successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
};

seed();
