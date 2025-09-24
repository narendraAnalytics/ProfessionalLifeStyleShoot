'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { usePlanLimits } from '@/hooks/usePlanLimits'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Progress } from './ui/progress'
import { 
  Sparkles, 
  Send, 
  Wand2, 
  Download,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  Edit3,
  Check,
  X
} from 'lucide-react'
import { toast } from 'sonner'

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

interface AIPhotoshootGeneratorProps {
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

export default function AIPhotoshootGenerator({ onImageGenerated }: AIPhotoshootGeneratorProps) {
  // Single chat state
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [enhancedPrompt, setEnhancedPrompt] = useState('')
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
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<'input' | 'enhanced' | 'enhanced-edit' | 'size-selection' | 'generated'>('input')
  const [selectedFormat, setSelectedFormat] = useState<'jpg' | 'webp' | 'png'>('jpg')
  const [isEditingEnhanced, setIsEditingEnhanced] = useState(false)
  const [tempEnhancedPrompt, setTempEnhancedPrompt] = useState('')
  useUser() // Keep for auth context
  
  // Plan limits and usage tracking
  const { planStatus, loading: planLoading, refreshUsage } = usePlanLimits()

  // Format options
  const formatOptions = [
    { value: 'jpg' as const, label: 'JPEG', description: 'Universal compatibility' },
    { value: 'webp' as const, label: 'WebP', description: '25-35% smaller files' },
    { value: 'png' as const, label: 'PNG', description: 'Highest quality' }
  ]

  // Aspect ratio options with enhanced descriptions
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

  const handleEnhancePrompt = async () => {
    if (!currentPrompt.trim()) {
      toast.error('Please enter a prompt')
      return
    }

    setError(null)
    setIsEnhancing(true)
    setProgress(10)

    try {
      const response = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: currentPrompt.trim()
        }),
      })

      setProgress(80)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to enhance prompt')
      }

      setOriginalPrompt(data.originalPrompt)
      setEnhancedPrompt(data.enhancedPrompt)
      setTempEnhancedPrompt(data.enhancedPrompt)
      setStep('enhanced-edit')
      setProgress(100)
      
      toast.success('Prompt enhanced successfully!')

    } catch (error) {
      console.error('Enhancement error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to enhance prompt'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsEnhancing(false)
      setProgress(0)
    }
  }

  const handleGenerateImage = async (promptToUse?: string) => {
    const finalPrompt = promptToUse || tempEnhancedPrompt || enhancedPrompt || currentPrompt.trim()
    
    if (!finalPrompt) {
      toast.error('Please enter a prompt or enhance one first')
      return
    }

    // Safety check: Don't block if plan is still loading
    if (planLoading) {
      toast.error('Loading plan information... Please try again in a moment.')
      return
    }

    // Check if user has reached their monthly image limit
    if (!planStatus.canGenerateImage) {
      const planName = planStatus.plan.name
      const maxImages = planStatus.plan.maxImagesPerMonth === -1 ? 'unlimited' : planStatus.plan.maxImagesPerMonth
      
      toast.error(
        `🎉 You've used all ${maxImages} images this month!`,
        {
          description: planName === 'Free' 
            ? 'Upgrade to Pro for 15 images/month + all aspect ratios!' 
            : 'You\'ve reached your monthly limit. Consider upgrading for more images.',
          duration: 8000,
          action: {
            label: planName === 'Free' ? 'Upgrade to Pro' : 'View Plans',
            onClick: () => {
              window.open('/pricing', '_blank')
            },
          },
        }
      )
      return
    }

    // Check if user can use selected aspect ratio BEFORE making API call
    if (!planStatus.plan.allowedAspectRatios.includes(selectedAspectRatio.ratio)) {
      const planName = planStatus.plan.name
      const aspectLabel = selectedAspectRatio.label
      
      if (planName === 'Free') {
        toast.error(
          `${aspectLabel} aspect ratio is only available in Pro plan. Upgrade to access all aspect ratios!`,
          {
            duration: 6000,
            action: {
              label: 'Upgrade to Pro',
              onClick: () => {
                // Navigate to pricing or show upgrade modal
                window.open('/pricing', '_blank')
              },
            },
          }
        )
      } else {
        toast.error(
          `${aspectLabel} aspect ratio requires ${aspectLabel === '2:3' || aspectLabel === '3:2' ? 'Max Ultimate' : 'Pro'} plan. Please upgrade to access this feature.`,
          {
            duration: 6000,
          }
        )
      }
      return
    }

    setError(null)
    setIsGenerating(true)
    setProgress(10)

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: originalPrompt || currentPrompt.trim(),
          style: 'professional',
          skipEnhancement: true, // We already enhanced if we have enhancedPrompt
          enhancedPrompt: finalPrompt,
          aspectRatio: selectedAspectRatio.ratio  // Use .ratio ("1:1") instead of .value ("1-1")
        }),
      })

      setProgress(80)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image')
      }

      setGeneratedImage(data.photoshoot)
      setStep('generated')
      setProgress(100)
      
      // Notify parent component
      if (onImageGenerated) {
        onImageGenerated(data.photoshoot)
      }

      toast.success('Image generated successfully!')
      
      // Refresh usage count after successful generation
      refreshUsage()

    } catch (error) {
      console.error('Generation error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate image'
      
      // Handle specific error types with better UX
      if (errorMessage.includes('aspect ratio') && errorMessage.includes('plan')) {
        // Aspect ratio limitation error
        const aspectLabel = selectedAspectRatio.label
        toast.error(
          `⭐ ${aspectLabel} aspect ratio is a premium feature`,
          {
            description: 'Upgrade to Pro to unlock all aspect ratios and generate stunning images in any format!',
            duration: 8000,
            action: {
              label: 'View Plans',
              onClick: () => {
                window.open('/pricing', '_blank')
              },
            },
          }
        )
      } else if (errorMessage.includes('monthly limit') || errorMessage.includes('images this month') || errorMessage.includes('reached your limit')) {
        // Monthly limit exceeded error
        const planName = planStatus.plan.name || 'Free'
        toast.error(
          `📸 Monthly image limit reached!`,
          {
            description: planName === 'Free' 
              ? 'You\'ve used all your free images this month. Upgrade to Pro for 15 images/month!' 
              : 'You\'ve reached your monthly limit. Consider upgrading for more images.',
            duration: 8000,
            action: {
              label: 'Upgrade Now',
              onClick: () => {
                window.open('/pricing', '_blank')
              },
            },
          }
        )
      } else {
        // Show other errors normally with better formatting
        toast.error(
          'Image generation failed',
          {
            description: errorMessage,
            duration: 6000,
          }
        )
      }
      
      setError(errorMessage)
    } finally {
      setIsGenerating(false)
      setProgress(0)
    }
  }


  const generateImageUrl = useCallback((originalUrl: string, isGrayscale = false, format = 'jpg') => {
    const transformations = []
    
    // Add grayscale transformation first for proper ImageKit processing
    if (isGrayscale) {
      transformations.push('e-grayscale')
    }
    
    // Add format transformation
    if (format !== 'jpg') {
      transformations.push(`f-${format}`)
    } else {
      transformations.push('f-jpg,q-80') // JPEG with quality optimization
    }
    
    const transformString = transformations.join(',')
    
    // Generate URL with proper cache-busting via timestamp - always fresh
    const timestamp = Date.now() + Math.random() * 1000
    const separator = originalUrl.includes('?') ? '&' : '?'
    
    let finalUrl: string
    if (transformString) {
      finalUrl = `${originalUrl}${separator}tr=${transformString}&v=${Math.floor(timestamp)}`
    } else {
      finalUrl = `${originalUrl}${separator}v=${Math.floor(timestamp)}`
    }
    
    // Debug logging
    console.log('🎨 ImageKit URL Generation:', {
      originalUrl,
      isGrayscale,
      format,
      transformations,
      finalUrl
    })
    
    return finalUrl
  }, [])

  const handleDownloadImage = async (image: GeneratedImage, isGrayscale = false, format: 'jpg' | 'webp' | 'png' = 'jpg') => {
    try {
      let downloadUrl: string;
      
      console.log('🔽 AI Generator Download request:', { isGrayscale, format, hasBwUrls: !!image.bwUrls?.original });
      
      if (isGrayscale && image.bwUrls?.original) {
        // Use pre-generated B&W URL if available
        downloadUrl = image.bwUrls.original;
        
        // Apply format transformation if needed
        if (format !== 'jpg') {
          const separator = downloadUrl.includes('?') ? '&' : '?'
          downloadUrl = `${downloadUrl}${separator}tr=f-${format}`
        }
        
        console.log('✅ Using B&W URL:', downloadUrl);
      } else {
        // Generate download URL with proper transformations
        downloadUrl = image.responsiveUrls?.original || image.imageUrl
        const transformations = []
        
        if (isGrayscale) {
          transformations.push('e-grayscale')
        }
        
        if (format !== 'jpg') {
          transformations.push(`f-${format}`)
        } else {
          transformations.push('f-jpg,q-90') // Higher quality for download
        }
        
        if (transformations.length > 0) {
          const transformString = transformations.join(',')
          const separator = downloadUrl.includes('?') ? '&' : '?'
          downloadUrl = `${downloadUrl}${separator}tr=${transformString}`
        }
        
        console.log(isGrayscale ? '🔄 Using fallback B&W transformation:' : '📷 Using original URL:', downloadUrl);
      }
      
      const response = await fetch(downloadUrl, {
        mode: 'cors'
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      
      const formatExt = format === 'jpg' ? 'jpg' : format
      const grayscaleLabel = isGrayscale ? '-bw' : ''
      a.download = `ai-photoshoot${grayscaleLabel}-${Date.now()}.${formatExt}`
      
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

  const handleProceedToSizeSelection = () => {
    setEnhancedPrompt(tempEnhancedPrompt)
    setIsEditingEnhanced(false)
    setStep('size-selection')
  }

  const handleEditEnhancedPrompt = () => {
    setIsEditingEnhanced(true)
  }

  const handleSaveEnhancedEdit = () => {
    setEnhancedPrompt(tempEnhancedPrompt)
    setIsEditingEnhanced(false)
  }

  const handleCancelEnhancedEdit = () => {
    setTempEnhancedPrompt(enhancedPrompt)
    setIsEditingEnhanced(false)
  }

  const handleStartOver = () => {
    setCurrentPrompt('')
    setEnhancedPrompt('')
    setOriginalPrompt('')
    setTempEnhancedPrompt('')
    setGeneratedImage(null)
    setStep('input')
    setError(null)
    setSelectedFormat('jpg')
    setIsEditingEnhanced(false)
    // Reset to default aspect ratio
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

  const quickIdeas = [
    'Professional headshots with soft lighting',
    'Fashion portrait with dramatic shadows',
    'Corporate executive photos',
    'Creative artistic lifestyle shots',
    'Product photography with clean background'
  ]

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
          AI Image Generation
        </h2>
        <p className="text-gray-600">
          Create stunning professional images with our 2-step AI workflow
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-6">
        
        {/* Progress Bar */}
        {(isEnhancing || isGenerating) && (
          <div className="mb-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>
                  {isEnhancing ? 'Enhancing your prompt...' : 'Generating your image...'}
                </span>
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
          
          {/* Step 1: Input Prompt */}
          {step === 'input' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Wand2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Step 1: Enter Your Prompt</h3>
                <p className="text-gray-600">Describe the image you want to create</p>
              </div>

              <div className="relative">
                <Textarea
                  value={currentPrompt}
                  onChange={(e) => setCurrentPrompt(e.target.value)}
                  placeholder="Describe the photoshoot you'd like me to create... (e.g., Professional headshots with soft lighting)"
                  className="min-h-[120px] text-base border border-gray-200 shadow-sm resize-none bg-white rounded-xl p-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  disabled={isEnhancing || isGenerating}
                />
              </div>

              {/* Usage Display */}
              {!planLoading && planStatus && (
                <div className="bg-gray-50 border rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Monthly Images</span>
                    <span className="font-medium">
                      {planStatus.usage.currentPeriodImages} of {planStatus.plan.maxImagesPerMonth === -1 ? '∞' : planStatus.plan.maxImagesPerMonth}
                    </span>
                  </div>
                  {planStatus.plan.maxImagesPerMonth !== -1 && (
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          planStatus.usage.currentPeriodImages >= planStatus.plan.maxImagesPerMonth 
                            ? 'bg-red-500' 
                            : 'bg-gradient-to-r from-purple-500 to-pink-500'
                        }`}
                        style={{ 
                          width: `${Math.min(100, (planStatus.usage.currentPeriodImages / planStatus.plan.maxImagesPerMonth) * 100)}%` 
                        }}
                      ></div>
                    </div>
                  )}
                  {!planStatus.canGenerateImage && (
                    <div className="mt-2 text-xs text-red-600">
                      You've reached your monthly limit. Upgrade for more images!
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={handleEnhancePrompt}
                  disabled={!currentPrompt.trim() || isEnhancing || isGenerating || !planStatus?.canGenerateImage}
                  variant="outline"
                  className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 flex-1"
                >
                  {isEnhancing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  Enhance Prompt
                </Button>
                <Button
                  onClick={() => handleGenerateImage(currentPrompt)}
                  disabled={!currentPrompt.trim() || isEnhancing || isGenerating || !planStatus?.canGenerateImage}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex-1"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Generate Image
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Enhanced Prompt Editing */}
          {step === 'enhanced-edit' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Step 2: Review & Edit Enhanced Prompt</h3>
                <p className="text-gray-600">Your prompt has been enhanced. You can edit it or proceed as-is.</p>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4">
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700 text-sm">Original Prompt:</span>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg text-gray-600 italic text-sm">
                      &ldquo;{originalPrompt}&rdquo;
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-emerald-700 text-sm">Enhanced Prompt:</span>
                      {!isEditingEnhanced && (
                        <Button
                          onClick={handleEditEnhancedPrompt}
                          size="sm"
                          variant="outline"
                          className="border-emerald-300 text-emerald-600 hover:bg-emerald-50"
                        >
                          <Edit3 className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                      )}
                    </div>
                    
                    {isEditingEnhanced ? (
                      <div className="space-y-3">
                        <Textarea
                          value={tempEnhancedPrompt}
                          onChange={(e) => setTempEnhancedPrompt(e.target.value)}
                          className="min-h-[100px] text-sm border-emerald-300 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="Edit your enhanced prompt..."
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={handleSaveEnhancedEdit}
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Save Changes
                          </Button>
                          <Button
                            onClick={handleCancelEnhancedEdit}
                            size="sm"
                            variant="outline"
                            className="border-gray-300"
                          >
                            <X className="w-3 h-3 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-1 p-3 bg-emerald-50 rounded-lg text-emerald-800 font-medium text-sm">
                        &ldquo;{tempEnhancedPrompt}&rdquo;
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleStartOver}
                  variant="outline"
                  className="border-gray-200 text-gray-600 hover:bg-gray-50"
                  disabled={isEditingEnhanced}
                >
                  Start Over
                </Button>
                <Button
                  onClick={handleProceedToSizeSelection}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white flex-1"
                  disabled={isEditingEnhanced}
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Proceed to Size Selection
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Size Selection */}
          {step === 'size-selection' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Step 3: Choose Image Size</h3>
                <p className="text-gray-600">Select your preferred aspect ratio for the generated image</p>
              </div>

              {/* Enhanced Prompt Display */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 mb-6">
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700 text-sm">Your Enhanced Prompt:</span>
                    <div className="mt-1 p-3 bg-emerald-50 rounded-lg text-emerald-800 font-medium text-sm">
                      &ldquo;{tempEnhancedPrompt || enhancedPrompt}&rdquo;
                    </div>
                  </div>
                </div>
              </div>

              {/* Aspect Ratio Selection */}
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <h4 className="font-medium text-gray-700">Choose Your Platform:</h4>
                  <p className="text-xs text-gray-500">Select the aspect ratio based on where you&apos;ll use the image</p>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  {aspectRatios.map((ratio) => {
                    const isLocked = !planStatus.plan.allowedAspectRatios.includes(ratio.ratio)
                    const isPremium = ratio.ratio !== '1:1'
                    
                    
                    return (
                    <button
                      key={ratio.value}
                      onClick={() => {
                        if (isLocked) {
                          // Show upgrade prompt instead of selecting locked ratio
                          toast.error(
                            `🔒 ${ratio.label} is a ${planStatus.plan.name === 'Free' ? 'Pro' : 'Premium'} feature`,
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
                  onClick={() => handleGenerateImage(tempEnhancedPrompt || enhancedPrompt)}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex-1"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Generate {selectedAspectRatio.description} Image ({selectedAspectRatio.label})
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Enhanced Prompt (Legacy - keeping for direct generation) */}
          {step === 'enhanced' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Step 3: Enhanced Prompt Ready!</h3>
                <p className="text-gray-600">Your prompt has been enhanced for better results</p>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4">
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700 text-sm">Original:</span>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg text-gray-600 italic text-sm">
                      &ldquo;{originalPrompt}&rdquo;
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-emerald-700 text-sm">Enhanced:</span>
                    <div className="mt-1 p-3 bg-emerald-50 rounded-lg text-emerald-800 font-medium text-sm">
                      &ldquo;{enhancedPrompt}&rdquo;
                    </div>
                  </div>
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
                  onClick={() => handleGenerateImage(enhancedPrompt)}
                  disabled={isGenerating || !planStatus?.canGenerateImage}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white flex-1"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Generate Image with Enhanced Prompt
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Generated Image */}
          {step === 'generated' && generatedImage && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Your {selectedAspectRatio.description} Image is Ready!</h3>
                <p className="text-gray-600">Generated in {selectedAspectRatio.label} aspect ratio</p>
              </div>

              {/* Image Preview */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">

                {/* Image Display */}
                <div className="relative">
                  <img
                    key={`image-${generatedImage.id}-original`}
                    src={generatedImage.responsiveUrls?.medium || generatedImage.imageUrl}
                    alt="Generated photoshoot"
                    className="w-full object-cover hover:scale-105 transition-all duration-500"
                    crossOrigin="anonymous"
                    loading="eager"
                    onLoad={() => {
                      // Image loaded successfully
                    }}
                    onError={(e) => {
                      console.error('❌ Image failed to load:', e.currentTarget.src)
                      // Fallback to original image
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
                        {selectedAspectRatio.label} {selectedAspectRatio.description}
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

                    {/* Download Button */}
                    <Button
                      onClick={() => handleDownloadImage(generatedImage, false, selectedFormat)}
                      size="sm"
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download {formatOptions.find(f => f.value === selectedFormat)?.label}
                    </Button>
                    
                    <Button
                      onClick={handleStartOver}
                      size="sm"
                      variant="outline"
                      className="w-full"
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      Create Another
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Quick Ideas - Only show in input step */}
        {step === 'input' && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <p className="text-sm font-medium text-gray-700">Quick Ideas:</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickIdeas.map((idea, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPrompt(idea)}
                  disabled={isEnhancing || isGenerating}
                  className="text-sm px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 text-purple-700 hover:text-purple-800 rounded-full border border-purple-200 transition-all duration-200 disabled:opacity-50 hover:shadow-md"
                >
                  {idea}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}