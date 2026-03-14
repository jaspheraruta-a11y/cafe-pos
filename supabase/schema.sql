-- =============================================
-- Cafe POS - Supabase Database Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- ENUMS
-- =============================================
CREATE TYPE user_role AS ENUM ('admin', 'client', 'rider');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled');
CREATE TYPE payment_method AS ENUM ('cash', 'gcash', 'card', 'cod');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');

-- =============================================
-- PROFILES (extends auth.users)
-- =============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'client',
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- RIDERS (delivery riders profile)
-- =============================================
CREATE TABLE riders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  vehicle_type TEXT,
  plate_number TEXT,
  photo_url TEXT,
  is_available BOOLEAN DEFAULT true,
  current_lat DECIMAL(10, 8),
  current_lng DECIMAL(11, 8),
  rating DECIMAL(3, 2) DEFAULT 5.00,
  total_deliveries INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- CATEGORIES
-- =============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  sort_order INT DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PRODUCTS (menu items)
-- =============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  stock_quantity INT DEFAULT 0,
  has_sizes BOOLEAN DEFAULT false,
  has_addons BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PRODUCT SIZES & ADDONS
-- =============================================
CREATE TABLE product_sizes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price_modifier DECIMAL(10, 2) DEFAULT 0,
  sort_order INT DEFAULT 0
);

CREATE TABLE product_addons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) DEFAULT 0,
  sort_order INT DEFAULT 0
);

-- =============================================
-- PROMO CODES
-- =============================================
CREATE TABLE promos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT CHECK (discount_type IN ('percent', 'fixed')),
  discount_value DECIMAL(10, 2) NOT NULL,
  min_order DECIMAL(10, 2) DEFAULT 0,
  max_uses INT,
  used_count INT DEFAULT 0,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ORDERS
-- =============================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  rider_id UUID REFERENCES riders(id) ON DELETE SET NULL,
  status order_status NOT NULL DEFAULT 'pending',
  order_type TEXT CHECK (order_type IN ('walkin', 'online', 'qr')) DEFAULT 'online',
  subtotal DECIMAL(10, 2) NOT NULL,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  promo_code TEXT,
  delivery_fee DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  delivery_address TEXT,
  delivery_notes TEXT,
  customer_notes TEXT,
  table_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_rider ON orders(rider_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- =============================================
-- ORDER ITEMS
-- =============================================
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  size TEXT,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  addons JSONB DEFAULT '[]',
  notes TEXT,
  line_total DECIMAL(10, 2) NOT NULL
);

-- =============================================
-- PAYMENTS
-- =============================================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  method payment_method NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  amount DECIMAL(10, 2) NOT NULL,
  reference_number TEXT,
  paid_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- DELIVERY TRACKING
-- =============================================
CREATE TABLE delivery_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  rider_id UUID REFERENCES riders(id) ON DELETE SET NULL,
  status order_status NOT NULL,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  eta_minutes INT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INVENTORY (for restocking alerts)
-- =============================================
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE UNIQUE,
  quantity INT NOT NULL DEFAULT 0,
  low_stock_threshold INT DEFAULT 10,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SALES REPORTS (aggregated for analytics)
-- =============================================
CREATE TABLE sales_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_date DATE NOT NULL,
  total_orders INT DEFAULT 0,
  total_revenue DECIMAL(12, 2) DEFAULT 0,
  walkin_count INT DEFAULT 0,
  online_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(report_date)
);

-- =============================================
-- FAVORITE ORDERS (customer saved orders)
-- =============================================
CREATE TABLE favorite_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  items JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- =============================================
-- ADMIN ACTIVITY LOGS
-- =============================================
CREATE TABLE admin_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE riders ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE promos ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update own
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow insert for new user" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Admins can manage everything (add service role or use custom claim)
CREATE POLICY "Admins full access profiles" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Products & categories: public read
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read product_sizes" ON product_sizes FOR SELECT USING (true);
CREATE POLICY "Public read product_addons" ON product_addons FOR SELECT USING (true);

