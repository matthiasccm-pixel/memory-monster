// app/api/user/profile/route.ts (FIXED CLERK IMPORT)
import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    console.log('🔍 Profile API called');
    
    // Get current user from Clerk
    const user = await currentUser();
    console.log('👤 User from Clerk:', user?.id);
    
    if (!user?.id) {
      console.log('❌ No user ID - unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;
    console.log('🔍 Looking for profile with clerk_user_id:', userId);

    // Try to get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('clerk_user_id', userId)
      .single();

    console.log('📊 Profile query result:', { profile, error: profileError });

    if (profileError && profileError.code === 'PGRST116') {
      console.log('👤 No profile found, creating new one...');
      
      // Create new profile
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert([{
          clerk_user_id: userId,
          email: user.emailAddresses?.[0]?.emailAddress || null,
          full_name: user.fullName || null,
          plan: 'free',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select('*')
        .single();

      console.log('✨ New profile creation result:', { newProfile, error: createError });

      if (createError) {
        console.error('❌ Failed to create profile:', createError);
        return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
      }

      // Return minimal response for new user
      return NextResponse.json({
        profile: newProfile,
        subscription: null,
        appUsage: {
          memory_scans_performed: 0,
          memory_freed_mb: 0,
          apps_optimized: 0,
          total_usage_time_minutes: 0
        },
        downloads: []
      });
    }

    if (profileError) {
      console.error('❌ Profile fetch error:', profileError);
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }

    console.log('✅ Profile found, fetching related data...');

    // Get subscriptions
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(1);

    // Get app usage
    const { data: appUsage } = await supabase
      .from('app_usage')
      .select('*')
      .eq('user_id', profile.id)
      .single();

    // Get downloads
    const { data: downloads } = await supabase
      .from('downloads')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(10);

    const response = {
      profile,
      subscription: subscriptions?.[0] || null,
      appUsage: appUsage || {
        memory_scans_performed: 0,
        memory_freed_mb: 0,
        apps_optimized: 0,
        total_usage_time_minutes: 0
      },
      downloads: downloads || []
    };

    console.log('✅ Returning response:', response);
    return NextResponse.json(response);

  } catch (error) {
    console.error('💥 Profile API error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}