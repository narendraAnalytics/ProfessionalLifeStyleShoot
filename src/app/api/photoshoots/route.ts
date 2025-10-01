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

      // Parse metadata for responsive URLs and B&W URLs
      let bwUrls = null
      if (photoshoot.metadata && typeof photoshoot.metadata === 'object') {
        const metadata = photoshoot.metadata as Record<string, unknown>
        console.log('📊 Processing photoshoot metadata for image:', photoshoot.id, {
          hasMetadata: !!photoshoot.metadata,
          metadataKeys: Object.keys(metadata),
          hasResponsiveUrls: !!metadata.responsiveUrls,
          hasBwUrls: !!metadata.bwUrls,
          bwImageUrl: photoshoot.bwImageUrl
        })
        
        if (metadata.responsiveUrls) {
          responsiveUrls = {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            small: (metadata.responsiveUrls as any).small || photoshoot.generatedImageUrl,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            medium: (metadata.responsiveUrls as any).medium || photoshoot.generatedImageUrl,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            large: (metadata.responsiveUrls as any).large || photoshoot.generatedImageUrl,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            original: (metadata.responsiveUrls as any).original || photoshoot.generatedImageUrl
          }
        }
        // Extract B&W URLs from metadata
        if (metadata.bwUrls) {
          bwUrls = metadata.bwUrls
          console.log('✅ B&W URLs extracted from metadata for image:', photoshoot.id, bwUrls)
        } else {
          console.log('⚠️ No B&W URLs found in metadata for image:', photoshoot.id)
        }
      } else {
        console.log('⚠️ No metadata found for image:', photoshoot.id)
      }

      const formattedImage = {
        id: photoshoot.id,
        imageUrl: photoshoot.generatedImageUrl,
        thumbnailUrl: photoshoot.thumbnailUrl || photoshoot.generatedImageUrl,
        bwImageUrl: photoshoot.bwImageUrl, // Include B&W image URL
        responsiveUrls,
        bwUrls, // Include B&W responsive URLs
        originalPrompt: photoshoot.originalPrompt,
        enhancedPrompt: photoshoot.enhancedPrompt || photoshoot.originalPrompt,
        style: photoshoot.style,
        createdAt: photoshoot.createdAt.toISOString()
      }

      console.log('📤 Formatted image response for:', photoshoot.id, {
        hasBwImageUrl: !!formattedImage.bwImageUrl,
        hasBwUrls: !!formattedImage.bwUrls,
        bwImageUrl: formattedImage.bwImageUrl,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        bwUrlsOriginal: (formattedImage.bwUrls as any)?.original
      })

      return formattedImage
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