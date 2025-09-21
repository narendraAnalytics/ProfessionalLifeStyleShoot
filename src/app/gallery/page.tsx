'use client'

import { useState, useEffect } from 'react'
import { useUser, SignedIn, SignedOut } from '@clerk/nextjs'
import PublicGallery from '@/components/PublicGallery'
import { 
  Image as ImageIcon, 
  Wand2,
  History,
  Loader2,
  ArrowLeft,
  Home
} from 'lucide-react'
import { toast } from 'sonner'

interface GeneratedImage {
  id: string
  imageUrl: string
  thumbnailUrl: string
  bwImageUrl?: string // B&W image URL
  responsiveUrls: {
    small: string
    medium: string
    large: string
    original: string
  }
  bwUrls?: {
    small: string
    medium: string
    large: string
    original: string
  }
  originalPrompt: string
  enhancedPrompt: string
  style: string
  createdAt: string
}

function UserGallerySection() {
  const [recentImages, setRecentImages] = useState<GeneratedImage[]>([])
  const [isLoadingImages, setIsLoadingImages] = useState(false)
  const [imagesError, setImagesError] = useState<string | null>(null)
  const [grayscaleStates, setGrayscaleStates] = useState<Record<string, boolean>>({})
  const [formatStates, setFormatStates] = useState<Record<string, 'jpg' | 'webp' | 'png'>>({})
  const [newlyGeneratedImages, setNewlyGeneratedImages] = useState<Set<string>>(new Set())
  const { user } = useUser()

  // Format options
  const formatOptions = [
    { value: 'jpg' as const, label: 'JPEG', description: 'Universal' },
    { value: 'webp' as const, label: 'WebP', description: 'Smaller' },
    { value: 'png' as const, label: 'PNG', description: 'Quality' }
  ]

  const fetchExistingImages = async () => {
    if (!user) return

    setIsLoadingImages(true)
    setImagesError(null)

    try {
      const response = await fetch('/api/photoshoots?limit=20')
      
      if (!response.ok) {
        throw new Error('Failed to fetch images')
      }

      const data = await response.json()
      
      if (data.success && data.images) {
        console.log('📦 Images loaded from API:', data.images.length, 'images')
        setRecentImages(data.images)
        
        // Clear any stale "newly generated" states for fetched images
        setNewlyGeneratedImages(prev => {
          const updated = new Set(prev)
          data.images.forEach((image: GeneratedImage) => updated.delete(image.id))
          return updated
        })
      }
    } catch (error) {
      console.error('Error fetching existing images:', error)
      setImagesError(error instanceof Error ? error.message : 'Failed to load images')
    } finally {
      setIsLoadingImages(false)
    }
  }

  // Fetch existing images when user is available
  useEffect(() => {
    if (user) {
      setTimeout(() => fetchExistingImages(), 0)
    }
  }, [user])

  const generateImageUrl = (originalUrl: string, isGrayscale = false, format = 'jpg') => {
    const transformations = []
    
    console.log('🛠️ generateImageUrl called with:', { originalUrl, isGrayscale, format })
    
    // Validate input URL
    if (!originalUrl || typeof originalUrl !== 'string') {
      console.error('❌ Invalid originalUrl provided to generateImageUrl:', originalUrl)
      throw new Error('Invalid original URL provided')
    }
    
    // Add grayscale transformation first for proper ImageKit processing
    if (isGrayscale) {
      transformations.push('e-grayscale')
      console.log('⚫ Added grayscale transformation')
    }
    
    // Add format transformation with quality - improved quality settings
    if (format === 'jpg') {
      transformations.push('f-jpg,q-95') // Higher quality for download
    } else if (format === 'png') {
      transformations.push('f-png,q-95') // PNG with quality
    } else if (format === 'webp') {
      transformations.push('f-webp,q-95') // Higher quality WebP
    }
    
    const transformString = transformations.join(',')
    console.log('🔧 Transform string created:', transformString)
    
    // Generate URL with proper cache-busting via timestamp - always fresh
    const timestamp = Date.now() + Math.random() * 1000
    
    // Handle existing transformations in URL
    let finalUrl: string
    if (originalUrl.includes('tr=')) {
      // URL already has transformations - we need to handle this carefully
      console.log('⚠️ URL already contains transformations, modifying existing ones')
      if (transformString) {
        // Add our transformations to existing ones
        finalUrl = originalUrl.replace(/tr=([^&]+)/, `tr=$1,${transformString}`)
      } else {
        finalUrl = originalUrl
      }
      
      // Add cache busting
      const separator = finalUrl.includes('?') ? '&' : '?'
      finalUrl = `${finalUrl}${separator}v=${Math.floor(timestamp)}`
    } else {
      // URL doesn't have transformations - add them fresh
      const separator = originalUrl.includes('?') ? '&' : '?'
      if (transformString) {
        finalUrl = `${originalUrl}${separator}tr=${transformString}&v=${Math.floor(timestamp)}`
      } else {
        finalUrl = `${originalUrl}${separator}v=${Math.floor(timestamp)}`
      }
    }
    
    return finalUrl
  }

  const handleDownloadImage = async (image: GeneratedImage, isGrayscale = false, format: 'jpg' | 'webp' | 'png' = 'jpg') => {
    try {
      let imageUrl: string;
      
      console.log('🔽 Download request initiated:', { 
        isGrayscale, 
        format, 
        hasBwUrls: !!image.bwUrls?.original,
        imageId: image.id,
        originalUrl: image.responsiveUrls?.original || image.imageUrl,
        bwUrlsOriginal: image.bwUrls?.original,
        currentGrayscaleState: grayscaleStates[image.id],
        allGrayscaleStates: grayscaleStates
      });

      // State validation before download
      if (isGrayscale) {
        if (!image.bwUrls?.original && (!image.responsiveUrls?.original && !image.imageUrl)) {
          console.error('❌ B&W download requested but no valid URLs available')
          toast.error('B&W version not available for this image')
          return
        }
        console.log('✅ B&W download validation passed')
      } else {
        if (!image.responsiveUrls?.original && !image.imageUrl) {
          console.error('❌ Original download requested but no valid URLs available')
          toast.error('Original image not available')
          return
        }
        console.log('✅ Original download validation passed')
      }
      
      if (isGrayscale) {
        console.log('🎯 B&W download path selected')
        if (image.bwUrls?.original) {
          // Use pre-generated B&W URL if available (NEW IMAGES)
          console.log('✅ Pre-generated B&W URL found:', image.bwUrls.original)
          imageUrl = image.bwUrls.original;
          
          // Apply format transformation if needed
          if (format !== 'jpg') {
            console.log('🔧 Applying format transformation for B&W URL:', format)
            const originalImageUrl = imageUrl
            // Check if URL already has transformations
            if (imageUrl.includes('tr=')) {
              // Add format to existing transformations
              imageUrl = imageUrl.replace(/tr=([^&]+)/, `tr=$1,f-${format}`)
              console.log('🔧 Added format to existing transformations:', originalImageUrl, '->', imageUrl)
            } else {
              // Add format as new transformation
              const separator = imageUrl.includes('?') ? '&' : '?'
              imageUrl = `${imageUrl}${separator}tr=f-${format}`
              console.log('🔧 Added format as new transformation:', originalImageUrl, '->', imageUrl)
            }
          }
          
          console.log('✅ Final B&W URL (pre-generated):', imageUrl);
        } else {
          // Fallback to transformation method for B&W (EXISTING GALLERY IMAGES)
          console.log('🔄 No pre-generated B&W URL found, using fallback transformation')
          const baseUrl = image.responsiveUrls.original || image.imageUrl
          console.log('🔄 Base URL for transformation:', baseUrl)
          imageUrl = generateImageUrl(
            baseUrl, 
            true, // Force grayscale
            format
          )
          console.log('🔄 Final B&W URL (transformation fallback):', imageUrl);
        }
      } else {
        // Original image
        console.log('📷 Original image download path selected')
        const baseUrl = image.responsiveUrls.original || image.imageUrl
        console.log('📷 Base URL for original:', baseUrl)
        imageUrl = generateImageUrl(
          baseUrl, 
          false, 
          format
        )
        console.log('📷 Final original URL:', imageUrl);
      }
      
      console.log('🌐 Fetching image from URL:', imageUrl)
      const response = await fetch(imageUrl)
      if (!response.ok) {
        console.error('❌ Fetch failed:', response.status, response.statusText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      console.log('✅ Fetch successful, creating blob...')
      const blob = await response.blob()
      console.log('✅ Blob created, size:', blob.size, 'type:', blob.type)
      
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      
      const formatExt = format === 'jpg' ? 'jpg' : format
      const grayscaleLabel = isGrayscale ? '-bw' : ''
      const fileName = `photoshoot${grayscaleLabel}-${Date.now()}.${formatExt}`
      a.download = fileName
      
      console.log('📁 Initiating download:', fileName)
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      console.log('✅ Download initiated successfully')
      
      const formatLabel = formatOptions.find(f => f.value === format)?.label || format.toUpperCase()
      toast.success(`${isGrayscale ? 'B&W' : 'Original'} ${formatLabel} downloaded successfully!`)
    } catch (error) {
      console.error('❌ Download error:', error)
      toast.error('Failed to download image. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            {/* Back to Home Button */}
            <div className="flex items-center justify-between mb-8">
              <a 
                href="/"
                className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                <Home className="w-5 h-5" />
                <span>Back to Home</span>
              </a>
              <div className="flex-1" />
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Your AI Creations
              </h2>
              <p className="text-gray-600">Browse your recent photoshoots and creations</p>
            </div>

            {/* Loading State */}
            {isLoadingImages ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wand2 className="w-12 h-12 text-purple-500 animate-spin" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading your creations...</h3>
                <p className="text-gray-500">Please wait while we fetch your images</p>
              </div>
            ) : /* Error State */ imagesError ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <History className="w-12 h-12 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-red-700 mb-2">Failed to load images</h3>
                <p className="text-red-500 mb-6">{imagesError}</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={fetchExistingImages}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 transition-all"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : /* Empty State */ recentImages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No images yet</h3>
                <p className="text-gray-500 mb-6">Create your first AI photoshoot to get started!</p>
                <div className="flex justify-center">
                  <a 
                    href="/dashboard"
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                  >
                    Generate with AI
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentImages.map((image) => {
                  const isGrayscale = grayscaleStates[image.id] || false
                  const selectedFormat = formatStates[image.id] || 'jpg'
                  const isNewlyGenerated = newlyGeneratedImages.has(image.id)
                  return (
                    <div key={image.id} className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                      {/* Image Preview Toggle */}
                      <div className="absolute top-2 right-2 z-10">
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              console.log('🔵 Original button clicked for image:', image.id)
                              setGrayscaleStates(prev => {
                                const updated = { ...prev, [image.id]: false }
                                console.log('🔵 Updated grayscale states (Original):', updated)
                                return updated
                              })
                            }}
                            className={`px-2 py-1 text-xs rounded transition-all ${
                              !isGrayscale 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-white/80 text-gray-700 hover:bg-white'
                            }`}
                          >
                            Original
                          </button>
                          <button
                            onClick={() => {
                              console.log('⚫ B&W button clicked for image:', image.id)
                              console.log('⚫ Image B&W URLs available:', !!image.bwUrls, image.bwUrls)
                              setGrayscaleStates(prev => {
                                const updated = { ...prev, [image.id]: true }
                                console.log('⚫ Updated grayscale states (B&W):', updated)
                                return updated
                              })
                            }}
                            className={`px-2 py-1 text-xs rounded transition-all ${
                              isGrayscale 
                                ? 'bg-gray-600 text-white' 
                                : 'bg-white/80 text-gray-700 hover:bg-white'
                            } ${isNewlyGenerated ? 'animate-pulse' : ''}`}
                            title={isNewlyGenerated ? 'Newly generated - B&W may take a moment to load' : 'Switch to black & white'}
                          >
                            {isNewlyGenerated ? 'B&W ⏳' : 'B&W'}
                          </button>
                        </div>
                      </div>

                      <div className="aspect-square overflow-hidden">
                        <img
                          key={`gallery-image-${image.id}-${isGrayscale ? 'bw' : 'original'}`}
                          src={isGrayscale 
                            ? (image.bwUrls?.medium || generateImageUrl(image.responsiveUrls.medium, isGrayscale))
                            : image.responsiveUrls.medium
                          }
                          alt={image.originalPrompt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          crossOrigin="anonymous"
                          loading="lazy"
                          onError={(e) => {
                            console.error('❌ Gallery image failed to load:', e.currentTarget.src)
                            
                            // Try fallback based on type
                            if (isGrayscale) {
                              // For B&W images, try the fallback B&W URL or transformation
                              const fallbackUrl = image.bwImageUrl || generateImageUrl(image.responsiveUrls.medium, true)
                              if (e.currentTarget.src !== fallbackUrl) {
                                console.log('🔄 Trying B&W fallback URL for image:', image.id)
                                e.currentTarget.src = fallbackUrl
                              }
                            } else {
                              // For original images, try different sizes
                              const fallbackUrl = image.responsiveUrls.original || image.imageUrl
                              if (e.currentTarget.src !== fallbackUrl) {
                                console.log('🔄 Trying fallback URL for image:', image.id)
                                e.currentTarget.src = fallbackUrl
                              }
                            }
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            image.style === 'upload' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-purple-100 text-purple-700'
                          }`}>
                            {image.style === 'upload' ? 'Upload' : 'AI Generated'}
                          </span>
                          {isNewlyGenerated && (
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 animate-pulse">
                              Just created ✨
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            {new Date(image.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                          {image.originalPrompt}
                        </p>
                        
                        {/* Download Options */}
                        <div className="space-y-2">
                          <div className="text-xs font-medium text-gray-600 mb-1">Format:</div>
                          <div className="grid grid-cols-3 gap-1 mb-2">
                            {formatOptions.map((format) => (
                              <button
                                key={format.value}
                                onClick={() => setFormatStates(prev => ({ ...prev, [image.id]: format.value }))}
                                className={`px-2 py-1 text-xs rounded transition-all ${
                                  selectedFormat === format.value
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                }`}
                              >
                                {format.label}
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={() => {
                              // Read the current grayscale state directly at download time
                              const currentGrayscaleState = grayscaleStates[image.id] || false;
                              console.log('🎯 Download button clicked:', {
                                imageId: image.id,
                                cachedIsGrayscale: isGrayscale,
                                currentGrayscaleState: currentGrayscaleState,
                                stateMatches: isGrayscale === currentGrayscaleState,
                                selectedFormat,
                                hasBwUrls: !!image.bwUrls,
                                bwUrlsOriginal: image.bwUrls?.original,
                                fullGrayscaleStates: grayscaleStates
                              });
                              // Use the current state instead of cached isGrayscale
                              handleDownloadImage(image, currentGrayscaleState, selectedFormat);
                            }}
                            className="w-full px-2 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded text-xs transition-colors font-medium"
                          >
                            Download {(grayscaleStates[image.id] || false) ? 'B&W' : 'Original'} {formatOptions.find(f => f.value === selectedFormat)?.label}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function GalleryPage() {
  return (
    <>
      <SignedOut>
        <PublicGallery />
      </SignedOut>
      <SignedIn>
        <UserGallerySection />
      </SignedIn>
    </>
  )
}