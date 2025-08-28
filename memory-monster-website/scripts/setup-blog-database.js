const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables in .env.local')
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupBlogTables() {
  try {
    console.log('🗄️ Setting up blog database tables...')

    // Create blog_categories table
    const { error: categoriesError } = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS blog_categories (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(100) NOT NULL UNIQUE,
          slug VARCHAR(100) NOT NULL UNIQUE,
          description TEXT,
          color VARCHAR(7) DEFAULT '#3b82f6',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
      `
    })

    if (categoriesError) {
      throw new Error(`Categories table error: ${categoriesError.message}`)
    }
    console.log('✅ Created blog_categories table')

    // Create blog_tags table
    const { error: tagsError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS blog_tags (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(50) NOT NULL UNIQUE,
          slug VARCHAR(50) NOT NULL UNIQUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create index for faster lookups
        CREATE INDEX IF NOT EXISTS idx_blog_tags_slug ON blog_tags(slug);
      `
    })

    if (tagsError) {
      throw new Error(`Tags table error: ${tagsError.message}`)
    }
    console.log('✅ Created blog_tags table')

    // Create blog_posts table
    const { error: postsError } = await supabase.rpc('execute_sql', {
      sql: `
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

        -- Create indexes for faster queries
        CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
        CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
        CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
        CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);
        CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING GIN(tags);

        -- Create trigger to automatically update updated_at
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
      `
    })

    if (postsError) {
      throw new Error(`Posts table error: ${postsError.message}`)
    }
    console.log('✅ Created blog_posts table')

    // Insert default categories
    const { error: insertCategoriesError } = await supabase
      .from('blog_categories')
      .upsert([
        { name: 'Technical', slug: 'technical', description: 'Technical deep-dives and explanations', color: '#8b5cf6' },
        { name: 'Guides', slug: 'guides', description: 'Step-by-step guides and tutorials', color: '#3b82f6' },
        { name: 'Performance', slug: 'performance', description: 'Mac performance tips and tricks', color: '#10b981' },
        { name: 'Updates', slug: 'updates', description: 'Product updates and announcements', color: '#f59e0b' },
        { name: 'Design', slug: 'design', description: 'Design workflow optimization', color: '#ec4899' },
        { name: 'Productivity', slug: 'productivity', description: 'Boost your productivity on Mac', color: '#06b6d4' }
      ], { onConflict: 'slug' })

    if (insertCategoriesError) {
      throw new Error(`Insert categories error: ${insertCategoriesError.message}`)
    }
    console.log('✅ Inserted default categories')

    // Insert some sample tags
    const { error: insertTagsError } = await supabase
      .from('blog_tags')
      .upsert([
        { name: 'Mac Optimization', slug: 'mac-optimization' },
        { name: 'Memory Management', slug: 'memory-management' },
        { name: 'Performance', slug: 'performance' },
        { name: 'macOS', slug: 'macos' },
        { name: 'Productivity', slug: 'productivity' },
        { name: 'Tips', slug: 'tips' },
        { name: 'Tutorial', slug: 'tutorial' },
        { name: 'Chrome', slug: 'chrome' },
        { name: 'Adobe', slug: 'adobe' },
        { name: 'Development', slug: 'development' }
      ], { onConflict: 'slug' })

    if (insertTagsError) {
      throw new Error(`Insert tags error: ${insertTagsError.message}`)
    }
    console.log('✅ Inserted default tags')

    // Insert sample blog posts
    const samplePosts = [
      {
        title: 'The Complete Mac Optimization Guide for 2025',
        slug: 'mac-optimization-guide-2025',
        excerpt: 'Everything you need to know about keeping your Mac running at peak performance, from memory management to system-level optimizations.',
        content: `# The Complete Mac Optimization Guide for 2025

Your Mac is an incredible machine, but even the most powerful hardware can be brought to its knees by poor memory management. In this comprehensive guide, we'll dive deep into the strategies that keep your Mac running at peak performance.

## Understanding Memory Management on macOS

macOS uses a sophisticated memory management system that's generally quite efficient. However, modern applications often don't play by the rules, leading to memory leaks, bloated processes, and system slowdowns.

### The Big Offenders

**Chrome and Electron Apps**
Chrome's multi-process architecture, while great for stability, can consume enormous amounts of memory. Each tab, extension, and plugin runs in its own process, and these can quickly add up to several gigabytes of RAM usage.

**Adobe Creative Suite**
Photoshop, Illustrator, and other Creative Cloud applications are notorious for memory consumption. They often cache large amounts of data and don't always release it properly when switching between documents.

**Development Tools**
IDEs like VS Code, Docker containers, and local development servers can consume significant resources, especially when running multiple projects simultaneously.

## System-Level Optimization Techniques

### Activity Monitor: Your First Line of Defense

The built-in Activity Monitor is your best friend for identifying memory hogs:

1. Open Activity Monitor (Applications > Utilities)
2. Click the Memory tab
3. Sort by "Memory" column to see the biggest consumers
4. Look for processes using more than 1GB of RAM

### Memory Pressure Indicators

macOS provides visual indicators of memory pressure:
- **Green**: Your system has sufficient memory
- **Yellow**: Your system is experiencing memory pressure
- **Red**: Your system is running out of memory

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
- Close applications you're not actively using
- Use web versions of apps when possible
- Limit browser tabs and extensions

## Performance Monitoring Best Practices

### Setting Up Alerts

Configure your system to alert you when memory usage gets too high:
1. Use third-party tools for custom alerts
2. Monitor key applications during peak usage
3. Set up automated cleanup schedules

### Benchmarking Your System

Regular performance testing helps you understand your Mac's baseline:
- Use built-in diagnostics tools
- Run memory stress tests
- Document performance before/after optimizations

## The Future of Mac Performance

As applications become more complex and resource-intensive, the need for intelligent memory management grows. AI-powered optimization tools are becoming essential for maintaining peak performance.

### Emerging Technologies

Machine learning algorithms can now predict memory usage patterns and proactively optimize system resources. Tools like Memory Monster represent the next generation of Mac optimization software.

## Conclusion

Keeping your Mac running smoothly requires a combination of good habits, the right tools, and understanding how your system works. With the strategies outlined in this guide, you'll be able to maintain peak performance and extend the life of your Mac.

Remember: prevention is always better than cure. Regular maintenance and intelligent monitoring will save you hours of frustration down the road.`,
        author: 'Sarah Chen',
        author_id: 'user_admin',
        category: 'Guides',
        status: 'published',
        read_time: 8,
        tags: ['mac-optimization', 'performance', 'tutorial'],
        seo_title: 'Complete Mac Optimization Guide 2025 - Memory Monster',
        seo_description: 'Learn how to optimize your Mac\'s performance with our comprehensive 2025 guide. Expert tips for memory management, system optimization, and peak performance.',
        published_at: new Date('2025-01-15').toISOString()
      },
      {
        title: 'Memory Leaks Explained: Why Your Mac Slows Down Over Time',
        slug: 'memory-leaks-explained',
        excerpt: 'Understanding the hidden culprits that gradually steal your Mac\'s performance and how to stop them.',
        content: `# Memory Leaks Explained: Why Your Mac Slows Down Over Time

If you've ever wondered why your Mac seems to get slower the longer it's been running, memory leaks are likely the culprit. These invisible performance thieves can turn your speedy machine into a sluggish disappointment.

## What Are Memory Leaks?

A memory leak occurs when an application allocates memory but fails to release it back to the system when it's no longer needed. Over time, these unreleased memory chunks accumulate, reducing the amount of available RAM for other processes.

### How Memory Leaks Happen

Memory leaks typically occur due to:
- Poor programming practices
- Unclosed resources (files, network connections)
- Circular references in code
- Third-party library bugs

## Common Memory Leak Sources on Mac

### Web Browsers
Modern browsers are notorious for memory leaks:
- **Chrome**: Each tab and extension can leak memory
- **Safari**: WebKit processes may not always clean up properly
- **Firefox**: Add-ons and long browsing sessions cause accumulation

### Creative Applications
Design and video editing apps often struggle with memory management:
- **Adobe Photoshop**: Large file caches that don't clear
- **Final Cut Pro**: Video preview buffers that stick around
- **Sketch**: Complex designs with many layers

### Development Tools
Programming environments are particularly prone to leaks:
- **Xcode**: Simulator instances and build caches
- **VS Code**: Extension processes and language servers
- **Docker**: Container overhead and volume mappings

## Identifying Memory Leaks

### Using Activity Monitor
1. Open Activity Monitor from Applications > Utilities
2. Click the Memory tab
3. Look for processes with unusually high memory usage
4. Monitor how memory usage changes over time

### Warning Signs
Watch out for these symptoms:
- Gradual system slowdown over hours/days
- Applications becoming unresponsive
- Frequent beach ball appearances
- System asking to close applications

## Preventing and Fixing Memory Leaks

### Immediate Solutions
- **Restart applications** that show high memory usage
- **Reboot your Mac** to clear all memory leaks
- **Close unused browser tabs** and applications
- **Update software** to get leak fixes

### Long-term Strategies
- Use **automated memory management tools** like Memory Monster
- Set up **regular restart schedules** for problem applications
- **Monitor system performance** proactively
- **Keep applications updated** to latest versions

## How Memory Monster Helps

Memory Monster uses advanced algorithms to:
1. **Detect memory leaks** in real-time
2. **Safely reclaim leaked memory** without affecting application data
3. **Learn patterns** of problematic applications
4. **Prevent future leaks** through intelligent monitoring

## The Technical Side

For those interested in the technical details:

### Memory Types
- **Stack memory**: Automatically managed, rarely leaks
- **Heap memory**: Manually managed, prone to leaks
- **System memory**: Kernel-level allocations

### Detection Methods
- **Reference counting**: Tracking object references
- **Garbage collection**: Automatic memory cleanup
- **Leak detection tools**: Instruments, Valgrind, etc.

## Conclusion

Memory leaks are a fact of life in modern computing, but they don't have to ruin your Mac experience. With proper monitoring, good habits, and the right tools, you can keep your system running smoothly for weeks or months without a restart.

Remember: understanding the problem is the first step to solving it. Now that you know what memory leaks are and how they work, you're better equipped to maintain your Mac's performance.`,
        author: 'Jake Martinez',
        author_id: 'user_admin',
        category: 'Technical',
        status: 'published',
        read_time: 5,
        tags: ['memory-management', 'technical', 'performance'],
        seo_title: 'Memory Leaks on Mac: Causes, Detection & Solutions',
        seo_description: 'Learn what memory leaks are, why they slow down your Mac, and how to detect and prevent them. Expert guide to Mac memory management.',
        published_at: new Date('2025-01-12').toISOString()
      }
    ]

    const { error: insertPostsError } = await supabase
      .from('blog_posts')
      .upsert(samplePosts, { onConflict: 'slug' })

    if (insertPostsError) {
      throw new Error(`Insert posts error: ${insertPostsError.message}`)
    }
    console.log('✅ Inserted sample blog posts')

    console.log('🎉 Blog database setup completed successfully!')
    console.log('\nTables created:')
    console.log('- blog_categories (with 6 default categories)')
    console.log('- blog_tags (with 10 default tags)')
    console.log('- blog_posts (with 2 sample posts)')

  } catch (error) {
    console.error('❌ Error setting up blog database:', error)
    process.exit(1)
  }
}

// Run the setup
if (require.main === module) {
  setupBlogTables()
}

module.exports = { setupBlogTables }