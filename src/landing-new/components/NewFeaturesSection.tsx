'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Cpu, Palette, Download, ArrowRight, Check } from 'lucide-react'

const features = [
  {
    id: 1,
    icon: Sparkles,
    title: "Describe Your Vision",
    description: "Simply describe your photoshoot idea in natural language. Our AI understands your creative vision.",
    gradient: "from-cyan-500 to-blue-600",
    glowColor: "cyan-500/25",
    delay: 0
  },
  {
    id: 2,
    icon: Cpu,
    title: "AI Creates Magic", 
    description: "Our advanced AI generates professional photoshoots with stunning detail and composition.",
    gradient: "from-emerald-500 to-teal-600",
    glowColor: "emerald-500/25",
    delay: 200
  },
  {
    id: 3,
    icon: Palette,
    title: "Smart Enhancement",
    description: "Automatic optimization, style adjustments, and professional post-processing applied.",
    gradient: "from-purple-500 to-pink-600",
    glowColor: "purple-500/25",
    delay: 400
  },
  {
    id: 4,
    icon: Download,
    title: "Ready to Use",
    description: "High-quality images delivered instantly, ready for your brand and marketing needs.",
    gradient: "from-orange-500 to-red-600",
    glowColor: "orange-500/25",
    delay: 600
  }
]

export default function NewFeaturesSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [visibleCards, setVisibleCards] = useState<number[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            // Animate cards in sequence
            features.forEach((feature, index) => {
              setTimeout(() => {
                setVisibleCards(prev => [...prev, feature.id])
              }, feature.delay)
            })
          }
        })
      },
      { threshold: 0.2 }
    )

    const section = document.getElementById('features')
    if (section) observer.observe(section)

    return () => observer.disconnect()
  }, [])

  return (
    <section id="features" className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden w-full max-w-full">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-[5%] w-48 h-48 lg:w-64 lg:h-64 bg-cyan-400/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-[5%] w-56 h-56 lg:w-72 lg:h-72 bg-emerald-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 lg:w-80 lg:h-80 bg-purple-400/3 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-30"></div>
        <div className="absolute top-3/4 right-1/6 w-3 h-3 bg-emerald-400 rounded-full animate-pulse opacity-40 animation-delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-purple-400 rounded-full animate-bounce opacity-30 animation-delay-2000"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-pink-400 rounded-full animate-ping opacity-40 animation-delay-3000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 overflow-hidden">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-full blur-xl opacity-60 animate-pulse" />
              <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl">
                <Sparkles className="w-8 h-8 bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent animate-bounce" />
              </div>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-600 via-emerald-600 to-purple-600 bg-clip-text text-transparent">
              How It Works
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Transform your creative vision into professional reality with our AI-powered process
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 xl:gap-10 max-w-4xl lg:max-w-5xl mx-auto overflow-hidden px-2 sm:px-0">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            const isCardVisible = visibleCards.includes(feature.id)
            
            return (
              <div
                key={feature.id}
                className={`group relative transition-all duration-700 hover:z-10 ${
                  isCardVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${feature.delay}ms` }}
              >
                {/* Card Container */}
                <div className="relative h-full">
                  {/* Background with glass morphism */}
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-lg transition-all duration-500 group-hover:bg-white/90 group-hover:border-gray-300 group-hover:shadow-2xl group-hover:-translate-y-2" />
                  
                  {/* Gradient glow on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl`} />
                  
                  {/* Content */}
                  <div className="relative p-6 sm:p-8 lg:p-10 xl:p-12 h-full flex flex-col min-h-[380px] sm:min-h-[400px]">
                    {/* Step Number */}
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {feature.id}
                      </div>
                      
                      {/* Process Arrow (except for last card) */}
                      {index < features.length - 1 && (
                        <div className="hidden lg:block">
                          <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      )}
                      
                      {/* Success check for last card */}
                      {index === features.length - 1 && (
                        <div className="hidden lg:block">
                          <Check className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                      )}
                    </div>

                    {/* Icon */}
                    <div className="mb-6">
                      <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg group-hover:shadow-${feature.glowColor}`}>
                        <IconComponent className="w-8 h-8 text-white" />
                        
                        {/* Icon glow effect */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />
                      </div>
                    </div>

                    {/* Text Content */}
                    <div className="flex-1">
                      <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 group-hover:text-gray-900 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      
                      <p className="text-gray-600 text-lg leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                        {feature.description}
                      </p>
                    </div>

                    {/* Animated bottom border */}
                    <div className={`absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r ${feature.gradient} rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-20 transition-all duration-1000 delay-800 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="relative inline-block">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg blur opacity-30 animate-pulse" />
            <div className="relative bg-white/80 backdrop-blur-sm px-8 py-3 rounded-lg border border-gray-200 shadow-lg">
              <p className="text-gray-700 text-lg">
                Ready to transform your vision? 
                <span className="ml-2 bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent font-semibold">
                  Start creating now!
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}