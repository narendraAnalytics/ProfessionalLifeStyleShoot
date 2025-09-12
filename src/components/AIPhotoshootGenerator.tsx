'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Progress } from './ui/progress'
import { 
  Sparkles, 
  Send, 
  Wand2, 
  Image as ImageIcon, 
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Loader2
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

export default function AIPhotoshootGenerator({ onImageGenerated }: AIPhotoshootGeneratorProps) {
  const [prompt, setPrompt] = useState('')
  const [enhancedPrompt, setEnhancedPrompt] = useState('')
  const [currentStep, setCurrentStep] = useState<'input' | 'enhancing' | 'generating' | 'completed'>('input')
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [credits, setCredits] = useState<number | null>(null)
  const { user } = useUser()

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt first')
      return
    }

    setError(null)
    setCurrentStep('enhancing')
    setProgress(20)

    try {
      const response = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to enhance prompt')
      }

      setEnhancedPrompt(data.enhancedPrompt)
      setCredits(data.remainingCredits)
      setProgress(40)
      setCurrentStep('input') // Return to input state but with enhanced prompt
      toast.success('Prompt enhanced successfully!')

    } catch (error) {
      console.error('Enhancement error:', error)
      setError(error instanceof Error ? error.message : 'Failed to enhance prompt')
      setCurrentStep('input')
      setProgress(0)
      toast.error(error instanceof Error ? error.message : 'Failed to enhance prompt')
    }
  }

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt first')
      return
    }

    setError(null)
    setCurrentStep('generating')
    setProgress(60)

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: prompt.trim(),
          enhancedPrompt: enhancedPrompt,
          style: 'professional',
          skipEnhancement: !!enhancedPrompt
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image')
      }

      setGeneratedImage(data.photoshoot)
      setCredits(data.remainingCredits)
      setProgress(100)
      setCurrentStep('completed')
      
      // Notify parent component
      if (onImageGenerated) {
        onImageGenerated(data.photoshoot)
      }

      toast.success('Image generated successfully!')

    } catch (error) {
      console.error('Generation error:', error)
      setError(error instanceof Error ? error.message : 'Failed to generate image')
      setCurrentStep('input')
      setProgress(0)
      toast.error(error instanceof Error ? error.message : 'Failed to generate image')
    }
  }

  const handleGenerateWithEnhancement = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt first')
      return
    }

    setError(null)
    setCurrentStep('enhancing')
    setProgress(10)

    try {
      // Generate image directly (API will handle enhancement)
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: prompt.trim(),
          style: 'professional',
          skipEnhancement: false
        }),
      })

      setProgress(80)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image')
      }

      setGeneratedImage(data.photoshoot)
      setEnhancedPrompt(data.photoshoot.enhancedPrompt)
      setCredits(data.remainingCredits)
      setProgress(100)
      setCurrentStep('completed')
      
      // Notify parent component
      if (onImageGenerated) {
        onImageGenerated(data.photoshoot)
      }

      toast.success('Image generated successfully!')

    } catch (error) {
      console.error('Generation error:', error)
      setError(error instanceof Error ? error.message : 'Failed to generate image')
      setCurrentStep('input')
      setProgress(0)
      toast.error(error instanceof Error ? error.message : 'Failed to generate image')
    }
  }

  const handleStartOver = () => {
    setPrompt('')
    setEnhancedPrompt('')
    setGeneratedImage(null)
    setCurrentStep('input')
    setProgress(0)
    setError(null)
  }

  const handleDownload = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ai-photoshoot-${Date.now()}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('Image downloaded successfully!')
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download image')
    }
  }

  const isLoading = currentStep === 'enhancing' || currentStep === 'generating'

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          AI Photoshoot Generator
        </h2>
        <p className="text-gray-600 mb-4">
          Create stunning professional photoshoots with AI-powered enhancement
        </p>
        {credits !== null && (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            <Sparkles className="w-4 h-4" />
            {credits} credits remaining
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {isLoading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>
              {currentStep === 'enhancing' ? 'Enhancing prompt...' : 'Generating image...'}
            </span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Input Section */}
      {currentStep !== 'completed' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="space-y-6">
            {/* Main Prompt Input */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Describe your perfect photoshoot
              </label>
              <div className="relative">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Professional headshots with soft lighting and modern background..."
                  className="min-h-[120px] text-lg border-0 shadow-none resize-none bg-gray-50/80 rounded-xl p-4 focus:bg-white transition-colors pr-16"
                  disabled={isLoading}
                />
                <div className="absolute bottom-4 right-4">
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                  ) : (
                    <Wand2 className="w-5 h-5 text-purple-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Prompt Display */}
            {enhancedPrompt && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-green-700">
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  Enhanced Prompt
                </label>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
                  {enhancedPrompt}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {!enhancedPrompt ? (
                <>
                  <Button
                    onClick={handleEnhancePrompt}
                    disabled={!prompt.trim() || isLoading}
                    variant="outline"
                    className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 flex-1"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Enhance Prompt (1 credit)
                  </Button>
                  <Button
                    onClick={handleGenerateWithEnhancement}
                    disabled={!prompt.trim() || isLoading}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex-1"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Enhance & Generate (3 credits)
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleGenerateImage}
                  disabled={!prompt.trim() || isLoading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex-1"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Generate Image (2 credits)
                </Button>
              )}
            </div>

            {/* Quick Ideas */}
            <div className="pt-4 border-t border-gray-200/50">
              <p className="text-sm text-gray-500 mb-3">Quick Ideas:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Professional headshots with soft lighting',
                  'Fashion portrait with dramatic shadows',
                  'Corporate executive photos',
                  'Creative artistic lifestyle shots',
                  'Product photography with clean background'
                ].map((idea, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(idea)}
                    disabled={isLoading}
                    className="text-sm px-3 py-1 bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 rounded-full transition-colors duration-200 disabled:opacity-50"
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {currentStep === 'completed' && generatedImage && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="text-center space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900">
              Your AI Photoshoot is Ready! 🎉
            </h3>
            
            {/* Generated Image */}
            <div className="relative inline-block rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={generatedImage.responsiveUrls.medium}
                alt="Generated photoshoot"
                className="max-w-full max-h-96 object-cover"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => handleDownload(generatedImage.responsiveUrls.original)}
                variant="outline"
                className="border-green-200 text-green-600 hover:bg-green-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Original
              </Button>
              <Button
                onClick={handleStartOver}
                variant="outline"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Create Another
              </Button>
            </div>

            {/* Prompt Display */}
            <div className="text-left space-y-3 bg-gray-50 p-4 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Your Original Prompt:</h4>
                <p className="text-sm text-gray-600">{generatedImage.originalPrompt}</p>
              </div>
              {generatedImage.enhancedPrompt && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Enhanced Prompt:</h4>
                  <p className="text-sm text-gray-600">{generatedImage.enhancedPrompt}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}