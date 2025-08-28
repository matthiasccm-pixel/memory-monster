// app/api/jobs/listings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// GET /api/jobs/listings - Get all job listings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const department = searchParams.get('department')
    const location = searchParams.get('location')
    const employment_type = searchParams.get('employment_type')
    const featured = searchParams.get('featured')
    const status = searchParams.get('status') || 'active'

    let query = supabase
      .from('job_listings')
      .select('*')
      .eq('status', status)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (department) {
      query = query.eq('department', department)
    }
    if (location) {
      query = query.ilike('location', `%${location}%`)
    }
    if (employment_type) {
      query = query.eq('employment_type', employment_type)
    }
    if (featured === 'true') {
      query = query.eq('featured', true)
    }

    const { data: jobs, error, count } = await query

    if (error) {
      console.error('Error fetching job listings:', error)
      return NextResponse.json({ success: false, error: 'Failed to fetch job listings' }, { status: 500 })
    }

    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from('job_listings')
      .select('*', { count: 'exact', head: true })
      .eq('status', status)

    return NextResponse.json({
      success: true,
      jobs: jobs || [],
      total: totalCount || 0,
      limit,
      offset
    })
  } catch (error) {
    console.error('Error in GET /api/jobs/listings:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/jobs/listings - Create new job listing (admin only)
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 })
    }

    // Get user email from Clerk
    const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    })
    
    if (!response.ok) {
      return NextResponse.json({ success: false, error: 'Failed to verify user' }, { status: 403 })
    }
    
    const user = await response.json()
    const userEmail = user.email_addresses?.[0]?.email_address
    
    // Check if user is admin
    if (userEmail !== 'matthiasccm@gmail.com') {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    
    // Generate slug from title if not provided
    if (!body.slug) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim()
    }

    // Set posted_by information
    body.posted_by = 'Memory Monster Admin'
    body.posted_by_id = userId
    body.published_at = new Date().toISOString()

    const { data: job, error } = await supabase
      .from('job_listings')
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error('Error creating job listing:', error)
      return NextResponse.json({ success: false, error: 'Failed to create job listing' }, { status: 500 })
    }

    return NextResponse.json({ success: true, job })
  } catch (error) {
    console.error('Error in POST /api/jobs/listings:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}