-- Database schema for store details
-- Run this SQL in your Neon database or PostgreSQL database

-- Store details table
CREATE TABLE IF NOT EXISTS store_details (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    street_address VARCHAR(500) NOT NULL,
    city VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    hours VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    banner_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_store_details_id ON store_details(id);

-- Function to update updated_at timestamp (if not already exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_store_details_updated_at ON store_details;
CREATE TRIGGER update_store_details_updated_at BEFORE UPDATE ON store_details
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

