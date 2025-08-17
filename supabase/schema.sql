-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'chief_teller', 'teller')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    price_htg DECIMAL(10,2) NOT NULL CHECK (price_htg >= 0),
    price_usd DECIMAL(10,2) NOT NULL CHECK (price_usd >= 0),
    qr_code TEXT UNIQUE,
    barcode TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sales table
CREATE TABLE IF NOT EXISTS public.sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price_htg DECIMAL(10,2) NOT NULL CHECK (price_htg >= 0),
    price_usd DECIMAL(10,2) NOT NULL CHECK (price_usd >= 0),
    total_htg DECIMAL(10,2) NOT NULL CHECK (total_htg >= 0),
    total_usd DECIMAL(10,2) NOT NULL CHECK (total_usd >= 0),
    seller_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    description TEXT NOT NULL,
    amount_htg DECIMAL(10,2) NOT NULL CHECK (amount_htg >= 0),
    amount_usd DECIMAL(10,2) NOT NULL CHECK (amount_usd >= 0),
    category TEXT NOT NULL,
    created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_products_name ON public.products(name);
CREATE INDEX IF NOT EXISTS idx_products_qr_code ON public.products(qr_code);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON public.products(barcode);
CREATE INDEX IF NOT EXISTS idx_sales_product_id ON public.sales(product_id);
CREATE INDEX IF NOT EXISTS idx_sales_seller_id ON public.sales(seller_id);
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON public.sales(created_at);
CREATE INDEX IF NOT EXISTS idx_expenses_created_by ON public.expenses(created_by);
CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON public.expenses(created_at);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON public.expenses(category);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Allow authenticated users to insert their own profile (for signup)
CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Allow admins to manage all users (but avoid circular references)
CREATE POLICY "Admins can manage all users" ON public.users
    FOR ALL USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
    );

-- Create RLS policies for products table
CREATE POLICY "All authenticated users can view products" ON public.products
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Managers and admins can manage products" ON public.products
    FOR ALL USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'manager')
    );

-- Create RLS policies for sales table
CREATE POLICY "All authenticated users can view sales" ON public.sales
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Tellers and above can create sales" ON public.sales
    FOR INSERT WITH CHECK (
        (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'manager', 'chief_teller', 'teller')
    );

-- Create RLS policies for expenses table
CREATE POLICY "Managers and admins can view expenses" ON public.expenses
    FOR SELECT USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'manager')
    );

CREATE POLICY "Managers and admins can create expenses" ON public.expenses
    FOR INSERT WITH CHECK (
        (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'manager')
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
-- Note: These are sample user profiles. You need to create auth users separately in Supabase Auth
-- Sample passwords for testing: password123
INSERT INTO public.users (id, email, full_name, role) VALUES
    ('00000000-0000-0000-0000-000000000001', 'admin@deb-cargo.com', 'System Administrator', 'admin'),
    ('00000000-0000-0000-0000-000000000002', 'manager@deb-cargo.com', 'Store Manager', 'manager'),
    ('00000000-0000-0000-0000-000000000003', 'chief@deb-cargo.com', 'Chief Teller', 'chief_teller'),
    ('00000000-0000-0000-0000-000000000004', 'teller@deb-cargo.com', 'Sales Teller', 'teller')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (id, name, description, price_htg, price_usd, qr_code, barcode) VALUES
    ('00000000-0000-0000-0000-000000000101', 'Shipping Box Small', 'Small cardboard shipping box', 150.00, 1.50, 'QR_SMALL_BOX_001', 'BAR_SMALL_BOX_001'),
    ('00000000-0000-0000-0000-000000000102', 'Shipping Box Medium', 'Medium cardboard shipping box', 250.00, 2.50, 'QR_MED_BOX_001', 'BAR_MED_BOX_001'),
    ('00000000-0000-0000-0000-000000000103', 'Shipping Box Large', 'Large cardboard shipping box', 350.00, 3.50, 'QR_LARGE_BOX_001', 'BAR_LARGE_BOX_001'),
    ('00000000-0000-0000-0000-000000000104', 'Packing Tape', 'Strong packing tape roll', 75.00, 0.75, 'QR_TAPE_001', 'BAR_TAPE_001'),
    ('00000000-0000-0000-0000-000000000105', 'Bubble Wrap', 'Protective bubble wrap sheet', 100.00, 1.00, 'QR_BUBBLE_001', 'BAR_BUBBLE_001')
ON CONFLICT (id) DO NOTHING;
