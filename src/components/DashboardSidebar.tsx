'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { 
  Camera, 
  Sparkles, 
  Image as ImageIcon, 
  History, 
  Settings, 
  Palette,
  Wand2,
  Images,
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export default function DashboardSidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  const menuItems = [
    {
      id: 'create',
      label: 'Create Shoot',
      icon: Plus,
      color: 'from-purple-500 to-pink-500',
      badge: 'New'
    },
    {
      id: 'gallery',
      label: 'My Gallery',
      icon: Images,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'history',
      label: 'Recent',
      icon: History,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'styles',
      label: 'AI Styles',
      icon: Palette,
      color: 'from-orange-500 to-red-500',
      badge: '100+'
    },
    {
      id: 'enhance',
      label: 'AI Enhance',
      icon: Wand2,
      color: 'from-violet-500 to-purple-500'
    }
  ]

  return (
    <aside className={`relative h-full bg-white/80 backdrop-blur-lg border-r border-gray-200/50 shadow-sm transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 z-10 w-6 h-6 p-0 bg-white border border-gray-200 shadow-md hover:bg-gray-50"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </Button>

      <div className="p-4 space-y-2">
        {/* Quick Create Button */}
        {!collapsed && (
          <Button
            onClick={() => onSectionChange('create')}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 mb-6"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Start Creating
          </Button>
        )}

        {/* Menu Items */}
        <nav className="space-y-1">
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
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-200"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                )}
              </Button>
            )
          })}
        </nav>

        {/* Bottom Section */}
        {!collapsed && (
          <div className="pt-8 mt-8 border-t border-gray-200">
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
    </aside>
  )
}