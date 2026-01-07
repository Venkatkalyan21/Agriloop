#!/bin/bash
# Railway Database Initialization Script
# This script should be run inside Railway's environment

echo "Initializing AgriLoop Database..."

# The DATABASE_URL is automatically available in Railway
psql $DATABASE_URL << 'EOF'

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('company', 'transporter', 'admin');
CREATE TYPE company_type AS ENUM ('manufacturer', 'recycler', 'waste_generator', 'other');
CREATE TYPE transaction_status AS ENUM ('pending', 'confirmed', 'in_transit', 'completed', 'cancelled');

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

-- Material Categories
CREATE TABLE IF NOT EXISTS material_categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Materials
CREATE TABLE IF NOT EXISTS materials (
    material_id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES material_categories(category_id),
    material_name VARCHAR(255) NOT NULL,
    physical_form VARCHAR(50),
    description TEXT,
    recyclable BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Material Listings
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
    available_from DATE NOT NULL,
    origin_city VARCHAR(100),
    origin_country VARCHAR(100),
    images TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sample data
INSERT INTO material_categories (category_name, description) VALUES
    ('Vegetables', 'Vegetable waste'),
    ('Fruits', 'Fruit waste'),
    ('Grains & Cereals', 'Grain residues'),
    ('Biomass', 'Biomass materials'),
    ('Animal Waste', 'Animal byproducts')
ON CONFLICT (category_name) DO NOTHING;

EOF

echo "✅ Database initialized successfully!"
