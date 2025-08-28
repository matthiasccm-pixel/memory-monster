// app/api/create-checkout-session/route.ts (FIXED VERSION - TAX DISABLED)
import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { priceId, planType, deviceId, returnUrl, metadata: customMetadata } = await request.json();
    const user = await currentUser();

    if (!priceId) {
      return NextResponse.json(
        { error: 'Missing required field: priceId' },
        { status: 400 }
      );
    }

    let profileId = null;
    let userEmail = null;
    let existingCustomerId = null;

    // If user is logged in, get/create their profile
    if (user?.id) {
      // Check if profile exists
      let { data: profile, error } = await supabase
        .from('profiles')
        .select('id, email, stripe_customer_id')
        .eq('clerk_user_id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{
            clerk_user_id: user.id,
            email: user.emailAddresses?.[0]?.emailAddress || null,
            full_name: user.fullName || null,
            plan: 'free',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select('id, email, stripe_customer_id')
          .single();

        if (createError) {
          console.error('Failed to create profile:', createError);
          return NextResponse.json(
            { error: 'Failed to create user profile' },
            { status: 500 }
          );
        }
        profile = newProfile;
      } else if (error) {
        console.error('Profile fetch error:', error);
        return NextResponse.json(
          { error: 'Failed to fetch user profile' },
          { status: 500 }
        );
      }

      if (profile) {
        profileId = profile.id;
        userEmail = profile.email || user.emailAddresses?.[0]?.emailAddress;
        existingCustomerId = profile.stripe_customer_id;
      }
    }

    // Prepare session metadata with device tracking
    const metadata: Record<string, string> = {
      priceId,
      planType: planType || 'monthly',
      ...(customMetadata || {}),
    };

    if (user?.id) {
      metadata.userId = user.id;
    }
    if (profileId) {
      metadata.profileId = profileId.toString();
    }
    if (deviceId) {
      metadata.deviceId = deviceId;
    }
    if (returnUrl) {
      metadata.returnUrl = returnUrl;
    }

    // Build success URL with device tracking
    let successUrl = `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`;
    if (deviceId) {
      successUrl += `&device_id=${encodeURIComponent(deviceId)}`;
    }
    if (returnUrl) {
      successUrl += `&return_url=${encodeURIComponent(returnUrl)}`;
    }

    // Create checkout session
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      metadata,
      success_url: successUrl,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
      subscription_data: {
        metadata,
        trial_period_days: 7, // 7-day trial
      },
      // automatic_tax: { enabled: true }, // REMOVED - causing issues in test mode
      billing_address_collection: 'required',
    };

    // Handle customer assignment
    if (existingCustomerId) {
      sessionConfig.customer = existingCustomerId;
    } else if (userEmail) {
      sessionConfig.customer_email = userEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}