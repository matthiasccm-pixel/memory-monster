import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase'
import type { BlogPost } from '../../../lib/supabase'

// GET /api/blog/posts - Fetch blog posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'published'
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    let query = supabaseAdmin
      .from('blog_posts')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    const { data: posts, error } = await query

    if (error) {
      console.error('Error fetching posts:', error)
      return NextResponse.json(
        { error: 'Failed to fetch posts' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      posts: posts || [],
      total: posts?.length || 0
    })

  } catch (error) {
    console.error('Blog posts API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/blog/posts - Create new blog post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      slug,
      excerpt,
      content,
      author,
      author_id,
      category,
      status = 'draft',
      featured_image,
      tags,
      seo_title,
      seo_description
    } = body

    // Validate required fields
    if (!title || !slug || !content || !author || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, content, author, category' },
        { status: 400 }
      )
    }

    // Calculate read time (rough estimate: 200 words per minute)
    const wordCount = content.split(/\s+/).length
    const read_time = Math.ceil(wordCount / 200)

    const postData: Partial<BlogPost> = {
      title,
      slug,
      excerpt,
      content,
      author,
      author_id,
      category,
      status: status as 'draft' | 'published',
      featured_image,
      read_time,
      tags: Array.isArray(tags) ? tags : tags?.split(',').map((t: string) => t.trim()).filter(Boolean) || [],
      seo_title,
      seo_description,
      published_at: status === 'published' ? new Date().toISOString() : null
    }

    const { data: post, error } = await supabaseAdmin
      .from('blog_posts')
      .insert([postData])
      .select()
      .single()

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json(
          { error: 'A post with this slug already exists' },
          { status: 409 }
        )
      }
      console.error('Error creating post:', error)
      return NextResponse.json(
        { error: 'Failed to create post' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      post
    }, { status: 201 })

  } catch (error) {
    console.error('Create post API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}