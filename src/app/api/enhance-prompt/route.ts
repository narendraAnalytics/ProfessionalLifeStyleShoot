import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { GeminiService } from '@/lib/gemini';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json({ error: 'Valid prompt is required' }, { status: 400 });
    }

    // Check user credits
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, creditsRemaining: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const creditsNeeded = 1; // Enhancement only costs 1 credit
    if (user.creditsRemaining < creditsNeeded) {
      return NextResponse.json({ 
        error: `Insufficient credits. Need ${creditsNeeded}, have ${user.creditsRemaining}` 
      }, { status: 403 });
    }

    // Initialize Gemini service
    const geminiService = new GeminiService();

    try {
      // Enhance prompt using gemini-2.5-flash-live-preview
      console.log('✨ Enhancing prompt only:', prompt);
      const enhancedPrompt = await geminiService.enhancePrompt(prompt.trim());

      // Update user credits (deduct 1 credit for enhancement)
      await prisma.user.update({
        where: { clerkId: userId },
        data: {
          creditsRemaining: { decrement: creditsNeeded },
          creditsUsed: { increment: creditsNeeded },
        },
      });

      console.log('✅ Prompt enhancement completed successfully');
    } finally {
      // Ensure cleanup even if an error occurs
      geminiService.cleanup();
    }

    return NextResponse.json({
      success: true,
      originalPrompt: prompt,
      enhancedPrompt,
      creditsUsed: creditsNeeded,
      remainingCredits: user.creditsRemaining - creditsNeeded,
    });

  } catch (error) {
    console.error('Prompt enhancement error:', error);
    
    // Return different error messages based on the error type
    if (error instanceof Error) {
      if (error.message.includes('GEMINI_API_KEY')) {
        return NextResponse.json(
          { error: 'AI service configuration error' }, 
          { status: 500 }
        );
      }
      if (error.message.includes('quota') || error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'AI service temporarily unavailable. Please try again later.' }, 
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to enhance prompt. Please try again.' }, 
      { status: 500 }
    );
  }
}