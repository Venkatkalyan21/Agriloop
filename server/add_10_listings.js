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
        console.log('Adding 10 diverse sample listings...\n');

        // Ensure categories exist
        const categories = [
            'Vegetables', 'Fruits', 'Grains & Cereals', 'Biomass',
            'Animal Waste', 'Processed Waste', 'Plastics', 'Metals', 'Glass'
        ];

        for (const cat of categories) {
            await pool.query(`
                INSERT INTO material_categories (category_name, description) 
                VALUES ($1, $2)
                ON CONFLICT DO NOTHING
            `, [cat, `${cat} materials`]);
        }

        // Ensure users exist
        const users = [
            { email: 'demo@agriloop.com', name: 'Green Earth Organics', city: 'Hamburg', country: 'Germany' },
            { email: 'farmer@punjab.com', name: 'Punjab Agro Farms', city: 'Ludhiana', country: 'India' },
            { email: 'recycler@kerala.com', name: 'Kerala Recyclers', city: 'Kochi', country: 'India' }
        ];

        for (const user of users) {
            await pool.query(`
                INSERT INTO users (email, password_hash, role, company_name, verified, active, city, country)
                VALUES ($1, '$2b$10$hash', 'company', $2, true, true, $3, $4)
                ON CONFLICT (email) DO NOTHING
            `, [user.email, user.name, user.city, user.country]);
        }

        // Get user IDs
        const getUserId = async (email) => {
            const res = await pool.query('SELECT user_id FROM users WHERE email = $1', [email]);
            return res.rows[0]?.user_id;
        };

        const user1 = await getUserId('demo@agriloop.com');
        const user2 = await getUserId('farmer@punjab.com');
        const user3 = await getUserId('recycler@kerala.com');

        // 10 diverse listings
        const listings = [
            { cat: 'Grains & Cereals', mat: 'Wheat Straw Bales', title: 'Premium Wheat Straw Bales', desc: 'High quality wheat straw for animal bedding', qty: 2000, price: 8, user: user2, img: 'https://images.pexels.com/photos/1600139/pexels-photo-1600139.jpeg?auto=compress&cs=tinysrgb&w=600' },
            { cat: 'Fruits', mat: 'Apple Pomace', title: 'Fresh Apple Pomace', desc: 'Leftover pulp from apple juice production', qty: 300, price: 3, user: user2, img: 'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=600' },
            { cat: 'Grains & Cereals', mat: 'Rice Husks', title: 'Rice Husks for Energy', desc: 'Dry rice husks suitable for biomass energy', qty: 1500, price: 6, user: user2, img: 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=600' },
            { cat: 'Biomass', mat: 'Wood Chips', title: 'Forestry Wood Chips', desc: 'Clean wood chips from sustainable forestry', qty: 1000, price: 10, user: user1, img: 'https://images.pexels.com/photos/129733/pexels-photo-129733.jpeg?auto=compress&cs=tinysrgb&w=600' },
            { cat: 'Animal Waste', mat: 'Cow Manure', title: 'Organic Cow Manure Compost', desc: 'Fully composted cow manure fertilizer', qty: 5000, price: 2, user: user2, img: 'https://images.pexels.com/photos/2252584/pexels-photo-2252584.jpeg?auto=compress&cs=tinysrgb&w=600' },
            { cat: 'Vegetables', mat: 'Potato Peels', title: 'Potato Processing Waste', desc: 'Fresh potato peels from food processing', qty: 800, price: 1.5, user: user1, img: 'https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=600' },
            { cat: 'Fruits', mat: 'Banana Peels', title: 'Banana Peel Waste', desc: 'Organic banana peels for composting', qty: 400, price: 1, user: user3, img: 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=600' },
            { cat: 'Processed Waste', mat: 'Coffee Grounds', title: 'Used Coffee Grounds', desc: 'Coffee grounds from cafes, great for gardens', qty: 200, price: 0.5, user: user3, img: 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=600' },
            { cat: 'Biomass', mat: 'Coconut Shells', title: 'Coconut Shell Waste', desc: 'Dried coconut shells for charcoal production', qty: 600, price: 4, user: user3, img: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=600' },
            { cat: 'Grains & Cereals', mat: 'Corn Stalks', title: 'Dried Corn Stalks', desc: 'Agricultural waste from corn harvest', qty: 3000, price: 5, user: user2, img: 'https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg?auto=compress&cs=tinysrgb&w=600' }
        ];

        let added = 0;
        for (const item of listings) {
            try {
                // Get or create category
                let catRes = await pool.query('SELECT category_id FROM material_categories WHERE category_name = $1', [item.cat]);
                if (catRes.rows.length === 0) continue;
                const catId = catRes.rows[0].category_id;

                // Get or create material
                let matRes = await pool.query('SELECT material_id FROM materials WHERE material_name = $1', [item.mat]);
                let matId;

                if (matRes.rows.length === 0) {
                    const newMat = await pool.query(
                        'INSERT INTO materials (category_id, material_name, physical_form, description, recyclable) VALUES ($1, $2, $3, $4, true) RETURNING material_id',
                        [catId, item.mat, 'solid', item.desc]
                    );
                    matId = newMat.rows[0].material_id;
                } else {
                    matId = matRes.rows[0].material_id;
                }

                // Check if listing already exists
                const existingListing = await pool.query('SELECT listing_id FROM material_listings WHERE title = $1', [item.title]);

                if (existingListing.rows.length === 0) {
                    await pool.query(`
                        INSERT INTO material_listings 
                        (seller_id, material_id, title, description, quantity, unit, price_per_unit, currency, origin_city, origin_country, images, is_active, available_from)
                        VALUES ($1, $2, $3, $4, $5, 'kg', $6, 'INR', 'City', 'Country', ARRAY[$7], true, CURRENT_DATE)
                    `, [item.user, matId, item.title, item.desc, item.qty, item.price, item.img]);

                    added++;
                    console.log(`✓ Added: ${item.title}`);
                }
            } catch (err) {
                console.log(`✗ Skipped: ${item.title} (${err.message})`);
            }
        }

        console.log(`\n✅ Successfully added ${added} new listings!`);

        // Show total count
        const countRes = await pool.query('SELECT COUNT(*) as total FROM material_listings');
        console.log(`📊 Total listings in database: ${countRes.rows[0].total}`);

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
};

seed();
