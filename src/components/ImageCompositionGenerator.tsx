'use client'

import React, { useState, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { usePlanLimits } from '@/hooks/usePlanLimits'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Progress } from './ui/progress'
import { 
  Send, 
  Wand2, 
  Download,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  Upload,
  Trash2,
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

interface GeneratedImage {
  id: string
  imageUrl: string
  thumbnailUrl: string
  bwImageUrl?: string
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

interface ImageCompositionGeneratorProps {
  onImageGenerated?: (image: GeneratedImage) => void
}

interface AspectRatio {
  label: string
  value: string
  ratio: string
  description: string
  icon: string
  platforms: string[]
  successRate: string
  recommended: boolean
}

interface UploadedImageFile {
  file: File
  preview: string
  name: string
}

export default function ImageCompositionGenerator({ onImageGenerated }: ImageCompositionGeneratorProps) {
  // Image upload state
  const [uploadedImages, setUploadedImages] = useState<UploadedImageFile[]>([])
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [originalPrompt, setOriginalPrompt] = useState('')
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null)
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatio>({
    label: '1:1',
    value: '1-1',
    ratio: '1:1',
    description: 'Square',
    icon: '⬜',
    platforms: ['Instagram Feed', 'Facebook Posts', 'LinkedIn Posts', 'Portfolio Grids'],
    successRate: '98%',
    recommended: true
  })
  
  // UI state
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<'upload' | 'size-selection' | 'generated'>('upload')
  const [selectedFormat, setSelectedFormat] = useState<'jpg' | 'webp' | 'png'>('jpg')
  const [isDragOver, setIsDragOver] = useState(false)
  
  // Plan limits and upgrade modal state
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [hasShownModalThisSession, setHasShownModalThisSession] = useState(false)
  
  useUser() // Keep for auth context
  const { planStatus, incrementUsage } = usePlanLimits()

  // Format options
  const formatOptions = [
    { value: 'jpg' as const, label: 'JPEG', description: 'Universal compatibility' },
    { value: 'webp' as const, label: 'WebP', description: '25-35% smaller files' },
    { value: 'png' as const, label: 'PNG', description: 'Highest quality' }
  ]

  // Aspect ratio options
  const aspectRatios: AspectRatio[] = [
    {
      label: '1:1',
      value: '1-1',
      ratio: '1:1',
      description: 'Square',
      icon: '⬜',
      platforms: ['Instagram Feed', 'Facebook Posts', 'LinkedIn Posts', 'Portfolio Grids'],
      successRate: '98%',
      recommended: true
    },
    {
      label: '4:5',
      value: '4-5',
      ratio: '4:5',
      description: 'Portrait Post',
      icon: '📷',
      platforms: ['Instagram Portrait', 'Pinterest', 'Magazine Covers', 'Fashion'],
      successRate: '95%',
      recommended: true
    },
    {
      label: '9:16',
      value: '9-16',
      ratio: '9:16',
      description: 'Stories/Reels',
      icon: '📱',
      platforms: ['Stories', 'Reels', 'TikTok', 'Mobile Wallpapers'],
      successRate: '93%',
      recommended: true
    }
  ]

  // Handle file selection
  const handleFileSelect = useCallback((files: FileList) => {
    // Check if user has reached their merge limit before allowing file upload
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
      return // Block file selection
    }
    
    const validFiles = Array.from(files).filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp']
      const maxSize = 10 * 1024 * 1024 // 10MB
      
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name}: Only JPEG, PNG, and WebP files are allowed`)
        return false
      }
      
      if (file.size > maxSize) {
        toast.error(`${file.name}: File too large (max 10MB)`)
        return false
      }
      
      return true
    })

    if (uploadedImages.length + validFiles.length > 2) {
      toast.error('Maximum 2 images allowed')
      return
    }

    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const preview = e.target?.result as string
        setUploadedImages(prev => [...prev, {
          file,
          preview,
          name: file.name
        }])
      }
      reader.readAsDataURL(file)
    })
  }, [uploadedImages.length, planStatus?.canMergeImages, hasShownModalThisSession])

  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    // Block drag & drop if merge limit reached
    if (!planStatus?.canMergeImages) {
      if (!hasShownModalThisSession) {
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
      }
      return // Block drag & drop
    }
    
    handleFileSelect(e.dataTransfer.files)
  }, [handleFileSelect, planStatus?.canMergeImages, hasShownModalThisSession])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  // Remove uploaded image
  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  // Handle proceed to size selection
  const handleProceedToSizeSelection = () => {
    if (!currentPrompt.trim()) {
      toast.error('Please enter a prompt')
      return
    }

    if (uploadedImages.length !== 2) {
      toast.error('Please upload exactly 2 images')
      return
    }

    // Check merge limits before proceeding
    if (!planStatus?.canMergeImages) {
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
      return
    }

    setOriginalPrompt(currentPrompt.trim())
    setStep('size-selection')
  }

  // Handle generate composition
  const handleGenerateComposition = async () => {
    const finalPrompt = originalPrompt || currentPrompt.trim()
    
    if (!finalPrompt) {
      toast.error('Please enter a prompt')
      return
    }

    if (uploadedImages.length !== 2) {
      toast.error('Please upload exactly 2 images')
      return
    }

    // Double-check merge limits before generating
    if (!planStatus?.canMergeImages) {
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
      return
    }

    // Check if user can use selected aspect ratio BEFORE making API call
    if (!planStatus?.plan.allowedAspectRatios.includes(selectedAspectRatio.ratio)) {
      const planName = planStatus?.plan.name
      const aspectLabel = selectedAspectRatio.label
      
      toast.error(
        `🔒 ${aspectLabel} aspect ratio is only available in ${planName === 'Free' ? 'Pro' : 'Premium'} plan. Upgrade to access all aspect ratios!`,
        {
          duration: 6000,
          action: {
            label: 'Upgrade Now',
            onClick: () => {
              window.open('/pricing', '_blank')
            },
          },
        }
      )
      return
    }

    setError(null)
    setIsGenerating(true)
    setProgress(10)

    try {
      // Create FormData with images and prompt
      const formData = new FormData()
      uploadedImages.forEach((img, index) => {
        formData.append(`image${index + 1}`, img.file)
      })
      formData.append('prompt', finalPrompt)
      formData.append('aspectRatio', selectedAspectRatio.ratio)  // Use .ratio ("1:1") instead of .value ("1-1")

      const response = await fetch('/api/compose-images', {
        method: 'POST',
        body: formData,
      })

      setProgress(80)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate composition')
      }

      setGeneratedImage(data.photoshoot)
      setStep('generated')
      setProgress(100)
      
      // Increment merge usage counter
      try {
        await incrementUsage('merge', 1)
        console.log('✅ Merge usage incremented successfully')
      } catch (error) {
        console.error('⚠️ Failed to increment merge usage:', error)
        // Don't fail the entire operation if usage tracking fails
      }
      
      // Notify parent component
      if (onImageGenerated) {
        onImageGenerated(data.photoshoot)
      }

      toast.success('Image composition generated successfully!')

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate composition'
      setError(errorMessage)
      
      // Check if this is a plan limit error and show upgrade prompt instead of generic error
      if (errorMessage.includes('monthly limit') || errorMessage.includes('Upgrade to')) {
        toast.error(
          `🎉 You've used your free Upload & Combine for this month!`,
          {
            description: errorMessage,
            duration: 8000,
            action: {
              label: 'Upgrade to Pro',
              onClick: () => {
                window.open('/pricing', '_blank')
              },
            },
          }
        )
      } else {
        // Log non-plan errors to console for debugging
        console.error('Generation error:', error)
        toast.error(errorMessage)
      }
    } finally {
      setIsGenerating(false)
      setProgress(0)
    }
  }

  const generateImageUrl = useCallback((originalUrl: string, isGrayscale = false, format = 'jpg') => {
    const transformations = []
    
    if (isGrayscale) {
      transformations.push('e-grayscale')
    }
    
    if (format !== 'jpg') {
      transformations.push(`f-${format}`)
    } else {
      transformations.push('f-jpg,q-80')
    }
    
    const transformString = transformations.join(',')
    const timestamp = Date.now() + Math.random() * 1000
    const separator = originalUrl.includes('?') ? '&' : '?'
    
    let finalUrl: string
    if (transformString) {
      finalUrl = `${originalUrl}${separator}tr=${transformString}&v=${Math.floor(timestamp)}`
    } else {
      finalUrl = `${originalUrl}${separator}v=${Math.floor(timestamp)}`
    }
    
    return finalUrl
  }, [])

  const handleDownloadImage = async (image: GeneratedImage, isGrayscale = false, format: 'jpg' | 'webp' | 'png' = 'jpg') => {
    try {
      let downloadUrl: string;
      
      if (isGrayscale && image.bwUrls?.original) {
        downloadUrl = image.bwUrls.original;
        
        if (format !== 'jpg') {
          const separator = downloadUrl.includes('?') ? '&' : '?'
          downloadUrl = `${downloadUrl}${separator}tr=f-${format}`
        }
      } else {
        downloadUrl = image.responsiveUrls?.original || image.imageUrl
        const transformations = []
        
        if (isGrayscale) {
          transformations.push('e-grayscale')
        }
        
        if (format !== 'jpg') {
          transformations.push(`f-${format}`)
        } else {
          transformations.push('f-jpg,q-90')
        }
        
        if (transformations.length > 0) {
          const transformString = transformations.join(',')
          const separator = downloadUrl.includes('?') ? '&' : '?'
          downloadUrl = `${downloadUrl}${separator}tr=${transformString}`
        }
      }
      
      const response = await fetch(downloadUrl, { mode: 'cors' })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      
      const formatExt = format === 'jpg' ? 'jpg' : format
      const grayscaleLabel = isGrayscale ? '-bw' : ''
      a.download = `image-composition${grayscaleLabel}-${Date.now()}.${formatExt}`
      
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      const formatLabel = formatOptions.find(f => f.value === format)?.label || format.toUpperCase()
      toast.success(`${isGrayscale ? 'B&W' : 'Original'} ${formatLabel} downloaded successfully!`)
    } catch (error) {
      console.error('❌ Download error:', error)
      toast.error('Failed to download image. Please try again.')
    }
  }


  const handleStartOver = () => {
    setUploadedImages([])
    setCurrentPrompt('')
    setOriginalPrompt('')
    setGeneratedImage(null)
    setStep('upload')
    setError(null)
    setSelectedFormat('jpg')
    // Reset modal state for new session
    setShowUpgradeModal(false)
    setHasShownModalThisSession(false)
    setSelectedAspectRatio({
      label: '1:1',
      value: '1-1',
      ratio: '1:1',
      description: 'Square',
      icon: '⬜',
      platforms: ['Instagram Feed', 'Facebook Posts', 'LinkedIn Posts', 'Portfolio Grids'],
      successRate: '98%',
      recommended: true
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
          Image Composition Generator
        </h2>
        <p className="text-gray-600">
          Upload 2 images and combine them with AI-powered composition
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-6">
        
        {/* Progress Bar */}
        {isGenerating && (
          <div className="mb-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Generating your composition...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6">
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Step-based Content */}
        <div className="space-y-6">
          
          {/* Step 1: Upload Images */}
          {step === 'upload' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  !planStatus?.canMergeImages
                    ? 'bg-gray-300'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500'
                }`}>
                  <Upload className={`w-6 h-6 ${
                    !planStatus?.canMergeImages ? 'text-gray-500' : 'text-white'
                  }`} />
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${
                  !planStatus?.canMergeImages ? 'text-gray-500' : 'text-gray-800'
                }`}>Step 1: Upload Your Images</h3>
                <p className={`${
                  !planStatus?.canMergeImages ? 'text-gray-400' : 'text-gray-600'
                }`}>Upload exactly 2 images (.jpeg, .webp, .png) to combine</p>
                
                {!planStatus?.canMergeImages && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600 font-medium">
                      🎉 You&rsquo;ve used your free Upload & Combine for this month!
                    </p>
                    <p className="text-xs text-red-500 mt-1">
                      {planStatus?.plan.name === 'Free' 
                        ? `Free plan: ${planStatus.usage.currentPeriodMerges}/${planStatus.plan.maxMergesPerMonth} merges used this month`
                        : 'Upgrade to continue combining images'
                      }
                    </p>
                  </div>
                )}
              </div>

              {/* Image Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  !planStatus?.canMergeImages
                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                    : isDragOver
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-300 hover:border-gray-400'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <input
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                  className={`absolute inset-0 w-full h-full opacity-0 ${
                    !planStatus?.canMergeImages ? 'cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  disabled={uploadedImages.length >= 2 || !planStatus?.canMergeImages}
                />
                
                <div className="space-y-3">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                    !planStatus?.canMergeImages 
                      ? 'bg-gray-300' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-500'
                  }`}>
                    <Upload className={`w-8 h-8 ${
                      !planStatus?.canMergeImages ? 'text-gray-500' : 'text-white'
                    }`} />
                  </div>
                  <div>
                    <p className={`text-lg font-medium mb-1 ${
                      !planStatus?.canMergeImages ? 'text-gray-400' : 'text-gray-700'
                    }`}>
                      {!planStatus?.canMergeImages 
                        ? 'Upload limit reached'
                        : uploadedImages.length < 2 
                          ? 'Drop your images here' 
                          : 'Maximum 2 images reached'
                      }
                    </p>
                    <p className={`text-sm ${
                      !planStatus?.canMergeImages ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {!planStatus?.canMergeImages
                        ? 'Upgrade to Pro for more merges'
                        : uploadedImages.length < 2 
                          ? 'or click to browse' 
                          : 'Remove an image to add another'
                      }
                    </p>
                  </div>
                  <p className={`text-xs ${
                    !planStatus?.canMergeImages ? 'text-gray-400' : 'text-gray-400'
                  }`}>
                    Supports JPEG, PNG, WebP (max 10MB each)
                  </p>
                </div>
              </div>

              {/* Uploaded Images Preview */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {uploadedImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={img.preview}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <p className="text-xs text-gray-500 mt-1 truncate">{img.name}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Prompt Input */}
              {uploadedImages.length === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Describe how you want to combine these images:
                    </label>
                    <Textarea
                      value={currentPrompt}
                      onChange={(e) => setCurrentPrompt(e.target.value)}
                      placeholder="e.g., Create a professional e-commerce fashion photo. Take the blue floral dress from the first image and let the woman from the second image wear it..."
                      className="min-h-[120px] text-base border border-gray-200 shadow-sm resize-none bg-white rounded-xl p-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      disabled={isGenerating}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleProceedToSizeSelection}
                      disabled={!currentPrompt.trim() || isGenerating || !planStatus?.canMergeImages}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex-1"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Proceed to Size Selection
                    </Button>
                  </div>
                  
                  {!planStatus?.canMergeImages && (
                    <div className="mt-2 text-xs text-red-600 text-center">
                      You&rsquo;ve reached your monthly merge limit. Upgrade for more!
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Size Selection */}
          {step === 'size-selection' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Step 2: Choose Image Size</h3>
                <p className="text-gray-600">Select your preferred aspect ratio for the composition</p>
              </div>

              {/* Prompt Display */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700 text-sm">Your Composition Prompt:</span>
                    <div className="mt-1 p-3 bg-blue-50 rounded-lg text-blue-800 font-medium text-sm">
                      &ldquo;{originalPrompt || currentPrompt}&rdquo;
                    </div>
                  </div>
                </div>
              </div>

              {/* Aspect Ratio Selection */}
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <h4 className="font-medium text-gray-700">Choose Your Platform:</h4>
                  <p className="text-xs text-gray-500">Select the aspect ratio based on where you&rsquo;ll use the image</p>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  {aspectRatios.map((ratio) => {
                    const isLocked = !planStatus?.plan.allowedAspectRatios.includes(ratio.ratio)
                    
                    return (
                    <button
                      key={ratio.value}
                      onClick={() => {
                        if (isLocked) {
                          // Show upgrade prompt instead of selecting locked ratio
                          toast.error(
                            `🔒 ${ratio.label} is a ${planStatus?.plan.name === 'Free' ? 'Pro' : 'Premium'} feature`,
                            {
                              description: `Upgrade to unlock ${ratio.description.toLowerCase()} format and all aspect ratios!`,
                              duration: 6000,
                              action: {
                                label: 'Upgrade Now',
                                onClick: () => {
                                  window.open('/pricing', '_blank')
                                },
                              },
                            }
                          )
                        } else {
                          setSelectedAspectRatio(ratio)
                        }
                      }}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 relative ${
                        selectedAspectRatio.value === ratio.value
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : isLocked 
                            ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed opacity-75 hover:opacity-90' 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      disabled={isLocked}
                    >
                      {/* Success rate badge or Pro badge */}
                      {isLocked ? (
                        <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow-md">
                          PRO
                        </div>
                      ) : (
                        <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                          {ratio.successRate}
                        </div>
                      )}
                      
                      <div className="text-xl">{ratio.icon}</div>
                      <div className="font-bold text-sm">{ratio.label}</div>
                      <div className="text-xs font-semibold text-center">{ratio.description}</div>
                      
                      {/* Platform tags */}
                      <div className="text-xs text-center text-gray-600 leading-tight font-medium">
                        {ratio.platforms.join(', ')}
                      </div>
                      
                      <div className="text-xs text-gray-500 font-medium">{ratio.ratio}</div>
                    </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleStartOver}
                  variant="outline"
                  className="border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  Start Over
                </Button>
                <Button
                  onClick={handleGenerateComposition}
                  disabled={isGenerating || !planStatus?.canMergeImages}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex-1"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Generate {selectedAspectRatio.description} Composition ({selectedAspectRatio.label})
                </Button>
              </div>
              
              {!planStatus?.canMergeImages && (
                <div className="mt-2 text-xs text-red-600 text-center">
                  You&rsquo;ve reached your monthly merge limit. Upgrade for more!
                </div>
              )}
            </div>
          )}

          {/* Step 3: Generated Composition */}
          {step === 'generated' && generatedImage && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Your Composition is Ready!</h3>
                <p className="text-gray-600">Generated in {selectedAspectRatio.label} aspect ratio</p>
              </div>

              {/* Image Preview */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                <div className="relative">
                  <img
                    key={`composition-${generatedImage.id}-original`}
                    src={generatedImage.responsiveUrls?.medium || generatedImage.imageUrl}
                    alt="Generated composition"
                    className="w-full object-cover hover:scale-105 transition-all duration-500"
                    crossOrigin="anonymous"
                    loading="eager"
                    onError={(e) => {
                      console.error('❌ Composition failed to load:', e.currentTarget.src)
                      const fallbackUrl = generatedImage.responsiveUrls?.original || generatedImage.imageUrl
                      if (e.currentTarget.src !== fallbackUrl) {
                        e.currentTarget.src = fallbackUrl
                      }
                    }}
                  />
                </div>

                <div className="p-4">
                  <div className="text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {selectedAspectRatio.label} {selectedAspectRatio.description} Composition
                      </span>
                    </div>
                    <span className="font-medium">Generated from:</span> &ldquo;{generatedImage.originalPrompt}&rdquo;
                    {generatedImage.enhancedPrompt && (
                      <div className="mt-1">
                        <span className="font-medium text-emerald-600">Enhanced:</span> &ldquo;{generatedImage.enhancedPrompt}&rdquo;
                      </div>
                    )}
                  </div>
                  
                  {/* Download Options */}
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-gray-700">Download Options:</div>
                    
                    {/* Format Selector */}
                    <div className="space-y-2">
                      <div className="text-xs text-gray-600">Choose format:</div>
                      <div className="grid grid-cols-3 gap-2">
                        {formatOptions.map((format) => (
                          <button
                            key={format.value}
                            onClick={() => setSelectedFormat(format.value)}
                            className={`p-2 rounded-lg border-2 transition-all text-xs ${
                              selectedFormat === format.value
                                ? 'border-purple-500 bg-purple-50 text-purple-700'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className="font-medium">{format.label}</div>
                            <div className="text-xs text-gray-500 mt-1">{format.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Download Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => handleDownloadImage(generatedImage, false, selectedFormat)}
                        size="sm"
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Original
                      </Button>
                      
                      <Button
                        onClick={() => handleDownloadImage(generatedImage, true, selectedFormat)}
                        size="sm"
                        variant="outline"
                        className="border-gray-300 hover:bg-gray-50"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download B&W
                      </Button>
                    </div>
                    
                    <Button
                      onClick={handleStartOver}
                      size="sm"
                      variant="outline"
                      className="w-full"
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      Create Another Composition
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
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