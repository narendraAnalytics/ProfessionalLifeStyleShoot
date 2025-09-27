'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from './ui/button'
import { SignInButton } from '@clerk/nextjs'
import { 
  Sparkles, 
  X, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  Camera,
  Palette,
  Wand2,
  Award,
  Home
} from 'lucide-react'

interface ShowcaseImage {
  id: string
  src: string
  title: string
  category: string
  description: string
  alt: string
}

const showcaseImages: ShowcaseImage[] = [
  {
    id: '1',
    src: '/images/BrandedWalkigshoes.png',
    title: 'Branded Walking Shoes',
    category: 'Product Photography',
    description: 'Professional lifestyle photography for athletic footwear brands',
    alt: 'Branded walking shoes professional photoshoot'
  },
  {
    id: '2', 
    src: '/images/Brandjewelrysaree-photoshoot.png',
    title: 'Jewelry & Saree Collection',
    category: 'Fashion Photography',
    description: 'Elegant jewelry and traditional wear brand photography',
    alt: 'Brand jewelry saree professional photoshoot'
  },
  {
    id: '3',
    src: '/images/Designed-saree-outdoor-rain.png', 
    title: 'Designer Saree Rain Shoot',
    category: 'Fashion Photography',
    description: 'Artistic outdoor rain photography for designer sarees',
    alt: 'Designer saree outdoor rain photoshoot'
  },
  {
    id: '4',
    src: '/images/Designedsaree-photoshoot.png',
    title: 'Designer Saree Studio',
    category: 'Fashion Photography', 
    description: 'Premium studio photography for luxury saree brands',
    alt: 'Designer saree studio photoshoot'
  },
  {
    id: '5',
    src: '/images/JewelryBrand-photoshoot.png',
    title: 'Luxury Jewelry Brand',
    category: 'Product Photography',
    description: 'High-end jewelry brand photography with elegant styling',
    alt: 'Jewelry brand luxury photoshoot'
  },
  {
    id: '6',
    src: '/images/sareephotoshootdesigner.png',
    title: 'Traditional Saree Collection',
    category: 'Fashion Photography',
    description: 'Traditional and contemporary saree brand photography',
    alt: 'Saree designer photoshoot collection'
  },
  {
    id: '7',
    src: '/images/slipperybrand.png',
    title: 'Branded Slippers for Womenn',
    category: 'Fashion Photography',
    description: 'Branded Photo shoot for the slippers Brand',
    alt: 'Brand designer photoshoot collection'
  },
  {
    id: '8',
    src: '/images/brandeddress.png',
    title: 'Brande fashion Dress',
    category: 'Fashion Photography',
    description: 'Traditional and contemporary Fashion brand photography',
    alt: 'Saree designer photoshoot collection'
  }
]

