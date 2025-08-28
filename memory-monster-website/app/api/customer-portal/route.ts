// app/api/customer-portal/route.ts
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

export async function POST() {
  try {
    const user = await currentUser();
    
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's Stripe customer ID
    const { data: profile } = await supabase
      .from('profiles')
      .select(`
        stripe_customer_id,
        subscriptions (stripe_customer_id)
      `)
      .eq('clerk_user_id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    // Get customer ID from profile or subscription
    const customerId = profile.stripe_customer_id || 
                      profile.subscriptions?.[0]?.stripe_customer_id;

    if (!customerId) {
      return NextResponse.json({ error: 'No billing account found' }, { status: 404 });
    }

    // Create billing portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
    });

    return NextResponse.json({ url: portalSession.url });

  } catch (error) {
    console.error('Customer portal error:', error);
    return NextResponse.json(
      { error: 'Failed to create billing portal session' },
      { status: 500 }
    );
  }
}