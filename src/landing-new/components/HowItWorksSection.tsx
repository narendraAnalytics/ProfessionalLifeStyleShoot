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
    <>
      {/* Custom Animations */}
      <style jsx>{`
        @keyframes slideInUp {
          0% {
            opacity: 0;
            transform: translateY(60px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes floating {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(6, 182, 212, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(6, 182, 212, 0.6);
          }
        }
      `}</style>
      
      <section id="features" className="relative py-16 lg:py-24 overflow-hidden bg-gradient-to-br from-sky-50 via-white to-purple-50">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-r from-cyan-200/30 to-emerald-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-orange-200/20 to-yellow-200/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div ref={sectionRef} className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/60 backdrop-blur-md border border-gray-200/50 mb-6 shadow-sm">
            <Zap className="w-5 h-5 text-cyan-500" />
            <span className="text-gray-700 font-medium">How It Works</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="text-gray-900 drop-shadow-sm">Transform Your Vision in</span>
            <span className="block bg-gradient-to-r from-cyan-500 via-emerald-500 to-lime-500 bg-clip-text text-transparent drop-shadow-sm">
              4 Simple Steps
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
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
              className={`relative transition-all duration-1200 transform ${
                visibleSteps.includes(index)
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-16 scale-95'
              }`}
              style={{ 
                transitionDelay: `${step.delay + index * 150}ms`,
                animation: visibleSteps.includes(index) 
                  ? `slideInUp 1s ease-out ${step.delay + index * 150}ms both, floating 6s ease-in-out ${step.delay + index * 150 + 1000}ms infinite` 
                  : 'none'
              }}
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
                    <div className="group relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-8 hover:bg-white/90 hover:border-gray-300/60 transition-all duration-700 hover:scale-110 hover:-translate-y-2 shadow-lg hover:shadow-xl hover:shadow-cyan-500/20 cursor-pointer overflow-hidden">
                      {/* Animated Background Shimmer */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500"></div>
                      </div>
                      
                      {/* Icon */}
                      <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${step.bgGradient} backdrop-blur-sm mb-6 group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 relative overflow-hidden`}>
                        {/* Icon shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <step.icon className={`w-8 h-8 text-transparent bg-gradient-to-r ${step.lightGradient} bg-clip-text group-hover:scale-110 transition-transform duration-300 relative z-10`} />
                      </div>
                      
                      <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                        {step.title}
                      </h3>
                      
                      <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                        {step.description}
                      </p>

                      {/* Features List */}
                      <div className="space-y-3">
                        {step.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${step.lightGradient} shadow-lg`} />
                            <span className="text-gray-500 text-sm font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Hover Glow Effect - Enhanced */}
                      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${step.gradient} opacity-0 group-hover:opacity-20 transition-all duration-700 -z-10 blur-xl group-hover:blur-2xl group-hover:scale-110`} />
                      
                      {/* Floating Border Animation */}
                      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                        <div className={`absolute inset-0 rounded-3xl border-2 border-gradient-to-r ${step.gradient} opacity-40 animate-pulse`}></div>
                      </div>
                      
                      {/* Floating Particles on Hover */}
                      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className={`absolute w-1 h-1 rounded-full bg-gradient-to-r ${step.lightGradient} animate-bounce`}
                            style={{
                              left: `${15 + i * 15}%`,
                              top: `${20 + (i % 3) * 20}%`,
                              animationDelay: `${i * 0.2}s`,
                              animationDuration: '1.5s'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visual Side */}
                <div className={`lg:col-span-6 ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                  <div className="relative flex justify-center group">
                    {/* Main Icon Circle */}
                    <div className="relative">
                      {/* Outer Pulsing Ring */}
                      <div className={`absolute inset-0 w-40 h-40 rounded-full bg-gradient-to-r ${step.gradient} animate-pulse opacity-10 group-hover:opacity-30 transition-opacity duration-500`} style={{ left: '-16px', top: '-16px' }} />
                      
                      {/* Animated Rotating Ring */}
                      <div className={`absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-r ${step.gradient} animate-spin opacity-20 group-hover:opacity-40 transition-opacity duration-500`} style={{ animationDuration: '8s' }} />
                      
                      {/* Counter-rotating Ring */}
                      <div className={`absolute inset-0 w-36 h-36 rounded-full bg-gradient-to-l ${step.gradient} animate-spin opacity-10 group-hover:opacity-25 transition-opacity duration-500`} style={{ animationDuration: '12s', animationDirection: 'reverse', left: '-8px', top: '-8px' }} />
                      
                      {/* Icon Container */}
                      <div className={`relative w-32 h-32 rounded-full bg-gradient-to-r ${step.gradient} flex items-center justify-center shadow-2xl hover:scale-125 hover:rotate-12 transition-all duration-500 group-hover:shadow-4xl`}>
                        <step.icon className="w-16 h-16 text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-300" />
                        
                        {/* Icon Glow */}
                        <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${step.gradient} opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-md`} />
                      </div>

                      {/* Enhanced Floating Particles */}
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(8)].map((_, i) => (
                          <div
                            key={i}
                            className={`absolute w-2 h-2 rounded-full bg-gradient-to-r ${step.lightGradient} animate-ping group-hover:animate-bounce`}
                            style={{
                              left: `${10 + i * 15}%`,
                              top: `${15 + (i % 3) * 25}%`,
                              animationDelay: `${i * 0.3}s`,
                              animationDuration: `${1.5 + (i % 3) * 0.5}s`
                            }}
                          />
                        ))}
                      </div>
                      
                      {/* Orbit Particles */}
                      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={`orbit-${i}`}
                            className={`absolute w-3 h-3 rounded-full bg-gradient-to-r ${step.lightGradient} animate-spin`}
                            style={{
                              left: '50%',
                              top: '50%',
                              transformOrigin: `${40 + i * 10}px center`,
                              animationDuration: `${3 + i}s`,
                              animationDelay: `${i * 0.5}s`
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
                    <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-6 hover:bg-white/90 hover:border-gray-300/60 transition-all duration-300 shadow-md hover:shadow-lg">
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${step.bgGradient} mb-4`}>
                        <step.icon className={`w-6 h-6 text-transparent bg-gradient-to-r ${step.lightGradient} bg-clip-text`} />
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {step.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {step.description}
                      </p>

                      {/* Features */}
                      <div className="space-y-2">
                        {step.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Star className={`w-4 h-4 text-transparent bg-gradient-to-r ${step.lightGradient} bg-clip-text`} />
                            <span className="text-gray-500 text-sm">{feature}</span>
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
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-8 group-hover:bg-white/90 group-hover:border-gray-300/60 transition-all duration-500 shadow-lg hover:shadow-xl">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Camera className="w-8 h-8 text-cyan-500" />
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  Ready to Create Magic?
                </h3>
              </div>
              
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
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
                    
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
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
                  
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                </button>
              </SignedIn>
            </div>

            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-200/40 via-emerald-200/40 to-lime-200/40 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-500 rounded-full animate-ping opacity-60" />
          <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-emerald-500 rounded-full animate-pulse opacity-60" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-purple-500 rounded-full animate-bounce opacity-60" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-pink-500 rounded-full animate-ping opacity-60" style={{ animationDelay: '3s' }} />
        </div>
      </div>
    </section>
    </>
  )
}