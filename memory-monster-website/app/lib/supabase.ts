// app/lib/supabase.ts

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client for browser-side operations (with RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Database types for better TypeScript support
export interface Profile {
  id: string
  clerk_user_id?: string
  email: string
  full_name?: string
  avatar_url?: string
  stripe_customer_id?: string
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_subscription_id?: string
  stripe_customer_id: string
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'paused' | 'trialing'
  plan_id: 'free' | 'pro'
  price_id?: string
  current_period_start?: string
  current_period_end?: string
  cancel_at_period_end?: boolean
  trial_end?: string
  created_at: string
  updated_at: string
}

export interface AppUsage {
  id: string
  user_id: string
  device_id: string
  app_version?: string
  memory_scans_performed?: number
  memory_freed_mb?: number
  junk_files_removed?: number
  apps_optimized?: number
  ai_optimization_used?: number
  background_monitoring_enabled?: boolean
  advanced_analytics_viewed?: number
  last_active?: string
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  author_id?: string
  category: string
  status: 'draft' | 'published'
  featured_image?: string
  read_time?: number
  tags?: string[]
  seo_title?: string
  seo_description?: string
  published_at?: string
  created_at: string
  updated_at: string
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  created_at: string
}

export interface BlogTag {
  id: string
  name: string
  slug: string
  created_at: string
}