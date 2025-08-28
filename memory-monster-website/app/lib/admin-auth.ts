// app/lib/admin-auth.ts
import { currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

const ADMIN_EMAILS = [
  'matthiasccm@gmail.com', // CHANGE THIS TO YOUR ACTUAL EMAIL
  'admin@memorymonster.co'
]

export async function requireAdmin() {
  const user = await currentUser()
  
  if (!user) {
    throw new Error('Unauthorized - not signed in')
  }
  
  const userEmail = user.emailAddresses[0]?.emailAddress
  
  if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
    throw new Error('Unauthorized - admin access required')
  }
  
  return user
}

export async function withAdminAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    try {
      await requireAdmin()
      return handler(req)
    } catch (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }
  }
}