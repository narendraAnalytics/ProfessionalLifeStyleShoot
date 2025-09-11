'use client'

import { useState, useEffect } from 'react'
import Navbar from './Navbar'
import HeroSection from './HeroSection'
import HowItWorksSection from './HowItWorksSection'
import AIFeaturesSection from './AIFeaturesSection'
import PricingSection from './PricingSection'
import TestimonialsSection from './TestimonialsSection'
import FAQSection from './FAQSection'
import CTASection from './CTASection'
import Footer from './Footer'
import ScrollProgress from './ScrollProgress'
import CursorFollower from './CursorFollower'

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setMounted(true)
    
    // Enhanced smooth scrolling for the entire page
    document.documentElement.style.scrollBehavior = 'smooth'
    
    // Mouse tracking for interactive effects
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-900 overflow-x-hidden">
      {/* Custom cursor and scroll progress */}
      <CursorFollower />
      <ScrollProgress />
      
      {/* Enhanced animated background elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-200/40 via-blue-200/40 to-pink-200/40 animate-pulse" />
        
        {/* Floating orbs with mouse interaction */}
        <div 
          className="absolute w-96 h-96 bg-purple-400/30 rounded-full blur-3xl animate-pulse transition-transform duration-1000"
          style={{
            top: '25%',
            left: '25%',
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        />
        <div 
          className="absolute w-96 h-96 bg-blue-400/30 rounded-full blur-3xl animate-pulse delay-1000 transition-transform duration-1000"
          style={{
            top: '75%',
            right: '25%',
            transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * 0.015}px)`
          }}
        />
        <div 
          className="absolute w-96 h-96 bg-pink-400/30 rounded-full blur-3xl animate-pulse delay-2000 transition-transform duration-1000"
          style={{
            bottom: '25%',
            left: '50%',
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * -0.01}px)`
          }}
        />
        
        {/* Additional floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/40 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Content with enhanced spacing and animations */}
      <div className="relative z-10 space-y-0">
        <Navbar />
        
        <main className="space-y-0">
          <section id="home" className="pt-8">
            <HeroSection />
          </section>
          
          <section id="how-it-works">
            <HowItWorksSection />
          </section>
          
          <section id="ai-features">
            <AIFeaturesSection />
          </section>
          
          <section id="pricing">
            <PricingSection />
          </section>
          
          <section id="testimonials">
            <TestimonialsSection />
          </section>
          
          <section id="faq">
            <FAQSection />
          </section>
          
          <section id="cta">
            <CTASection />
          </section>
        </main>
        
        <Footer />
      </div>
    </div>
  )
}