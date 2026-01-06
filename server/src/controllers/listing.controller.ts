import { Request, Response } from 'express';
import pool from '../config/database';

/**
 * Get all active listings with material and seller details
 */
export const getAllListings = async (req: Request, res: Response) => {
    try {
        const query = `
      SELECT 
        l.listing_id, 
        l.title, 
        l.description, 
        l.quantity, 
        l.unit, 
        l.price_per_unit, 
        l.currency, 
        l.origin_city, 
        l.origin_country,
        l.created_at,
        l.images,
        m.material_name,
        c.category_name as category,
        u.company_name as seller_name
      FROM material_listings l
      JOIN materials m ON l.material_id = m.material_id
      LEFT JOIN material_categories c ON m.category_id = c.category_id
      JOIN users u ON l.seller_id = u.user_id
      WHERE l.is_active = true AND l.quantity > 0
      ORDER BY l.created_at DESC
    `;

        const result = await pool.query(query);

        // Transform data to match frontend expectations if necessary
        const listings = result.rows.map(row => ({
            id: row.listing_id,
            name: row.material_name, // Mapping for frontend "name"
            title: row.title,
            description: row.description,
            quantity: `${row.quantity} ${row.unit}`,
            price: `${row.currency === 'USD' ? '$' : '₹'}${row.price_per_unit}/${row.unit}`,
            location: `${row.origin_city}, ${row.origin_country}`,
            category: row.category,
            image: row.images && row.images.length > 0 ? row.images[0] : null,
            seller: row.seller_name,
            createdAt: row.created_at
        }));

        res.status(200).json(listings);
    } catch (error: any) {
        console.error('Error fetching listings:', error);
        res.status(500).json({ message: 'Error fetching listings', error: error.message });
    }
};

/**
 * Create a new listing
 */
export const createListing = async (req: Request, res: Response) => {
    try {
        // This is a simplified version. In a real app, you'd likely create the material first if it doesn't exist,
        // or select from existing materials.
        // For now, we'll assume the request body handles the complexity or we insert basic data.

        // NOTE: To properly implement this, we need to know how the frontend sends data.
        // For now, let's just return a placeholder to satisfy the route, 
        // as the immediate user goal is SEEING listings in the marketplace.
        // The "Create Listing" page likely needs its own backend work later.

        res.status(501).json({ message: 'Create listing implemented partially' });
    } catch (error: any) {
        console.error('Error creating listing:', error);
        res.status(500).json({ message: 'Error creating listing', error: error.message });
    }
};
