-- Fix RLS Policies - Infinite Recursion Issue
-- Run this script in your Supabase SQL Editor to fix the policy errors

-- First, drop all existing policies to clean up
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can insert users" ON public.users;
DROP POLICY IF EXISTS "Admins can update users" ON public.users;
DROP POLICY IF EXISTS "Admins can delete users" ON public.users;

DROP POLICY IF EXISTS "All authenticated users can view products" ON public.products;
DROP POLICY IF EXISTS "Managers and admins can manage products" ON public.products;

DROP POLICY IF EXISTS "All authenticated users can view sales" ON public.sales;
DROP POLICY IF EXISTS "Tellers and above can create sales" ON public.sales;

DROP POLICY IF EXISTS "Managers and admins can view expenses" ON public.expenses;
DROP POLICY IF EXISTS "Managers and admins can create expenses" ON public.expenses;

-- Now recreate the policies with the correct logic (no infinite recursion)

-- Users table policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can manage all users" ON public.users
    FOR ALL USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
    );

-- Products table policies
CREATE POLICY "All authenticated users can view products" ON public.products
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Managers and admins can manage products" ON public.products
    FOR ALL USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'manager')
    );

-- Sales table policies
CREATE POLICY "All authenticated users can view sales" ON public.sales
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Tellers and above can create sales" ON public.sales
    FOR INSERT WITH CHECK (
        (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'manager', 'chief_teller', 'teller')
    );

-- Expenses table policies
CREATE POLICY "Managers and admins can view expenses" ON public.expenses
    FOR SELECT USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'manager')
    );

CREATE POLICY "Managers and admins can create expenses" ON public.expenses
    FOR INSERT WITH CHECK (
        (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'manager')
    );

-- Verify policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
