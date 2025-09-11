'use client'

import { useState, useEffect, useRef } from 'react'
import { Star, Quote, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import { Badge } from './ui/badge'
import Image from 'next/image'

export default function TestimonialsSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [visibleSection, setVisibleSection] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Fashion Photographer",
      company: "Studio Lumina",
      image: "https://images.unsplash.com/photo-1494790108755-2616c25482c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      content: "This AI platform completely transformed how I approach product photography. What used to take hours of setup and post-processing now takes minutes. The quality is simply outstanding!",
      rating: 5,
      gradient: "from-purple-400 to-pink-400"
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      role: "E-commerce Manager",
      company: "TechStyle Co.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      content: "We've generated over 1,000 product photos using this platform. The consistency and professional quality have boosted our sales by 40%. It's a game-changer for online retail.",
      rating: 5,
      gradient: "from-blue-400 to-cyan-400"
    },
    {
      id: 3,
      name: "Emily Watson",
      role: "Marketing Director",
      company: "Luxe Brands",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      content: "The variety of styles and the ability to customize every aspect is incredible. Our jewelry campaigns look like they were shot by top-tier photographers. Absolutely worth every penny!",
      rating: 5,
      gradient: "from-yellow-400 to-orange-400"
    },
    {
      id: 4,
      name: "David Kim",
      role: "Creative Director",
      company: "Modern Agency",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      content: "As someone who's worked with traditional photography for 15 years, I was skeptical. But this AI produces results that rival professional studio work. It's the future of photography.",
      rating: 5,
      gradient: "from-green-400 to-emerald-400"
    },
    {
      id: 5,
      name: "Lisa Thompson",
      role: "Interior Designer",
      company: "Elegant Spaces",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      content: "The home photography styles are phenomenal. I can showcase furniture and decor in perfect lighting conditions that would cost thousands to create in real life. My clients are amazed!",
      rating: 5,
      gradient: "from-pink-400 to-rose-400"
    }
  ]

  const companies = [
    { name: "TechStyle", logo: "🚀" },
    { name: "Luxe Brands", logo: "💎" },
    { name: "Modern Agency", logo: "🎨" },
    { name: "Studio Lumina", logo: "📸" },
    { name: "Elegant Spaces", logo: "🏠" },
    { name: "Creative Co", logo: "✨" }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSection(true)
          }
        })
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, testimonials.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <section id="testimonials" className="relative py-10 lg:py-16 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl animate-pulse delay-500" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1500" />
      </div>

      <div ref={sectionRef} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          visibleSection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Badge className="mb-4 bg-gradient-to-r from-pink-600/20 to-purple-600/20 text-pink-300 border-pink-400/30">
            Testimonials
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent">
              Loved by Creators Worldwide
            </span>
          </h2>
          <p className="text-xl text-gray-800/70 max-w-3xl mx-auto">
            Join thousands of photographers, designers, and businesses who trust our AI to create stunning professional visuals.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Main Carousel Container */}
          <div className="relative h-[400px] md:h-[350px] lg:h-[300px] mb-8 overflow-hidden rounded-3xl">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`absolute inset-0 transition-all duration-700 transform ${
                  index === currentSlide
                    ? 'opacity-100 translate-x-0 scale-100'
                    : index < currentSlide
                    ? 'opacity-0 -translate-x-full scale-95'
                    : 'opacity-0 translate-x-full scale-95'
                }`}
              >
                {/* Glassmorphic Testimonial Card */}
                <div className="relative h-full bg-white/80 backdrop-blur-md border border-gray-300 rounded-3xl p-8 lg:p-12 overflow-hidden">
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient}/10 opacity-50 rounded-3xl`} />
                  
                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col lg:flex-row items-center gap-8">
                    {/* Quote and Content */}
                    <div className="flex-1 text-center lg:text-left">
                      {/* Quote Icon */}
                      <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${testimonial.gradient}/20 mb-6`}>
                        <Quote className={`w-8 h-8 text-transparent bg-gradient-to-r ${testimonial.gradient} bg-clip-text`} />
                      </div>

                      {/* Testimonial Text */}
                      <blockquote className="text-lg lg:text-xl text-gray-800/90 mb-6 leading-relaxed">
                        "{testimonial.content}"
                      </blockquote>

                      {/* Rating */}
                      <div className="flex justify-center lg:justify-start gap-1 mb-6">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className={`w-5 h-5 fill-current text-transparent bg-gradient-to-r ${testimonial.gradient} bg-clip-text`} />
                        ))}
                      </div>

                      {/* Author Info */}
                      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20">
                          <Image
                            src={testimonial.image}
                            alt={testimonial.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-center lg:text-left">
                          <h4 className="text-gray-800 font-semibold text-lg">{testimonial.name}</h4>
                          <p className="text-gray-800/70">{testimonial.role}</p>
                          <p className={`text-transparent bg-gradient-to-r ${testimonial.gradient} bg-clip-text font-medium`}>
                            {testimonial.company}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 opacity-20">
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${testimonial.gradient} blur-2xl animate-pulse`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-6 mb-8">
            {/* Previous Button */}
            <button
              onClick={prevSlide}
              className="p-3 rounded-full bg-white/90 backdrop-blur-md border border-white/20 text-gray-800 hover:bg-white/95 transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Slide Indicators */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'bg-gradient-to-r from-purple-400 to-pink-400 scale-125'
                      : 'bg-white/70 hover:bg-white/90'
                  }`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={nextSlide}
              className="p-3 rounded-full bg-white/90 backdrop-blur-md border border-white/20 text-gray-800 hover:bg-white/95 transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Auto-play Toggle */}
          <div className="flex justify-center mb-12">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-white/20 text-gray-800/70 hover:text-gray-800 hover:bg-white/95 transition-all duration-300"
            >
              {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isAutoPlaying ? 'Pause' : 'Play'} Auto-scroll
            </button>
          </div>
        </div>

        {/* Company Logos */}
        <div className={`text-center transition-all duration-1000 delay-300 ${
          visibleSection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <p className="text-gray-800/50 text-sm mb-8">Trusted by leading companies worldwide</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {companies.map((company, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-md border border-gray-300 rounded-2xl p-6 hover:bg-white/90 transition-all duration-300 hover:scale-105"
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{company.logo}</div>
                  <div className="text-gray-800/70 text-sm font-medium">{company.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}