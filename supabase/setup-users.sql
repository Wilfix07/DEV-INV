-- This script helps set up sample users in Supabase Auth
-- Run this in your Supabase SQL editor after setting up the main schema

-- First, create the auth users (you'll need to do this manually in Supabase Auth)
-- Go to Authentication > Users in your Supabase dashboard and create these users:

-- 1. admin@deb-cargo.com / password123
-- 2. manager@deb-cargo.com / password123  
-- 3. chief@deb-cargo.com / password123
-- 4. teller@deb-cargo.com / password123

-- After creating the auth users, you can link them to the profiles by updating the user IDs
-- Replace the UUIDs below with the actual auth user IDs from your Supabase Auth

-- Example (replace with actual auth user IDs):
-- UPDATE public.users SET id = 'actual-auth-user-id-here' WHERE email = 'admin@deb-cargo.com';

-- Or alternatively, you can delete the sample profiles and let the signup process create them:
-- DELETE FROM public.users WHERE email IN (
--   'admin@deb-cargo.com',
--   'manager@deb-cargo.com', 
--   'chief@deb-cargo.com',
--   'teller@deb-cargo.com'
-- );

-- This will allow new users to sign up and create their own profiles
