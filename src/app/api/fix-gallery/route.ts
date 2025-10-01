import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// POST endpoint to fix stuck imageCompositions and orphaned records
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find user first
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    console.log('🔧 Fix Gallery API: Starting database cleanup for user:', user.id)

    // Find all imageCompositions that should be completed but aren't
    const stuckCompositions = await prisma.imageComposition.findMany({
      where: {
        userId: user.id,
        status: { not: 'completed' },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        outputImageUrl: { not: null as any } // Has valid output URL but wrong status
      }
    })

    console.log('🔍 Found stuck compositions:', stuckCompositions.length)

    // Update stuck compositions to completed
    const updateResults = await Promise.all(
      stuckCompositions.map(async (composition) => {
        const updated = await prisma.imageComposition.update({
          where: { id: composition.id },
          data: { status: 'completed' }
        })
        return {
          id: composition.id,
          oldStatus: composition.status,
          newStatus: updated.status,
          createdAt: composition.createdAt
        }
      })
    )

    // Also find and clean up any compositions that are truly broken (no output URL after 1+ hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    const brokenCompositions = await prisma.imageComposition.findMany({
      where: {
        userId: user.id,
        status: { not: 'completed' },
        createdAt: { lt: oneHourAgo },
        OR: [
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          { outputImageUrl: null as any },
          { outputImageUrl: '' }
        ]
      }
    })

    console.log('🗑️ Found broken compositions to delete:', brokenCompositions.length)

    // Delete broken compositions
    const deleteResults = await Promise.all(
      brokenCompositions.map(async (composition) => {
        await prisma.imageComposition.delete({
          where: { id: composition.id }
        })
        return {
          id: composition.id,
          status: composition.status,
          createdAt: composition.createdAt
        }
      })
    )

    // Get final counts
    const finalStats = await prisma.imageComposition.groupBy({
      by: ['status'],
      where: { userId: user.id },
      _count: { status: true }
    })

    const response = {
      success: true,
      message: 'Gallery database cleanup completed',
      results: {
        fixed: updateResults,
        deleted: deleteResults,
        finalStats: finalStats.reduce((acc, stat) => {
          acc[stat.status] = stat._count.status
          return acc
        }, {} as Record<string, number>)
      }
    }

    console.log('✅ Fix Gallery API completed:', response)

    return NextResponse.json(response)

  } catch (error) {
    console.error('❌ Fix Gallery API error:', error)
    return NextResponse.json(
      { error: 'Failed to fix gallery database. Please try again.' },
      { status: 500 }
    )
  }
}

// GET endpoint to diagnose gallery issues
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find user first
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get diagnostic data
    const [
      totalPhotoshoots,
      completedPhotoshoots,
      totalCompositions,
      completedCompositions,
      allCompositions
    ] = await Promise.all([
      prisma.photoshoot.count({ where: { userId: user.id } }),
      prisma.photoshoot.count({ where: { userId: user.id, status: 'completed' } }),
      prisma.imageComposition.count({ where: { userId: user.id } }),
      prisma.imageComposition.count({ where: { userId: user.id, status: 'completed' } }),
      prisma.imageComposition.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          status: true,
          outputImageUrl: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' }
      })
    ])

    const statusBreakdown = allCompositions.reduce((acc, comp) => {
      acc[comp.status] = (acc[comp.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const stuckCompositions = allCompositions.filter(comp => 
      comp.status !== 'completed' && comp.outputImageUrl
    )

    return NextResponse.json({
      success: true,
      diagnostics: {
        userId: user.id,
        photoshoots: {
          total: totalPhotoshoots,
          completed: completedPhotoshoots
        },
        compositions: {
          total: totalCompositions,
          completed: completedCompositions,
          statusBreakdown,
          stuckWithValidUrls: stuckCompositions.length
        },
        recentCompositions: allCompositions.slice(0, 5).map(comp => ({
          id: comp.id,
          status: comp.status,
          hasUrl: !!comp.outputImageUrl,
          age: Math.round((Date.now() - comp.createdAt.getTime()) / 1000 / 60) + 'min'
        }))
      }
    })

  } catch (error) {
    console.error('❌ Diagnose Gallery API error:', error)
    return NextResponse.json(
      { error: 'Failed to diagnose gallery issues' },
      { status: 500 }
    )
  }
}