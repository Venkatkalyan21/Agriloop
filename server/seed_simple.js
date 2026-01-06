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
        console.log('Starting simple seed...');

        // Insert categories
        await pool.query(`
            INSERT INTO material_categories (category_name, description) 
            SELECT 'Vegetables', 'Organic vegetable waste'
            WHERE NOT EXISTS (SELECT 1 FROM material_categories WHERE category_name = 'Vegetables')
        `);

        await pool.query(`
            INSERT INTO material_categories (category_name, description) 
            SELECT 'Grains & Cereals', 'Grain residues'
            WHERE NOT EXISTS (SELECT 1 FROM material_categories WHERE category_name = 'Grains & Cereals')
        `);

        // Insert users
        await pool.query(`
            INSERT INTO users (email, password_hash, role, company_name, verified, active, city, country)
            VALUES ('demo@agriloop.com', '$2b$10$hash', 'company', 'Green Earth Organics', true, true, 'Hamburg', 'Germany')
            ON CONFLICT (email) DO NOTHING
        `);

        // Get category and user IDs
        const catResult = await pool.query("SELECT category_id FROM material_categories WHERE category_name = 'Vegetables' LIMIT 1");
        const userResult = await pool.query("SELECT user_id FROM users WHERE email = 'demo@agriloop.com' LIMIT 1");

        if (catResult.rows.length === 0 || userResult.rows.length === 0) {
            throw new Error('Failed to get IDs');
        }

        const catId = catResult.rows[0].category_id;
        const userId = userResult.rows[0].user_id;

        // Insert material
        const matResult = await pool.query(`
            INSERT INTO materials (category_id, material_name, physical_form, description, recyclable)
            VALUES ($1, 'Organic Tomato Waste', 'solid', 'Fresh tomato waste', true)
            ON CONFLICT DO NOTHING
            RETURNING material_id
        `, [catId]);

        let matId;
        if (matResult.rows.length > 0) {
            matId = matResult.rows[0].material_id;
        } else {
            const existing = await pool.query("SELECT material_id FROM materials WHERE material_name = 'Organic Tomato Waste' LIMIT 1");
            matId = existing.rows[0].material_id;
        }

        // Insert listing with proper array syntax
        await pool.query(`
            INSERT INTO material_listings 
            (seller_id, material_id, title, description, quantity, unit, price_per_unit, currency, origin_city, origin_country, images, is_active, available_from)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_DATE)
        `, [
            userId,
            matId,
            'Bulk Organic Tomato Waste',
            'Fresh tomato waste available for immediate pickup',
            500,
            'kg',
            5.00,
            'INR',
            'Hamburg',
            'Germany',
            ['https://images.pexels.com/photos/533360/pexels-photo-533360.jpeg?auto=compress&cs=tinysrgb&w=600'],
            true
        ]);

        console.log('Seed completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

seed();
