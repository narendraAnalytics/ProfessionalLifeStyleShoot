'use client'

import { useState, useEffect, useRef } from 'react'
import { Brain, Palette, Mountain, Shirt, Sun, Users, Zap, Camera, Sparkles, Settings, Image, Wand2 } from 'lucide-react'
import { Badge } from './ui/badge'

export default function AIFeaturesSection() {
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  const features = [
    {
      id: 1,
      icon: Brain,
      title: "Smart Prompt Enhancement",
      description: "AI automatically improves your descriptions to create perfect photoshoot prompts",
      details: "Natural language processing transforms simple ideas into professional photography instructions",
      color: "from-purple-400 to-indigo-400",
      bgColor: "from-purple-500/20 to-indigo-500/20",
      size: "large", // Takes 2 columns on desktop
      delay: 0
    },
    {
      id: 2,
      icon: Palette,
      title: "100+ Style Presets",
      description: "Choose from curated professional photography styles",
      details: "Business, Fashion, Artistic, Vintage, Modern, and more",
      color: "from-pink-400 to-rose-400",
      bgColor: "from-pink-500/20 to-rose-500/20",
      size: "medium",
      delay: 100
    },
    {
      id: 3,
      icon: Mountain,
      title: "Background Replacement",
      description: "Replace any background with stunning locations and environments",
      details: "Studio, outdoor, abstract, or custom backgrounds",
      color: "from-green-400 to-emerald-400",
      bgColor: "from-green-500/20 to-emerald-500/20",
      size: "medium",
      delay: 200
    },
    {
      id: 4,
      icon: Shirt,
      title: "Outfit Customization",
      description: "Transform clothing and accessories with AI precision",
      details: "Professional attire, casual wear, formal outfits",
      color: "from-blue-400 to-cyan-400",
      bgColor: "from-blue-500/20 to-cyan-500/20",
      size: "small",
      delay: 300
    },
    {
      id: 5,
      icon: Sun,
      title: "Lighting Adjustment",
      description: "Perfect lighting conditions for every shot",
      details: "Golden hour, studio lighting, natural light",
      color: "from-yellow-400 to-orange-400",
      bgColor: "from-yellow-500/20 to-orange-500/20",
      size: "small",
      delay: 400
    },
    {
      id: 6,
      icon: Users,
      title: "Pose Suggestions",
      description: "AI-powered pose recommendations for perfect shots",
      details: "Professional, candid, artistic poses",
      color: "from-violet-400 to-purple-400",
      bgColor: "from-violet-500/20 to-purple-500/20",
      size: "medium",
      delay: 500
    },
    {
      id: 7,
      icon: Zap,
      title: "Instant Processing",
      description: "Lightning-fast AI processing in under 60 seconds",
      details: "Optimized algorithms for rapid results",
      color: "from-amber-400 to-yellow-400",
      bgColor: "from-amber-500/20 to-yellow-500/20",
      size: "small",
      delay: 600
    },
    {
      id: 8,
      icon: Settings,
      title: "Fine-Tune Controls",
      description: "Adjust every aspect of your generated photos",
      details: "Color, contrast, saturation, and style intensity",
      color: "from-gray-400 to-slate-400",
      bgColor: "from-gray-500/20 to-slate-500/20",
      size: "medium",
      delay: 700
    },
    {
      id: 9,
      icon: Image,
      title: "4K Quality Output",
      description: "Professional resolution for any use case",
      details: "High-definition results perfect for print and digital",
      color: "from-teal-400 to-cyan-400",
      bgColor: "from-teal-500/20 to-cyan-500/20",
      size: "medium",
      delay: 800
    }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = parseInt(entry.target.getAttribute('data-card') || '0')
            setVisibleCards(prev => [...prev, cardIndex].filter((v, i, a) => a.indexOf(v) === i))
          }
        })
      },
      { threshold: 0.2 }
    )

    const cardElements = sectionRef.current?.querySelectorAll('[data-card]')
    cardElements?.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const getGridClasses = (size: string, index: number) => {
    switch (size) {
      case 'large':
        return 'col-span-1 md:col-span-2 row-span-2'
      case 'medium':
        return 'col-span-1 row-span-1'
      case 'small':
        return 'col-span-1 row-span-1'
      default:
        return 'col-span-1 row-span-1'
    }
  }

  return (
    <section id="ai-features" className="relative py-10 lg:py-16 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-500" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1500" />
      </div>

      <div ref={sectionRef} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 border-blue-400/30">
            AI Features
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              Powered by Advanced AI
            </span>
          </h2>
          <p className="text-xl text-gray-800/70 max-w-3xl mx-auto">
            Experience the future of photography with cutting-edge artificial intelligence that transforms ordinary photos into extraordinary professional shots.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-fr">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              data-card={index}
              className={`
                ${getGridClasses(feature.size, index)}
                relative group cursor-pointer
                transition-all duration-700 transform
                ${visibleCards.includes(index)
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-8 scale-95'
                }
              `}
              style={{ transitionDelay: `${feature.delay}ms` }}
              onMouseEnter={() => setHoveredCard(feature.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Glassmorphic Card */}
              <div className={`
                relative h-full min-h-[200px] p-6 lg:p-8 rounded-3xl
                bg-white/80 backdrop-blur-md border border-gray-300
                hover:bg-white/90 hover:border-gray-400
                transition-all duration-500 hover:scale-105
                shadow-2xl hover:shadow-3xl
                ${feature.size === 'large' ? 'min-h-[300px] lg:min-h-[400px]' : ''}
                overflow-hidden
              `}>
                
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`} />
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col">
                  {/* Icon */}
                  <div className={`
                    inline-flex p-4 rounded-2xl mb-6
                    bg-gradient-to-r ${feature.bgColor}
                    transition-all duration-300 group-hover:scale-110
                    ${hoveredCard === feature.id ? 'animate-pulse' : ''}
                  `}>
                    <feature.icon className={`w-8 h-8 text-transparent bg-gradient-to-r ${feature.color} bg-clip-text`} />
                  </div>

                  {/* Title */}
                  <h3 className={`
                    text-xl lg:text-2xl font-bold text-gray-800 mb-4
                    ${feature.size === 'large' ? 'lg:text-3xl' : ''}
                  `}>
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-800/70 text-sm lg:text-base mb-4 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Details (shown on larger cards or hover) */}
                  {(feature.size === 'large' || hoveredCard === feature.id) && (
                    <div className={`
                      mt-auto pt-4
                      transition-all duration-300
                      ${hoveredCard === feature.id ? 'opacity-100 translate-y-0' : feature.size === 'large' ? 'opacity-100' : 'opacity-0 translate-y-2'}
                    `}>
                      <p className="text-gray-800/50 text-sm">
                        {feature.details}
                      </p>
                    </div>
                  )}

                  {/* Hover Effect Overlay */}
                  {hoveredCard === feature.id && (
                    <div className="absolute top-4 right-4">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${feature.color} animate-ping`} />
                    </div>
                  )}
                </div>

                {/* Floating Particles (for large cards) */}
                {feature.size === 'large' && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`absolute w-2 h-2 rounded-full bg-gradient-to-r ${feature.color} opacity-20 animate-pulse`}
                        style={{
                          left: `${20 + i * 15}%`,
                          top: `${20 + (i * 20) % 60}%`,
                          animationDelay: `${i * 0.5}s`
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* External Glow Effect */}
              <div className={`
                absolute inset-0 rounded-3xl blur-xl opacity-0 group-hover:opacity-30
                bg-gradient-to-r ${feature.color} -z-10
                transition-opacity duration-500
              `} />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}