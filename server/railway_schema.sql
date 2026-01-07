-- AgriLoop Database Schema for Railway PostgreSQL
-- Run this script to initialize your production database

-- Create ENUM types first
CREATE TYPE user_role AS ENUM ('company', 'transporter', 'admin');
CREATE TYPE company_type AS ENUM ('manufacturer', 'recycler', 'waste_generator', 'other');
CREATE TYPE transaction_status AS ENUM ('pending', 'confirmed', 'in_transit', 'completed', 'cancelled');
CREATE TYPE transport_status AS ENUM ('scheduled', 'in_transit', 'delivered', 'cancelled');

-- Users table
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    company_name VARCHAR(255),
    verified BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    city VARCHAR(100),
    country VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Material Categories table
CREATE TABLE IF NOT EXISTS material_categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Materials table
CREATE TABLE IF NOT EXISTS materials (
    material_id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES material_categories(category_id),
    material_name VARCHAR(255) NOT NULL,
    physical_form VARCHAR(50),
    description TEXT,
    recyclable BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Material Listings table
CREATE TABLE IF NOT EXISTS material_listings (
    listing_id SERIAL PRIMARY KEY,
    seller_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    material_id INTEGER REFERENCES materials(material_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    quantity DECIMAL(12, 2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    price_per_unit DECIMAL(12, 2),
    currency VARCHAR(10) DEFAULT 'USD',
    minimum_order_quantity DECIMAL(12, 2),
    available_from DATE NOT NULL,
    available_until DATE,
    origin_city VARCHAR(100),
    origin_country VARCHAR(100),
    images TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    transaction_id SERIAL PRIMARY KEY,
    listing_id INTEGER REFERENCES material_listings(listing_id),
    buyer_id INTEGER REFERENCES users(user_id),
    seller_id INTEGER REFERENCES users(user_id),
    quantity DECIMAL(12, 2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    total_price DECIMAL(12, 2),
    currency VARCHAR(10) DEFAULT 'USD',
    status transaction_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_listings_seller ON material_listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_listings_material ON material_listings(material_id);
CREATE INDEX IF NOT EXISTS idx_listings_active ON material_listings(is_active);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer ON transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_seller ON transactions(seller_id);

-- Insert sample data
INSERT INTO material_categories (category_name, description) VALUES
    ('Vegetables', 'Organic vegetable waste'),
    ('Fruits', 'Organic fruit waste'),
    ('Grains & Cereals', 'Grain residues'),
    ('Biomass', 'Wood and plant matter'),
    ('Animal Waste', 'Manure and byproducts')
ON CONFLICT (category_name) DO NOTHING;

COMMENT ON DATABASE postgres IS 'AgriLoop Circular Economy Marketplace Database';
