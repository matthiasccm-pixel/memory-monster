import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase'

interface RouteParams {
  params: {
    slug: string
  }
}

// GET /api/blog/slug/[slug] - Get blog post by slug
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = params

    const { data: post, error } = await supabaseAdmin
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return NextResponse.json(
          { error: 'Post not found' },
          { status: 404 }
        )
      }
      console.error('Error fetching post by slug:', error)
      return NextResponse.json(
        { error: 'Failed to fetch post' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      post
    })

  } catch (error) {
    console.error('Get post by slug API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}