// app/api/jobs/slug/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// GET /api/jobs/slug/[slug] - Get job listing by slug
export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    const { data: job, error } = await supabase
      .from('job_listings')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'active')
      .single()

    if (error || !job) {
      console.error('Error fetching job listing by slug:', error)
      return NextResponse.json({ success: false, error: 'Job listing not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, job })
  } catch (error) {
    console.error('Error in GET /api/jobs/slug/[slug]:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}