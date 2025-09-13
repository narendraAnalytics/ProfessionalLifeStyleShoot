'use client'

import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { 
  Sparkles, 
  Settings, 
  Wand2,
  Images,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export default function DashboardSidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    let ticking = false

    const updateScrollY = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollY)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const menuItems = [
    {
      id: 'create',
      label: 'Generate Images',
      icon: Wand2,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'gallery',
      label: 'My Gallery',
      icon: Images,
      color: 'from-blue-500 to-cyan-500'
    }
  ]

  // Calculate sidebar position based on scroll with bounds
  const maxScroll = typeof document !== 'undefined' 
    ? Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
    : 0
  const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0
  const sidebarTop = 80 + (scrollProgress * 200) // Start at 80px, move up to 280px based on scroll
  
  return (
    <aside 
      className={`fixed top-0 left-0 bg-white/80 backdrop-blur-lg border-r border-gray-200/50 shadow-sm transition-all duration-300 z-40 ${collapsed ? 'w-16' : 'w-64'}`}
      style={{ 
        top: `${sidebarTop}px`,
        height: 'calc(100vh - 160px)', // Dynamic height to stay within bounds
        transition: 'top 0.15s ease-out, width 0.3s ease'
      }}
    >
      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 z-10 w-6 h-6 p-0 bg-white border border-gray-200 shadow-md hover:bg-gray-50"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </Button>

      {/* Content Container */}
      <div className="h-full flex flex-col justify-center p-4">
        {/* Main Navigation Panel */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 space-y-4">
          {/* Quick Create Button */}
          {!collapsed && (
            <Button
              onClick={() => onSectionChange('create')}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 mb-4"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Create Image
            </Button>
          )}

          {/* Menu Items */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = activeSection === item.id
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full justify-start transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border-l-4 border-purple-500' 
                      : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                  } ${collapsed ? 'px-2' : 'px-4'}`}
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${item.color} ${collapsed ? 'mr-0' : 'mr-3'}`}>
                    <item.icon className="w-4 h-4 text-white" />
                  </div>
                  
                  {!collapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </Button>
              )
            })}
          </nav>

          {/* Tools Section */}
          {!collapsed && (
            <div className="pt-4 mt-4 border-t border-gray-200">
              <div className="space-y-2">
                <h3 className="px-4 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Tools
                </h3>
                <Button
                  variant="ghost"
                  onClick={() => onSectionChange('settings')}
                  className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  <div className="p-2 rounded-lg bg-gradient-to-r from-gray-400 to-gray-500 mr-3">
                    <Settings className="w-4 h-4 text-white" />
                  </div>
                  Settings
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}