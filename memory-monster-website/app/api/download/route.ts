// app/api/download/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    const { platform } = await request.json();

    if (!platform || !['silicon', 'intel'].includes(platform)) {
      return NextResponse.json(
        { error: 'Invalid platform specified' },
        { status: 400 }
      );
    }

    // Get download URL based on platform
    const downloadUrl = platform === 'silicon' 
      ? process.env.NEXT_PUBLIC_APP_DOWNLOAD_SILICON
      : process.env.NEXT_PUBLIC_APP_DOWNLOAD_INTEL;

    if (!downloadUrl) {
      return NextResponse.json(
        { error: 'Download URL not configured' },
        { status: 500 }
      );
    }

    // If user is logged in, track the download
    if (user?.id) {
      try {
        // Ensure user profile exists
        let { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('clerk_user_id', user.id)
          .single();

        if (!profile) {
          // Create profile if it doesn't exist
          const { data: newProfile } = await supabase
            .from('profiles')
            .insert([{
              clerk_user_id: user.id,
              plan: 'free',
              created_at: new Date().toISOString()
            }])
            .select('id')
            .single();
          
          profile = newProfile;
        }

        if (profile) {
          // Record the download
          await supabase
            .from('downloads')
            .insert([{
              user_id: profile.id,
              platform,
              version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
              created_at: new Date().toISOString()
            }]);
        }
      } catch (error) {
        console.error('Failed to track download:', error);
        // Don't fail the download if tracking fails
      }
    }

    return NextResponse.json({ 
      downloadUrl,
      platform,
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'
    });

  } catch (error) {
    console.error('Download API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await currentUser();
    
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('clerk_user_id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ downloads: [] });
    }

    const { data: downloads, error } = await supabase
      .from('downloads')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Failed to fetch downloads:', error);
      return NextResponse.json({ error: 'Failed to fetch downloads' }, { status: 500 });
    }

    return NextResponse.json({ downloads: downloads || [] });

  } catch (error) {
    console.error('Download history API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}