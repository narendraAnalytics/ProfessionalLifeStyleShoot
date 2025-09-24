import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '../../../../lib/prisma'
import { NextResponse } from 'next/server'

export async function POST() {
  console.log('🔧 API /users/sync called')
  console.log('🌐 Environment check:', {
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    nodeEnv: process.env.NODE_ENV
  })
  
  try {
    const { userId } = await auth()
    console.log('🔐 Auth check - userId:', userId)
    
    if (!userId) {
      console.log('❌ No userId found - unauthorized')
      return NextResponse.json({ 
        error: 'Unauthorized',
        details: 'No valid authentication found. Please sign in and try again.'
      }, { status: 401 })
    }

    const clerkUser = await currentUser()
    console.log('👤 Clerk user data:', {
      id: clerkUser?.id,
      email: clerkUser?.primaryEmailAddress?.emailAddress,
      firstName: clerkUser?.firstName,
      lastName: clerkUser?.lastName,
      username: clerkUser?.username
    })
    
    if (!clerkUser) {
      console.log('❌ Clerk user not found')
      return NextResponse.json({ 
        error: 'User not found',
        details: 'Unable to retrieve user information from authentication provider.'
      }, { status: 404 })
    }

    // Validate required user data
    const email = clerkUser.primaryEmailAddress?.emailAddress
    if (!email) {
      console.log('❌ No email address found for user')
      return NextResponse.json({
        error: 'Invalid user data',
        details: 'User must have a valid email address.'
      }, { status: 400 })
    }

    // Check if user already exists in database
    console.log('🔍 Checking if user exists in database...')
    let existingUser
    try {
      existingUser = await prisma.user.findUnique({
        where: { clerkId: userId }
      })
      console.log('🔍 Database check result:', existingUser ? 'User exists' : 'User not found')
    } catch (dbError) {
      console.error('❌ Database query failed:', dbError)
      return NextResponse.json({ 
        error: 'Database query failed',
        details: 'Unable to check existing user data.',
        type: 'DatabaseQueryError'
      }, { status: 500 })
    }

    try {
      if (existingUser) {
        console.log('🔄 Updating existing user...')
        // Update existing user with latest Clerk data
        const updatedUser = await prisma.user.update({
          where: { clerkId: userId },
          data: {
            email: email,
            firstName: clerkUser.firstName || existingUser.firstName,
            lastName: clerkUser.lastName || existingUser.lastName,
            username: clerkUser.username || existingUser.username,
            profileImageUrl: clerkUser.imageUrl || existingUser.profileImageUrl,
          }
        })
        
        console.log('✅ User updated successfully:', updatedUser.id)
        return NextResponse.json({ 
          user: {
            id: updatedUser.id,
            clerkId: updatedUser.clerkId,
            email: updatedUser.email,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName
          }, 
          created: false 
        })
      } else {
        console.log('➕ Creating new user in database...')
        // Create new user in database
        const newUser = await prisma.user.create({
          data: {
            clerkId: userId,
            email: email,
            firstName: clerkUser.firstName,
            lastName: clerkUser.lastName,
            username: clerkUser.username,
            profileImageUrl: clerkUser.imageUrl,
          }
        })
        
        console.log('🎉 New user created successfully:', newUser.id)
        return NextResponse.json({ 
          user: {
            id: newUser.id,
            clerkId: newUser.clerkId,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName
          }, 
          created: true 
        })
      }
    } catch (dbError) {
      console.error('❌ Database operation failed:', dbError)
      
      // Handle specific Prisma errors
      if (dbError && typeof dbError === 'object' && 'code' in dbError) {
        const prismaError = dbError as { code: string, meta?: any }
        if (prismaError.code === 'P2002') {
          return NextResponse.json({ 
            error: 'Unique constraint violation',
            details: 'A user with this email or username already exists.',
            type: 'UniqueConstraintError'
          }, { status: 409 })
        }
      }
      
      return NextResponse.json({ 
        error: 'Database operation failed',
        details: 'Unable to save user data.',
        type: 'DatabaseOperationError'
      }, { status: 500 })
    }
  } catch (error) {
    console.error('💥 Unexpected error syncing user:', error)
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    // Don't expose sensitive error details in production
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: isDevelopment && error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred. Please try again later.',
      type: error instanceof Error ? error.name : 'UnknownError'
    }, { status: 500 })
  } finally {
    // Note: Not calling prisma.$disconnect() in serverless/pooled environments
    // as recommended by Neon for better connection management
    console.log('🔌 API route completed (connection managed by pool)')
  }
}