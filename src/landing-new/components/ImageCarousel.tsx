'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const carouselImages = [
  {
    src: '/CarouselImages/CarosuelImage1.png',
    alt: 'Professional lifestyle photoshoot - Image 1',
    objectPosition: 'center 15%', // Shows more headroom, centers the face better
    objectFit: 'cover' as const
  },
  {
    src: '/CarouselImages/Image2Carousel.png', 
    alt: 'Professional lifestyle photoshoot - Image 2',
    objectPosition: 'center 15%', // Proper headroom spacing with full width coverage
    objectFit: 'cover' as const
  },
  {
    src: '/CarouselImages/image3carosel.png', 
    alt: 'Professional lifestyle photoshoot - Image 3',
    objectPosition: 'center 15%', // Same headroom positioning with full width coverage
    objectFit: 'cover' as const
  }
]

export default function ImageCarousel() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % carouselImages.length
      )
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [])

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100" />
    )
  }

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-black">
      {/* Carousel Images */}
      {carouselImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="relative w-full h-full">
            {/* Ken Burns Effect Container */}
            <div 
              className={`absolute inset-0 w-full h-full transition-transform duration-[20000ms] ease-out ${
                index === currentImageIndex 
                  ? 'transform scale-110 translate-x-2 translate-y-1' 
                  : 'transform scale-100'
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                style={{
                  objectFit: image.objectFit,
                  objectPosition: image.objectPosition
                }}
                sizes="100vw"
                priority={index === 0}
                quality={95}
              />
            </div>
            
            {/* Professional Dark Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
            
            {/* Additional Overlay for Better Text Contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
          </div>
        </div>
      ))}

      {/* Subtle Vignette Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10" />
      
      {/* Bottom Gradient for Better Footer Transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 to-transparent" />

      {/* Carousel Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentImageIndex
                ? 'bg-white shadow-lg scale-110'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
        <div 
          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-75 ease-linear"
          style={{
            width: `${((Date.now() % 5000) / 5000) * 100}%`
          }}
        />
      </div>
    </div>
  )
}