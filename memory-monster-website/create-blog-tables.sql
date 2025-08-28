-- Blog tables for Memory Monster
-- Run this SQL in your Supabase SQL editor

-- Create blog_categories table
CREATE TABLE IF NOT EXISTS blog_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3b82f6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_tags table
CREATE TABLE IF NOT EXISTS blog_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
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
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_blog_tags_slug ON blog_tags(slug);

-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER trigger_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_blog_posts_updated_at();

-- Insert default categories
INSERT INTO blog_categories (name, slug, description, color) VALUES
    ('Technical', 'technical', 'Technical deep-dives and explanations', '#8b5cf6'),
    ('Guides', 'guides', 'Step-by-step guides and tutorials', '#3b82f6'),
    ('Performance', 'performance', 'Mac performance tips and tricks', '#10b981'),
    ('Updates', 'updates', 'Product updates and announcements', '#f59e0b'),
    ('Design', 'design', 'Design workflow optimization', '#ec4899'),
    ('Productivity', 'productivity', 'Boost your productivity on Mac', '#06b6d4')
ON CONFLICT (slug) DO NOTHING;

-- Insert default tags
INSERT INTO blog_tags (name, slug) VALUES
    ('Mac Optimization', 'mac-optimization'),
    ('Memory Management', 'memory-management'),
    ('Performance', 'performance'),
    ('macOS', 'macos'),
    ('Productivity', 'productivity'),
    ('Tips', 'tips'),
    ('Tutorial', 'tutorial'),
    ('Chrome', 'chrome'),
    ('Adobe', 'adobe'),
    ('Development', 'development')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample blog posts
INSERT INTO blog_posts (
    title, slug, excerpt, content, author, category, status, 
    read_time, tags, published_at, seo_title, seo_description
) VALUES (
    'The Complete Mac Optimization Guide for 2025',
    'mac-optimization-guide-2025',
    'Everything you need to know about keeping your Mac running at peak performance, from memory management to system-level optimizations.',
    '# The Complete Mac Optimization Guide for 2025

Your Mac is an incredible machine, but even the most powerful hardware can be brought to its knees by poor memory management. In this comprehensive guide, we''ll dive deep into the strategies that keep your Mac running at peak performance.

## Understanding Memory Management on macOS

macOS uses a sophisticated memory management system that''s generally quite efficient. However, modern applications often don''t play by the rules, leading to memory leaks, bloated processes, and system slowdowns.

### The Big Offenders

**Chrome and Electron Apps**
Chrome''s multi-process architecture, while great for stability, can consume enormous amounts of memory. Each tab, extension, and plugin runs in its own process, and these can quickly add up to several gigabytes of RAM usage.

**Adobe Creative Suite**
Photoshop, Illustrator, and other Creative Cloud applications are notorious for memory consumption. They often cache large amounts of data and don''t always release it properly when switching between documents.

**Development Tools**
IDEs like VS Code, Docker containers, and local development servers can consume significant resources, especially when running multiple projects simultaneously.

## Advanced Optimization Strategies

### Automated Memory Management

Modern solutions like Memory Monster take a proactive approach to memory management:

- **Real-time monitoring**: Continuously tracks memory usage across all applications
- **Intelligent cleanup**: Automatically identifies and cleans up memory leaks  
- **Predictive optimization**: Learns your usage patterns to optimize before problems occur

### Manual Optimization Techniques

If you prefer a hands-on approach, here are some techniques:

**Regular System Maintenance**
- Restart your Mac at least once a week
- Clear system caches regularly
- Keep your system updated

**Application Management**
- Close applications you''re not actively using
- Use web versions of apps when possible
- Limit browser tabs and extensions

## Conclusion

Keeping your Mac running smoothly requires a combination of good habits, the right tools, and understanding how your system works. With Memory Monster handling the heavy lifting, you can focus on what you do best while your Mac runs at peak performance.',
    'Memory Monster Team',
    'Guides',
    'published',
    8,
    ARRAY['mac-optimization', 'performance', 'tutorial'],
    NOW(),
    'Complete Mac Optimization Guide 2025 - Memory Monster',
    'Learn how to optimize your Mac''s performance with our comprehensive 2025 guide. Expert tips for memory management, system optimization, and peak performance.'
), (
    'Memory Leaks Explained: Why Your Mac Slows Down Over Time',
    'memory-leaks-explained',
    'Understanding the hidden culprits that gradually steal your Mac''s performance and how to stop them.',
    '# Memory Leaks Explained: Why Your Mac Slows Down Over Time

If you''ve ever wondered why your Mac seems to get slower the longer it''s been running, memory leaks are likely the culprit. These invisible performance thieves can turn your speedy machine into a sluggish disappointment.

## What Are Memory Leaks?

A memory leak occurs when an application allocates memory but fails to release it back to the system when it''s no longer needed. Over time, these unreleased memory chunks accumulate, reducing the amount of available RAM for other processes.

## Common Memory Leak Sources on Mac

### Web Browsers
Modern browsers are notorious for memory leaks:
- **Chrome**: Each tab and extension can leak memory
- **Safari**: WebKit processes may not always clean up properly
- **Firefox**: Add-ons and long browsing sessions cause accumulation

### Creative Applications
Design and video editing apps often struggle with memory management:
- **Adobe Photoshop**: Large file caches that don''t clear
- **Final Cut Pro**: Video preview buffers that stick around
- **Sketch**: Complex designs with many layers

## How Memory Monster Helps

Memory Monster uses advanced algorithms to:
1. **Detect memory leaks** in real-time
2. **Safely reclaim leaked memory** without affecting application data
3. **Learn patterns** of problematic applications
4. **Prevent future leaks** through intelligent monitoring

## Conclusion

Memory leaks are a fact of life in modern computing, but they don''t have to ruin your Mac experience. With proper monitoring, good habits, and the right tools, you can keep your system running smoothly for weeks or months without a restart.',
    'Memory Monster Team',
    'Technical',
    'published',
    5,
    ARRAY['memory-management', 'technical', 'performance'],
    NOW() - INTERVAL '3 days',
    'Memory Leaks on Mac: Causes, Detection & Solutions',
    'Learn what memory leaks are, why they slow down your Mac, and how to detect and prevent them. Expert guide to Mac memory management.'
) ON CONFLICT (slug) DO NOTHING;