-- Orders: users see own, admins see all
CREATE POLICY "Users view own orders" ON orders FOR SELECT USING (auth.uid() = user_id OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') OR
  EXISTS (SELECT 1 FROM riders WHERE user_id = auth.uid() AND riders.id = orders.rider_id));
CREATE POLICY "Users create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Admin update orders" ON orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Rider update assigned orders" ON orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM riders WHERE user_id = auth.uid() AND riders.id = orders.rider_id)
);

-- Order items: follow order access
CREATE POLICY "Order items select" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders o WHERE o.id = order_items.order_id AND (o.user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin') OR
    EXISTS (SELECT 1 FROM riders r WHERE r.user_id = auth.uid() AND r.id = o.rider_id)))
);
CREATE POLICY "Order items insert" ON order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders o WHERE o.id = order_items.order_id)
);

-- Payments: order-based access
CREATE POLICY "Payments select" ON payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders o WHERE o.id = payments.order_id AND (o.user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')))
);

-- Promos: public read active
CREATE POLICY "Public read active promos" ON promos FOR SELECT USING (is_active = true AND (valid_until IS NULL OR valid_until > NOW()));

-- =============================================
-- FUNCTIONS
-- =============================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), 'client');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(REPLACE(NEW.id::TEXT, '-', '') FROM 1 FOR 6));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_order_number ON orders;
CREATE TRIGGER set_order_number BEFORE INSERT ON orders
  FOR EACH ROW WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
  EXECUTE PROCEDURE generate_order_number();

-- =============================================
-- SEED DATA (optional - run if you want sample data)
-- =============================================
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Coffee', 'coffee', 'Espresso, Americano, Latte & more', 1),
  ('Milk Tea', 'milk-tea', 'Classic and flavored milk teas', 2),
  ('Pastries', 'pastries', 'Croissants, cakes & sweets', 3),
  ('Meals', 'meals', 'Breakfast and light meals', 4);

-- Get category IDs and insert sample products (run after categories exist)
DO $$
DECLARE
  cat_coffee UUID; cat_tea UUID; cat_pastry UUID; cat_meals UUID;
BEGIN
  SELECT id INTO cat_coffee FROM categories WHERE slug = 'coffee' LIMIT 1;
  SELECT id INTO cat_tea FROM categories WHERE slug = 'milk-tea' LIMIT 1;
  SELECT id INTO cat_pastry FROM categories WHERE slug = 'pastries' LIMIT 1;
  SELECT id INTO cat_meals FROM categories WHERE slug = 'meals' LIMIT 1;

  INSERT INTO products (category_id, name, slug, description, price, is_available, has_sizes, sort_order) VALUES
    (cat_coffee, 'Espresso', 'espresso', 'Single shot', 80.00, true, true, 1),
    (cat_coffee, 'Americano', 'americano', 'Double shot with hot water', 95.00, true, true, 2),
    (cat_coffee, 'Latte', 'latte', 'Espresso with steamed milk', 120.00, true, true, 3),
    (cat_coffee, 'Cappuccino', 'cappuccino', 'Espresso, steamed milk, foam', 120.00, true, true, 4),
    (cat_tea, 'Classic Milk Tea', 'classic-milk-tea', 'Black tea with milk', 99.00, true, true, 1),
    (cat_tea, 'Wintermelon', 'wintermelon', 'Wintermelon with milk', 109.00, true, true, 2),
    (cat_pastry, 'Croissant', 'croissant', 'Buttery croissant', 85.00, true, false, 1),
    (cat_pastry, 'Chocolate Cake', 'chocolate-cake', 'Slice of chocolate cake', 125.00, true, false, 2),
    (cat_meals, 'Breakfast Set', 'breakfast-set', 'Eggs, toast, coffee', 150.00, true, false, 1);
END $$;

-- Sample promo
INSERT INTO promos (code, description, discount_type, discount_value, min_order, valid_until) VALUES
  ('WELCOME10', '10% off first order', 'percent', 10, 200, NOW() + INTERVAL '30 days');
