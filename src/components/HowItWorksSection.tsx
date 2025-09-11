'use client'

import { useState, useEffect, useRef } from 'react'
import { Upload, Palette, Sparkles, Download, Check, ArrowRight } from 'lucide-react'
import { Badge } from './ui/badge'

export default function HowItWorksSection() {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([])
  const sectionRef = useRef<HTMLDivElement>(null)

  const steps = [
    {
      id: 1,
      icon: Upload,
      title: "Upload Your Photo",
      description: "Simply upload any photo - portrait, product, or scene. Our AI works with any image quality.",
      details: ["Support for JPG, PNG, HEIC", "Automatic quality enhancement", "Privacy protected"],
      color: "from-blue-400 to-cyan-400",
      bgColor: "from-blue-500/20 to-cyan-500/20",
      delay: 0
    },
    {
      id: 2,
      icon: Palette,
      title: "Choose Your Style",
      description: "Select from 100+ professional photography styles or describe your vision with AI prompts.",
      details: ["Business & Corporate", "Fashion & Lifestyle", "Product Photography"],
      color: "from-purple-400 to-pink-400",
      bgColor: "from-purple-500/20 to-pink-500/20",
      delay: 200
    },
    {
      id: 3,
      icon: Sparkles,
      title: "AI Magic Happens",
      description: "Our advanced AI transforms your image with professional lighting, backgrounds, and effects.",
      details: ["Advanced AI processing", "Professional enhancement", "Quality optimization"],
      color: "from-yellow-400 to-orange-400",
      bgColor: "from-yellow-500/20 to-orange-500/20",
      delay: 400
    },
    {
      id: 4,
      icon: Download,
      title: "Download HD Results",
      description: "Get your professional photoshoot in high definition, ready for any use case.",
      details: ["4K resolution available", "Multiple format options", "Instant download"],
      color: "from-green-400 to-emerald-400",
      bgColor: "from-green-500/20 to-emerald-500/20",
      delay: 600
    }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepIndex = parseInt(entry.target.getAttribute('data-step') || '0')
            setVisibleSteps(prev => [...prev, stepIndex].filter((v, i, a) => a.indexOf(v) === i))
          }
        })
      },
      { threshold: 0.3 }
    )

    const stepElements = sectionRef.current?.querySelectorAll('[data-step]')
    stepElements?.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section id="how-it-works" className="relative py-10 lg:py-16 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div ref={sectionRef} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <Badge className="mb-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 border-purple-400/30">
            How It Works
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Transform in 4 Simple Steps
            </span>
          </h2>
          <p className="text-xl text-gray-800/70 max-w-3xl mx-auto">
            From upload to professional photoshoot in under 60 seconds. No photography experience needed.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Central Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-transparent via-purple-500/50 to-transparent hidden lg:block" />
          
          {/* Mobile Timeline Line */}
          <div className="absolute left-8 top-0 h-full w-0.5 bg-gradient-to-b from-transparent via-purple-500/50 to-transparent lg:hidden" />

          {/* Steps */}
          <div className="space-y-16 lg:space-y-32">
            {steps.map((step, index) => (
              <div
                key={step.id}
                data-step={index}
                className={`relative transition-all duration-1000 transform ${
                  visibleSteps.includes(index)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${step.delay}ms` }}
              >
                {/* Desktop Layout */}
                <div className={`hidden lg:grid lg:grid-cols-2 gap-16 items-center ${
                  index % 2 === 0 ? '' : 'lg:grid-cols-2'
                }`}>
                  {/* Content Side */}
                  <div className={`${index % 2 === 0 ? 'lg:text-right' : 'lg:order-2'}`}>
                    <div className="relative">
                      {/* Step Number */}
                      <div className={`absolute ${index % 2 === 0 ? '-right-8' : '-left-8'} top-4 z-10`}>
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-gray-800 font-bold text-xl shadow-2xl`}>
                          {step.id}
                        </div>
                      </div>

                      {/* Glassmorphic Content Card */}
                      <div className={`bg-white/80 backdrop-blur-md border border-gray-300 rounded-3xl p-8 hover:bg-white/90 transition-all duration-300 hover:scale-105 shadow-2xl ${index % 2 === 0 ? 'mr-8' : 'ml-8'}`}>
                        <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${step.bgColor} mb-6`}>
                          <step.icon className={`w-8 h-8 text-transparent bg-gradient-to-r ${step.color} bg-clip-text`} />
                        </div>
                        
                        <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
                          {step.title}
                        </h3>
                        
                        <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                          {step.description}
                        </p>

                        {/* Feature List */}
                        <div className="space-y-3">
                          {step.details.map((detail, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${step.color}`} />
                              <span className="text-gray-600 text-sm">{detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Visual Side */}
                  <div className={`${index % 2 === 0 ? 'lg:order-2' : ''}`}>
                    <div className="relative">
                      {/* Central Circle */}
                      <div className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-r ${step.color} animate-pulse opacity-20`} />
                      
                      {/* Icon Container */}
                      <div className="relative flex justify-center">
                        <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300`}>
                          <step.icon className="w-12 h-12 text-gray-800" />
                        </div>
                      </div>

                      {/* Floating Animation Elements */}
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className={`absolute w-3 h-3 rounded-full bg-gradient-to-r ${step.color} animate-ping opacity-40`}
                            style={{
                              left: `${20 + i * 30}%`,
                              top: `${30 + i * 20}%`,
                              animationDelay: `${i * 0.5}s`
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="lg:hidden relative">
                  {/* Step Number Circle */}
                  <div className="absolute left-0 flex items-center justify-center">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-gray-800 font-bold text-xl shadow-2xl z-10`}>
                      {step.id}
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className="ml-24 bg-white/80 backdrop-blur-md border border-gray-300 rounded-3xl p-6 hover:bg-white/90 transition-all duration-300">
                    <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${step.bgColor} mb-4`}>
                      <step.icon className={`w-6 h-6 text-transparent bg-gradient-to-r ${step.color} bg-clip-text`} />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      {step.title}
                    </h3>
                    
                    <p className="text-gray-700 mb-4">
                      {step.description}
                    </p>

                    {/* Feature List */}
                    <div className="space-y-2">
                      {step.details.map((detail, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Check className={`w-4 h-4 text-transparent bg-gradient-to-r ${step.color} bg-clip-text`} />
                          <span className="text-gray-600 text-sm">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Arrow for mobile (except last item) */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-7 -bottom-8 flex justify-center">
                      <ArrowRight className="w-6 h-6 text-purple-400 transform rotate-90 animate-bounce" />
                    </div>
                  )}
                </div>

                {/* Timeline Dot for Desktop */}
                <div className="hidden lg:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${step.color} border-4 border-black shadow-xl z-20 animate-pulse`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="bg-white/80 backdrop-blur-md border border-gray-300 rounded-3xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Ready to see the magic in action?
            </h3>
            <p className="text-gray-700 mb-6">
              Join thousands of creators who are already transforming their photos with AI
            </p>
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300">
              Try It Free Now
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}