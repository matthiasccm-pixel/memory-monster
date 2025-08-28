import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase'
import type { BlogPost } from '../../../../lib/supabase'

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/blog/posts/[id] - Get single blog post
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params

    const { data: post, error } = await supabaseAdmin
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return NextResponse.json(
          { error: 'Post not found' },
          { status: 404 }
        )
      }
      console.error('Error fetching post:', error)
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
    console.error('Get post API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/blog/posts/[id] - Update blog post
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    const body = await request.json()
    const {
      title,
      slug,
      excerpt,
      content,
      author,
      author_id,
      category,
      status,
      featured_image,
      tags,
      seo_title,
      seo_description
    } = body

    // Calculate read time if content changed
    const wordCount = content?.split(/\s+/).length || 0
    const read_time = wordCount > 0 ? Math.ceil(wordCount / 200) : undefined

    const updateData: Partial<BlogPost> = {
      ...(title && { title }),
      ...(slug && { slug }),
      ...(excerpt !== undefined && { excerpt }),
      ...(content && { content }),
      ...(author && { author }),
      ...(author_id !== undefined && { author_id }),
      ...(category && { category }),
      ...(status && { status: status as 'draft' | 'published' }),
      ...(featured_image !== undefined && { featured_image }),
      ...(read_time && { read_time }),
      ...(tags !== undefined && { tags: Array.isArray(tags) ? tags : tags?.split(',').map((t: string) => t.trim()).filter(Boolean) || [] }),
      ...(seo_title !== undefined && { seo_title }),
      ...(seo_description !== undefined && { seo_description })
    }

    // Set published_at when status changes to published
    if (status === 'published') {
      const { data: currentPost } = await supabaseAdmin
        .from('blog_posts')
        .select('status, published_at')
        .eq('id', id)
        .single()
      
      if (currentPost?.status === 'draft' && !currentPost.published_at) {
        updateData.published_at = new Date().toISOString()
      }
    }

    const { data: post, error } = await supabaseAdmin
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return NextResponse.json(
          { error: 'Post not found' },
          { status: 404 }
        )
      }
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json(
          { error: 'A post with this slug already exists' },
          { status: 409 }
        )
      }
      console.error('Error updating post:', error)
      return NextResponse.json(
        { error: 'Failed to update post' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      post
    })

  } catch (error) {
    console.error('Update post API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/blog/posts/[id] - Delete blog post
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params

    const { error } = await supabaseAdmin
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting post:', error)
      return NextResponse.json(
        { error: 'Failed to delete post' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully'
    })

  } catch (error) {
    console.error('Delete post API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}