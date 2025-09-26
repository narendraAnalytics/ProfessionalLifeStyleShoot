'use client'

import { useState, useEffect, useRef } from 'react'
import { ExternalLink, Camera, Sparkles, Eye } from 'lucide-react'
import Image from 'next/image'

interface PortfolioItem {
  id: number
  image: string
  title: string
  category: string
  description: string
  gradient: string
  lightGradient: string
}

export default function PortfolioSection() {
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const sectionRef = useRef<HTMLDivElement>(null)

  const portfolioItems: PortfolioItem[] = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=600&fit=crop&crop=center',
      title: 'Luxury Sunglasses',
      category: 'Fashion',
      description: 'Beach lifestyle photography highlighting premium eyewear with natural lighting',
      gradient: 'from-purple-600 via-pink-600 to-rose-600',
      lightGradient: 'from-purple-500 via-pink-500 to-rose-500'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=600&fit=crop&crop=center',
      title: 'Diamond Jewelry',
      category: 'Jewelry',
      description: 'Elegant diamond rings and necklaces with sophisticated luxury presentation',
      gradient: 'from-orange-500 via-amber-500 to-yellow-500',
      lightGradient: 'from-orange-400 via-amber-400 to-yellow-400'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=500&h=600&fit=crop&crop=center',
      title: 'Premium Tech',
      category: 'Technology',
      description: 'Modern workspace showcasing cutting-edge gadgets with sleek design',
      gradient: 'from-cyan-500 via-emerald-500 to-lime-500',
      lightGradient: 'from-cyan-400 via-emerald-400 to-lime-400'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=600&fit=crop&crop=center',
      title: 'Luxury Timepiece',
      category: 'Luxury',
      description: 'Sophisticated styling for high-end watch collection with elegant presentation',
      gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
      lightGradient: 'from-emerald-500 via-teal-500 to-cyan-500'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=600&fit=crop&crop=center',
      title: 'Spa Collection',
      category: 'Beauty',
      description: 'Serene spa environment for wellness products with calming aesthetics',
      gradient: 'from-violet-600 via-purple-600 to-indigo-600',
      lightGradient: 'from-violet-500 via-purple-500 to-indigo-500'
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=600&fit=crop&crop=center',
      title: 'Designer Accessories',
      category: 'Fashion',
      description: 'Elegant presentation of luxury fashion items with sophisticated lighting',
      gradient: 'from-pink-600 via-rose-600 to-red-600',
      lightGradient: 'from-pink-500 via-rose-500 to-red-500'
    }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const itemIndex = parseInt(entry.target.getAttribute('data-item') || '0')
            setVisibleItems(prev => [...new Set([...prev, itemIndex])])
          }
        })
      },
      { threshold: 0.2, rootMargin: '50px' }
    )

    const itemElements = sectionRef.current?.querySelectorAll('[data-item]')
    itemElements?.forEach(el => observer.observe(el))

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
            transform: translateY(-8px);
          }
        }
      `}</style>

      <section id="portfolio" className="relative py-16 lg:py-24 overflow-hidden bg-gradient-to-br from-sky-50 via-white to-purple-50">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gradient-to-r from-cyan-200/30 to-emerald-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-orange-200/20 to-yellow-200/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }} />
        </div>

        <div ref={sectionRef} className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16 lg:mb-20">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/60 backdrop-blur-md border border-gray-200/50 mb-6 shadow-sm">
              <Camera className="w-5 h-5 text-purple-500" />
              <span className="text-gray-700 font-medium">Our Portfolio</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-gray-900 drop-shadow-sm">Stunning </span>
              <span className="block bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 bg-clip-text text-transparent drop-shadow-sm">
                Lifestyle Photography
              </span>
            </h2>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explore our latest work showcasing products in authentic lifestyle environments 
              that tell compelling brand stories.
            </p>
          </div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {portfolioItems.map((item, index) => (
              <div
                key={item.id}
                data-item={index}
                className={`group relative transition-all duration-1000 transform ${
                  visibleItems.includes(index)
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-16 scale-95'
                }`}
                style={{ 
                  transitionDelay: `${index * 150}ms`,
                  animation: visibleItems.includes(index) 
                    ? `slideInUp 0.8s ease-out ${index * 150}ms both, floating 6s ease-in-out ${index * 150 + 1000}ms infinite` 
                    : 'none'
                }}
              >
                <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl hover:border-gray-300/60 transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer">
                  {/* Image Container */}
                  <div className="relative h-80 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={`${item.title} - ${item.description}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    
                    {/* Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-90 transition-all duration-500 flex items-center justify-center`}>
                      <div className="text-center text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <Eye className="w-8 h-8 mx-auto mb-3 animate-pulse" />
                        <p className="font-semibold text-lg mb-1">View Project</p>
                        <div className="flex items-center justify-center gap-1">
                          <ExternalLink className="w-4 h-4" />
                          <span className="text-sm">See Details</span>
                        </div>
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${item.lightGradient} text-white shadow-lg backdrop-blur-sm`}>
                        {item.category}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10 transition-all duration-500 -z-10`} />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <div className="relative group max-w-2xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-8 group-hover:bg-white/90 group-hover:border-gray-300/60 transition-all duration-500 shadow-lg hover:shadow-xl">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Sparkles className="w-8 h-8 text-purple-500" />
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    Ready to Showcase Your Brand?
                  </h3>
                </div>
                
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  Let's create stunning lifestyle photography that tells your unique story
                </p>
                
                <button className="group relative px-10 py-5 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-400 hover:via-pink-400 hover:to-rose-400 rounded-2xl text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-2xl hover:shadow-purple-500/25 active:scale-95 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>
                  
                  <div className="relative flex items-center justify-center space-x-3">
                    <ExternalLink className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="group-hover:tracking-wide transition-all duration-300">View Full Portfolio</span>
                  </div>
                  
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                </button>
              </div>

              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-200/40 via-pink-200/40 to-rose-200/40 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-500 rounded-full animate-ping opacity-60" />
            <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-pink-500 rounded-full animate-pulse opacity-60" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-cyan-500 rounded-full animate-bounce opacity-60" style={{ animationDelay: '2s' }} />
            <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-emerald-500 rounded-full animate-ping opacity-60" style={{ animationDelay: '3s' }} />
          </div>
        </div>
      </section>
    </>
  )
}