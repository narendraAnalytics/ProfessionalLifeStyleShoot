'use client'

import { useState, useRef } from 'react'
import { useUser } from '@clerk/nextjs'
import DashboardHeader from './DashboardHeader'
import DashboardSidebar from './DashboardSidebar'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { 
  Sparkles, 
  Plus, 
  Send, 
  Image as ImageIcon, 
  Upload,
  Wand2
} from 'lucide-react'

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('create')
  const [prompt, setPrompt] = useState('')
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useUser()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setUploadedImages(prev => [...prev, ...files])
  }

  const handleSubmit = () => {
    if (!prompt.trim() && uploadedImages.length === 0) return
    
    console.log('Prompt:', prompt)
    console.log('Images:', uploadedImages)
    
    // Here you would integrate with your AI service
    setPrompt('')
    setUploadedImages([])
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader />
      
      <div className="flex flex-1">
        <DashboardSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        
        <main className="flex-1 p-6 overflow-auto relative">
          {/* Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-1/4 w-64 h-64 bg-purple-400/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-400/3 rounded-full blur-3xl animate-pulse delay-2000" />
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
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

            {/* Chat Interface */}
            <div className="max-w-3xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl transition-all duration-500">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse delay-75"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse delay-150"></div>
                  <div className="flex-1 text-center">
                    <span className="text-sm font-medium text-gray-500">AI Photoshoot Generator</span>
                  </div>
                </div>

                {/* Image Upload Area */}
                {uploadedImages.length > 0 && (
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-3">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 border-2 border-dashed border-purple-300">
                            <img 
                              src={URL.createObjectURL(image)} 
                              alt={`Upload ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Area */}
                <div className="space-y-4">
                  <div className="relative">
                    <Textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe your perfect photoshoot... (e.g., 'Professional headshots with soft lighting and modern background')"
                      className="min-h-[120px] text-lg border-0 shadow-none resize-none bg-gray-50/80 rounded-xl p-4 focus:bg-white transition-colors pr-16"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                          handleSubmit()
                        }
                      }}
                    />
                    <div className="absolute bottom-4 right-4">
                      <Wand2 className="w-5 h-5 text-purple-400 animate-spin-slow" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        multiple
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Images
                      </Button>
                      <span className="text-sm text-gray-500">
                        {uploadedImages.length > 0 && `${uploadedImages.length} image${uploadedImages.length > 1 ? 's' : ''} selected`}
                      </span>
                    </div>

                    <Button
                      onClick={handleSubmit}
                      disabled={!prompt.trim() && uploadedImages.length === 0}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Generate
                    </Button>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 pt-6 border-t border-gray-200/50">
                  <p className="text-sm text-gray-500 mb-3">Quick Ideas:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Professional headshots',
                      'Fashion portraits',
                      'Lifestyle photos',
                      'Corporate shots',
                      'Creative artistic'
                    ].map((idea, index) => (
                      <button
                        key={index}
                        onClick={() => setPrompt(idea)}
                        className="text-sm px-3 py-1 bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 rounded-full transition-colors duration-200"
                      >
                        {idea}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="group bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/30 hover:bg-white/80 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Upload & Transform</h3>
                <p className="text-sm text-gray-600">Upload your photos and transform them with AI-powered enhancements</p>
              </div>

              <div className="group bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/30 hover:bg-white/80 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Wand2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">AI Magic</h3>
                <p className="text-sm text-gray-600">Professional-quality results powered by advanced AI technology</p>
              </div>

              <div className="group bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/30 hover:bg-white/80 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Instant Results</h3>
                <p className="text-sm text-gray-600">Get stunning professional photoshoots in seconds, not hours</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}