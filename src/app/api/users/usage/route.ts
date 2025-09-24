import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { 
        id: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate current billing period (monthly)
    const now = new Date()
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1) // First day of current month
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0) // Last day of current month
    periodEnd.setHours(23, 59, 59, 999) // End of day

    // Count images generated in current period
    const imageCount = await prisma.photoshoot.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: periodStart,
          lte: periodEnd
        }
      }
    })

    // Count image merges/compositions in current period (set to 0 for now)
    const mergeCount = 0 // TODO: Implement actual merge counting when you have the composition feature

    const usage = {
      currentPeriodImages: imageCount,
      currentPeriodMerges: mergeCount,
      periodStartDate: periodStart.toISOString(),
      periodEndDate: periodEnd.toISOString()
    }

    return NextResponse.json(usage)

  } catch (error) {
    console.error('Usage fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch usage statistics' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type, amount = 1 } = await req.json() // 'image' or 'merge'

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // This endpoint can be used to track usage increments
    // For now, image generation is tracked automatically via photoshoot creation
    // Merge usage would need to be implemented when you add that feature

    if (type !== 'image' && type !== 'merge') {
      return NextResponse.json({ error: 'Invalid usage type' }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true,
      message: `${type} usage tracked`
    })

  } catch (error) {
    console.error('Usage update error:', error)
    return NextResponse.json(
      { error: 'Failed to update usage statistics' },
      { status: 500 }
    )
  }
}