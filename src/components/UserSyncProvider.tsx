'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState, createContext, useContext, useRef } from 'react'

interface UserSyncContextType {
  isSyncing: boolean
  syncError: string | null
  syncSuccess: boolean
  retrySync: () => void
}

const UserSyncContext = createContext<UserSyncContextType>({
  isSyncing: false,
  syncError: null,
  syncSuccess: false,
  retrySync: () => {}
})

export const useUserSync = () => useContext(UserSyncContext)

export default function UserSyncProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser()
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [syncSuccess, setSyncSuccess] = useState(false)
  
  // Refs for cleanup
  const abortControllerRef = useRef<AbortController | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const syncInProgressRef = useRef(false)
  
  const MAX_RETRIES = 3

  // Cleanup function to cancel all ongoing operations
  const cleanupSync = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
      retryTimeoutRef.current = null
    }
    syncInProgressRef.current = false
  }

  useEffect(() => {
    if (isLoaded && user && !isSyncing && !syncSuccess && !syncInProgressRef.current) {
      console.log('🔄 User detected, starting background sync process...', {
        userId: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName
      })
      // Start sync in background - don't block rendering
      setTimeout(() => syncUser(), 0)
    }
    
    // Cleanup on unmount
    return cleanupSync
  }, [isLoaded, user, syncSuccess])

  const syncUser = async () => {
    // Prevent race conditions
    if (syncInProgressRef.current) {
      console.log('🔄 Sync already in progress, skipping...')
      return
    }

    syncInProgressRef.current = true
    setIsSyncing(true)
    setSyncError(null)
    
    console.log('📡 Calling sync API in background... (Attempt:', retryCount + 1, ')')

    try {
      // Clean up any existing controllers/timeouts
      cleanupSync()
      
      // Create new AbortController
      const controller = new AbortController()
      abortControllerRef.current = controller
      
      // Increased timeout to 60 seconds for better reliability
      const timeoutId = setTimeout(() => {
        console.log('⏱️ Request timeout reached, aborting...')
        controller.abort('timeout')
      }, 60000)
      timeoutRef.current = timeoutId

      const response = await fetch('/api/users/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      timeoutRef.current = null
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
          // Exponential backoff: 1s, 2s, 4s
          const retryDelay = Math.pow(2, retryCount) * 1000
          console.log(`🔄 Retrying sync in background in ${retryDelay/1000} seconds... (${retryCount + 1}/${MAX_RETRIES})`)
          
          retryTimeoutRef.current = setTimeout(() => {
            retryTimeoutRef.current = null
            syncUser()
          }, retryDelay)
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
        // Check if it was a timeout or manual abort
        const wasTimeout = err.message === 'timeout'
        if (wasTimeout) {
          const timeoutError = 'Request timed out after 60 seconds. Please check your internet connection and try again.'
          setSyncError(timeoutError)
          console.error('⏱️ Sync timed out after 60 seconds')
        } else {
          // Manual abort (component unmounting, etc.)
          console.log('🛑 Sync request was cancelled')
          return // Don't set error for manual cancellation
        }
      } else if (retryCount < MAX_RETRIES && (err instanceof TypeError || err instanceof Error && err.message.includes('fetch'))) {
        // Network error - retry with exponential backoff
        setRetryCount(prev => prev + 1)
        const retryDelay = Math.pow(2, retryCount) * 1000
        console.log(`🔄 Network error, retrying sync in background in ${retryDelay/1000} seconds... (${retryCount + 1}/${MAX_RETRIES})`)
        
        retryTimeoutRef.current = setTimeout(() => {
          retryTimeoutRef.current = null
          syncUser()
        }, retryDelay)
        return
      } else {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred during sync'
        setSyncError(errorMessage)
        console.error('💥 Final sync error:', errorMessage)
      }
    } finally {
      syncInProgressRef.current = false
      setIsSyncing(false)
    }
  }

  const retrySync = () => {
    // Clean up any existing operations
    cleanupSync()
    setRetryCount(0)
    setSyncError(null)
    setSyncSuccess(false)
    syncUser()
  }

  // Show sync error if any (optional - for debugging)
  if (syncError) {
    console.error('🚨 Background Sync Error:', syncError)
  }

  // Show loading state during sync
  if (isSyncing && retryCount === 0) {
    console.log('⏳ User sync in progress (background)...')
  } else if (isSyncing && retryCount > 0) {
    console.log(`⏳ Retrying user sync in background... (${retryCount}/${MAX_RETRIES})`)
  }

  // Show success state
  if (syncSuccess) {
    console.log('✅ User successfully synchronized with database (background)')
  }

  const contextValue: UserSyncContextType = {
    isSyncing,
    syncError,
    syncSuccess,
    retrySync
  }

  return (
    <UserSyncContext.Provider value={contextValue}>
      {children}
    </UserSyncContext.Provider>
  )
}