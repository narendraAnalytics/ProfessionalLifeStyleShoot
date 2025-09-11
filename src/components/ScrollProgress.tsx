'use client'

import { useState, useEffect } from 'react'

export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(Math.min(progress, 100))
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial call

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-black/20 backdrop-blur-sm">
      <div 
        className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 transition-all duration-200 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
      
      {/* Glowing dot at the end */}
      {scrollProgress > 0 && (
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full shadow-lg"
          style={{ left: `${scrollProgress}%`, marginLeft: '-6px' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-ping opacity-75" />
        </div>
      )}
    </div>
  )
}