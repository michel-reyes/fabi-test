-- ===============================================
-- UBER EATS CLONE - POSTGRESQL DATABASE SCHEMA
-- ===============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===============================================
-- USERS TABLE
-- ===============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) CHECK (role IN ('customer', 'seller', 'admin')) DEFAULT 'customer',
    is_active BOOLEAN DEFAULT true,
    profile_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===============================================
-- ADDRESSES TABLE
-- ===============================================
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    label VARCHAR(50) DEFAULT 'Home', -- Home, Work, Other
    street_address VARCHAR(255) NOT NULL,
    apartment VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) DEFAULT 'United States',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_default BOOLEAN DEFAULT false,
    delivery_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===============================================
-- RESTAURANTS TABLE
-- ===============================================
CREATE TABLE restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cuisine_type VARCHAR(50) CHECK (cuisine_type IN ('italian', 'chinese')) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    
    -- Address fields
    street_address VARCHAR(255) NOT NULL,
    apartment VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Business details
    cover_image_url TEXT,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    is_open BOOLEAN DEFAULT false,
    
    -- Ratings and stats
    average_rating DECIMAL(3, 2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    
    -- Delivery info
    delivery_fee DECIMAL(10, 2) DEFAULT 2.99,
    minimum_order DECIMAL(10, 2) DEFAULT 0.00,
    estimated_delivery_time INTEGER DEFAULT 30, -- in minutes
    
    -- Business hours (stored as JSON)
    business_hours JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===============================================
-- MENU CATEGORIES TABLE
-- ===============================================
CREATE TABLE menu_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===============================================
-- MENU ITEMS TABLE
-- ===============================================
CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES menu_categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    
    -- Item details
    is_available BOOLEAN DEFAULT true,
    is_vegetarian BOOLEAN DEFAULT false,
    is_vegan BOOLEAN DEFAULT false,
    is_gluten_free BOOLEAN DEFAULT false,
    spice_level INTEGER DEFAULT 0, -- 0-5 scale
    calories INTEGER,
    prep_time INTEGER DEFAULT 15, -- in minutes
    
    -- Customization options (stored as JSON)
    customization_options JSONB, -- [{name: "Size", options: ["Small", "Medium", "Large"], prices: [0, 2, 4]}]
    
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===============================================
-- ORDERS TABLE
-- ===============================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    
    -- Order status
    status VARCHAR(50) CHECK (status IN (
        'pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivering', 'delivered', 'cancelled'
    )) DEFAULT 'pending',
    
    -- Delivery information
    delivery_address_id UUID REFERENCES addresses(id),
    delivery_instructions TEXT,
    
    -- Order totals
    subtotal DECIMAL(10, 2) NOT NULL,
    delivery_fee DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) NOT NULL,
    tip_amount DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    
    -- Timing
    estimated_delivery_time TIMESTAMP WITH TIME ZONE,
    actual_delivery_time TIMESTAMP WITH TIME ZONE,
    
    -- Payment (placeholder for future integration)
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(50),
    
    -- Special instructions
    special_instructions TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===============================================
-- ORDER ITEMS TABLE
-- ===============================================
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    
    -- Customizations for this specific order item
    customizations JSONB, -- Store selected customizations
    special_instructions TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===============================================
-- RESTAURANT REVIEWS TABLE
-- ===============================================
CREATE TABLE restaurant_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    review_text TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure one review per customer per restaurant
    UNIQUE(restaurant_id, customer_id)
);

-- ===============================================
-- FAVORITES TABLE
-- ===============================================
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure one favorite per user per restaurant
    UNIQUE(user_id, restaurant_id)
);

-- ===============================================
-- CART TABLE (For persistent cart storage)
-- ===============================================
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    customizations JSONB,
    special_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===============================================
-- INDEXES FOR PERFORMANCE
-- ===============================================

-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Address indexes
CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_addresses_location ON addresses(latitude, longitude);

-- Restaurant indexes
CREATE INDEX idx_restaurants_owner_id ON restaurants(owner_id);
CREATE INDEX idx_restaurants_cuisine_type ON restaurants(cuisine_type);
CREATE INDEX idx_restaurants_location ON restaurants(latitude, longitude);
CREATE INDEX idx_restaurants_active_open ON restaurants(is_active, is_open);

-- Menu indexes
CREATE INDEX idx_menu_categories_restaurant_id ON menu_categories(restaurant_id);
CREATE INDEX idx_menu_items_restaurant_id ON menu_items(restaurant_id);
CREATE INDEX idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX idx_menu_items_available ON menu_items(is_available);

-- Order indexes
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_restaurant_id ON orders(restaurant_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Review indexes
CREATE INDEX idx_restaurant_reviews_restaurant_id ON restaurant_reviews(restaurant_id);
CREATE INDEX idx_restaurant_reviews_customer_id ON restaurant_reviews(customer_id);

-- Favorites indexes
CREATE INDEX idx_favorites_user_id ON favorites(user_id);

-- Cart indexes
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);

