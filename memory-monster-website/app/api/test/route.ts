import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    // Test environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY  
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    console.log('Environment check:')
    console.log('URL:', supabaseUrl ? 'Set' : 'Missing')
    console.log('Anon Key:', supabaseAnonKey ? 'Set' : 'Missing')
    console.log('Service Key:', supabaseServiceKey ? 'Set' : 'Missing')

    // Test the import
    let importTest = 'Not tested'
    try {
      const { supabaseAdmin } = await import('@/app/lib/supabase')
      importTest = 'Success'
    } catch (importError: any) {
      importTest = `Failed: ${importError?.message || 'Unknown import error'}`
    }

    return NextResponse.json({
      success: true,
      message: 'Test API route working',
      timestamp: new Date().toISOString(),
      env_check: {
        supabaseUrl: supabaseUrl ? '✅ Set' : '❌ Missing',
        supabaseAnonKey: supabaseAnonKey ? '✅ Set' : '❌ Missing', 
        supabaseServiceKey: supabaseServiceKey ? '✅ Set' : '❌ Missing'
      },
      import_test: importTest
    })
  } catch (error: any) {
    console.error('Test route error:', error)
    return NextResponse.json({
      success: false,
      error: error?.message || 'Unknown error occurred'
    }, { status: 500 })
  }
}