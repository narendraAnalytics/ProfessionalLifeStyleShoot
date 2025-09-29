import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { GeminiService } from '@/lib/gemini';
import { prisma } from '@/lib/prisma';

const isDev = process.env.NODE_ENV === 'development';

export async function POST(req: NextRequest) {
  try {
    // Auth check with detailed error handling
    let userId: string | null = null;
    try {
      const authResult = await auth();
      userId = authResult?.userId || null;
    } catch (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body with error handling
    let requestData;
    try {
      requestData = await req.json();
    } catch (parseError) {
      console.error('Request parsing error:', parseError);
      return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
    }

    const { prompt, aspectRatio } = requestData;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json({ error: 'Valid prompt is required' }, { status: 400 });
    }

    // Database check with error handling
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { clerkId: userId },
        select: { id: true }
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Initialize Gemini service with timeout
    let geminiService: GeminiService | null = null;
    let enhancedPrompt = '';

    try {
      if (isDev) console.log('✨ Enhancing prompt with aspect ratio:', prompt, aspectRatio);
      
      geminiService = new GeminiService();
      
      // Add timeout to prevent hanging requests
      const enhancementPromise = geminiService.enhancePrompt(prompt.trim(), aspectRatio);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Enhancement request timed out after 30 seconds')), 30000)
      );
      
      enhancedPrompt = await Promise.race([enhancementPromise, timeoutPromise]) as string;

      // Validate enhanced prompt
      if (!enhancedPrompt || typeof enhancedPrompt !== 'string') {
        throw new Error('Invalid enhancement result received');
      }

      if (isDev) console.log('✅ Prompt enhancement completed successfully');
    } catch (enhancementError) {
      console.error('Enhancement process error details:', {
        error: enhancementError instanceof Error ? enhancementError.message : 'Unknown error',
        errorType: enhancementError instanceof Error ? enhancementError.constructor.name : typeof enhancementError,
        stack: enhancementError instanceof Error ? enhancementError.stack : undefined,
        prompt: prompt.substring(0, 100) + '...',
        aspectRatio: aspectRatio || 'none'
      });
      
      // Handle specific error types - but now we're more specific about what constitutes a real failure
      if (enhancementError instanceof Error) {
        // These are real API/system failures that should return errors to user
        if (enhancementError.message.includes('GEMINI_API_KEY') || enhancementError.message.includes('API key')) {
          return NextResponse.json(
            { error: 'AI service configuration error' }, 
            { status: 500 }
          );
        }
        if (enhancementError.message.includes('quota') || enhancementError.message.includes('QUOTA_EXCEEDED')) {
          return NextResponse.json(
            { error: 'AI service temporarily unavailable due to quota limits. Please try again later.' }, 
            { status: 429 }
          );
        }
        if (enhancementError.message.includes('permission') || enhancementError.message.includes('access')) {
          return NextResponse.json(
            { error: 'AI service access error. Please contact support.' }, 
            { status: 403 }
          );
        }
        
        // For timeout and connection issues, we can fallback to original prompt with a warning
        if (enhancementError.message.includes('timeout') || enhancementError.message.includes('connection')) {
          console.log('⚠️ Enhancement timed out or connection failed, using original prompt as fallback');
          enhancedPrompt = prompt.trim();
        }
        // For all other enhancement failures, also fallback but log the specific error
        else {
          console.log('⚠️ Enhancement failed with specific error, using original prompt as fallback:', enhancementError.message);
          enhancedPrompt = prompt.trim();
        }
      } else {
        // Unknown error type
        console.log('⚠️ Enhancement failed with unknown error, using original prompt as fallback');
        enhancedPrompt = prompt.trim();
      }
    } finally {
      // Ensure cleanup even if an error occurs
      if (geminiService) {
        try {
          geminiService.cleanup();
        } catch (cleanupError) {
          console.error('Cleanup error:', cleanupError);
        }
      }
    }

    // Validate final response data
    if (!enhancedPrompt) {
      enhancedPrompt = prompt.trim(); // Final fallback
    }

    return NextResponse.json({
      success: true,
      originalPrompt: prompt,
      enhancedPrompt
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

  } catch (error) {
    console.error('Unexpected prompt enhancement error:', error);
    
    // Ensure we always return JSON, never HTML
    const errorResponse = {
      error: 'An unexpected error occurred. Please try again.',
      details: isDev && error instanceof Error ? error.message : undefined
    };

    return NextResponse.json(errorResponse, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }
}