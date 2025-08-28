import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message, category } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Format the email content
    const emailBody = `
New Contact Form Submission

Category: ${category || 'General Inquiry'}
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
Sent from Memory Monster Contact Form
    `.trim()

    // Send email using your preferred email service
    // For now, we'll just log it and return success
    // In production, integrate with services like SendGrid, Resend, or AWS SES
    
    console.log('Contact form submission:', {
      to: 'help@memorymonster.co',
      subject: `[Contact Form] ${subject}`,
      body: emailBody,
      replyTo: email
    })

    // Here you would typically send the email:
    // await sendEmail({
    //   to: 'help@memorymonster.co',
    //   subject: `[Contact Form] ${subject}`,
    //   text: emailBody,
    //   replyTo: email
    // })

    return NextResponse.json(
      { success: true, message: 'Email sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}