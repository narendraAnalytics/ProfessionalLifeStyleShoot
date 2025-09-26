'use client'

import { useState } from 'react'
import Image from 'next/image'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube,
  Heart,
  Camera,
  Sparkles,
  ExternalLink
} from 'lucide-react'
import { toast } from 'sonner'

interface FooterLink {
  name: string
  href: string
}

interface FooterSection {
  title: string
  links: FooterLink[]
}

interface SocialLink {
  name: string
  href: string
  icon: React.ElementType
  color: string
}

export default function Footer() {
  const [email, setEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubscribing(true)
    
    // Simulate subscription
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.success('Thanks for subscribing! Check your email for confirmation.')
    setEmail('')
    setIsSubscribing(false)
  }

  const footerSections: FooterSection[] = [
    {
      title: 'Services',
      links: [
        { name: 'AI Photography', href: '/services/ai-photography' },
        { name: 'Lifestyle Shoots', href: '/services/lifestyle' },
        { name: 'Brand Content', href: '/services/brand-content' },
        { name: 'Portfolio Creation', href: '/services/portfolio' },
        { name: 'Image Enhancement', href: '/services/enhancement' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Our Team', href: '/team' },
        { name: 'Blog', href: '/blog' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press Kit', href: '/press' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Refund Policy', href: '/refund' }
      ]
    }
  ]

  const socialLinks: SocialLink[] = [
    {
      name: 'Instagram',
      href: 'https://instagram.com/lifeshotstudios',
      icon: Instagram,
      color: 'from-pink-500 to-purple-500'
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/lifeshotstudios',
      icon: Twitter,
      color: 'from-blue-400 to-blue-600'
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/lifeshotstudios',
      icon: Linkedin,
      color: 'from-blue-600 to-blue-700'
    },
    {
      name: 'YouTube',
      href: 'https://youtube.com/@lifeshotstudios',
      icon: Youtube,
      color: 'from-red-500 to-red-600'
    }
  ]

  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-100/40 to-purple-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-100/40 to-pink-100/40 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Main Footer */}
        <div className="px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="max-w-7xl mx-auto">
            {/* Top Section */}
            <div className="grid lg:grid-cols-12 gap-12 mb-12">
              {/* Brand Section */}
              <div className="lg:col-span-4 space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-sm" />
                    <Image
                      src="/images/iconWebsite.png"
                      alt="Professional Life Shoot Logo"
                      width={48}
                      height={48}
                      className="relative rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      LifeShot Studios
                    </h3>
                    <p className="text-gray-500 text-sm">AI-Powered Photography</p>
                  </div>
                </div>

                <p className="text-gray-600 leading-relaxed">
                  Transform your ordinary photos into stunning professional lifestyle shoots with our cutting-edge AI technology. 
                  Create magazine-quality images in seconds.
                </p>

                {/* Newsletter Signup */}
                <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    <h4 className="font-semibold text-gray-900">Stay Updated</h4>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Get the latest AI photography tips and updates
                  </p>
                  <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="flex-1 px-4 py-2 bg-white/50 border border-gray-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isSubscribing}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubscribing ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Footer Links */}
              <div className="lg:col-span-8 grid md:grid-cols-3 gap-8">
                {footerSections.map((section, index) => (
                  <div key={index} className="space-y-4">
                    <h4 className="font-bold text-gray-900 text-lg">
                      {section.title}
                    </h4>
                    <ul className="space-y-3">
                      {section.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <a
                            href={link.href}
                            className="text-gray-600 hover:text-purple-600 transition-colors duration-300 group flex items-center gap-1"
                          >
                            <span>{link.name}</span>
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Separator */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-8" />

            {/* Bottom Section */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              {/* Copyright */}
              <div className="flex items-center gap-4 text-gray-600">
                <p className="text-sm">
                  © {currentYear} LifeShot Studios. All rights reserved.
                </p>
                <div className="hidden md:flex items-center gap-1 text-xs text-gray-500">
                  <span>Made with</span>
                  <Heart className="w-3 h-3 text-red-500 fill-current" />
                  <span>by our team</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-500" />
                  <span>hello@lifeshotstudios.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-purple-500" />
                  <span>+1 (555) 123-4567</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative"
                  >
                    <div className={`w-10 h-10 bg-gradient-to-r ${social.color} rounded-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:rotate-6 group-hover:shadow-lg`}>
                      <social.icon className="w-5 h-5" />
                    </div>
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      {social.name}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-white/40 backdrop-blur-sm border-t border-gray-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <span>🚀 Powered by AI Technology</span>
                <span>•</span>
                <span>✨ Professional Results in Seconds</span>
              </div>
              <div className="flex items-center gap-4">
                <a href="/support" className="hover:text-purple-600 transition-colors duration-300">
                  Support
                </a>
                <a href="/status" className="hover:text-purple-600 transition-colors duration-300">
                  System Status
                </a>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>All systems operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/6 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-30" />
        <div className="absolute top-3/4 right-1/6 w-2 h-2 bg-pink-400 rounded-full animate-pulse opacity-40" />
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-blue-400 rounded-full animate-bounce opacity-30" />
      </div>
    </footer>
  )
}