'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

export default function UserSyncProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser()
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [syncSuccess, setSyncSuccess] = useState(false)
  
  const MAX_RETRIES = 3

  useEffect(() => {
    if (isLoaded && user && !isSyncing && !syncSuccess) {
      console.log('🔄 User detected, starting sync process...', {
        userId: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName
      })
      syncUser()
    }
  }, [isLoaded, user, syncSuccess])

  const syncUser = async () => {
    setIsSyncing(true)
    setSyncError(null)
    
    console.log('📡 Calling sync API... (Attempt:', retryCount + 1, ')')

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      const response = await fetch('/api/users/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      console.log('📡 Sync API Response:', response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        let parsedError
        try {
          parsedError = JSON.parse(errorText)
        } catch {
          parsedError = { error: errorText }
        }
        
        console.error('❌ Sync API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: parsedError
        })
        
        // Determine if error is retryable
        const isRetryableError = response.status >= 500 || response.status === 429
        if (isRetryableError && retryCount < MAX_RETRIES) {
          setRetryCount(prev => prev + 1)
          console.log(`🔄 Retrying in 2 seconds... (${retryCount + 1}/${MAX_RETRIES})`)
          setTimeout(() => syncUser(), 2000)
          return
        }
        
        throw new Error(parsedError.error || `Sync failed with status ${response.status}`)
      }

      const data = await response.json()
      console.log('✅ User synced successfully:', {
        created: data.created,
        user: data.user
      })
      
      if (data.created) {
        console.log('🎉 New user created in database!')
      } else {
        console.log('🔄 Existing user updated in database')
      }
      
      setSyncSuccess(true)
      setRetryCount(0) // Reset retry count on success
      
    } catch (err) {
      console.error('❌ User sync failed:', err)
      
      if (err instanceof Error && err.name === 'AbortError') {
        const timeoutError = 'Sync request timed out. Please check your connection.'
        setSyncError(timeoutError)
      } else if (retryCount < MAX_RETRIES && (err instanceof TypeError || err instanceof Error && err.message.includes('fetch'))) {
        // Network error - retry
        setRetryCount(prev => prev + 1)
        console.log(`🔄 Network error, retrying in 2 seconds... (${retryCount + 1}/${MAX_RETRIES})`)
        setTimeout(() => syncUser(), 2000)
        return
      } else {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
        setSyncError(errorMessage)
      }
    } finally {
      setIsSyncing(false)
    }
  }

  // Show sync error if any (optional - for debugging)
  if (syncError) {
    console.error('🚨 Sync Error:', syncError)
  }

  // Show loading state during sync
  if (isSyncing && retryCount === 0) {
    console.log('⏳ User sync in progress...')
  } else if (isSyncing && retryCount > 0) {
    console.log(`⏳ Retrying user sync... (${retryCount}/${MAX_RETRIES})`)
  }

  // Show success state
  if (syncSuccess) {
    console.log('✅ User successfully synchronized with database')
  }

  return <>{children}</>
}