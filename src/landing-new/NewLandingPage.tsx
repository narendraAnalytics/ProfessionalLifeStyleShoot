'use client'

import { useState, useEffect } from 'react'
import NewNavbar from './components/NewNavbar'
import NewHeroSection from './components/NewHeroSection'
import ImageCarousel from './components/ImageCarousel'

export default function NewLandingPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
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
    </div>
  )
}