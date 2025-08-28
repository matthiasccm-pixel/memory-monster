// app/api/license/session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session_id parameter' },
        { status: 400 }
      );
    }

    console.log('🔍 Looking up license for session:', sessionId);

    // Get the Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    console.log('📧 Session customer email:', session.customer_details?.email || session.customer_email);
    console.log('🏷️ Session customer ID:', session.customer);

    // Find the profile by either Stripe customer ID or email
    let profile = null;

    // First try by Stripe customer ID
    if (session.customer) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('stripe_customer_id', session.customer)
        .single();
      profile = data;
    }

    // If not found and we have email, try by email
    if (!profile) {
      const email = session.customer_details?.email || session.customer_email;
      if (email) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', email)
          .single();
        profile = data;
      }
    }

    if (!profile) {
      console.log('❌ No profile found for session');
      return NextResponse.json(
        { error: 'Profile not found for this session' },
        { status: 404 }
      );
    }

    console.log('✅ Found profile:', profile.id, 'with license:', profile.license_key);

    return NextResponse.json({
      success: true,
      profile: {
        id: profile.id,
        email: profile.email,
        license_key: profile.license_key,
        plan: profile.plan
      }
    });

  } catch (error: any) {
    console.error('❌ Error in license/session:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}