export default function PublicGallery() {
  const [selectedImage, setSelectedImage] = useState<ShowcaseImage | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const scrollToGallery = () => {
    const gallerySection = document.getElementById('gallery')
    if (gallerySection) {
      gallerySection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      })
    }
  }

  const openLightbox = (image: ShowcaseImage, index: number) => {
    setSelectedImage(image)
    setCurrentIndex(index)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % showcaseImages.length
    setCurrentIndex(nextIndex)
    setSelectedImage(showcaseImages[nextIndex])
  }

  const prevImage = () => {
    const prevIndex = (currentIndex - 1 + showcaseImages.length) % showcaseImages.length
    setCurrentIndex(prevIndex)
    setSelectedImage(showcaseImages[prevIndex])
  }

  const features = [
    { icon: Wand2, text: "AI-Powered Generation", color: "from-purple-400 to-pink-400" },
    { icon: Camera, text: "Studio Quality", color: "from-blue-400 to-cyan-400" },
    { icon: Palette, text: "Brand Customization", color: "from-green-400 to-emerald-400" },
    { icon: Award, text: "Professional Results", color: "from-yellow-400 to-orange-400" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 overflow-x-hidden">
      {/* Header Section */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-32 h-32 md:w-48 md:h-48 bg-purple-400/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-1/4 w-40 h-40 md:w-56 md:h-56 bg-blue-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 bg-pink-400/3 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* Professional Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative group">
              {/* Multiple layered glow effects - optimized for no overflow */}
              <div className="absolute -inset-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-2xl opacity-60 animate-pulse" />
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse" style={{animationDelay: '0.5s'}} />
              <div className="absolute -inset-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-lg opacity-40 animate-pulse" style={{animationDelay: '1s'}} />
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full blur-md opacity-30 animate-pulse" style={{animationDelay: '1.5s'}} />
              
              {/* Logo with bright background - larger size */}
              <div className="relative bg-white rounded-full p-1 shadow-2xl">
                <Image
                  src="/images/dasboardicon.png"
                  alt="Professional Life Shoot Dashboard Logo"
                  width={128}
                  height={128}
                  className="relative z-10 rounded-full transition-all duration-500 group-hover:scale-110 shadow-lg w-28 h-28 md:w-32 md:h-32"
                  priority
                />
              </div>
              
              {/* Additional bright overlay - optimized */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full animate-pulse" style={{animationDelay: '2s'}} />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Designed By AI
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            If you want to create stunning photoshoots like these, 
            <span className="font-semibold text-purple-600"> Sign In and start Creating For Your Brands</span>
          </p>

          {/* CTA and Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/">
              <Button 
                size="lg"
                variant="outline"
                className="bg-white/90 border-purple-200 text-purple-700 hover:bg-purple-50 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-purple-200/50 transform hover:scale-105 transition-all duration-300"
              >
                <Home className="w-5 h-5 mr-3" />
                Back to Home
              </Button>
            </Link>
            <SignInButton mode="modal">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-5 rounded-full font-semibold text-xl shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
              >
                <Sparkles className="w-6 h-6 mr-3" />
                Start Creating Your Brand
              </Button>
            </SignInButton>
          </div>

          {/* Features Row */}
          <div className="flex flex-wrap justify-center gap-6 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl px-6 py-4 hover:bg-white hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full bg-gradient-to-r ${feature.color}`}>
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-800 font-medium">{feature.text}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Animated Scroll Arrow */}
          <div className="flex justify-center">
            <button
              onClick={scrollToGallery}
              className="group relative p-4 bg-white/90 hover:bg-white backdrop-blur-sm border border-purple-200 rounded-full shadow-lg hover:shadow-purple-200/50 transform hover:scale-110 transition-all duration-300 animate-bounce"
              aria-label="Scroll to gallery"
            >
              {/* Glowing background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-500" />
              
              {/* Icon */}
              <ChevronDown className="w-8 h-8 text-purple-600 group-hover:text-purple-700 relative z-10 transition-colors duration-300" />
              
              {/* Animated ring */}
              <div className="absolute inset-0 border-2 border-purple-300 rounded-full animate-ping opacity-20" />
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div id="gallery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our AI-Generated
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Portfolio</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the power of AI in creating professional brand photography that captivates and converts
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {showcaseImages.map((image, index) => (
            <div
              key={image.id}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] cursor-pointer"
              onClick={() => openLightbox(image, index)}
            >
              {/* Professional Frame Effect */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/10 via-transparent to-gray-900/20 z-10 rounded-2xl" />
                
                <div className="aspect-[4/5] relative overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>

                {/* Elegant Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-30">
                  <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <span className="inline-block px-3 py-1 bg-purple-600/80 rounded-full text-xs font-medium mb-2">
                      {image.category}
                    </span>
                    <h3 className="text-lg font-bold mb-2">{image.title}</h3>
                    <p className="text-sm opacity-90 line-clamp-2">{image.description}</p>
                  </div>
                </div>

                {/* Studio Badge */}
                <div className="absolute top-4 right-4 z-20">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-gray-800 shadow-lg">
                    AI Studio
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className="mt-20 text-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-white">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Create Your Own?
          </h3>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of brands who trust our AI to create stunning professional photography in minutes
          </p>
          <SignInButton mode="modal">
            <Button 
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 px-10 py-5 rounded-full font-semibold text-xl shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Camera className="w-6 h-6 mr-3" />
              Start Your Free Trial
            </Button>
          </SignInButton>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-6xl mx-auto">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-60 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-60 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-60 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Image */}
            <div className="relative">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={1200}
                height={800}
                className="rounded-xl max-h-[80vh] object-contain"
                priority
              />
              
              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-xl">
                <div className="text-white">
                  <span className="inline-block px-3 py-1 bg-purple-600 rounded-full text-sm font-medium mb-2">
                    {selectedImage.category}
                  </span>
                  <h3 className="text-2xl font-bold mb-2">{selectedImage.title}</h3>
                  <p className="opacity-90">{selectedImage.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}