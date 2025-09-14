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

    const { prompt, aspectRatio } = await req.json();

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json({ error: 'Valid prompt is required' }, { status: 400 });
    }

    // Skip credits check for now
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Initialize Gemini service
    const geminiService = new GeminiService();
    let enhancedPrompt = '';

    try {
      // Enhance prompt using gemini-2.5-flash-live-preview with aspect ratio context
      console.log('✨ Enhancing prompt with aspect ratio:', prompt, aspectRatio);
      enhancedPrompt = await geminiService.enhancePrompt(prompt.trim(), aspectRatio);

      // Credits system disabled for now

      console.log('✅ Prompt enhancement completed successfully');
    } finally {
      // Ensure cleanup even if an error occurs
      geminiService.cleanup();
    }

    return NextResponse.json({
      success: true,
      originalPrompt: prompt,
      enhancedPrompt
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