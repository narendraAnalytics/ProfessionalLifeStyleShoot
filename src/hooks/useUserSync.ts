'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

interface DatabaseUser {
  id: string
  clerkId: string
  email: string
  firstName: string | null
  lastName: string | null
  username: string | null
  profileImageUrl: string | null
  createdAt: string
  updatedAt: string
}

export function useUserSync() {
  const { user, isLoaded } = useUser()
  const [dbUser, setDbUser] = useState<DatabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isLoaded && user) {
      syncUser()
    }
  }, [isLoaded, user])

  const syncUser = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/users/sync', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to sync user')
      }

      const data = await response.json()
      setDbUser(data.user)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error syncing user:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshUser = async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/users/me')

      if (!response.ok) {
        throw new Error('Failed to fetch user')
      }

      const data = await response.json()
      setDbUser(data.user)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching user:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    user: dbUser,
    clerkUser: user,
    isLoading,
    error,
    syncUser,
    refreshUser,
  }
}