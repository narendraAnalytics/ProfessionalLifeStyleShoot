import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// GET endpoint to fetch user's complete gallery (photoshoots + imageCompositions)
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      console.log('❌ Gallery API: No user ID provided')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('✅ Gallery API: Authenticated user:', userId)

    // Get URL search params for pagination
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Find user first
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      console.log('❌ Gallery API: User not found in database for clerkId:', userId)
      // Try to handle this gracefully - the user might need to be synced
      return NextResponse.json({ 
        error: 'User profile not found. Please try refreshing the page.',
        needsSync: true 
      }, { status: 404 })
    }

    console.log('✅ Gallery API: Found user in database:', user.id)

    // Fetch both AI generated images AND Upload & Combine compositions
    console.log('🔍 Gallery API: Fetching data for user:', user.id)
    
    const [photoshoots, imageCompositions, allImageCompositions] = await Promise.all([
      // AI Generated images from photoshoots table
      prisma.photoshoot.findMany({
        where: {
          userId: user.id,
          status: 'completed'
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      
      // Upload & Combine images from imageCompositions table (completed only)
      prisma.imageComposition.findMany({
        where: {
          userId: user.id,
          status: 'completed'
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      
      // Debug: Fetch ALL imageCompositions for this user to check status issues
      prisma.imageComposition.findMany({
        where: {
          userId: user.id
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    ])
    
    console.log('📊 Gallery API Debug Data:', {
      userId: user.id,
      completedPhotoshoots: photoshoots.length,
      completedImageCompositions: imageCompositions.length,
      allImageCompositions: allImageCompositions.length,
      imageCompositionStatuses: allImageCompositions.map(ic => ({ 
        id: ic.id, 
        status: ic.status, 
        createdAt: ic.createdAt,
        hasOutputUrl: !!ic.outputImageUrl
      }))
    })

    // Transform photoshoots to match GeneratedImage interface
    const formattedPhotoshoots = photoshoots.map(photoshoot => {
      let responsiveUrls = {
        small: photoshoot.generatedImageUrl,
        medium: photoshoot.generatedImageUrl,
        large: photoshoot.generatedImageUrl,
        original: photoshoot.generatedImageUrl
      }

      let bwUrls = null
      if (photoshoot.metadata && typeof photoshoot.metadata === 'object') {
        const metadata = photoshoot.metadata as Record<string, unknown>
        
        if (metadata.responsiveUrls) {
          responsiveUrls = {
            small: (metadata.responsiveUrls as any).small || photoshoot.generatedImageUrl,
            medium: (metadata.responsiveUrls as any).medium || photoshoot.generatedImageUrl,
            large: (metadata.responsiveUrls as any).large || photoshoot.generatedImageUrl,
            original: (metadata.responsiveUrls as any).original || photoshoot.generatedImageUrl
          }
        }
        
        if (metadata.bwUrls) {
          bwUrls = metadata.bwUrls
        }
      }

      return {
        id: photoshoot.id,
        imageUrl: photoshoot.generatedImageUrl,
        thumbnailUrl: photoshoot.thumbnailUrl || photoshoot.generatedImageUrl,
        bwImageUrl: photoshoot.bwImageUrl,
        responsiveUrls,
        bwUrls,
        originalPrompt: photoshoot.originalPrompt,
        enhancedPrompt: photoshoot.enhancedPrompt || photoshoot.originalPrompt,
        style: photoshoot.style,
        createdAt: photoshoot.createdAt.toISOString(),
        type: 'ai-generated' as const
      }
    })

    // Transform imageCompositions to match GeneratedImage interface
    const formattedCompositions = imageCompositions.map(composition => {
      let responsiveUrls = {
        small: composition.outputImageUrl,
        medium: composition.outputImageUrl,
        large: composition.outputImageUrl,
        original: composition.outputImageUrl
      }

      let bwUrls = null
      let bwImageUrl = null
      let originalPrompt = 'Upload & Combine image'
      let enhancedPrompt = 'Upload & Combine image'

      if (composition.metadata && typeof composition.metadata === 'object') {
        const metadata = composition.metadata as Record<string, unknown>
        
        if (metadata.responsiveUrls) {
          responsiveUrls = {
            small: (metadata.responsiveUrls as any).small || composition.outputImageUrl,
            medium: (metadata.responsiveUrls as any).medium || composition.outputImageUrl,
            large: (metadata.responsiveUrls as any).large || composition.outputImageUrl,
            original: (metadata.responsiveUrls as any).original || composition.outputImageUrl
          }
        }
        
        if (metadata.bwUrls) {
          bwUrls = metadata.bwUrls
        }

        if (metadata.bwImageUrl) {
          bwImageUrl = metadata.bwImageUrl as string
        }

        if (metadata.prompt) {
          originalPrompt = metadata.prompt as string
          enhancedPrompt = metadata.prompt as string
        }
      }

      return {
        id: composition.id,
        imageUrl: composition.outputImageUrl,
        thumbnailUrl: (composition.metadata as any)?.thumbnailUrl || composition.outputImageUrl,
        bwImageUrl,
        responsiveUrls,
        bwUrls,
        originalPrompt,
        enhancedPrompt,
        style: 'composition',
        createdAt: composition.createdAt.toISOString(),
        type: 'upload-combine' as const
      }
    })

    // Combine both arrays and sort by creation date (most recent first)
    const allImages = [...formattedPhotoshoots, ...formattedCompositions]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Apply pagination to combined results
    const paginatedImages = allImages.slice(offset, offset + limit)

    console.log('📊 Gallery API fetched:', {
      totalPhotoshoots: formattedPhotoshoots.length,
      totalCompositions: formattedCompositions.length,
      totalCombined: allImages.length,
      returnedAfterPagination: paginatedImages.length,
      offset,
      limit
    })

    return NextResponse.json({
      success: true,
      images: paginatedImages,
      pagination: {
        total: allImages.length,
        limit,
        offset,
        hasMore: offset + limit < allImages.length
      }
    })

  } catch (error) {
    console.error('❌ Error fetching gallery:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gallery images' },
      { status: 500 }
    )
  }
}