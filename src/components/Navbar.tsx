'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { Button } from './ui/button'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', href: '#home', isRoute: false },
    { name: 'How It Works', href: '#how-it-works', isRoute: false },
    { name: 'Gallery', href: '/gallery', isRoute: true },
    { name: 'Pricing', href: '#pricing', isRoute: false },
    { name: 'About', href: '#about', isRoute: false },
    { name: 'Contact', href: '#contact', isRoute: false }
  ]

  const handleNavClick = (href: string) => {
    const elementId = href.replace('#', '')
    const element = document.getElementById(elementId)
    if (element) {
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - 80

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ease-out ${
      isScrolled 
        ? 'bg-black/20 backdrop-blur-md border-b border-white/10 py-2' 
        : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 group">
            <a 
              href="#home" 
              onClick={(e) => {
                e.preventDefault()
                handleNavClick('#home')
              }}
              className="flex items-center transition-all duration-300 group-hover:scale-200 relative z-20"
            >
              <div className="relative">
                {/* Glow effect background */}
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Logo Image */}
                <Image
                  src="/images/iconWebsite.png"
                  alt="Professional Life Shoot Logo"
                  width={44}
                  height={44}
                  className="relative z-10 rounded-full transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/25 w-10 h-10 sm:w-11 sm:h-11"
                  priority
                />
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    if (!item.isRoute) {
                      e.preventDefault()
                      handleNavClick(item.href)
                    }
                  }}
                  className="text-gray-800/80 hover:text-gray-800 px-3 py-2 text-sm font-medium transition-all duration-300 relative group cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="relative z-10">{item.name}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300 group-hover:w-full"></span>
                  <div className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10 scale-95 group-hover:scale-100" />
                </a>
              ))}
            </div>
          </div>

          {/* CTA Button / User Menu */}
          <div className="hidden md:flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:shadow-2xl hover:scale-110 relative overflow-hidden cursor-pointer group">
                  <span className="relative z-10">Sign In to Start</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-30 group-hover:opacity-70 transition-opacity duration-300 -z-10" />
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Button 
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
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:shadow-2xl hover:scale-110 relative overflow-hidden cursor-pointer group active:scale-95"
              >
                <span className="relative z-10">Start Your Shoot</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-30 group-hover:opacity-70 transition-opacity duration-300 -z-10" />
              </Button>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-800 hover:text-purple-400 transition-colors duration-300"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/90 backdrop-blur-md border-b border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-800/80 hover:text-gray-800 block px-3 py-2 text-base font-medium transition-colors duration-300"
                  onClick={(e) => {
                    if (!item.isRoute) {
                      e.preventDefault()
                      handleNavClick(item.href)
                    }
                    setIsMobileMenuOpen(false)
                  }}
                >
                  {item.name}
                </a>
              ))}
              <div className="px-3 py-2 space-y-2">
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 rounded-full font-medium transition-all duration-300">
                      Sign In to Start
                    </Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Button 
                    onClick={() => {
                      // Add immediate visual feedback for mobile
                      const button = document.activeElement as HTMLButtonElement
                      if (button) {
                        button.style.transform = 'scale(0.95)'
                        setTimeout(() => {
                          button.style.transform = ''
                        }, 100)
                      }
                      router.push('/dashboard')
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 rounded-full font-medium transition-all duration-300 active:scale-95"
                  >
                    Start Your Shoot
                  </Button>
                  <div className="flex justify-center pt-2">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </SignedIn>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}