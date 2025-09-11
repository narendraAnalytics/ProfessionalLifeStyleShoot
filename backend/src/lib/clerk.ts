import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node'
import { createClerkClient } from '@clerk/backend'

if (!process.env.CLERK_SECRET_KEY) {
  throw new Error('Missing CLERK_SECRET_KEY')
}

export const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
})

export const requireAuth = ClerkExpressRequireAuth()