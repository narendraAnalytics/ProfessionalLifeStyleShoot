'use client'

import { Sparkles, Camera } from 'lucide-react'
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function NewHeroSection() {
  const router = useRouter()

  return (
    <main className="w-full min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
      <div className="w-full max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-slate-800">
          Transform Your Vision into
          <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Professional Reality
          </span>
        </h1>
        
        <p className="text-lg sm:text-xl lg:text-2xl mb-12 text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Create stunning professional lifestyle photoshoots with AI-powered technology. 
          Elegant design with perfect user experience.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          {/* Create Your Shoot Button - Conditional based on auth */}
          <SignedOut>
            <SignInButton mode="modal">
              <button className="group relative w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-cyan-500 via-emerald-500 to-lime-500 hover:from-cyan-400 hover:via-emerald-400 hover:to-lime-400 rounded-2xl text-white font-bold text-lg transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-2xl hover:shadow-cyan-500/25 active:scale-95 overflow-hidden">
                {/* Animated background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-emerald-400 to-lime-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                
                {/* Button content */}
                <div className="relative flex items-center justify-center space-x-3">
                  <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="group-hover:tracking-wide transition-all duration-300">Create Your Shoot</span>
                </div>
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <button 
              onClick={() => router.push('/dashboard')}
              className="group relative w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-cyan-500 via-emerald-500 to-lime-500 hover:from-cyan-400 hover:via-emerald-400 hover:to-lime-400 rounded-2xl text-white font-bold text-lg transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-2xl hover:shadow-cyan-500/25 active:scale-95 overflow-hidden"
            >
              {/* Animated background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-emerald-400 to-lime-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              
              {/* Button content */}
              <div className="relative flex items-center justify-center space-x-3">
                <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                <span className="group-hover:tracking-wide transition-all duration-300">Create Your Shoot</span>
              </div>
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
            </button>
          </SignedIn>

          {/* View Gallery Button - Conditional based on auth */}
          <SignedOut>
            <button 
              onClick={() => router.push('/gallery')}
              className="group relative w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:via-pink-500 hover:to-rose-500 rounded-2xl text-white font-bold text-lg transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-2xl hover:shadow-purple-500/25 active:scale-95 overflow-hidden"
            >
              {/* Animated background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              
              {/* Button content */}
              <div className="relative flex items-center justify-center space-x-3">
                <Camera className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                <span className="group-hover:tracking-wide transition-all duration-300">View Gallery</span>
              </div>
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
            </button>
          </SignedOut>

          <SignedIn>
            <button 
              onClick={() => router.push('/my-gallery')}
              className="group relative w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:via-pink-500 hover:to-rose-500 rounded-2xl text-white font-bold text-lg transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-2xl hover:shadow-purple-500/25 active:scale-95 overflow-hidden"
            >
              {/* Animated background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              
              {/* Button content */}
              <div className="relative flex items-center justify-center space-x-3">
                <Camera className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                <span className="group-hover:tracking-wide transition-all duration-300">My Gallery</span>
              </div>
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
            </button>
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
  )
}