// app/api/jobs/listings/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// GET /api/jobs/listings/[id] - Get single job listing
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const { data: job, error } = await supabase
      .from('job_listings')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching job listing:', error)
      return NextResponse.json({ success: false, error: 'Job listing not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, job })
  } catch (error) {
    console.error('Error in GET /api/jobs/listings/[id]:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/jobs/listings/[id] - Update job listing (admin only)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const { id } = params
    const body = await request.json()

    const { data: job, error } = await supabase
      .from('job_listings')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating job listing:', error)
      return NextResponse.json({ success: false, error: 'Failed to update job listing' }, { status: 500 })
    }

    return NextResponse.json({ success: true, job })
  } catch (error) {
    console.error('Error in PUT /api/jobs/listings/[id]:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/jobs/listings/[id] - Delete job listing (admin only)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    const { id } = params

    const { error } = await supabase
      .from('job_listings')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting job listing:', error)
      return NextResponse.json({ success: false, error: 'Failed to delete job listing' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/jobs/listings/[id]:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}