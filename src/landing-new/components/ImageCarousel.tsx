'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const carouselImages = [
  {
    src: '/CarouselImages/CarosuelImage1.png',
    alt: 'Professional lifestyle photoshoot - Image 1',
    objectPosition: 'center 15%',
    objectFit: 'cover' as const,
    priority: true, // First image gets priority
    quality: 95
  },
  {
    src: '/CarouselImages/Image2Carousel.png', 
    alt: 'Professional lifestyle photoshoot - Image 2',
    objectPosition: 'center 15%',
    objectFit: 'cover' as const,
    quality: 95
  },
  {
    src: '/CarouselImages/image3carosel.png', 
    alt: 'Professional lifestyle photoshoot - Image 3',
    objectPosition: 'center 15%',
    objectFit: 'cover' as const,
    quality: 95
  },
  {
    src: '/CarouselImages/image4carosel.jpg', 
    alt: 'Professional lifestyle photoshoot - Image 4',
    objectPosition: 'center 15%',
    objectFit: 'cover' as const,
    quality: 90 // Optimized for this JPG
  },
  {
    src: '/CarouselImages/carosuelimage.jpg',
    alt: 'Professional lifestyle photoshoot - Image 5',
    objectPosition: 'center 15%',
    objectFit: 'cover' as const,
    priority: true, // Enhanced loading for problematic image
    quality: 90 // Optimized quality for better loading

  }
]

export default function ImageCarousel() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Set hydrated state to avoid hydration mismatch
    setIsHydrated(true)
    
    // Clear debug and setup logging
    console.clear()
    console.log('🔄 CAROUSEL INITIALIZATION - Fresh Start')
    console.log('🎠 Total Images Configured:', carouselImages.length)
    console.log('🎠 Image Paths:', carouselImages.map((img, i) => `${i+1}. ${img.src}`))
    console.log('🎠 Expected: 5 images should cycle every 5 seconds')
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % carouselImages.length
        const currentImg = carouselImages[prevIndex]?.src || 'unknown'
        const nextImg = carouselImages[nextIndex]?.src || 'unknown'
        console.log(`🎠 ROTATION: ${prevIndex+1}→${nextIndex+1} | ${currentImg} → ${nextImg}`)
        return nextIndex
      })
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      <div className="absolute inset-0 w-full h-full bg-black">
      {/* Carousel Images */}
      {carouselImages.map((image, index) => (
        <div
          key={`carousel-${index}-${image.src}`}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="relative w-full h-full">
            {/* Ken Burns Effect Container */}
            <div 
              className={`absolute inset-0 w-full h-full transition-transform duration-[20000ms] ease-out overflow-hidden ${
                index === currentImageIndex 
                  ? 'transform scale-105 translate-y-1' 
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
                priority={index === 0 || image.priority === true}
                quality={image.quality || 95}
                unoptimized={false}
                onLoad={() => {
                  console.log(`✅ LOADED: Image ${index + 1} - ${image.src}`)
                  if (image.src.includes('image4carosel.jpg')) {
                    console.log('🎯 SUCCESS: image4carosel.jpg loaded (previously problematic)')
                  }
                  if (image.src.includes('carosuelimage.jpg')) {
                    console.log('🎯 SUCCESS: carosuelimage.jpg loaded (was not displaying)')
                  }
                }}
                onError={(e) => {
                  console.error(`❌ FAILED: Image ${index + 1} - ${image.src}`)
                  console.error('Error details:', e)
                  if (image.src.includes('image4carosel')) {
                    console.error('🚨 CRITICAL: image4carosel.jpg failed - check filename!')
                  }
                  if (image.src.includes('carosuelimage.jpg')) {
                    console.error('🚨 CRITICAL: carosuelimage.jpg failed - check file!')
                  }
                }}
                onLoadingComplete={() => {
                  console.log(`🏁 READY: Image ${index + 1} fully loaded and ready`)
                }}
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
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
        {carouselImages.map((image, index) => (
          <button
            key={index}
            onClick={() => {
              console.log(`🔘 MANUAL NAVIGATION: Clicked indicator ${index + 1} - ${image.src}`)
              setCurrentImageIndex(index)
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentImageIndex
                ? 'bg-white shadow-lg scale-110'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            title={`Image ${index + 1}: ${image.alt}`}
          />
        ))}
      </div>

      {/* Static Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
        <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 w-0" />
      </div>
    </div>
  )
}