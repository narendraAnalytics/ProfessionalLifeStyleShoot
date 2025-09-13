import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// GET endpoint to fetch user's photoshoots
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get URL search params for pagination
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Find user first
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Fetch user's photoshoots
    const photoshoots = await prisma.photoshoot.findMany({
      where: {
        userId: user.id,
        status: 'completed' // Only fetch completed photoshoots
      },
      orderBy: {
        createdAt: 'desc' // Most recent first
      },
      take: limit,
      skip: offset
    })

    // Transform photoshoots to match the GeneratedImage interface expected by Dashboard
    const formattedImages = photoshoots.map(photoshoot => {
      // Parse metadata to get responsive URLs if available
      let responsiveUrls = {
        small: photoshoot.generatedImageUrl,
        medium: photoshoot.generatedImageUrl,
        large: photoshoot.generatedImageUrl,
        original: photoshoot.generatedImageUrl
      }

      // Try to parse metadata for responsive URLs
      if (photoshoot.metadata && typeof photoshoot.metadata === 'object') {
        const metadata = photoshoot.metadata as any
        if (metadata.responsiveUrls) {
          responsiveUrls = {
            small: metadata.responsiveUrls.small || photoshoot.generatedImageUrl,
            medium: metadata.responsiveUrls.medium || photoshoot.generatedImageUrl,
            large: metadata.responsiveUrls.large || photoshoot.generatedImageUrl,
            original: metadata.responsiveUrls.original || photoshoot.generatedImageUrl
          }
        }
      }

      return {
        id: photoshoot.id,
        imageUrl: photoshoot.generatedImageUrl,
        thumbnailUrl: photoshoot.thumbnailUrl || photoshoot.generatedImageUrl,
        responsiveUrls,
        originalPrompt: photoshoot.originalPrompt,
        enhancedPrompt: photoshoot.enhancedPrompt || photoshoot.originalPrompt,
        style: photoshoot.style,
        createdAt: photoshoot.createdAt.toISOString()
      }
    })

    // Also get total count for pagination
    const totalCount = await prisma.photoshoot.count({
      where: {
        userId: user.id,
        status: 'completed'
      }
    })

    return NextResponse.json({
      success: true,
      images: formattedImages,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    })

  } catch (error) {
    console.error('❌ Error fetching photoshoots:', error)
    return NextResponse.json(
      { error: 'Failed to fetch photoshoots' },
      { status: 500 }
    )
  }
}