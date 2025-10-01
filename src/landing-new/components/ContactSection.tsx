'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Shield, Linkedin } from 'lucide-react'
import { toast } from 'sonner'
import emailjs from '@emailjs/browser'
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'

interface ContactInfo {
  icon: React.ElementType
  title: string
  detail: string
  description: string
  gradient: string
}

interface FormData {
  name: string
  email: string
  company: string
  message: string
}

export default function ContactSection() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // EmailJS configuration
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      
      // Template parameters that match your EmailJS template
      const templateParams = {
        name: formData.name,
        email: formData.email,
        your_company: formData.company,
        message: formData.message,
        time: new Date().toLocaleString('en-IN', { 
          timeZone: 'Asia/Kolkata',
          dateStyle: 'full',
          timeStyle: 'medium'
        })
      }
      
      // Send email using EmailJS
      await emailjs.send(serviceId, templateId, templateParams, publicKey)
      
      // Enhanced success notification with personalization
      toast.success(
        `Thank you, ${formData.name}! 🎉 Your message has been sent successfully. We'll respond within 24 hours. For urgent matters, call us at +91 9135568511.`,
        {
          duration: 6000,
          style: {
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
          }
        }
      )
      
      // Reset form only on successful submission
      setFormData({ name: '', email: '', company: '', message: '' })
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('EmailJS error:', error)
      
      // Enhanced error handling with specific messages
      let errorMessage = ''
      
      if (error?.status === 400) {
        errorMessage = '❌ Please check your information and try again. Some fields may be invalid.'
      } else if (error?.status === 429) {
        errorMessage = '⏳ Too many requests. Please wait a moment and try again.'
      } else if (error?.text?.includes('network') || error?.name === 'NetworkError') {
        errorMessage = '🌐 Network error. Please check your connection and try again.'
      } else if (error?.status === 401 || error?.status === 403) {
        errorMessage = '🔐 Service temporarily unavailable. Please email us directly at narendra.insights@gmail.com'
      } else {
        errorMessage = '⚠️ Message failed to send. Please try again or email us directly at narendra.insights@gmail.com'
      }
      
      toast.error(errorMessage, {
        duration: 8000,
        style: {
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: '500',
        }
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const contactInfo: ContactInfo[] = [
    {
      icon: Mail,
      title: 'Email Us',
      detail: 'narendra.insights@gmail.com',
      description: 'Drop us a line anytime',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Phone,
      title: 'Call Us',
      detail: '+91 9135568511',
      description: 'Mon-Fri 9AM-6PM IST',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      icon: MapPin,
      title: 'Visit Studio',
      detail: 'Amaravati',
      description: 'By appointment only',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Linkedin,
      title: 'LinkedIn',
      detail: 'Connect with us',
      description: 'Professional network',
      gradient: 'from-blue-500 to-indigo-600'
    }
  ]

  return (
    <section id="contact" className="relative py-16 lg:py-24 overflow-hidden bg-gradient-to-br from-sky-50 via-white to-purple-50">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-r from-blue-200/30 to-cyan-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-200/20 to-teal-200/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/60 backdrop-blur-md border border-gray-200/50 mb-6 shadow-sm">
            <MessageCircle className="w-5 h-5 text-blue-500" />
            <span className="text-gray-700 font-medium">Get In Touch</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="text-gray-900 drop-shadow-sm">Let&apos;s Create </span>
            <span className="block bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
              Together
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Ready to bring your products to life? Get in touch with us to discuss 
            your project and receive a custom quote.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Send className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Send us a message
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/50 rounded-xl border border-gray-200/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/50 rounded-xl border border-gray-200/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="company" className="block text-gray-700 font-medium mb-2">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/50 rounded-xl border border-gray-200/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/50 rounded-xl border border-gray-200/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>

              {/* Authentication-protected submit button */}
              <SignedOut>
                <SignInButton 
                  mode="modal"
                  forceRedirectUrl="/"
                  signUpForceRedirectUrl="/"
                >
                  <button
                    type="button"
                    className="group relative w-full px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-400 hover:via-purple-400 hover:to-pink-400 rounded-2xl text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-2xl hover:shadow-blue-500/25 active:scale-95 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>
                    
                    <div className="relative flex items-center justify-center space-x-3">
                      <Send className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                      <span className="group-hover:tracking-wide transition-all duration-300">
                        Send Message (Login Required)
                      </span>
                    </div>
                    
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                  </button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-400 hover:via-purple-400 hover:to-pink-400 rounded-2xl text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-2xl hover:shadow-blue-500/25 active:scale-95 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>
                  
                  <div className="relative flex items-center justify-center space-x-3">
                    <Send className={`w-5 h-5 transition-transform duration-300 ${isSubmitting ? 'animate-pulse' : 'group-hover:rotate-12'}`} />
                    <span className="group-hover:tracking-wide transition-all duration-300">
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </span>
                  </div>
                  
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                </button>
              </SignedIn>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <div 
                key={index}
                className={`group ${info.title === 'LinkedIn' ? 'bg-white/80 hover:bg-gradient-to-r hover:from-blue-200/60 hover:to-indigo-300/60 cursor-pointer' : 'bg-white/80'} backdrop-blur-sm border border-gray-200/50 rounded-3xl p-6 shadow-lg hover:shadow-xl hover:border-gray-300/60 transition-all duration-300 hover:scale-105`}
                onClick={info.title === 'LinkedIn' ? () => window.open('https://www.linkedin.com/in/nk-analytics', '_blank') : undefined}
                title={info.title === 'LinkedIn' ? 'Click here' : undefined}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 bg-gradient-to-r ${info.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <info.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      {info.title}
                    </h4>
                    <p className="text-lg font-semibold text-gray-700 mb-1">
                      {info.detail}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {info.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Guarantee Card */}
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-2xl font-bold">
                  Quick Response Guarantee
                </h4>
              </div>
              <p className="text-white/90 leading-relaxed">
                We respond to all inquiries within 4 hours during business days. 
                For urgent projects, call us directly for immediate assistance.
              </p>
              
              <div className="flex items-center gap-2 mt-4 text-white/80">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">100% Satisfaction Guaranteed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-500 rounded-full animate-ping opacity-60" />
          <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-purple-500 rounded-full animate-pulse opacity-60" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-pink-500 rounded-full animate-bounce opacity-60" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-cyan-500 rounded-full animate-ping opacity-60" style={{ animationDelay: '3s' }} />
        </div>
      </div>
    </section>
  )
}