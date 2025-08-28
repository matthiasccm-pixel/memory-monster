// TEMPORARY: Regenerate license key for development
import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function generateLicenseKey(): string {
  const prefix = 'MM';
  const random = randomBytes(16).toString('hex').toUpperCase();
  const formatted = random.match(/.{1,4}/g)?.join('-') || random;
  return `${prefix}-${formatted}`;
}

export async function POST() {
  try {
    // Get current user
    const user = await currentUser();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate new license key
    const newLicenseKey = generateLicenseKey();
    
    // Update profile with new license key
    const { data, error } = await supabase
      .from('profiles')
      .update({
        license_key: newLicenseKey,
        updated_at: new Date().toISOString()
      })
      .eq('clerk_user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Failed to update license key:', error);
      return NextResponse.json({ error: 'Failed to update license key' }, { status: 500 });
    }

    console.log('✅ License key regenerated:', newLicenseKey);
    
    return NextResponse.json({ 
      success: true, 
      license_key: newLicenseKey,
      profile: data 
    });
  } catch (error) {
    console.error('Error regenerating license:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}