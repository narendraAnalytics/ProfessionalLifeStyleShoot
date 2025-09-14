import { Sparkles, Wand2, Camera } from 'lucide-react'

export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="text-center max-w-md mx-auto px-4">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-75 animate-pulse"></div>
          <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-bounce" />
          </div>
        </div>

        {/* Loading Text */}
        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Loading Your Creative Dashboard
          </span>
        </h1>

        <p className="text-gray-600 mb-8 leading-relaxed">
          Preparing your AI-powered photoshoot studio...
        </p>

        {/* Loading Animation */}
        <div className="flex justify-center items-center space-x-4 mb-8">
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce delay-100"></div>
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-200"></div>
        </div>

        {/* Feature Icons */}
        <div className="flex justify-center space-x-6 text-gray-400">
          <div className="flex flex-col items-center">
            <Wand2 className="w-6 h-6 mb-2 animate-pulse" />
            <span className="text-xs">AI Enhancement</span>
          </div>
          <div className="flex flex-col items-center">
            <Camera className="w-6 h-6 mb-2 animate-pulse delay-300" />
            <span className="text-xs">Professional Photos</span>
          </div>
          <div className="flex flex-col items-center">
            <Sparkles className="w-6 h-6 mb-2 animate-pulse delay-600" />
            <span className="text-xs">Instant Results</span>
          </div>
        </div>
      </div>
    </div>
  )
}