// app/lib/analytics.ts

// Replace with your actual Google Analytics Measurement ID
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX' // You'll get this from Google Analytics

// Extend window object for TypeScript
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

export class MemoryMonsterAnalytics {
  private sessionId: string = `session_${Date.now()}`
  private userId: string | null = null
  private isInitialized = false

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeGA()
      console.log('🎯 Analytics initialized with Google Analytics')
    }
  }

  private initializeGA() {
    // Load Google Analytics
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    document.head.appendChild(script)

    script.onload = () => {
      // Initialize gtag
      window.dataLayer = window.dataLayer || []
      window.gtag = function() {
        window.dataLayer.push(arguments)
      }
      
      window.gtag('js', new Date())
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_title: 'Memory Monster',
        page_location: window.location.href
      })
      
      this.isInitialized = true
      console.log('✅ Google Analytics loaded successfully')
    }

    script.onerror = () => {
      console.warn('⚠️ Google Analytics failed to load')
      this.isInitialized = false
    }
  }

  setUserId(userId: string) {
    this.userId = userId
    if (this.isInitialized && window.gtag) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        user_id: userId
      })
    }
    console.log('👤 User ID set:', userId)
  }

  async track(eventName: string, properties: Record<string, any> = {}) {
    // Console logging (keep for development)
    console.log('📊 Event:', eventName, properties)
    
    // Send to Google Analytics if available
    if (this.isInitialized && window.gtag) {
      window.gtag('event', eventName, {
        ...properties,
        session_id: this.sessionId,
        user_id: this.userId,
        timestamp: Date.now()
      })
    }
  }

  async trackPageView(page?: string) {
    const pageData = {
      page_title: 'Memory Monster',
      page_location: window.location.href,
      page: page || window.location.pathname
    }
    
    await this.track('page_view', pageData)
    
    if (this.isInitialized && window.gtag) {
      window.gtag('config', GA_MEASUREMENT_ID, pageData)
    }
  }

  async trackPersonaSelection(persona: string, selectionTime: number) {
    await this.track('persona_selected', { 
      persona, 
      selection_time_ms: selectionTime,
      category: 'user_segmentation'
    })
  }

  async trackDownloadIntent(source: string) {
    await this.track('download_intent', { 
      source,
      category: 'conversion',
      value: 1 // Assign value for conversion tracking
    })
  }

  async trackDownloadCompleted(platform: string, source: string) {
    await this.track('download_completed', { 
      platform, 
      source,
      category: 'conversion',
      value: 10 // Higher value for completed downloads
    })
  }

  async trackCheckoutStart(plan: string) {
    await this.track('checkout_started', { 
      plan,
      category: 'ecommerce',
      value: plan === 'pro' ? 4.99 : 0
    })
  }

  // Bonus: Track scroll depth
  async trackScrollDepth(percentage: number) {
    if (percentage % 25 === 0) { // Track at 25%, 50%, 75%, 100%
      await this.track('scroll_depth', {
        percentage,
        category: 'engagement'
      })
    }
  }

  // Bonus: Track time on page
  async trackTimeOnPage(seconds: number) {
    await this.track('time_on_page', {
      seconds,
      category: 'engagement'
    })
  }
}

export const analytics = new MemoryMonsterAnalytics()