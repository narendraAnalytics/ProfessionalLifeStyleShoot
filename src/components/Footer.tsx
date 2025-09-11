'use client'

import { useState } from 'react'
import { Mail, Heart, ArrowRight, Github, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react'
import { Button } from './ui/button'

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newsletterEmail) {
      setIsSubscribed(true)
      setTimeout(() => {
        setIsSubscribed(false)
        setNewsletterEmail('')
      }, 3000)
    }
  }

  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "AI Photography", href: "#" },
        { name: "Style Presets", href: "#" },
        { name: "API Access", href: "#" },
        { name: "Pricing", href: "#pricing" },
        { name: "Enterprise", href: "#" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "#" },
        { name: "Video Tutorials", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Case Studies", href: "#" },
        { name: "Community", href: "#" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#about" },
        { name: "Careers", href: "#" },
        { name: "Press Kit", href: "#" },
        { name: "Partners", href: "#" },
        { name: "Contact", href: "#contact" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Cookie Policy", href: "#" },
        { name: "GDPR", href: "#" },
        { name: "Licenses", href: "#" }
      ]
    }
  ]

  const socialLinks = [
    { name: "Twitter", icon: Twitter, href: "#", color: "hover:text-blue-400" },
    { name: "Instagram", icon: Instagram, href: "#", color: "hover:text-pink-400" },
    { name: "LinkedIn", icon: Linkedin, href: "#", color: "hover:text-blue-600" },
    { name: "GitHub", icon: Github, href: "#", color: "hover:text-gray-300" },
    { name: "YouTube", icon: Youtube, href: "#", color: "hover:text-red-400" }
  ]

  return (
    <footer className="relative bg-black/50 backdrop-blur-md border-t border-white/10">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <a href="#home" className="inline-block">
                  <div className="text-3xl font-bold">
                    <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
                      ProfessionalLifeStyleShoot
                    </span>
                  </div>
                </a>
                <p className="text-gray-800/70 mt-4 text-lg leading-relaxed">
                  Transform ordinary photos into extraordinary professional shots with cutting-edge AI technology. 
                  Trusted by thousands of creators, businesses, and photographers worldwide.
                </p>
              </div>

              {/* Newsletter Signup */}
              <div className="mb-8">
                <h4 className="text-gray-800 font-semibold mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-purple-400" />
                  Stay Updated
                </h4>
                {!isSubscribed ? (
                  <form onSubmit={handleNewsletterSubmit} className="flex gap-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="flex-1 px-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-gray-800 placeholder-white/50 focus:outline-none focus:border-purple-400/50 focus:bg-white/10 transition-all duration-300"
                      required
                    />
                    <Button 
                      type="submit"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-gray-800 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </form>
                ) : (
                  <div className="flex items-center gap-2 py-3 px-4 bg-green-500/20 border border-green-400/30 rounded-xl">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <ArrowRight className="w-2 h-2 text-gray-800 transform rotate-45" />
                    </div>
                    <span className="text-green-300 text-sm font-medium">Successfully subscribed!</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div>
                <h4 className="text-gray-800 font-semibold mb-4">Follow Us</h4>
                <div className="flex gap-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      className={`w-10 h-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-center text-gray-800/70 transition-all duration-300 hover:bg-white/10 hover:scale-110 ${social.color}`}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Links */}
            <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-8">
              {footerSections.map((section) => (
                <div key={section.title}>
                  <h4 className="text-gray-800 font-semibold mb-6">{section.title}</h4>
                  <ul className="space-y-4">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <a
                          href={link.href}
                          className="text-gray-800/60 hover:text-gray-800 transition-colors duration-300 text-sm hover:underline underline-offset-4"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="text-gray-800/50 text-sm">
              <p className="flex items-center gap-2">
                © 2025 ProfessionalLifeStyleShoot. Made with 
                <Heart className="w-4 h-4 text-red-400 fill-current animate-pulse" />
                using AI technology.
              </p>
            </div>

            {/* Additional Links */}
            <div className="flex items-center gap-6 text-sm text-gray-800/50">
              <a href="#" className="hover:text-gray-800 transition-colors duration-300">
                Status
              </a>
              <span className="w-px h-4 bg-white/20" />
              <a href="#" className="hover:text-gray-800 transition-colors duration-300">
                Help Center
              </a>
              <span className="w-px h-4 bg-white/20" />
              <a href="#" className="hover:text-gray-800 transition-colors duration-300">
                Sitemap
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-gray-800/70 text-xs font-medium">All Systems Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
    </footer>
  )
}