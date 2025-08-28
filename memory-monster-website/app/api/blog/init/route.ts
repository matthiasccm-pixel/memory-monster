import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase'

// Initialize blog tables and sample data
export async function POST() {
  try {
    console.log('🗄️ Initializing blog database...')

    // Create tables using raw SQL
    const queries = [
      // Blog categories table
      `CREATE TABLE IF NOT EXISTS blog_categories (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        slug VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        color VARCHAR(7) DEFAULT '#3b82f6',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,

      // Blog tags table
      `CREATE TABLE IF NOT EXISTS blog_tags (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        slug VARCHAR(50) NOT NULL UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,

      // Blog posts table
      `CREATE TABLE IF NOT EXISTS blog_posts (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        excerpt TEXT,
        content TEXT NOT NULL,
        author VARCHAR(100) NOT NULL,
        author_id VARCHAR(100),
        category VARCHAR(100) NOT NULL,
        status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
        featured_image TEXT,
        read_time INTEGER,
        tags TEXT[] DEFAULT '{}',
        seo_title VARCHAR(255),
        seo_description TEXT,
        published_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,

      // Indexes
      `CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);`,
      `CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);`,
      `CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);`,
      `CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);`,
      `CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);`,
      `CREATE INDEX IF NOT EXISTS idx_blog_tags_slug ON blog_tags(slug);`
    ]

    // Execute each query
    for (const query of queries) {
      const { error } = await supabaseAdmin.rpc('exec_sql', { query })
      if (error) {
        console.error('SQL Error:', error)
        // Continue with other queries even if one fails
      }
    }

    // Insert sample data
    const { error: categoriesError } = await supabaseAdmin
      .from('blog_categories')
      .upsert([
        { name: 'Technical', slug: 'technical', description: 'Technical deep-dives and explanations', color: '#8b5cf6' },
        { name: 'Guides', slug: 'guides', description: 'Step-by-step guides and tutorials', color: '#3b82f6' },
        { name: 'Performance', slug: 'performance', description: 'Mac performance tips and tricks', color: '#10b981' },
        { name: 'Updates', slug: 'updates', description: 'Product updates and announcements', color: '#f59e0b' }
      ], { onConflict: 'slug' })

    if (categoriesError) {
      console.error('Categories error:', categoriesError)
    }

    const { error: tagsError } = await supabaseAdmin
      .from('blog_tags')
      .upsert([
        { name: 'Mac Optimization', slug: 'mac-optimization' },
        { name: 'Memory Management', slug: 'memory-management' },
        { name: 'Performance', slug: 'performance' },
        { name: 'macOS', slug: 'macos' }
      ], { onConflict: 'slug' })

    if (tagsError) {
      console.error('Tags error:', tagsError)
    }

    // Insert sample blog posts
    const samplePosts = [
      {
        title: 'The Complete Mac Optimization Guide for 2025',
        slug: 'mac-optimization-guide-2025',
        excerpt: 'Everything you need to know about keeping your Mac running at peak performance.',
        content: `# The Complete Mac Optimization Guide for 2025

Your Mac is powerful, but memory thieves can slow it down. This guide shows you how to reclaim your Mac's speed and keep it running at peak performance.

## The Problem with Memory Leaks

Modern apps like Chrome, Slack, and Adobe Creative Suite are notorious memory hogs. They consume more and more RAM over time, leaving less for other applications.

## Solution: Intelligent Memory Management

Memory Monster uses AI to detect and prevent memory leaks before they impact your performance:

- Real-time monitoring of all applications
- Intelligent cleanup of leaked memory
- Predictive optimization based on usage patterns

## Getting Started

1. Download Memory Monster from the Mac App Store
2. Run your first optimization scan
3. Enable background monitoring for continuous protection

## Advanced Features

For power users, Memory Monster Pro offers:
- Custom optimization profiles
- Advanced analytics and reporting
- Priority support

Start optimizing your Mac today!`,
        author: 'Memory Monster Team',
        category: 'Guides',
        status: 'published',
        read_time: 5,
        tags: ['mac-optimization', 'performance'],
        published_at: new Date().toISOString()
      }
    ]

    const { error: postsError } = await supabaseAdmin
      .from('blog_posts')
      .upsert(samplePosts, { onConflict: 'slug' })

    if (postsError) {
      console.error('Posts error:', postsError)
    }

    return NextResponse.json({
      success: true,
      message: 'Blog database initialized successfully'
    })

  } catch (error) {
    console.error('Blog init error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to initialize blog database'
    }, { status: 500 })
  }
}