import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'manager' | 'chief_teller' | 'teller'
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  description?: string
  price_htg: number
  price_usd: number
  qr_code?: string
  barcode?: string
  created_at: string
  updated_at: string
}

export interface Sale {
  id: string
  product_id: string
  quantity: number
  price_htg: number
  price_usd: number
  total_htg: number
  total_usd: number
  seller_id: string
  created_at: string
}

export interface Expense {
  id: string
  description: string
  amount_htg: number
  amount_usd: number
  category: string
  created_by: string
  created_at: string
}

export interface SaleWithProduct extends Sale {
  product: Product
  seller: User
}