-- ===============================================
-- FUNCTIONS AND TRIGGERS
-- ===============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON restaurants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_categories_updated_at BEFORE UPDATE ON menu_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_restaurant_reviews_updated_at BEFORE UPDATE ON restaurant_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update restaurant average rating
CREATE OR REPLACE FUNCTION update_restaurant_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE restaurants 
    SET 
        average_rating = (
            SELECT COALESCE(AVG(rating), 0) 
            FROM restaurant_reviews 
            WHERE restaurant_id = COALESCE(NEW.restaurant_id, OLD.restaurant_id)
        ),
        total_reviews = (
            SELECT COUNT(*) 
            FROM restaurant_reviews 
            WHERE restaurant_id = COALESCE(NEW.restaurant_id, OLD.restaurant_id)
        )
    WHERE id = COALESCE(NEW.restaurant_id, OLD.restaurant_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Trigger to update restaurant rating when review is added/updated/deleted
CREATE TRIGGER update_restaurant_rating_trigger 
    AFTER INSERT OR UPDATE OR DELETE ON restaurant_reviews
    FOR EACH ROW EXECUTE FUNCTION update_restaurant_rating();

-- ===============================================
-- SAMPLE DATA (ITALIAN & CHINESE RESTAURANTS)
-- ===============================================

-- Sample admin user
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
('admin@ubereats.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewWmV7SzT/CkZ2Xi', 'Admin', 'User', 'admin');

-- Sample restaurant owners
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
('mario@italianplace.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewWmV7SzT/CkZ2Xi', 'Mario', 'Rossi', 'seller'),
('chen@dragonpalace.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewWmV7SzT/CkZ2Xi', 'Chen', 'Wang', 'seller'),
('giuseppe@bellaroma.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewWmV7SzT/CkZ2Xi', 'Giuseppe', 'Bianchi', 'seller'),
('li@goldenwok.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewWmV7SzT/CkZ2Xi', 'Li', 'Zhang', 'seller');

-- Sample customers
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
('john@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewWmV7SzT/CkZ2Xi', 'John', 'Doe', 'customer'),
('jane@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewWmV7SzT/CkZ2Xi', 'Jane', 'Smith', 'customer');

-- Sample Italian Restaurants
INSERT INTO restaurants (owner_id, name, description, cuisine_type, phone, email, street_address, city, state, postal_code, latitude, longitude, cover_image_url, is_active, is_open, average_rating, total_reviews, delivery_fee, minimum_order, estimated_delivery_time) VALUES
((SELECT id FROM users WHERE email = 'mario@italianplace.com'), 'Marios Italian Kitchen', 'Authentic Italian cuisine with fresh ingredients and traditional recipes', 'italian', '(555) 123-4567', 'mario@italianplace.com', '123 Little Italy St', 'New York', 'NY', '10013', 40.7589, -73.9441, '/images/restaurants/marios-cover.jpg', true, true, 4.5, 234, 3.99, 15.00, 35),
((SELECT id FROM users WHERE email = 'giuseppe@bellaroma.com'), 'Bella Roma Pizzeria', 'Wood-fired pizzas and homemade pasta in the heart of the city', 'italian', '(555) 234-5678', 'giuseppe@bellaroma.com', '456 Roma Avenue', 'New York', 'NY', '10014', 40.7505, -73.9934, '/images/restaurants/bellaroma-cover.jpg', true, true, 4.3, 189, 2.99, 12.00, 30);

-- Sample Chinese Restaurants  
INSERT INTO restaurants (owner_id, name, description, cuisine_type, phone, email, street_address, city, state, postal_code, latitude, longitude, cover_image_url, is_active, is_open, average_rating, total_reviews, delivery_fee, minimum_order, estimated_delivery_time) VALUES
((SELECT id FROM users WHERE email = 'chen@dragonpalace.com'), 'Dragon Palace', 'Traditional Szechuan and Cantonese dishes with bold flavors', 'chinese', '(555) 345-6789', 'chen@dragonpalace.com', '789 Chinatown Ave', 'New York', 'NY', '10013', 40.7157, -73.9970, '/images/restaurants/dragon-palace-cover.jpg', true, true, 4.7, 312, 4.99, 20.00, 25),
((SELECT id FROM users WHERE email = 'li@goldenwok.com'), 'Golden Wok Express', 'Fast and delicious Chinese takeout with generous portions', 'chinese', '(555) 456-7890', 'li@goldenwok.com', '321 Dragon Street', 'New York', 'NY', '10013', 40.7183, -73.9944, '/images/restaurants/golden-wok-cover.jpg', true, true, 4.2, 156, 3.49, 10.00, 20);

-- This schema provides:
-- 1. Complete user management (customers, sellers, admins)
-- 2. Restaurant management with location support
-- 3. Flexible menu system with categories and customizations
-- 4. Comprehensive order workflow
-- 5. Review and rating system
-- 6. Cart persistence
-- 7. Address management
-- 8. Performance optimized with proper indexes
-- 9. Automatic triggers for data consistency
-- 10. Sample data for Italian and Chinese restaurants