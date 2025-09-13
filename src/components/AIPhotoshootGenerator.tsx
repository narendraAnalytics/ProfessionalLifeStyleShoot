'use client'

import React, { useState } from 'react'
import { useUser } from '@clerk/nextjs'
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
  Image as ImageIcon
} from 'lucide-react'
import { toast } from 'sonner'

interface GeneratedImage {
  id: string
  imageUrl: string
  thumbnailUrl: string
  responsiveUrls: {
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
    icon: '⬜'
  })
  
  // UI state
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<'input' | 'enhanced' | 'size-selection' | 'generated'>('input')
  const [showGrayscale, setShowGrayscale] = useState(false)
  const { user } = useUser()

  // Aspect ratio options
  const aspectRatios: AspectRatio[] = [
    {
      label: '1:1',
      value: '1-1',
      ratio: '1:1',
      description: 'Square',
      icon: '⬜'
    },
    {
      label: '16:9',
      value: '16-9',
      ratio: '16:9',
      description: 'Landscape',
      icon: '▭'
    },
    {
      label: '9:16',
      value: '9-16',
      ratio: '9:16',
      description: 'Portrait',
      icon: '▯'
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
      setStep('size-selection')
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
    const finalPrompt = promptToUse || enhancedPrompt || currentPrompt.trim()
    
    if (!finalPrompt) {
      toast.error('Please enter a prompt or enhance one first')
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
          aspectRatio: selectedAspectRatio.value
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

    } catch (error) {
      console.error('Generation error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate image'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsGenerating(false)
      setProgress(0)
    }
  }

  const handleDownloadImage = async (image: GeneratedImage, isGrayscale = false) => {
    try {
      const imageUrl = isGrayscale 
        ? generateGrayscaleUrl(image.responsiveUrls.original || image.imageUrl)
        : (image.responsiveUrls.original || image.imageUrl)
      
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ai-photoshoot${isGrayscale ? '-grayscale' : ''}-${Date.now()}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success(`${isGrayscale ? 'Grayscale' : 'Original'} image downloaded successfully!`)
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download image')
    }
  }

  const generateGrayscaleUrl = (originalUrl: string) => {
    // Add grayscale transformation to ImageKit URL
    if (originalUrl.includes('?')) {
      return originalUrl.replace('?', '?tr=e-grayscale,')
    } else {
      return `${originalUrl}?tr=e-grayscale`
    }
  }

  const handleStartOver = () => {
    setCurrentPrompt('')
    setEnhancedPrompt('')
    setOriginalPrompt('')
    setGeneratedImage(null)
    setStep('input')
    setError(null)
    setShowGrayscale(false)
    // Reset to default aspect ratio
    setSelectedAspectRatio({
      label: '1:1',
      value: '1-1',
      ratio: '1:1',
      description: 'Square',
      icon: '⬜'
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

              <div className="flex gap-3">
                <Button
                  onClick={handleEnhancePrompt}
                  disabled={!currentPrompt.trim() || isEnhancing || isGenerating}
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
                  disabled={!currentPrompt.trim() || isEnhancing || isGenerating}
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

          {/* Step 2: Size Selection */}
          {step === 'size-selection' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Step 2: Choose Image Size</h3>
                <p className="text-gray-600">Select your preferred aspect ratio for the generated image</p>
              </div>

              {/* Enhanced Prompt Display */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 mb-6">
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700 text-sm">Your Enhanced Prompt:</span>
                    <div className="mt-1 p-3 bg-emerald-50 rounded-lg text-emerald-800 font-medium text-sm">
                      "{enhancedPrompt}"
                    </div>
                  </div>
                </div>
              </div>

              {/* Aspect Ratio Selection */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700 text-center">Choose Aspect Ratio:</h4>
                <div className="grid grid-cols-3 gap-4">
                  {aspectRatios.map((ratio) => (
                    <button
                      key={ratio.value}
                      onClick={() => setSelectedAspectRatio(ratio)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                        selectedAspectRatio.value === ratio.value
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-2xl">{ratio.icon}</div>
                      <div className="font-medium">{ratio.label}</div>
                      <div className="text-sm text-gray-500">{ratio.description}</div>
                      <div className="text-xs text-gray-400">{ratio.ratio}</div>
                    </button>
                  ))}
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
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Step 2: Enhanced Prompt Ready!</h3>
                <p className="text-gray-600">Your prompt has been enhanced for better results</p>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4">
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700 text-sm">Original:</span>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg text-gray-600 italic text-sm">
                      "{originalPrompt}"
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-emerald-700 text-sm">Enhanced:</span>
                    <div className="mt-1 p-3 bg-emerald-50 rounded-lg text-emerald-800 font-medium text-sm">
                      "{enhancedPrompt}"
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
                  disabled={isGenerating}
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

              {/* Image Preview Toggle */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-center gap-2">
                    <Button
                      onClick={() => setShowGrayscale(false)}
                      size="sm"
                      variant={!showGrayscale ? "default" : "outline"}
                      className={!showGrayscale ? "bg-blue-600 text-white" : ""}
                    >
                      Original
                    </Button>
                    <Button
                      onClick={() => setShowGrayscale(true)}
                      size="sm"
                      variant={showGrayscale ? "default" : "outline"}
                      className={showGrayscale ? "bg-gray-600 text-white" : ""}
                    >
                      Grayscale
                    </Button>
                  </div>
                </div>

                {/* Before/After Image Display */}
                {!showGrayscale ? (
                  <div className="relative">
                    <img
                      src={generatedImage.responsiveUrls?.medium || generatedImage.imageUrl}
                      alt="Generated photoshoot - Original"
                      className="w-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        console.error('❌ Image failed to load:', e.currentTarget.src)
                        if (e.currentTarget.src !== generatedImage.imageUrl) {
                          e.currentTarget.src = generatedImage.imageUrl
                        }
                      }}
                    />
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium">
                        Original
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={generateGrayscaleUrl(generatedImage.responsiveUrls?.medium || generatedImage.imageUrl)}
                      alt="Generated photoshoot - Grayscale"
                      className="w-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 bg-gray-600 text-white rounded text-xs font-medium">
                        Grayscale
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-4">
                  <div className="text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {selectedAspectRatio.label} {selectedAspectRatio.description}
                      </span>
                    </div>
                    <span className="font-medium">Generated from:</span> "{generatedImage.originalPrompt}"
                    {generatedImage.enhancedPrompt && (
                      <div className="mt-1">
                        <span className="font-medium text-emerald-600">Enhanced:</span> "{generatedImage.enhancedPrompt}"
                      </div>
                    )}
                  </div>
                  
                  {/* Download Options */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700 mb-2">Download Options:</div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => handleDownloadImage(generatedImage, false)}
                        size="sm"
                        variant="outline"
                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Original
                      </Button>
                      <Button
                        onClick={() => handleDownloadImage(generatedImage, true)}
                        size="sm"
                        variant="outline"
                        className="border-gray-200 text-gray-600 hover:bg-gray-50"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Grayscale
                      </Button>
                    </div>
                    
                    <Button
                      onClick={handleStartOver}
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white w-full mt-3"
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