// app/api/link-clerk-profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { email, clerkUserId } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Get the current Clerk user to verify
    const user = await currentUser();
    const finalClerkUserId = clerkUserId || user?.id;
    
    if (!finalClerkUserId) {
      return NextResponse.json(
        { error: 'No Clerk user ID available' },
        { status: 400 }
      );
    }

    console.log('🔗 Linking Clerk user', finalClerkUserId, 'to profile with email:', email);

    // Find the existing profile by email (from guest checkout)
    const { data: existingProfile, error: findError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (findError || !existingProfile) {
      console.error('❌ Profile not found for email:', email, findError);
      return NextResponse.json(
        { error: 'Profile not found for this email' },
        { status: 404 }
      );
    }

    // Check if this Clerk user already has a profile
    const { data: clerkProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('clerk_user_id', finalClerkUserId)
      .single();

    if (clerkProfile && clerkProfile.id !== existingProfile.id) {
      console.log('🔄 Clerk user already has a different profile, merging data...');
      
      // Merge the existing profile data into the Clerk profile
      const { error: mergeError } = await supabase
        .from('profiles')
        .update({
          plan: existingProfile.plan, // Keep the purchased plan
          license_key: existingProfile.license_key, // Keep the license key
          stripe_customer_id: existingProfile.stripe_customer_id, // Keep Stripe data
          updated_at: new Date().toISOString(),
        })
        .eq('clerk_user_id', finalClerkUserId);

      if (mergeError) {
        console.error('❌ Failed to merge profile data:', mergeError);
        return NextResponse.json(
          { error: 'Failed to merge account data' },
          { status: 500 }
        );
      }

      // Update subscriptions to point to the Clerk profile
      await supabase
        .from('subscriptions')
        .update({ user_id: clerkProfile.id })
        .eq('user_id', existingProfile.id);

      // Update app_usage to point to the Clerk profile  
      await supabase
        .from('app_usage')
        .update({ user_id: clerkProfile.id })
        .eq('user_id', existingProfile.id);

      // Delete the old guest profile
      await supabase
        .from('profiles')
        .delete()
        .eq('id', existingProfile.id);

      console.log('✅ Successfully merged guest profile into existing Clerk profile');
    } else {
      // Update the existing profile with the Clerk user ID
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          clerk_user_id: finalClerkUserId,
          full_name: user?.fullName || existingProfile.full_name,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingProfile.id);

      if (updateError) {
        console.error('❌ Failed to link Clerk user to profile:', updateError);
        return NextResponse.json(
          { error: 'Failed to link account to purchase' },
          { status: 500 }
        );
      }

      console.log('✅ Successfully linked Clerk user to existing profile:', existingProfile.id);
    }

    return NextResponse.json({
      success: true,
      message: 'Account successfully linked to your purchase'
    });

  } catch (error: any) {
    console.error('❌ Error in link-clerk-profile:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}