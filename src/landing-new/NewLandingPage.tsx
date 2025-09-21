'use client'

import { useState, useEffect } from 'react'
import NewNavbar from './components/NewNavbar'
import NewHeroSection from './components/NewHeroSection'

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
      {/* Beautiful light gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/40 via-indigo-100/40 to-purple-100/40 animate-pulse" />
        
        {/* Floating gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Content wrapper with proper constraints */}
      <div className="relative z-10 w-full max-w-none">
        {/* Navigation */}
        <NewNavbar />

        {/* Hero Section */}
        <NewHeroSection />
      </div>
    </div>
  )
}