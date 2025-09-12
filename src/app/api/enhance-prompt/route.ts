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

    // Check user credits (optional - implement based on your business logic)
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { creditsRemaining: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.creditsRemaining <= 0) {
      return NextResponse.json({ error: 'No credits remaining' }, { status: 403 });
    }

    // Enhance the prompt using Gemini Live API
    const geminiService = new GeminiService();
    const enhancedPrompt = await geminiService.enhancePrompt(prompt.trim());

    // Update user credits
    await prisma.user.update({
      where: { clerkId: userId },
      data: {
        creditsRemaining: { decrement: 1 },
        creditsUsed: { increment: 1 },
      },
    });

    return NextResponse.json({
      success: true,
      originalPrompt: prompt,
      enhancedPrompt,
      creditsUsed: 1,
      remainingCredits: user.creditsRemaining - 1,
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