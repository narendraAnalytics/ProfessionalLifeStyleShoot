'use client'

import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Star, Sparkles, Zap, Camera, Users, Award } from 'lucide-react'
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function HeroSection() {
  const [currentImage, setCurrentImage] = useState(0)
  const [animatedText, setAnimatedText] = useState('')
  const fullText = "Transform Into a Professional Model with AI"
  const router = useRouter()

  // Professional lifestyle photoshoot images
  const professionalImages = [
    { 
      id: 1, 
      src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      style: 'Luxury Watch',
      alt: 'Professional luxury watch photoshoot'
    },
    { 
      id: 2, 
      src: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      style: 'Modern Home',
      alt: 'Professional modern house photography'
    },
    { 
      id: 3, 
      src: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      style: 'Designer Shoes',
      alt: 'Professional designer shoe photography'
    },
    { 
      id: 4, 
      src: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      style: 'Fine Jewelry',
      alt: 'Professional jewelry photoshoot'
    },
    { 
      id: 5, 
      src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      style: 'Fashion Style',
      alt: 'Professional fashion photography'
    }
  ]

  // Animate text on load
  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setAnimatedText(fullText.slice(0, index + 1))
        index++
      } else {
        clearInterval(interval)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [])

  // Auto-rotate images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % professionalImages.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const trustBadges = [
    { icon: Users, text: "10,000+ Shoots Created", color: "from-blue-400 to-cyan-400" },
    { icon: Star, text: "5-Star Rated", color: "from-yellow-400 to-orange-400" },
    { icon: Award, text: "AI-Powered", color: "from-purple-400 to-pink-400" }
  ]

  const floatingCards = [
    { icon: Camera, text: "100+ Styles", delay: "delay-0" },
    { icon: Sparkles, text: "HD Quality", delay: "delay-1000" },
    { icon: Zap, text: "60 Sec Generation", delay: "delay-2000" }
  ]

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-white/20 rounded-full animate-pulse`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Animated headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
                {animatedText}
                <span className="animate-pulse">|</span>
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Create stunning professional photoshoots in minutes using cutting-edge AI technology
            </p>

            {/* Floating glassmorphic info cards */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 my-8">
              {floatingCards.map((card, index) => (
                <div
                  key={index}
                  className={`group bg-gray-800/90 backdrop-blur-md border border-gray-700 rounded-2xl px-6 py-4 hover:bg-gray-700/90 transition-all duration-300 hover:scale-105 animate-bounce ${card.delay}`}
                >
                  <div className="flex items-center space-x-3">
                    <card.icon className="w-5 h-5 text-purple-400 group-hover:text-pink-400 transition-colors" />
                    <span className="text-white font-medium">{card.text}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Sign In to Create Shoot
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Button 
                  size="lg" 
                  onClick={() => {
                    // Add immediate visual feedback
                    const button = document.activeElement as HTMLButtonElement
                    if (button) {
                      button.style.transform = 'scale(0.95)'
                      setTimeout(() => {
                        button.style.transform = ''
                      }, 100)
                    }
                    router.push('/dashboard')
                  }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 active:scale-95"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Create Your Shoot
                </Button>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-gray-300 text-gray-800 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold text-lg backdrop-blur-sm transition-all duration-300 hover:scale-105"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    View Gallery
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => {
                    // Add immediate visual feedback
                    const button = document.activeElement as HTMLButtonElement
                    if (button) {
                      button.style.transform = 'scale(0.95)'
                      setTimeout(() => {
                        button.style.transform = ''
                      }, 100)
                    }
                    // Navigate to dashboard with gallery section active
                    router.push('/dashboard?section=gallery')
                  }}
                  className="border-gray-300 text-gray-800 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold text-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  View Gallery
                </Button>
              </SignedIn>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-12">
              {trustBadges.map((badge, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className={`p-2 rounded-full bg-gradient-to-r ${badge.color}`}>
                    <badge.icon className="w-4 h-4 text-gray-800" />
                  </div>
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Image carousel */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Main rotating image display */}
              <div className="relative w-80 h-80 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px]">
                {/* Single image display */}
                <div className="relative w-full h-full">
                  {/* Glassmorphic frame */}
                  <div className="relative w-full h-full bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-3xl p-4 border border-gray-700 shadow-2xl">
                    <div className="relative w-full h-full rounded-2xl overflow-hidden">
                      <Image
                        src={professionalImages[currentImage].src}
                        alt={professionalImages[currentImage].alt}
                        fill
                        className="object-cover transition-all duration-500"
                        priority
                      />
                      
                      {/* Style label overlay */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <Badge className="bg-white/70 backdrop-blur-md text-gray-800 border-gray-200 px-3 py-2 text-sm font-medium">
                          {professionalImages[currentImage].style}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl blur-xl -z-10 animate-pulse" />
                </div>
              </div>

              {/* Image navigation dots */}
              <div className="flex justify-center space-x-2 mt-8">
                {professionalImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentImage
                        ? 'bg-gradient-to-r from-purple-400 to-pink-400 scale-125'
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>

              {/* Floating decorative elements */}
              <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-20 animate-ping" />
              <div className="absolute -bottom-8 -left-8 w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-30 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}