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
    <div className="min-h-screen w-full overflow-x-hidden">
      {/* Dynamic Carousel Background */}
      <ImageCarousel />

      {/* Content wrapper with proper constraints - floats above carousel */}
      <div className="relative z-20 w-full max-w-none">
        {/* Navigation */}
        <NewNavbar />

        {/* Hero Section */}
        <NewHeroSection />
      </div>
    </div>
  )
}