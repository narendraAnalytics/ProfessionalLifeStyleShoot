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
  RefreshCw,
  AlertCircle,
  Loader2,
  MessageSquare,
  Plus
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

interface ChatMessage {
  id: string
  type: 'user' | 'assistant' | 'image' | 'system' | 'enhanced-prompt'
  content: string
  timestamp: Date
  image?: GeneratedImage
  isTyping?: boolean
  enhancedPrompt?: string
  originalPrompt?: string
}

interface Conversation {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
}

interface AIPhotoshootGeneratorProps {
  onImageGenerated?: (image: GeneratedImage) => void
}

export default function AIPhotoshootGenerator({ onImageGenerated }: AIPhotoshootGeneratorProps) {
  // Multi-chat state
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [currentPrompt, setCurrentPrompt] = useState('')
  
  // UI state
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState<'enhancing' | 'generating'>('enhancing')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [credits, setCredits] = useState<number | null>(null)
  const [showSidebar, setShowSidebar] = useState(true)
  const { user } = useUser()

  // Get active conversation
  const activeConversation = conversations.find(conv => conv.id === activeConversationId)

  // Helper functions for managing conversations
  const createNewConversation = (title: string = 'New Photoshoot'): string => {
    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
    const newConversation: Conversation = {
      id: conversationId,
      title,
      messages: [{
        id: `msg_${Date.now()}_1`,
        type: 'system',
        content: 'Welcome! Describe the photoshoot you\'d like me to create for you.',
        timestamp: new Date()
      }],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    setConversations(prev => [newConversation, ...prev])
    setActiveConversationId(conversationId)
    return conversationId
  }

  const addMessageToConversation = (conversationId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
    const newMessage: ChatMessage = {
      ...message,
      id: messageId,
      timestamp: new Date()
    }

    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { 
            ...conv, 
            messages: [...conv.messages, newMessage],
            updatedAt: new Date()
          }
        : conv
    ))
    
    return messageId
  }

  const updateMessage = (conversationId: string, messageId: string, updates: Partial<ChatMessage>) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? {
            ...conv,
            messages: conv.messages.map(msg => 
              msg.id === messageId ? { ...msg, ...updates } : msg
            ),
            updatedAt: new Date()
          }
        : conv
    ))
  }

  const handleEnhancePrompt = async (message: string) => {
    if (!message.trim()) {
      toast.error('Please enter a message')
      return
    }

    // Ensure we have an active conversation
    let conversationId = activeConversationId
    if (!conversationId) {
      const title = message.length > 30 ? message.substring(0, 30) + '...' : message
      conversationId = createNewConversation(title)
    }

    // Add user message
    addMessageToConversation(conversationId, {
      type: 'user',
      content: message
    })

    // Clear current prompt
    setCurrentPrompt('')
    setError(null)
    setIsProcessing(true)
    setProcessingStep('enhancing')
    setProgress(10)

    // Add assistant thinking message
    const thinkingMessageId = addMessageToConversation(conversationId, {
      type: 'assistant',
      content: 'Enhancing your prompt...',
      isTyping: true
    })

    try {
      const response = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: message.trim()
        }),
      })

      setProgress(80)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to enhance prompt')
      }

      // Update thinking message to completion
      updateMessage(conversationId, thinkingMessageId, {
        content: 'Here\'s your enhanced prompt!',
        isTyping: false
      })

      // Add enhanced prompt message
      addMessageToConversation(conversationId, {
        type: 'enhanced-prompt',
        content: `Enhanced: "${data.enhancedPrompt}"`,
        originalPrompt: data.originalPrompt,
        enhancedPrompt: data.enhancedPrompt
      })

      setCredits(data.remainingCredits)
      setProgress(100)
      
      toast.success('Prompt enhanced successfully!')

    } catch (error) {
      console.error('Enhancement error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to enhance prompt'
      
      // Update thinking message with error
      updateMessage(conversationId, thinkingMessageId, {
        content: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
        isTyping: false
      })
      
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  const handleSendMessage = async (message: string, withEnhancement: boolean = false, preEnhancedPrompt?: string) => {
    if (!message.trim()) {
      toast.error('Please enter a message')
      return
    }

    // Ensure we have an active conversation
    let conversationId = activeConversationId
    if (!conversationId) {
      const title = message.length > 30 ? message.substring(0, 30) + '...' : message
      conversationId = createNewConversation(title)
    }

    // Add user message
    addMessageToConversation(conversationId, {
      type: 'user',
      content: message
    })

    // Clear current prompt
    setCurrentPrompt('')
    setError(null)
    setIsProcessing(true)
    setProcessingStep('enhancing')
    setProgress(10)

    // Add assistant thinking message
    const thinkingMessageId = addMessageToConversation(conversationId, {
      type: 'assistant',
      content: withEnhancement ? 'Enhancing your prompt and generating image...' : 'Generating your photoshoot...',
      isTyping: true
    })

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: message.trim(),
          style: 'professional',
          skipEnhancement: !withEnhancement,
          enhancedPrompt: preEnhancedPrompt
        }),
      })

      setProgress(80)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image')
      }

      // Update thinking message to completion
      updateMessage(conversationId, thinkingMessageId, {
        content: 'Here\'s your generated photoshoot!',
        isTyping: false
      })

      // Add image message
      addMessageToConversation(conversationId, {
        type: 'image',
        content: `Generated from: "${data.photoshoot.originalPrompt}"${data.photoshoot.enhancedPrompt ? ` (Enhanced: "${data.photoshoot.enhancedPrompt}")` : ''}`,
        image: data.photoshoot
      })

      setCredits(data.remainingCredits)
      setProgress(100)
      
      // Notify parent component
      if (onImageGenerated) {
        onImageGenerated(data.photoshoot)
      }

      toast.success('Image generated successfully!')

    } catch (error) {
      console.error('Generation error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate image'
      
      // Update thinking message with error
      updateMessage(conversationId, thinkingMessageId, {
        content: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
        isTyping: false
      })
      
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  // Initialize with first conversation on component mount
  React.useEffect(() => {
    if (conversations.length === 0) {
      createNewConversation('Welcome to AI Photoshoot')
    }
  }, [])

  const handleStartNewChat = () => {
    createNewConversation('New Photoshoot')
  }

  const handleDownloadImage = async (image: GeneratedImage) => {
    try {
      const response = await fetch(image.responsiveUrls.original || image.imageUrl)
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

  const quickIdeas = [
    'Professional headshots with soft lighting',
    'Fashion portrait with dramatic shadows',
    'Corporate executive photos',
    'Creative artistic lifestyle shots',
    'Product photography with clean background'
  ]

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[90vh] max-w-7xl mx-auto p-4">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="lg:hidden mb-4 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      >
        <MessageSquare className="w-4 h-4" />
        {showSidebar ? 'Hide' : 'Show'} Conversations
      </button>

      {/* Conversations Sidebar */}
      <div className={`${showSidebar ? 'block' : 'hidden lg:block'} w-full lg:w-80 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-4 flex-shrink-0`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Conversations</h3>
          <Button 
            onClick={handleStartNewChat}
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            <Plus className="w-4 h-4 mr-1" />
            New Chat
          </Button>
        </div>
        
        <div className="space-y-2 flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-8">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-gray-500 text-sm">No conversations yet</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setActiveConversationId(conv.id)}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  activeConversationId === conv.id 
                    ? 'bg-purple-100 border-2 border-purple-300 shadow-sm' 
                    : 'hover:bg-gray-50 border border-gray-200 hover:shadow-sm'
                }`}
              >
                <div className="font-medium text-sm text-gray-800 mb-1 truncate">
                  {conv.title}
                </div>
                <div className="text-xs text-gray-500">
                  {conv.messages.length - 1} messages
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Credits Display */}
        {credits !== null && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
              <Sparkles className="w-4 h-4" />
              {credits} credits remaining
            </div>
          </div>
        )}
      </div>

      {/* Chat Interface */}
      <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {activeConversation?.title || 'AI Photoshoot Generator'}
          </h2>
          <p className="text-gray-600 text-sm">
            Create stunning professional photoshoots with AI-powered enhancement
          </p>
        </div>

        {/* Progress Bar */}
        {isProcessing && (
          <div className="p-4 border-b border-gray-200">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>
                  {processingStep === 'enhancing' ? 'Enhancing prompt...' : 'Generating image...'}
                </span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 min-h-0">
          {!activeConversation && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-4">
                <Wand2 className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Welcome to AI Photoshoot Generator</h3>
              <p className="text-gray-600 mb-4">Start a new conversation to create stunning professional photoshoots with AI</p>
              <Button
                onClick={handleStartNewChat}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Start Your First Chat
              </Button>
            </div>
          )}
          {activeConversation?.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-5 py-4 shadow-sm ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-purple-200'
                    : message.type === 'system'
                    ? 'bg-blue-50 border border-blue-200 text-blue-800'
                    : message.type === 'image'
                    ? 'bg-white border border-gray-200 shadow-lg'
                    : message.type === 'enhanced-prompt'
                    ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 shadow-lg'
                    : 'bg-gray-100 text-gray-800 border border-gray-200'
                }`}
              >
                {message.type === 'image' && message.image ? (
                  <div className="space-y-3">
                    <div className="relative rounded-xl overflow-hidden shadow-lg">
                      <img
                        src={message.image.responsiveUrls?.medium || message.image.imageUrl}
                        alt="Generated photoshoot"
                        className="w-full max-w-lg object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          console.error('❌ Image failed to load:', e.currentTarget.src)
                          if (e.currentTarget.src !== message.image!.imageUrl) {
                            e.currentTarget.src = message.image!.imageUrl
                          }
                        }}
                      />
                    </div>
                    <div className="text-sm text-gray-600">
                      {message.content}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleDownloadImage(message.image!)}
                        size="sm"
                        variant="outline"
                        className="border-green-200 text-green-600 hover:bg-green-50"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ) : message.type === 'enhanced-prompt' ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-emerald-700 font-medium">
                      <Sparkles className="w-4 h-4" />
                      Enhanced Prompt Ready
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Original:</span>
                        <div className="mt-1 p-3 bg-gray-50 rounded-lg text-gray-600 italic">
                          "{message.originalPrompt}"
                        </div>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-emerald-700">Enhanced:</span>
                        <div className="mt-1 p-3 bg-emerald-50 rounded-lg text-emerald-800 font-medium">
                          "{message.enhancedPrompt}"
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          if (message.enhancedPrompt) {
                            setCurrentPrompt(message.enhancedPrompt)
                            toast.success('Enhanced prompt added to input!')
                          }
                        }}
                        size="sm"
                        variant="outline"
                        className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                      >
                        <Wand2 className="w-4 h-4 mr-2" />
                        Use Enhanced
                      </Button>
                      <Button
                        onClick={() => {
                          if (message.enhancedPrompt && message.originalPrompt) {
                            handleSendMessage(message.originalPrompt, false, message.enhancedPrompt)
                          }
                        }}
                        size="sm"
                        className="bg-emerald-600 text-white hover:bg-emerald-700"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Generate with Enhanced (2 credits)
                      </Button>
                      <Button
                        onClick={() => {
                          if (message.originalPrompt) {
                            setCurrentPrompt(message.originalPrompt)
                            toast.success('Original prompt added to input!')
                          }
                        }}
                        size="sm"
                        variant="outline"
                        className="border-gray-200 text-gray-600 hover:bg-gray-50"
                      >
                        Use Original
                      </Button>
                    </div>
                    <div className="text-xs text-emerald-600">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-sm leading-relaxed">{message.content}</div>
                    {message.isTyping && (
                      <div className="flex items-center gap-2 text-xs opacity-70">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Thinking...</span>
                      </div>
                    )}
                    <div className="text-xs opacity-60">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 space-y-4">
          <div className="relative">
            <Textarea
              value={currentPrompt}
              onChange={(e) => setCurrentPrompt(e.target.value)}
              placeholder="Describe the photoshoot you'd like me to create... (Press Enter to send, Shift+Enter for new line)"
              className="min-h-[100px] text-base border border-gray-200 shadow-sm resize-none bg-white rounded-xl p-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-24"
              disabled={isProcessing}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage(currentPrompt, false)
                }
              }}
            />
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              {isProcessing ? (
                <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
              ) : (
                <Button
                  onClick={() => handleSendMessage(currentPrompt, false)}
                  disabled={!currentPrompt.trim() || isProcessing}
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => handleEnhancePrompt(currentPrompt)}
              disabled={!currentPrompt.trim() || isProcessing}
              variant="outline"
              className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 flex-1"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Enhance Prompt (1 credit)
            </Button>
            <Button
              onClick={() => handleSendMessage(currentPrompt, false)}
              disabled={!currentPrompt.trim() || isProcessing}
              variant="outline"
              className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 flex-1"
            >
              <Send className="w-4 h-4 mr-2" />
              Quick Generate (2 credits)
            </Button>
            <Button
              onClick={() => handleSendMessage(currentPrompt, true)}
              disabled={!currentPrompt.trim() || isProcessing}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex-1"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              ✨ Enhanced Generate (3 credits)
            </Button>
          </div>

          {/* Quick Ideas */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <p className="text-sm font-medium text-gray-700">Quick Ideas:</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickIdeas.map((idea, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPrompt(idea)}
                  disabled={isProcessing}
                  className="text-sm px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 text-purple-700 hover:text-purple-800 rounded-full border border-purple-200 transition-all duration-200 disabled:opacity-50 hover:shadow-md"
                >
                  {idea}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}