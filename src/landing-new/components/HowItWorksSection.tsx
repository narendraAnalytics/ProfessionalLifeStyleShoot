'use client'

import { useState, useEffect, useRef } from 'react'
import { Upload, Palette, Sparkles, Download, Camera, Zap, Image as ImageIcon, Star } from 'lucide-react'
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function HowItWorksSection() {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([])
  const sectionRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const steps = [
    {
      id: 1,
      icon: Upload,
      title: "Upload & Enhance",
      description: "Upload any photo and watch our AI instantly enhance quality, lighting, and composition for professional results.",
      features: ["Auto quality enhancement", "Smart lighting correction", "Background optimization"],
      gradient: "from-cyan-500 via-emerald-500 to-lime-500",
      lightGradient: "from-cyan-400 via-emerald-400 to-lime-400",
      bgGradient: "from-cyan-500/20 via-emerald-500/20 to-lime-500/20",
      delay: 0
    },
    {
      id: 2,
      icon: Palette,
      title: "Choose Your Style",
      description: "Select from premium lifestyle themes or describe your vision. Our AI understands and creates your perfect aesthetic.",
      features: ["Professional themes", "Custom style prompts", "Brand consistency"],
      gradient: "from-purple-600 via-pink-600 to-rose-600",
      lightGradient: "from-purple-500 via-pink-500 to-rose-500",
      bgGradient: "from-purple-600/20 via-pink-600/20 to-rose-600/20",
      delay: 200
    },
    {
      id: 3,
      icon: Sparkles,
      title: "AI Magic Happens",
      description: "Advanced algorithms transform your image with professional lighting, backgrounds, and artistic effects in seconds.",
      features: ["Real-time processing", "Professional effects", "Quality optimization"],
      gradient: "from-orange-500 via-amber-500 to-yellow-500",
      lightGradient: "from-orange-400 via-amber-400 to-yellow-400",
      bgGradient: "from-orange-500/20 via-amber-500/20 to-yellow-500/20",
      delay: 400
    },
    {
      id: 4,
      icon: Download,
      title: "Download Results",
      description: "Get your stunning professional photoshoot in ultra-high definition, ready for any platform or print use.",
      features: ["4K resolution", "Multiple formats", "Instant download"],
      gradient: "from-emerald-600 via-teal-600 to-cyan-600",
      lightGradient: "from-emerald-500 via-teal-500 to-cyan-500",
      bgGradient: "from-emerald-600/20 via-teal-600/20 to-cyan-600/20",
      delay: 600
    }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepIndex = parseInt(entry.target.getAttribute('data-step') || '0')
            setVisibleSteps(prev => [...new Set([...prev, stepIndex])])
          }
        })
      },
      { threshold: 0.2, rootMargin: '50px' }
    )

    const stepElements = sectionRef.current?.querySelectorAll('[data-step]')
    stepElements?.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section id="features" className="relative py-16 lg:py-24 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-orange-500/5 to-yellow-500/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div ref={sectionRef} className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
            <Zap className="w-5 h-5 text-cyan-400" />
            <span className="text-white/90 font-medium">How It Works</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="text-white drop-shadow-2xl">Transform Your Vision in</span>
            <span className="block bg-gradient-to-r from-cyan-400 via-emerald-400 to-lime-400 bg-clip-text text-transparent drop-shadow-lg">
              4 Simple Steps
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
            From ordinary photo to professional lifestyle shoot in under 60 seconds. 
            No photography experience needed.
          </p>
        </div>

        {/* Steps Container */}
        <div className="space-y-12 lg:space-y-20">
          {steps.map((step, index) => (
            <div
              key={step.id}
              data-step={index}
              className={`relative transition-all duration-1000 transform ${
                visibleSteps.includes(index)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${step.delay}ms` }}
            >
              {/* Desktop Layout */}
              <div className={`hidden lg:grid lg:grid-cols-12 gap-8 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}>
                {/* Content Side */}
                <div className={`lg:col-span-6 ${index % 2 === 1 ? 'lg:col-start-7' : ''}`}>
                  <div className="relative">
                    {/* Floating Step Number */}
                    <div className={`absolute ${index % 2 === 0 ? '-left-6' : '-right-6'} -top-6 z-20`}>
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${step.gradient} flex items-center justify-center text-white font-bold text-xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300`}>
                        {step.id}
                      </div>
                    </div>

                    {/* Content Card */}
                    <div className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 shadow-2xl">
                      {/* Icon */}
                      <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${step.bgGradient} backdrop-blur-sm mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <step.icon className={`w-8 h-8 text-transparent bg-gradient-to-r ${step.lightGradient} bg-clip-text`} />
                      </div>
                      
                      <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 drop-shadow-lg">
                        {step.title}
                      </h3>
                      
                      <p className="text-white/80 text-lg mb-6 leading-relaxed drop-shadow-md">
                        {step.description}
                      </p>

                      {/* Features List */}
                      <div className="space-y-3">
                        {step.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${step.lightGradient} shadow-lg`} />
                            <span className="text-white/70 text-sm font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Hover Glow Effect */}
                      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${step.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 -z-10 blur-xl`} />
                    </div>
                  </div>
                </div>

                {/* Visual Side */}
                <div className={`lg:col-span-6 ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                  <div className="relative flex justify-center">
                    {/* Main Icon Circle */}
                    <div className="relative">
                      {/* Animated Ring */}
                      <div className={`absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-r ${step.gradient} animate-spin opacity-20`} style={{ animationDuration: '10s' }} />
                      
                      {/* Icon Container */}
                      <div className={`relative w-32 h-32 rounded-full bg-gradient-to-r ${step.gradient} flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300`}>
                        <step.icon className="w-16 h-16 text-white drop-shadow-lg" />
                      </div>

                      {/* Floating Particles */}
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className={`absolute w-3 h-3 rounded-full bg-gradient-to-r ${step.lightGradient} animate-ping`}
                            style={{
                              left: `${15 + i * 25}%`,
                              top: `${20 + (i % 2) * 40}%`,
                              animationDelay: `${i * 0.8}s`,
                              animationDuration: '2s'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="lg:hidden relative">
                <div className="flex gap-6">
                  {/* Step Number */}
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${step.gradient} flex items-center justify-center text-white font-bold text-xl shadow-2xl transform rotate-3`}>
                      {step.id}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${step.bgGradient} mb-4`}>
                        <step.icon className={`w-6 h-6 text-transparent bg-gradient-to-r ${step.lightGradient} bg-clip-text`} />
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-3 drop-shadow-lg">
                        {step.title}
                      </h3>
                      
                      <p className="text-white/80 mb-4 leading-relaxed drop-shadow-md">
                        {step.description}
                      </p>

                      {/* Features */}
                      <div className="space-y-2">
                        {step.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Star className={`w-4 h-4 text-transparent bg-gradient-to-r ${step.lightGradient} bg-clip-text`} />
                            <span className="text-white/70 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Connection Line */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center mt-8 mb-4">
                    <div className="w-px h-12 bg-gradient-to-b from-white/30 to-white/10" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="relative group max-w-2xl mx-auto">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-500">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Camera className="w-8 h-8 text-cyan-400" />
                <h3 className="text-2xl lg:text-3xl font-bold text-white drop-shadow-lg">
                  Ready to Create Magic?
                </h3>
              </div>
              
              <p className="text-white/80 text-lg mb-8 leading-relaxed drop-shadow-md">
                Join thousands of creators transforming their photos with professional AI technology
              </p>
              
              {/* CTA Button - Conditional based on auth */}
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="group relative px-10 py-5 bg-gradient-to-r from-cyan-500 via-emerald-500 to-lime-500 hover:from-cyan-400 hover:via-emerald-400 hover:to-lime-400 rounded-2xl text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-2xl hover:shadow-cyan-500/25 active:scale-95 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-emerald-400 to-lime-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>
                    
                    <div className="relative flex items-center justify-center space-x-3">
                      <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                      <span className="group-hover:tracking-wide transition-all duration-300">Start Creating Now</span>
                    </div>
                    
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  </button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="group relative px-10 py-5 bg-gradient-to-r from-cyan-500 via-emerald-500 to-lime-500 hover:from-cyan-400 hover:via-emerald-400 hover:to-lime-400 rounded-2xl text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-2xl hover:shadow-cyan-500/25 active:scale-95 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-emerald-400 to-lime-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>
                  
                  <div className="relative flex items-center justify-center space-x-3">
                    <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="group-hover:tracking-wide transition-all duration-300">Start Creating Now</span>
                  </div>
                  
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </button>
              </SignedIn>
            </div>

            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-emerald-500/20 to-lime-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-40" />
          <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-emerald-400 rounded-full animate-pulse opacity-40" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-purple-400 rounded-full animate-bounce opacity-40" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-pink-400 rounded-full animate-ping opacity-40" style={{ animationDelay: '3s' }} />
        </div>
      </div>
    </section>
  )
}