'use client'

import { useState, useEffect, useRef } from 'react'
import { Sparkles, ArrowRight, Mail, Star } from 'lucide-react'
import { Button } from './ui/button'

export default function CTASection() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [visibleSection, setVisibleSection] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const floatingImages = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      className: 'absolute top-10 left-10 w-16 h-16 rounded-2xl opacity-20 animate-pulse',
      delay: '0s'
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      className: 'absolute top-20 right-20 w-20 h-20 rounded-2xl opacity-30 animate-pulse',
      delay: '1s'
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      className: 'absolute bottom-16 left-16 w-14 h-14 rounded-2xl opacity-25 animate-pulse',
      delay: '2s'
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      className: 'absolute bottom-20 right-12 w-18 h-18 rounded-2xl opacity-20 animate-pulse',
      delay: '0.5s'
    }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSection(true)
          }
        })
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
      setTimeout(() => {
        setIsSubmitted(false)
        setEmail('')
      }, 3000)
    }
  }

  return (
    <section className="relative py-12 lg:py-20 overflow-hidden">
      {/* Animated Mesh Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-blue-900/30" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-pulse" />
        
        {/* Large background orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div ref={sectionRef} className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main CTA Container */}
        <div className={`
          relative bg-white/80 backdrop-blur-md border border-gray-300 rounded-3xl p-8 lg:p-16 overflow-hidden
          transition-all duration-1000 transform
          ${visibleSection ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}
        `}>
          
          {/* Background Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10 rounded-3xl" />
          
          {/* Floating Sample Images */}
          <div className="absolute inset-0 pointer-events-none hidden lg:block">
            {floatingImages.map((image) => (
              <div
                key={image.id}
                className={image.className}
                style={{ animationDelay: image.delay }}
              >
                <img
                  src={image.src}
                  alt=""
                  className="w-full h-full object-cover rounded-2xl border border-white/20"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-2xl" />
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            {/* Main Headline */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 px-4 py-2 rounded-full border border-purple-400/30 mb-6">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span className="text-purple-300 font-medium">Ready to Transform Your Photography?</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  Become a Professional Model with AI
                </span>
              </h2>
              
              <p className="text-xl md:text-2xl text-gray-800/80 leading-relaxed mb-8">
                Join over <span className="text-purple-300 font-semibold">50,000+ creators</span> who are already using our AI to create stunning professional photos in seconds.
              </p>
            </div>

            {/* Email Capture Form */}
            <div className="mb-8">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-800/50 w-5 h-5" />
                    <input
                      type="email"
                      placeholder="Enter your email to start free trial"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-md border border-gray-400 rounded-2xl text-gray-800 placeholder-white/60 focus:outline-none focus:border-purple-400/50 focus:bg-white/95 transition-all duration-300"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-gray-800 px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 whitespace-nowrap"
                  >
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </form>
              ) : (
                <div className="flex items-center justify-center gap-3 py-4 px-6 bg-green-500/20 border border-green-400/30 rounded-2xl max-w-xl mx-auto">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-3 h-3 text-gray-800 transform rotate-45" />
                  </div>
                  <span className="text-green-300 font-medium">Thanks! Check your email to get started.</span>
                </div>
              )}

              <p className="text-gray-800/50 text-sm mt-4">
                No credit card required • 7-day free trial • Cancel anytime
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-gray-800 px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Try AI Photography Now
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                className="border-white/30 text-gray-800 hover:bg-white/90 px-8 py-4 rounded-2xl font-semibold text-lg backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                View Sample Gallery
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-800/60">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm">4.9/5 from 10k+ reviews</span>
              </div>
              
              <div className="w-px h-6 bg-white/20 hidden sm:block" />
              
              <div className="text-sm">
                <span className="text-green-400 font-medium">99.9%</span> uptime guarantee
              </div>
              
              <div className="w-px h-6 bg-white/20 hidden sm:block" />
              
              <div className="text-sm">
                <span className="text-purple-400 font-medium">50k+</span> photos generated daily
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-8 left-8 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-60" />
          <div className="absolute top-12 right-12 w-3 h-3 bg-pink-400 rounded-full animate-pulse opacity-40" />
          <div className="absolute bottom-8 left-12 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-50 animation-delay-1000" />
          <div className="absolute bottom-12 right-8 w-3 h-3 bg-cyan-400 rounded-full animate-pulse opacity-30 animation-delay-2000" />
        </div>
      </div>
    </section>
  )
}