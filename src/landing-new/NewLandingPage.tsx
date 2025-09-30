'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
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
  // Banner advertisement modal state
  const [showAdModal, setShowAdModal] = useState(false)

  // Show banner modal on first visit (once per session)
  useEffect(() => {
    // Check if user has seen the ad in this browser session
    const adSeen = sessionStorage.getItem('bannerAdSeen')
    if (!adSeen) {
      // Show modal after 3 seconds delay for better user experience
      const timer = setTimeout(() => setShowAdModal(true), 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  // Handle closing the banner modal
  const handleCloseAdModal = () => {
    setShowAdModal(false)
    // Mark as seen for this session so it won't show again
    sessionStorage.setItem('bannerAdSeen', 'true')
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

      {/* Promotional Banner Modal */}
      <Dialog open={showAdModal} onOpenChange={handleCloseAdModal}>
        <DialogContent className="max-w-6xl p-0 border-0 bg-transparent shadow-2xl">
          <DialogTitle className="sr-only">AI-Powered Photography Service Promotion</DialogTitle>
          <div className="relative">
            {/* Three-panel advertisement layout */}
            <div className="grid grid-cols-3 gap-2 rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm">
              {/* Left Panel - Saree Shoot */}
              <div className="relative group">
                <img 
                  src="/Sareeshoot.jpeg" 
                  alt="Professional Saree Photography" 
                  className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              {/* Center Panel - Main Banner */}
              <div className="relative group">
                <img 
                  src="/BannerImage.png" 
                  alt="AI-Powered Photography Service" 
                  className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              {/* Right Panel - Bright Shoot */}
              <div className="relative group">
                <img 
                  src="/BrightShoot.jpeg" 
                  alt="Professional Lifestyle Photography" 
                  className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
            
            {/* Close button */}
            <button 
              onClick={handleCloseAdModal}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 hover:scale-110 z-10"
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