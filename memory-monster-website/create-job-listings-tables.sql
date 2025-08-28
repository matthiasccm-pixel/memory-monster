-- Job Listings tables for Memory Monster
-- Run this SQL in your Supabase SQL editor

-- Create job_categories table
CREATE TABLE IF NOT EXISTS job_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3b82f6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job_listings table
CREATE TABLE IF NOT EXISTS job_listings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    department VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    employment_type VARCHAR(50) NOT NULL, -- 'full-time', 'part-time', 'contract', 'internship'
    experience_level VARCHAR(50) NOT NULL, -- 'entry', 'mid', 'senior', 'lead', 'executive'
    description TEXT NOT NULL,
    requirements TEXT,
    responsibilities TEXT,
    benefits TEXT,
    salary_min INTEGER,
    salary_max INTEGER,
    salary_currency VARCHAR(3) DEFAULT 'USD',
    remote_friendly BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'closed')),
    posted_by VARCHAR(100),
    posted_by_id VARCHAR(100),
    tags TEXT[] DEFAULT '{}',
    seo_title VARCHAR(255),
    seo_description TEXT,
    application_url TEXT,
    apply_email VARCHAR(255),
    published_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_job_listings_slug ON job_listings(slug);
CREATE INDEX IF NOT EXISTS idx_job_listings_status ON job_listings(status);
CREATE INDEX IF NOT EXISTS idx_job_listings_department ON job_listings(department);
CREATE INDEX IF NOT EXISTS idx_job_listings_location ON job_listings(location);
CREATE INDEX IF NOT EXISTS idx_job_listings_employment_type ON job_listings(employment_type);
CREATE INDEX IF NOT EXISTS idx_job_listings_experience_level ON job_listings(experience_level);
CREATE INDEX IF NOT EXISTS idx_job_listings_featured ON job_listings(featured);
CREATE INDEX IF NOT EXISTS idx_job_listings_published_at ON job_listings(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_listings_tags ON job_listings USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_job_categories_slug ON job_categories(slug);

-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_job_listings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_job_listings_updated_at ON job_listings;
CREATE TRIGGER trigger_job_listings_updated_at
    BEFORE UPDATE ON job_listings
    FOR EACH ROW
    EXECUTE FUNCTION update_job_listings_updated_at();

-- Insert default job categories
INSERT INTO job_categories (name, slug, description, color) VALUES
    ('Engineering', 'engineering', 'Software development and technical roles', '#3b82f6'),
    ('Design', 'design', 'UI/UX design and creative roles', '#8b5cf6'),
    ('Product', 'product', 'Product management and strategy', '#10b981'),
    ('Marketing', 'marketing', 'Growth, content, and marketing roles', '#f59e0b'),
    ('Operations', 'operations', 'Business operations and support', '#ef4444'),
    ('Data', 'data', 'Data science and analytics roles', '#06b6d4'),
    ('AI/ML', 'ai-ml', 'Machine learning and AI development', '#ec4899'),
    ('QA', 'qa', 'Quality assurance and testing', '#84cc16')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample job listings
INSERT INTO job_listings (
    title, slug, department, location, employment_type, experience_level,
    description, requirements, responsibilities, benefits,
    salary_min, salary_max, remote_friendly, featured, status,
    posted_by, tags, published_at, seo_title, seo_description,
    application_url, apply_email
) VALUES (
    'Senior iOS Engineer',
    'senior-ios-engineer',
    'Engineering',
    'San Francisco, CA / Remote',
    'full-time',
    'senior',
    'Join our mobile team to build the next generation of Memory Monster for iOS. You''ll work on performance optimization, system-level integrations, and creating delightful user experiences that help millions of Mac users optimize their systems.

## About the Role

We''re looking for a Senior iOS Engineer who is passionate about performance, systems programming, and creating exceptional user experiences. You''ll be working closely with our macOS team to bring Memory Monster''s powerful optimization capabilities to iOS and iPadOS.

## What You''ll Do

- Architect and develop iOS applications with focus on performance and user experience
- Collaborate with our macOS engineering team on cross-platform features
- Implement system-level optimizations and performance monitoring
- Work with our design team to create intuitive user interfaces
- Optimize app performance and memory usage (practice what we preach!)
- Contribute to our technical blog and open-source initiatives',
    '• 5+ years of iOS development experience with Swift and Objective-C
• Strong understanding of iOS frameworks (UIKit, SwiftUI, Core Data, etc.)
• Experience with performance optimization and memory management
• Knowledge of system-level programming and Unix/Darwin internals
• Experience with App Store submission and review process
• Understanding of mobile app architecture patterns (MVVM, MVC, etc.)
• Familiarity with CI/CD pipelines and automated testing
• Experience with Git and collaborative development workflows',
    '• Design and implement new iOS features and improvements
• Optimize application performance and memory usage
• Collaborate with cross-functional teams including Design, Product, and Backend
• Write clean, maintainable, and well-documented code
• Participate in code reviews and mentor junior developers
• Stay current with iOS development trends and best practices
• Contribute to technical decision-making and architecture discussions',
    '• Competitive salary with equity package
• Comprehensive health, dental, and vision insurance
• Flexible remote work options
• Professional development budget ($3,000/year)
• Top-tier equipment (MacBook Pro, external monitors, etc.)
• Unlimited PTO policy
• Annual company retreats in amazing locations
• Opportunity to work on products used by millions of users',
    140000,
    180000,
    true,
    true,
    'active',
    'Memory Monster Team',
    ARRAY['ios', 'swift', 'mobile', 'performance', 'senior'],
    NOW(),
    'Senior iOS Engineer - Memory Monster',
    'Join Memory Monster as a Senior iOS Engineer. Build performance optimization tools for millions of users. Remote-friendly with competitive salary.',
    'https://jobs.lever.co/memorymonster/senior-ios-engineer',
    'careers@memorymonster.co'
), (
    'UI/UX Designer',
    'ui-ux-designer',
    'Design',
    'San Francisco, CA / Remote',
    'full-time',
    'mid',
    'Shape the future of Mac optimization with beautiful, intuitive design. We''re looking for a UI/UX Designer who can balance aesthetic excellence with functional clarity to create interfaces that make complex system optimization feel effortless.

## About the Role

As our UI/UX Designer, you''ll be responsible for designing user experiences that make advanced system optimization accessible to everyone. You''ll work closely with our engineering and product teams to create interfaces that are both powerful and delightful to use.

## What You''ll Do

- Design user interfaces for our Mac and iOS applications
- Create user flows and wireframes for new features
- Develop and maintain our design system
- Conduct user research and usability testing
- Collaborate with engineers to ensure pixel-perfect implementation
- Create marketing materials and website designs',
    '• 3+ years of UI/UX design experience, preferably for desktop/mobile applications
• Proficiency in design tools (Figma, Sketch, Adobe Creative Suite)
• Strong portfolio demonstrating user-centered design process
• Experience with design systems and component libraries
• Understanding of iOS and macOS Human Interface Guidelines
• Knowledge of front-end development (HTML/CSS) is a plus
• Experience with user research and usability testing
• Strong communication and collaboration skills',
    '• Design user interfaces and experiences for Mac and iOS applications
• Create wireframes, prototypes, and high-fidelity designs
• Develop and maintain design system components
• Conduct user research and analyze user feedback
• Collaborate with product managers and engineers on feature requirements
• Create design specifications and assets for development
• Present design concepts to stakeholders and iterate based on feedback',
    '• Competitive salary with equity package
• Comprehensive health, dental, and vision insurance
• Flexible remote work options
• Professional development budget ($2,500/year)
• Design tool subscriptions covered
• Unlimited PTO policy
• Annual company retreats
• Creative freedom to shape product direction',
    90000,
    130000,
    true,
    true,
    'active',
    'Memory Monster Team',
    ARRAY['design', 'ui', 'ux', 'figma', 'mobile'],
    NOW(),
    'UI/UX Designer - Memory Monster',
    'Join Memory Monster as a UI/UX Designer. Design beautiful interfaces for Mac optimization tools. Remote-friendly position.',
    'https://jobs.lever.co/memorymonster/ui-ux-designer',
    'careers@memorymonster.co'
), (
    'ML Performance Engineer',
    'ml-performance-engineer',
    'AI/ML',
    'Remote',
    'full-time',
    'senior',
    'Build the intelligence behind Memory Monster''s optimization algorithms. We''re seeking an ML Performance Engineer to develop machine learning models that predict, prevent, and resolve system performance issues before users even notice them.

## About the Role

You''ll be at the forefront of applying machine learning to system performance optimization. This role involves developing predictive models, analyzing system telemetry, and creating intelligent algorithms that adapt to user behavior patterns.

## What You''ll Do

- Develop ML models for predicting system performance issues
- Build recommendation systems for optimization suggestions
- Analyze large-scale telemetry data to identify patterns
- Create real-time performance prediction systems
- Collaborate with systems engineers on data collection
- Research and implement cutting-edge ML techniques',
    '• PhD or Masters in Computer Science, Machine Learning, or related field
• 4+ years of experience in machine learning and data science
• Proficiency in Python, TensorFlow/PyTorch, and scikit-learn
• Experience with time series analysis and anomaly detection
• Knowledge of system performance metrics and telemetry
• Experience with big data processing (Spark, Hadoop, etc.)
• Understanding of macOS/Unix system internals
• Strong statistical analysis and mathematical modeling skills',
    '• Design and implement machine learning models for performance optimization
• Analyze system telemetry data to identify performance patterns
• Develop predictive algorithms for proactive system optimization
• Build recommendation engines for user-specific optimizations
• Collaborate with engineering teams on model deployment
• Research and prototype new ML approaches to system optimization
• Mentor junior data scientists and engineers',
    '• Competitive salary with significant equity package
• Comprehensive health, dental, and vision insurance
• Fully remote work environment
• Professional development budget ($4,000/year)
• Conference attendance and speaking opportunities
• Research publication support
• Unlimited PTO policy
• Cutting-edge hardware and cloud resources',
    150000,
    200000,
    true,
    true,
    'active',
    'Memory Monster Team',
    ARRAY['machine-learning', 'ai', 'python', 'performance', 'data-science'],
    NOW(),
    'ML Performance Engineer - Memory Monster',
    'Join Memory Monster as an ML Performance Engineer. Build AI systems that predict and optimize Mac performance. Fully remote position.',
    'https://jobs.lever.co/memorymonster/ml-performance-engineer',
    'careers@memorymonster.co'
) ON CONFLICT (slug) DO NOTHING;