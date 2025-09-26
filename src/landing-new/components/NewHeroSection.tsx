'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Camera } from 'lucide-react'
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function NewHeroSection() {
  // Add custom styles for enhanced animations
  const customStyles = `
    @keyframes wordSlideIn {
      0% {
        opacity: 0;
        transform: translateY(20px) scale(0.8);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    
    @keyframes wordSlideOut {
      0% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
      100% {
        opacity: 0;
        transform: translateY(-20px) scale(0.8);
      }
    }
  `
  const router = useRouter()
  
  const rotatingWords = ["Model", "Brand", "Designer", "Creator", "Content"]
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isGalleryLoading, setIsGalleryLoading] = useState(false)
  const [isMyGalleryLoading, setIsMyGalleryLoading] = useState(false)
  const [isCreateShootLoading, setIsCreateShootLoading] = useState(false)
  
  const handleGalleryClick = () => {
    setIsGalleryLoading(true)
    router.push('/gallery')
  }

  const handleMyGalleryClick = () => {
    setIsMyGalleryLoading(true)
    router.push('/gallery')
  }

  const handleCreateShootClick = () => {
    setIsCreateShootLoading(true)
    router.push('/dashboard')
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length)
        
        setTimeout(() => {
          setIsAnimating(false)
        }, 50) // Brief pause before entrance
      }, 350) // Exit animation duration
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <style jsx>{customStyles}</style>
      <main id="home" className="w-full min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
        <div className="w-full max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-slate-200 drop-shadow-2xl">
          Transform Your{' '}
          <span className="inline-block min-w-[140px] text-left relative overflow-hidden">
            <span 
              className={`inline-block transition-all duration-300 ease-in-out transform bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent ${
                isAnimating 
                  ? 'opacity-0 -translate-y-4 scale-95' 
                  : 'opacity-100 translate-y-0 scale-100'
              }`}
            >
              {rotatingWords[currentWordIndex]}
            </span>
          </span>{' '}
          Vision into
          <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
            Professional Reality
          </span>
        </h1>
        
        <p className="text-lg sm:text-xl lg:text-2xl mb-12 text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
          Create stunning professional lifestyle photoshoots with AI-powered technology. 
          Elegant design with perfect user experience.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          {/* Create Your Shoot Button - Conditional based on auth */}
          <SignedOut>
            <SignInButton mode="modal">
              <button className="group relative w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-cyan-500 via-emerald-500 to-lime-500 hover:from-cyan-400 hover:via-emerald-400 hover:to-lime-400 rounded-2xl text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-2xl hover:shadow-cyan-500/25 active:scale-95 overflow-hidden">
                {/* Animated background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-emerald-400 to-lime-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>
                
                {/* Button content */}
                <div className="relative flex items-center justify-center space-x-3">
                  <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="group-hover:tracking-wide transition-all duration-300">Create Your Shoot</span>
                </div>
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent overflow-hidden"></div>
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <button 
              onClick={handleCreateShootClick}
              className="group relative w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-cyan-500 via-emerald-500 to-lime-500 hover:from-cyan-400 hover:via-emerald-400 hover:to-lime-400 rounded-2xl text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-2xl hover:shadow-cyan-500/25 active:scale-95 overflow-hidden"
            >
              {/* Animated background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-emerald-400 to-lime-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>
              
              {/* Button content */}
              <div className="relative flex items-center justify-center space-x-3">
                <Sparkles className={`w-6 h-6 transition-transform duration-300 ${
                  isCreateShootLoading 
                    ? 'animate-spin' 
                    : 'group-hover:rotate-12'
                }`} />
                <span className="group-hover:tracking-wide transition-all duration-300">Create Your Shoot</span>
              </div>
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent overflow-hidden"></div>
            </button>
          </SignedIn>

          {/* View Gallery Button - Conditional based on auth */}
          <SignedOut>
            <div className="relative group">
              <button 
                onClick={handleGalleryClick}
                className="group relative w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:via-pink-500 hover:to-rose-500 rounded-2xl text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-2xl hover:shadow-purple-500/25 active:scale-95 overflow-hidden"
              >
                {/* Animated background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>
                
                {/* Button content */}
                <div className="relative flex items-center justify-center space-x-3">
                  <Camera className={`w-6 h-6 transition-transform duration-300 ${
                    isGalleryLoading 
                      ? 'animate-spin' 
                      : 'group-hover:rotate-12'
                  }`} />
                  <span className="group-hover:tracking-wide transition-all duration-300">View Gallery</span>
                </div>
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent overflow-hidden"></div>
              </button>
              
              {/* Tooltip */}
              <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out pointer-events-none z-[99999]">
                <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 text-white px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap shadow-2xl border border-white/30 backdrop-blur-lg relative overflow-hidden">
                  {/* Glowing background effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 opacity-20 blur-sm"></div>
                  
                  {/* Text content */}
                  <span className="relative z-10 bg-gradient-to-r from-white via-cyan-100 to-purple-100 bg-clip-text text-transparent font-extrabold tracking-wide">
                    AI GENERATED IMAGES VIEW HERE
                  </span>
                  
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-[6px] border-transparent border-t-purple-600"></div>
                </div>
              </div>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="relative group">
              <button 
                onClick={handleMyGalleryClick}
                className="group relative w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:via-pink-500 hover:to-rose-500 rounded-2xl text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-2xl hover:shadow-purple-500/25 active:scale-95 overflow-hidden"
              >
                {/* Animated background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>
                
                {/* Button content */}
                <div className="relative flex items-center justify-center space-x-3">
                  <Camera className={`w-6 h-6 transition-transform duration-300 ${
                    isMyGalleryLoading 
                      ? 'animate-spin' 
                      : 'group-hover:rotate-12'
                  }`} />
                  <span className="group-hover:tracking-wide transition-all duration-300">My Gallery</span>
                </div>
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent overflow-hidden"></div>
              </button>
              
              {/* Tooltip */}
              <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out pointer-events-none z-[99999]">
                <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 text-white px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap shadow-2xl border border-white/30 backdrop-blur-lg relative overflow-hidden">
                  {/* Glowing background effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 opacity-20 blur-sm"></div>
                  
                  {/* Text content */}
                  <span className="relative z-10 bg-gradient-to-r from-white via-cyan-100 to-purple-100 bg-clip-text text-transparent font-extrabold tracking-wide">
                    ACCESS YOUR PERSONAL GALLERY
                  </span>
                  
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-[6px] border-transparent border-t-purple-600"></div>
                </div>
              </div>
            </div>
          </SignedIn>
        </div>

        {/* Additional floating animation */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-30"></div>
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-emerald-400 rounded-full animate-pulse opacity-40 animation-delay-1000"></div>
          <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-purple-400 rounded-full animate-bounce opacity-30 animation-delay-2000"></div>
        </div>
      </div>
    </main>
    </>
  )
}