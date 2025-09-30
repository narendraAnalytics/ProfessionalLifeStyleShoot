'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useAuth } from '@clerk/nextjs'
import NewNavbar from './components/NewNavbar'
import NewHeroSection from './components/NewHeroSection'
import HowItWorksSection from './components/HowItWorksSection'
import NewPricingSection from './components/NewPricingSection'
import PortfolioSection from './components/PortfolioSection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'
import ImageCarousel from './components/ImageCarousel'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'

export default function NewLandingPage() {
  // Authentication state
  const { isSignedIn } = useAuth()
  
  // Banner advertisement modal state
  const [showAdModal, setShowAdModal] = useState(false)
  
  // Auto-timeout configuration (in milliseconds)
  const BANNER_TIMEOUT_DURATION = 10000 // 10 seconds

  // Dynamic image configuration based on authentication status
  const bannerImages = {
    leftSide: isSignedIn ? '/DiamoundShoot.jpeg' : '/BrightShoot.jpeg',
    rightSide: isSignedIn ? '/DressPhotoshoot.jpeg' : '/Sareeshoot.jpeg',
    centerBanner: '/BannerImage.png' // Same for both states
  }

  // Show banner modal on first visit (once per session per auth state)
  useEffect(() => {
    // Create unique session storage key based on authentication status
    const sessionKey = `bannerAdSeen_${isSignedIn ? 'loggedIn' : 'loggedOut'}`
    
    // Check if user has seen the ad for this authentication state in this browser session
    const adSeen = sessionStorage.getItem(sessionKey)
    if (!adSeen) {
      // Show modal after 3 seconds delay for better user experience
      const showTimer = setTimeout(() => setShowAdModal(true), 3000)
      return () => clearTimeout(showTimer)
    }
  }, [isSignedIn])

  // Auto-close banner after timeout duration
  useEffect(() => {
    let autoCloseTimer: NodeJS.Timeout | null = null
    
    if (showAdModal) {
      // Start auto-close timer when banner is shown
      autoCloseTimer = setTimeout(() => {
        handleCloseAdModal()
      }, BANNER_TIMEOUT_DURATION)
    }

    // Cleanup timer on unmount or when showAdModal changes
    return () => {
      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer)
      }
    }
  }, [showAdModal])

  // Handle closing the banner modal
  const handleCloseAdModal = () => {
    setShowAdModal(false)
    // Mark as seen for this authentication state and session so it won't show again
    const sessionKey = `bannerAdSeen_${isSignedIn ? 'loggedIn' : 'loggedOut'}`
    sessionStorage.setItem(sessionKey, 'true')
  }

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section with Carousel Background */}
      <div className="relative min-h-screen">
        {/* Dynamic Carousel Background - Hero Only */}
        <ImageCarousel />

        {/* Hero Content - floats above carousel */}
        <div className="relative z-20 w-full overflow-hidden">
          {/* Navigation */}
          <NewNavbar />

          {/* Hero Section */}
          <NewHeroSection />
        </div>
      </div>

      {/* How It Works Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
        <HowItWorksSection />
      </div>

    
      {/* Pricing Section */}
      <div className="relative bg-gradient-to-br from-blue-50/80 via-white/90 to-purple-50/80 backdrop-blur-sm">
        <NewPricingSection />
      </div>

      {/* Portfolio Section */}
      <PortfolioSection />
      
      {/* Contact Section */}
      <ContactSection />
      
      {/* Footer */}
      <Footer />

      {/* Left Side Image - Outside Modal */}
      {showAdModal && (
        <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40">
          <div className="relative group p-2 bg-gradient-to-br from-white via-gray-100 to-gray-200 rounded-3xl shadow-2xl">
            <img 
              src={bannerImages.leftSide} 
              alt="Professional Lifestyle Photography" 
              className="w-64 h-80 object-cover rounded-2xl shadow-lg brightness-125 contrast-110 transition-all duration-300 group-hover:scale-105 group-hover:brightness-110 border-2 border-white/50"
            />
            <div className="absolute inset-2 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
          </div>
        </div>
      )}

      {/* Right Side Image - Outside Modal */}
      {showAdModal && (
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40">
          <div className="relative group p-2 bg-gradient-to-br from-white via-gray-100 to-gray-200 rounded-3xl shadow-2xl">
            <img 
              src={bannerImages.rightSide} 
              alt="Professional Saree Photography" 
              className="w-64 h-80 object-cover rounded-2xl shadow-lg brightness-125 contrast-110 transition-all duration-300 group-hover:scale-105 group-hover:brightness-110 border-2 border-white/50"
            />
            <div className="absolute inset-2 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
          </div>
        </div>
      )}

      {/* Promotional Banner Modal */}
      <Dialog open={showAdModal} onOpenChange={handleCloseAdModal}>
        <DialogContent className="max-w-[95vw] p-0 border-0 bg-transparent shadow-2xl">
          <DialogTitle className="sr-only">AI-Powered Photography Service Promotion</DialogTitle>
          <div className="relative">
            <img 
              src={bannerImages.centerBanner} 
              alt="AI-Powered Photography Service" 
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
            <button 
              onClick={handleCloseAdModal}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 hover:scale-110"
              aria-label="Close advertisement"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
      
    </div>
  )
}