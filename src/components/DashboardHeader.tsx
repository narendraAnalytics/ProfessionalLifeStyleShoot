'use client'

import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Home, Sparkles, Settings, LogOut } from 'lucide-react'
import { UserButton, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function DashboardHeader() {
  const { user } = useUser()
  const router = useRouter()

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Home Button */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/')}
              className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:block font-medium">Home</span>
            </Button>
            
            <div className="h-6 w-px bg-gray-300" />
            
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
            </div>
          </div>

          {/* User Info and Actions */}
          <div className="flex items-center space-x-4">
            {/* Welcome Message */}
            {user && (
              <div className="hidden md:block text-right">
                <p className="text-sm text-gray-500">Welcome back,</p>
                <p className="text-sm font-medium text-gray-900">
                  {user.firstName || user.emailAddresses[0]?.emailAddress}
                </p>
              </div>
            )}

            {/* User Button from Clerk */}
            <div className="flex items-center space-x-2">
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10 rounded-full border-2 border-purple-200 hover:border-purple-400 transition-colors",
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}