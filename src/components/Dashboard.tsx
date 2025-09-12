'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import DashboardHeader from './DashboardHeader'
import DashboardSidebar from './DashboardSidebar'
import AIPhotoshootGenerator from './AIPhotoshootGenerator'
import ImageUploadArea from './ImageUploadArea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  Sparkles, 
  Image as ImageIcon, 
  Upload,
  Wand2,
  History
} from 'lucide-react'

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

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('create')
  const [recentImages, setRecentImages] = useState<GeneratedImage[]>([])
  const { user } = useUser()

  const handleImageGenerated = (image: GeneratedImage) => {
    setRecentImages(prev => [image, ...prev.slice(0, 9)]) // Keep last 10 images
  }

  const handleImagesUploaded = (images: any[]) => {
    // Convert uploaded images to the same format for consistency
    const convertedImages = images.map(image => ({
      id: image.id,
      imageUrl: image.imageUrl,
      thumbnailUrl: image.thumbnailUrl,
      responsiveUrls: image.responsiveUrls,
      originalPrompt: `Uploaded: ${image.fileName}`,
      enhancedPrompt: '',
      style: 'upload',
      createdAt: image.uploadedAt
    }))
    setRecentImages(prev => [...convertedImages, ...prev].slice(0, 10))
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

            {/* Main Content Tabs */}
            <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8 bg-white/80 backdrop-blur-sm">
                <TabsTrigger value="create" className="flex items-center gap-2">
                  <Wand2 className="w-4 h-4" />
                  Create
                </TabsTrigger>
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload
                </TabsTrigger>
                <TabsTrigger value="gallery" className="flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Gallery
                </TabsTrigger>
              </TabsList>

              {/* AI Photoshoot Generator */}
              <TabsContent value="create">
                <AIPhotoshootGenerator onImageGenerated={handleImageGenerated} />
              </TabsContent>

              {/* Image Upload Area */}
              <TabsContent value="upload">
                <ImageUploadArea onImagesUploaded={handleImagesUploaded} />
              </TabsContent>

              {/* Gallery/History */}
              <TabsContent value="gallery">
                <div className="space-y-6">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Your AI Creations
                      </h2>
                      <p className="text-gray-600">Browse your recent photoshoots and creations</p>
                    </div>

                    {recentImages.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <ImageIcon className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No images yet</h3>
                        <p className="text-gray-500 mb-6">Create your first AI photoshoot to get started!</p>
                        <div className="flex gap-3 justify-center">
                          <button
                            onClick={() => setActiveSection('create')}
                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                          >
                            Generate with AI
                          </button>
                          <button
                            onClick={() => setActiveSection('upload')}
                            className="px-4 py-2 border border-purple-200 text-purple-600 rounded-lg hover:bg-purple-50 transition-all"
                          >
                            Upload Images
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recentImages.map((image) => (
                          <div key={image.id} className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                            <div className="aspect-square overflow-hidden">
                              <img
                                src={image.responsiveUrls.medium}
                                alt={image.originalPrompt}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                                <span className="text-xs text-gray-500">
                                  {new Date(image.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                                {image.originalPrompt}
                              </p>
                              <button
                                onClick={() => {
                                  const a = document.createElement('a')
                                  a.href = image.responsiveUrls.original
                                  a.download = `photoshoot-${image.id}.jpg`
                                  a.click()
                                }}
                                className="w-full px-3 py-2 bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 rounded-lg transition-colors text-sm"
                              >
                                Download
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Feature Cards - Always visible at bottom */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="group bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/30 hover:bg-white/80 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Wand2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">AI Enhancement</h3>
                <p className="text-sm text-gray-600">Transform simple prompts into professional photography briefs with Google Search integration</p>
              </div>

              <div className="group bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/30 hover:bg-white/80 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Smart Upload</h3>
                <p className="text-sm text-gray-600">Upload and enhance your existing photos with AI-powered processing and optimization</p>
              </div>

              <div className="group bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/30 hover:bg-white/80 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Professional Results</h3>
                <p className="text-sm text-gray-600">Get magazine-quality images optimized for all platforms with responsive delivery</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}