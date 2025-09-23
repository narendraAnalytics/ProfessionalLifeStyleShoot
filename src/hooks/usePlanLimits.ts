'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'

export interface PlanLimits {
  name: string
  maxImagesPerMonth: number
  maxMergesPerMonth: number
  allowedAspectRatios: string[]
  maxQuality: 'standard' | 'hd' | '4k'
  supportLevel: 'community' | 'email' | 'priority' | '24/7'
  hasCommercialLicense: boolean
  hasApiAccess: boolean
  hasCustomBranding: boolean
}

export interface UsageStats {
  currentPeriodImages: number
  currentPeriodMerges: number
  periodStartDate: string
  periodEndDate: string
}

export interface PlanStatus {
  plan: PlanLimits
  usage: UsageStats
  canGenerateImage: boolean
  canMergeImages: boolean
  imagesRemaining: number
  mergesRemaining: number
  isAtLimit: boolean
  upgradeRequired: boolean
}

const PLAN_DEFINITIONS: Record<string, PlanLimits> = {
  free: {
    name: 'Free',
    maxImagesPerMonth: 2,
    maxMergesPerMonth: 1,
    allowedAspectRatios: ['1:1'],
    maxQuality: 'standard',
    supportLevel: 'community',
    hasCommercialLicense: false,
    hasApiAccess: false,
    hasCustomBranding: false
  },
  pro_plan: {
    name: 'Pro Plan',
    maxImagesPerMonth: 15,
    maxMergesPerMonth: 8,
    allowedAspectRatios: ['1:1', '16:9', '9:16', '4:3', '3:4', '21:9'],
    maxQuality: 'hd',
    supportLevel: 'email',
    hasCommercialLicense: false,
    hasApiAccess: false,
    hasCustomBranding: false
  },
  max_ultimate: {
    name: 'Max Ultimate',
    maxImagesPerMonth: -1, // -1 means unlimited
    maxMergesPerMonth: -1,
    allowedAspectRatios: ['1:1', '16:9', '9:16', '4:3', '3:4', '21:9', '2:3', '3:2'],
    maxQuality: '4k',
    supportLevel: '24/7',
    hasCommercialLicense: true,
    hasApiAccess: true,
    hasCustomBranding: true
  }
}

export function usePlanLimits() {
  const { has, isLoaded } = useAuth()
  const [usage, setUsage] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Determine current plan
  const getCurrentPlan = (): PlanLimits => {
    if (!isLoaded) return PLAN_DEFINITIONS.free // Default to free while loading
    
    if (has && has({ plan: 'max_ultimate' })) {
      return PLAN_DEFINITIONS.max_ultimate
    }
    if (has && has({ plan: 'pro_plan' })) {
      return PLAN_DEFINITIONS.pro_plan
    }
    return PLAN_DEFINITIONS.free
  }

  const currentPlan = getCurrentPlan()

  // Fetch usage stats
  const fetchUsage = async () => {
    if (!isLoaded) return
    
    try {
      setLoading(true)
      const response = await fetch('/api/users/usage')
      
      if (!response.ok) {
        throw new Error('Failed to fetch usage stats')
      }
      
      const data = await response.json()
      setUsage(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch usage')
      // Set default usage if fetch fails
      setUsage({
        currentPeriodImages: 0,
        currentPeriodMerges: 0,
        periodStartDate: new Date().toISOString(),
        periodEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsage()
  }, [isLoaded])

  // Calculate plan status
  const getPlanStatus = (): PlanStatus => {
    if (!usage) {
      return {
        plan: currentPlan,
        usage: {
          currentPeriodImages: 0,
          currentPeriodMerges: 0,
          periodStartDate: new Date().toISOString(),
          periodEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        canGenerateImage: false,
        canMergeImages: false,
        imagesRemaining: 0,
        mergesRemaining: 0,
        isAtLimit: true,
        upgradeRequired: false
      }
    }

    const isUnlimited = currentPlan.maxImagesPerMonth === -1
    const imagesRemaining = isUnlimited 
      ? 999999 
      : Math.max(0, currentPlan.maxImagesPerMonth - usage.currentPeriodImages)
    const mergesRemaining = isUnlimited 
      ? 999999 
      : Math.max(0, currentPlan.maxMergesPerMonth - usage.currentPeriodMerges)

    const canGenerateImage = isUnlimited || usage.currentPeriodImages < currentPlan.maxImagesPerMonth
    const canMergeImages = isUnlimited || usage.currentPeriodMerges < currentPlan.maxMergesPerMonth
    
    const isAtLimit = !canGenerateImage && !canMergeImages
    const upgradeRequired = currentPlan.name === 'Free' && (
      usage.currentPeriodImages >= currentPlan.maxImagesPerMonth || 
      usage.currentPeriodMerges >= currentPlan.maxMergesPerMonth
    )

    return {
      plan: currentPlan,
      usage,
      canGenerateImage,
      canMergeImages,
      imagesRemaining,
      mergesRemaining,
      isAtLimit,
      upgradeRequired
    }
  }

  // Utility functions
  const canUseAspectRatio = (aspectRatio: string): boolean => {
    return currentPlan.allowedAspectRatios.includes(aspectRatio)
  }

  const canUseQuality = (quality: 'standard' | 'hd' | '4k'): boolean => {
    const qualityLevels = { standard: 1, hd: 2, '4k': 3 }
    const maxLevel = qualityLevels[currentPlan.maxQuality]
    const requestedLevel = qualityLevels[quality]
    return requestedLevel <= maxLevel
  }

  const getUpgradeMessage = (): string | null => {
    const status = getPlanStatus()
    
    if (!status.canGenerateImage && currentPlan.name === 'Free') {
      return `You've used all ${currentPlan.maxImagesPerMonth} free images this month. Upgrade to Pro for 15 images/month!`
    }
    
    if (!status.canMergeImages && currentPlan.name === 'Free') {
      return `You've used your free image merge this month. Upgrade to Pro for 8 merges/month!`
    }
    
    if (!status.canGenerateImage && currentPlan.name === 'Pro Plan') {
      return `You've reached your Pro plan limit. Upgrade to Max Ultimate for unlimited everything!`
    }
    
    return null
  }

  const refreshUsage = () => {
    fetchUsage()
  }

  return {
    planStatus: getPlanStatus(),
    loading,
    error,
    canUseAspectRatio,
    canUseQuality,
    getUpgradeMessage,
    refreshUsage,
    isLoaded
  }
}