import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../../.env') });
import pool from '../config/database';

const seed = async () => {
    try {
        console.log('Starting DB Seed...');

        // 1. Categories
        console.log('Inserting Categories...');
        const categories = [
            'Vegetables', 'Fruits', 'Grains & Cereals', 'Biomass',
            'Animal Waste', 'Processed Waste', 'Plastics', 'Metals', 'Glass'
        ];

        for (const cat of categories) {
            const check = await pool.query('SELECT category_id FROM material_categories WHERE category_name = $1', [cat]);
            if (check.rows.length === 0) {
                await pool.query(
                    `INSERT INTO material_categories (category_name, description) VALUES ($1, $2)`,
                    [cat, `${cat} description`]
                );
            }
        }

        // 2. Users
        console.log('Inserting Users...');
        const users = [
            { email: 'demo@agriloop.com', name: 'Green Earth Organics', city: 'Hamburg', country: 'Germany' },
            { email: 'farmer@punjab.com', name: 'Punjab Agro Farms', city: 'Ludhiana', country: 'India' }
        ];

        for (const user of users) {
            // email is UNIQUE in schema, so ON CONFLICT works here
            await pool.query(
                `INSERT INTO users (email, password_hash, role, company_name, verified, active, city, country)
                 VALUES ($1, $2, 'company', $3, true, true, $4, $5)
                 ON CONFLICT (email) DO NOTHING`,
                [user.email, '$2b$10$wT.f/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p/p', user.name, user.city, user.country]
            );
        }

        // 3. Materials
        console.log('Inserting Materials...');
        const getCatId = async (name: string) => {
            const res = await pool.query('SELECT category_id FROM material_categories WHERE category_name = $1', [name]);
            return res.rows[0]?.category_id;
        };

        const materials = [
            { cat: 'Vegetables', name: 'Organic Tomato Waste', desc: 'Fresh tomato waste suitable for composting.' },
            { cat: 'Grains & Cereals', name: 'Wheat Straw Bales', desc: 'Dry wheat straw for bedding or biomass.' },
            { cat: 'Processed Waste', name: 'Apple Pomace', desc: 'Leftover pulp from apple juice production.' },
            { cat: 'Grains & Cereals', name: 'Rice Husks', desc: 'Rice husks for energy or insulation.' },
            { cat: 'Biomass', name: 'Wood Chips', desc: 'Clean wood chips from forestry.' },
            { cat: 'Animal Waste', name: 'Cow Manure', desc: 'Composted cow manure fertilizer.' }
        ];

        for (const mat of materials) {
            const catId = await getCatId(mat.cat);
            if (catId) {
                const check = await pool.query('SELECT material_id FROM materials WHERE material_name = $1', [mat.name]);
                if (check.rows.length === 0) {
                    await pool.query(
                        `INSERT INTO materials (category_id, material_name, physical_form, description, recyclable)
                        VALUES ($1, $2, 'solid', $3, true)`,
                        [catId, mat.name, mat.desc]
                    );
                }
            }
        }

        // 4. Listings
        console.log('Inserting Listings...');
        const getUserId = async (email: string) => {
            const res = await pool.query('SELECT user_id FROM users WHERE email = $1', [email]);
            return res.rows[0]?.user_id;
        };
        const getMatId = async (name: string) => {
            const res = await pool.query('SELECT material_id FROM materials WHERE material_name = $1', [name]);
            return res.rows[0]?.material_id;
        };

        const listings = [
            { user: 'demo@agriloop.com', mat: 'Organic Tomato Waste', title: 'Bulk Organic Tomato Waste', q: 500, p: 5.00, img: 'https://images.pexels.com/photos/533360/pexels-photo-533360.jpeg?auto=compress&cs=tinysrgb&w=600' },
            { user: 'farmer@punjab.com', mat: 'Wheat Straw Bales', title: 'High Quality Wheat Straw Bales', q: 2000, p: 8.00, img: 'https://images.pexels.com/photos/1600139/pexels-photo-1600139.jpeg?auto=compress&cs=tinysrgb&w=600' },
            { user: 'farmer@punjab.com', mat: 'Apple Pomace', title: 'Fresh Apple Pomace', q: 300, p: 3.00, img: 'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=600' },
            { user: 'farmer@punjab.com', mat: 'Rice Husks', title: 'Rice Husks for Biomass', q: 1500, p: 6.00, img: 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=600' },
            { user: 'demo@agriloop.com', mat: 'Wood Chips', title: 'Forestry Wood Chips', q: 1000, p: 10.00, img: 'https://images.pexels.com/photos/129733/pexels-photo-129733.jpeg?auto=compress&cs=tinysrgb&w=600' },
            { user: 'farmer@punjab.com', mat: 'Cow Manure', title: 'Organic Cow Manure Compost', q: 5000, p: 2.00, img: 'https://images.pexels.com/photos/2252584/pexels-photo-2252584.jpeg?auto=compress&cs=tinysrgb&w=600' }
        ];

        for (const l of listings) {
            const userId = await getUserId(l.user);
            const matId = await getMatId(l.mat);

            if (userId && matId) {
                const check = await pool.query('SELECT listing_id FROM material_listings WHERE title = $1', [l.title]);
                if (check.rows.length === 0) {
                    await pool.query(
                        `INSERT INTO material_listings 
                        (seller_id, material_id, title, description, quantity, unit, price_per_unit, currency, origin_city, origin_country, images, is_active)
                        VALUES ($1, $2, $3, $3, $4, 'kg', $5, 'INR', 'City', 'Country', $6, true)`,
                        [userId, matId, l.title, l.q, l.p, [l.img]]
                    );
                }
            }
        }

        console.log('Database successfully seeded!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seed();
