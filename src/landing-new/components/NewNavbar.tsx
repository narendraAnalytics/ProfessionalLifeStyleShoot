'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X, Play, Home, Sparkles, CreditCard, Image as ImageIcon, Mail, Crown, Gift, Zap } from 'lucide-react'
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function NewNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const { has } = useAuth()

  // Determine current plan
  const getCurrentPlan = () => {
    if (has && has({ plan: 'max_ultimate' })) {
      return { name: 'Max', icon: Zap, color: 'from-orange-400 to-red-400', bgColor: 'bg-gradient-to-r from-orange-500/20 to-red-500/20' }
    }
    if (has && has({ plan: 'pro_plan' })) {
      return { name: 'Pro', icon: Crown, color: 'from-purple-400 to-pink-400', bgColor: 'bg-gradient-to-r from-purple-500/20 to-pink-500/20' }
    }
    return { name: 'Free', icon: Gift, color: 'from-green-400 to-emerald-400', bgColor: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20' }
  }

  const navigationItems = [
    { name: 'Home', href: '#home', icon: Home },
    { name: 'Features', href: '#features', icon: Sparkles },
    { name: 'Pricing', href: '#pricing', icon: CreditCard },
    { name: 'Gallery', href: '#gallery', icon: ImageIcon },
    { name: 'Contact', href: '#contact', icon: Mail }
  ]

  const handleNavigation = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      element?.scrollIntoView({ behavior: 'smooth' })
    } else {
      router.push(href)
    }
    setIsMenuOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full">
      {/* Content container with proper width constraints - no background */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => handleNavigation('#home')}>
              <div className="relative w-12 h-12 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:drop-shadow-lg">
                <Image
                  src="/images/iconWebsite.png"
                  alt="Professional LifeShoot Logo"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-500 via-emerald-500 to-lime-500 bg-clip-text text-transparent group-hover:from-cyan-600 group-hover:via-emerald-600 group-hover:to-lime-600 transition-all duration-300">
                  Professional LifeShoot
                </h1>
                <p className="text-xs bg-gradient-to-r from-slate-600 to-emerald-500 bg-clip-text text-transparent group-hover:from-emerald-500 group-hover:to-cyan-500 transition-all duration-300">
                  Creating Branded Images Using AI
                </p>
              </div>
            </div>

            {/* Plan Badge - Only show when signed in */}
            <SignedIn>
              {(() => {
                const currentPlan = getCurrentPlan()
                const PlanIcon = currentPlan.icon
                return (
                  <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full ${currentPlan.bgColor} backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-105 cursor-pointer group/badge`}
                       onClick={() => currentPlan.name === 'Free' ? handleNavigation('#pricing') : undefined}>
                    <PlanIcon className={`w-4 h-4 text-transparent bg-gradient-to-r ${currentPlan.color} bg-clip-text group-hover/badge:scale-110 transition-transform duration-300`} />
                    <span className={`text-sm font-medium text-transparent bg-gradient-to-r ${currentPlan.color} bg-clip-text`}>
                      {currentPlan.name}
                    </span>
                    {currentPlan.name === 'Free' && (
                      <div className="text-xs text-white/60 group-hover/badge:text-white/80 transition-colors duration-300">
                        (Upgrade)
                      </div>
                    )}
                  </div>
                )
              })()}
            </SignedIn>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => {
              const IconComponent = item.icon
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className="relative text-slate-600 hover:text-slate-800 transition-all duration-300 font-medium group flex items-center justify-center w-16 h-10"
                >
                  {/* Text that fades out on hover */}
                  <span className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 group-hover:scale-75 transition-all duration-300 ease-out">
                    {item.name}
                  </span>
                  
                  {/* Icon that fades in on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 scale-125 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out">
                    <IconComponent className="w-5 h-5 text-cyan-600" />
                  </div>
                  
                  {/* Modern underline animation */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-500 via-emerald-500 to-lime-500 group-hover:w-8 transition-all duration-300 ease-out"></div>
                  
                  {/* Subtle background glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-100/30 via-emerald-100/30 to-lime-100/30 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 ease-out"></div>
                </button>
              )
            })}
          </div>

          {/* Auth and CTA section */}
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton 
                mode="modal"
                forceRedirectUrl="/"
                signUpForceRedirectUrl="/"
              >
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0">
                  <Play className="w-4 h-4 mr-2" />
                  Start Shoot
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Button 
                onClick={() => router.push('/dashboard')}
                className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-semibold px-6 py-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Dashboard
              </Button>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 ring-2 ring-blue-400 ring-offset-2"
                  }
                }}
              />
            </SignedIn>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile navigation menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 right-0 bg-black/80 backdrop-blur-sm rounded-lg mx-4">
            <div className="px-4 py-6 space-y-4">
              {navigationItems.map((item) => {
                const IconComponent = item.icon
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.href)}
                    className="relative block w-full text-left text-slate-600 hover:text-slate-800 transition-all duration-300 font-medium py-3 px-4 rounded-lg group"
                  >
                    <div className="flex items-center space-x-3">
                      {/* Icon */}
                      <IconComponent className="w-5 h-5 text-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {/* Text */}
                      <span className="relative z-10">{item.name}</span>
                    </div>
                    
                    {/* Modern slide-in background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-emerald-500/20 to-lime-500/20 rounded-lg translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                    {/* Left border accent */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-600 via-emerald-600 to-lime-600 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out origin-center rounded-full"></div>
                  </button>
                )
              })}
              
              <SignedOut>
                <div className="pt-4 border-t border-white/10">
                  <SignInButton 
                    mode="modal"
                    forceRedirectUrl="/"
                    signUpForceRedirectUrl="/"
                  >
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 justify-start">
                      <Play className="w-4 h-4 mr-2" />
                      Start Shoot
                    </Button>
                  </SignInButton>
                </div>
              </SignedOut>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}