'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'
import DashboardHeader from './DashboardHeader'
import DashboardSidebar from './DashboardSidebar'
import AIPhotoshootGenerator from './AIPhotoshootGenerator'
import ImageCompositionGenerator from './ImageCompositionGenerator'
import { useUserSync } from './UserSyncProvider'
import { usePlanLimits } from '@/hooks/usePlanLimits'
import { 
  Sparkles, 
  Image as ImageIcon, 
  Wand2,
  History,
  Loader2,
  AlertCircle,
  Plus,
  Crown
} from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'

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

export default function Dashboard() {
  const searchParams = useSearchParams()
  const [activeSection, setActiveSection] = useState('create')
  const [recentImages, setRecentImages] = useState<GeneratedImage[]>([])
  const [isLoadingImages, setIsLoadingImages] = useState(false)
  const [imagesError, setImagesError] = useState<string | null>(null)
  const [grayscaleStates, setGrayscaleStates] = useState<Record<string, boolean>>({})
  const [formatStates, setFormatStates] = useState<Record<string, 'jpg' | 'webp' | 'png'>>({})
  const [dashboardReady, setDashboardReady] = useState(false)
  const [newlyGeneratedImages, setNewlyGeneratedImages] = useState<Set<string>>(new Set())
  const [showImageComposer, setShowImageComposer] = useState(false)
  
  // Upgrade modal state for Upload & Combine
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [hasShownModalThisSession, setHasShownModalThisSession] = useState(false)
  
  const { user } = useUser()
  const { isSyncing, syncError, syncSuccess, retrySync } = useUserSync()
  const { planStatus, loading: planLoading } = usePlanLimits()

  // Format options
  const formatOptions = [
    { value: 'jpg' as const, label: 'JPEG', description: 'Universal' },
    { value: 'webp' as const, label: 'WebP', description: 'Smaller' },
    { value: 'png' as const, label: 'PNG', description: 'Quality' }
  ]

  const handleImageGenerated = (image: GeneratedImage) => {
    // Initialize states for the newly generated image
    setGrayscaleStates(prev => ({ ...prev, [image.id]: false }))
    setFormatStates(prev => ({ ...prev, [image.id]: 'jpg' }))
    
    // Mark as newly generated (for special handling)
    setNewlyGeneratedImages(prev => new Set([...prev, image.id]))
    
    // Add the image to the gallery
    setRecentImages(prev => [image, ...prev.slice(0, 9)]) // Keep last 10 images
    
    // Remove from newly generated after 10 seconds (ImageKit propagation time)
    setTimeout(() => {
      setNewlyGeneratedImages(prev => {
        const updated = new Set(prev)
        updated.delete(image.id)
        return updated
      })
      console.log('✅ Image propagation complete for:', image.id)
    }, 10000) // 10 seconds should be enough for ImageKit propagation
    
    // Log for debugging
    console.log('🆕 New image added to gallery:', {
      imageId: image.id,
      imageUrl: image.imageUrl,
      responsiveUrls: image.responsiveUrls,
      willBeTreatedAsNewFor: '10 seconds'
    })
  }

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
        data.images.forEach((img: GeneratedImage) => {
          console.log('📦 Image details from API:', {
            id: img.id,
            hasBwImageUrl: !!img.bwImageUrl,
            bwImageUrl: img.bwImageUrl,
            hasBwUrls: !!img.bwUrls,
            bwUrls: img.bwUrls,
            bwUrlsOriginal: img.bwUrls?.original,
            hasResponsiveUrls: !!img.responsiveUrls,
            style: img.style,
            createdAt: img.createdAt
          })
        })
        
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

  // Handle URL section parameter on mount
  useEffect(() => {
    const section = searchParams.get('section')
    if (section === 'gallery') {
      setActiveSection('gallery')
    }
  }, [searchParams])

  // Initialize dashboard immediately - don't wait for sync
  useEffect(() => {
    // Make dashboard ready immediately
    const timer = setTimeout(() => setDashboardReady(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Fetch existing images when user is available - async, non-blocking
  useEffect(() => {
    if (user) {
      // Fetch images in background, don't block dashboard rendering
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
    
    // Enhanced debug logging
    console.log('🖼️ Enhanced ImageKit URL Generation:', {
      originalUrl,
      isGrayscale,
      format,
      transformations,
      transformString,
      hadExistingTransforms: originalUrl.includes('tr='),
      finalUrl,
      urlLength: finalUrl.length
    })
    
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

  // Show loading state only for first few milliseconds
  if (!dashboardReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Sparkles className="w-8 h-8 text-white animate-bounce" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Dashboard...</h2>
          <p className="text-gray-600">Preparing your creative workspace</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader />
      
      {/* User Sync Status Banner */}
      {(isSyncing || syncError) && (
        <div className={`px-4 py-2 text-sm ${
          syncError 
            ? 'bg-orange-100 border-orange-200 text-orange-800' 
            : 'bg-blue-100 border-blue-200 text-blue-800'
        } border-b`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isSyncing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Syncing user profile in background...</span>
                </>
              ) : syncError ? (
                <>
                  <AlertCircle className="w-4 h-4" />
                  <span>Sync failed: {syncError}</span>
                </>
              ) : null}
            </div>
            {syncError && (
              <button 
                onClick={retrySync}
                className="px-3 py-1 bg-orange-200 hover:bg-orange-300 rounded transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      )}
      
      <div className="flex flex-1">
        <DashboardSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        
        <main className="flex-1 p-6 overflow-auto relative pl-72">
          {/* Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-1/4 w-64 h-64 bg-purple-400/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-400/3 rounded-full blur-3xl animate-pulse delay-2000" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            {/* Welcome Section */}
            <div className="text-center mb-12 animate-fade-in">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-75 animate-pulse"></div>
                  <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <Sparkles className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-bounce" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
                  Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress?.split('@')[0] || 'Creator'}
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Transform your ideas into stunning professional photoshoots with the power of AI
              </p>
            </div>

            {/* Main Content - Conditional Rendering */}
            {activeSection === 'create' && (
              <>
                {/* Quick Action Button - Only show in create section */}
                <div className="flex justify-center mb-8">
                  <button
                    onClick={() => {
                      // If switching back to AI Generator, allow it
                      if (showImageComposer) {
                        setShowImageComposer(false)
                        return
                      }
                      
                      // Check if user can merge images before switching to Upload & Combine
                      if (!planStatus?.canMergeImages && !hasShownModalThisSession) {
                        setShowUpgradeModal(true)
                        setHasShownModalThisSession(true)
                        toast.error(
                          `🎉 You've used your free Upload & Combine for this month!`,
                          {
                            description: `Free plan: 1 merge/month. Upgrade to Pro for 8 merges/month!`,
                            duration: 5000,
                            action: {
                              label: 'Upgrade to Pro',
                              onClick: () => {
                                window.open('/pricing', '_blank')
                              },
                            },
                          }
                        )
                        return // Block switching to Upload & Combine
                      }
                      
                      // Allow switching to Upload & Combine
                      setShowImageComposer(true)
                    }}
                    className={`group relative overflow-hidden text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                      !planStatus?.canMergeImages && !showImageComposer
                        ? 'bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 animate-pulse'
                    }`}
                    title={!planStatus?.canMergeImages && !showImageComposer ? 'Upgrade to Pro for more merges' : 'Upload and combine images'}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 animate-gradient-x opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center gap-3">
                      <div className="bg-white/20 p-2 rounded-full">
                        <Plus className="w-6 h-6 animate-bounce" />
                      </div>
                      <span className="text-lg">
                        {showImageComposer ? 'Back to AI Generator' : 'Upload & Combine Images'}
                      </span>
                    </div>
                  </button>
                </div>

                {!showImageComposer ? (
                  <AIPhotoshootGenerator onImageGenerated={handleImageGenerated} />
                ) : (
                  <ImageCompositionGenerator onImageGenerated={handleImageGenerated} />
                )}
              </>
            )}

            {activeSection === 'gallery' && (
                <div className="space-y-6">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
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
                          <button
                            onClick={() => setActiveSection('create')}
                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                          >
                            Create New Image
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
                          <button
                            onClick={() => setActiveSection('create')}
                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                          >
                            Generate with AI
                          </button>
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
            )}
          </div>
        </main>
      </div>

      {/* Upload & Combine Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              🎉 You&rsquo;ve Used Your Free Upload & Combine!
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              You&rsquo;ve created <span className="font-semibold text-purple-600">1 amazing merged image</span> this month with your Free plan.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Benefits List */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 space-y-3">
              <div className="text-sm font-semibold text-gray-700 mb-2">✨ Upgrade to Pro and get:</div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span><strong className="text-purple-600">8 Upload & Combine</strong> images per month</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span><strong className="text-purple-600">15 AI Generated</strong> images per month</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span><strong className="text-purple-600">All aspect ratios</strong> (Portrait, Stories, etc.)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span><strong className="text-purple-600">HD Quality</strong> images</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span><strong className="text-purple-600">Email Support</strong></span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col space-y-2">
            <Button
              onClick={() => {
                window.open('/pricing', '_blank')
                setShowUpgradeModal(false)
              }}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Pro Plan
            </Button>
            <Button
              onClick={() => setShowUpgradeModal(false)}
              variant="ghost"
              className="w-full text-gray-500 hover:text-gray-700"
            >
              Maybe Later
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}