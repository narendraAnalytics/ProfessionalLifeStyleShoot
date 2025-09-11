'use client'

import { useState } from 'react'
import DashboardHeader from './DashboardHeader'
import DashboardSidebar from './DashboardSidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { 
  Camera, 
  Sparkles, 
  Image as ImageIcon, 
  TrendingUp,
  Clock,
  Star,
  Zap,
  Users,
  Download,
  Heart,
  Play
} from 'lucide-react'

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('create')

  const statsCards = [
    {
      title: 'Total Shoots',
      value: '12',
      change: '+3 this week',
      icon: Camera,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Generated Images',
      value: '48',
      change: '+12 today',
      icon: ImageIcon,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'AI Credits',
      value: '150',
      change: '75 remaining',
      icon: Sparkles,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Downloads',
      value: '24',
      change: '+8 this week',
      icon: Download,
      color: 'from-orange-500 to-red-500'
    }
  ]

  const recentShots = [
    {
      id: 1,
      title: 'Professional Headshot',
      style: 'Corporate',
      timestamp: '2 hours ago',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      status: 'completed'
    },
    {
      id: 2,
      title: 'Fashion Portrait',
      style: 'Elegant',
      timestamp: '1 day ago',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b0c5?w=300&h=300&fit=crop&crop=face',
      status: 'completed'
    },
    {
      id: 3,
      title: 'Casual Lifestyle',
      style: 'Natural',
      timestamp: '3 days ago',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      status: 'completed'
    }
  ]

  const popularStyles = [
    { name: 'Professional Headshot', uses: '2.4k', trend: '+12%', color: 'from-blue-500 to-blue-600' },
    { name: 'Fashion Portrait', uses: '1.8k', trend: '+8%', color: 'from-purple-500 to-purple-600' },
    { name: 'Casual Lifestyle', uses: '1.5k', trend: '+15%', color: 'from-green-500 to-green-600' },
    { name: 'Artistic Creative', uses: '1.2k', trend: '+22%', color: 'from-pink-500 to-pink-600' }
  ]

  const renderMainContent = () => {
    switch (activeSection) {
      case 'create':
        return (
          <div className="space-y-8">
            {/* Hero Create Section */}
            <div className="relative">
              <Card className="bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 text-white border-0 shadow-2xl">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-6 h-6" />
                        <Badge className="bg-white/20 text-white border-white/30">
                          AI Powered
                        </Badge>
                      </div>
                      <h2 className="text-3xl font-bold">Create Your Next Shoot</h2>
                      <p className="text-lg opacity-90">
                        Transform your photos into professional shoots with AI magic
                      </p>
                      <Button 
                        size="lg" 
                        className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Start Creating
                      </Button>
                    </div>
                    <div className="hidden lg:block">
                      <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                        <Camera className="w-16 h-16 text-white" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsCards.map((stat, index) => (
                <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                        <p className="text-sm text-green-600 mt-1 flex items-center">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          {stat.change}
                        </p>
                      </div>
                      <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color}`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Shots and Popular Styles */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Recent Shots */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <span>Recent Shots</span>
                  </CardTitle>
                  <CardDescription>
                    Your latest AI-generated photoshoots
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentShots.map((shot) => (
                    <div key={shot.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                        <img 
                          src={shot.image} 
                          alt={shot.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{shot.title}</h4>
                        <p className="text-sm text-gray-500">{shot.style} • {shot.timestamp}</p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        {shot.status}
                      </Badge>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-4">
                    View All Shots
                  </Button>
                </CardContent>
              </Card>

              {/* Popular Styles */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-purple-600" />
                    <span>Popular Styles</span>
                  </CardTitle>
                  <CardDescription>
                    Trending AI photography styles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {popularStyles.map((style, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${style.color}`} />
                        <div>
                          <h4 className="font-medium text-gray-900">{style.name}</h4>
                          <p className="text-sm text-gray-500">{style.uses} uses</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        {style.trend}
                      </Badge>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-4">
                    Browse All Styles
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      
      default:
        return (
          <div className="flex items-center justify-center h-96">
            <Card className="max-w-md w-full text-center shadow-lg border-0">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Coming Soon
                </h3>
                <p className="text-gray-600 mb-4">
                  This section is under development. We're working hard to bring you amazing features!
                </p>
                <Button 
                  onClick={() => setActiveSection('create')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Back to Create
                </Button>
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader />
      
      <div className="flex flex-1">
        <DashboardSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {renderMainContent()}
          </div>
        </main>
      </div>

      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>
    </div>
  )
}