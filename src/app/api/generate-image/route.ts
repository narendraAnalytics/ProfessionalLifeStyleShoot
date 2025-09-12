import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { GeminiService } from '@/lib/gemini';
import { imageKitService } from '@/lib/imagekit';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt, enhancedPrompt, style, skipEnhancement } = await req.json();

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

    // Smart credit calculation: if prompt is already enhanced, only charge for generation
    const creditsNeeded = skipEnhancement ? 2 : (enhancedPrompt ? 2 : 3); // 2 for basic/pre-enhanced, 3 for enhance+generate
    if (user.creditsRemaining < creditsNeeded) {
      return NextResponse.json({ 
        error: `Insufficient credits. Need ${creditsNeeded}, have ${user.creditsRemaining}` 
      }, { status: 403 });
    }

    // Initialize services
    const geminiService = new GeminiService();
    let finalPrompt = prompt.trim();
    let actualEnhancedPrompt = enhancedPrompt;

    try {
      // Enhance prompt if not already enhanced or if skipEnhancement is false
      if (!skipEnhancement && !enhancedPrompt) {
        console.log('🔄 Enhancing prompt first...');
        actualEnhancedPrompt = await geminiService.enhancePrompt(finalPrompt);
        finalPrompt = actualEnhancedPrompt;
        console.log('✨ Using enhanced prompt for image generation:', finalPrompt);
      } else if (enhancedPrompt) {
        finalPrompt = enhancedPrompt;
        console.log('✅ Using pre-enhanced prompt:', finalPrompt);
      } else {
        console.log('⚠️ Using original prompt (skip enhancement):', finalPrompt);
      }

      // Generate image using the final prompt
      console.log('🎨 Starting image generation with final prompt:', finalPrompt);
      const imageBuffer = await geminiService.generateImage(finalPrompt);

      // Upload to ImageKit
      const uploadResult = await imageKitService.uploadImage(
        imageBuffer,
        'ai-generated.png',
        userId,
        {
          folder: `/photoshoots/${userId}`,
          tags: ['ai-generated', 'professional', style || 'general'],
        }
      );

      // Save to database
      const photoshoot = await prisma.photoshoot.create({
        data: {
          userId: user.id,
          originalImageUrl: uploadResult.url,
          generatedImageUrl: uploadResult.url,
          thumbnailUrl: uploadResult.thumbnailUrl,
          imageKitFileId: uploadResult.fileId,
          style: style || 'professional',
          originalPrompt: prompt,
          enhancedPrompt: actualEnhancedPrompt,
          status: 'completed',
          creditsUsed: creditsNeeded,
        },
      });

      // Update user credits
      await prisma.user.update({
        where: { clerkId: userId },
        data: {
          creditsRemaining: { decrement: creditsNeeded },
          creditsUsed: { increment: creditsNeeded },
        },
      });

      // Generate responsive URLs
      const responsiveUrls = imageKitService.getResponsiveUrls(uploadResult.url);

      console.log('📊 Image URLs generated:', {
        originalUrl: uploadResult.url,
        thumbnailUrl: uploadResult.thumbnailUrl,
        responsiveUrls
      });

      // Clean up Gemini service resources
      geminiService.cleanup();

      return NextResponse.json({
        success: true,
        photoshoot: {
          id: photoshoot.id,
          imageUrl: uploadResult.url,
          thumbnailUrl: uploadResult.thumbnailUrl,
          responsiveUrls,
          style: photoshoot.style,
          originalPrompt: photoshoot.originalPrompt,
          enhancedPrompt: photoshoot.enhancedPrompt,
          createdAt: photoshoot.createdAt,
        },
        creditsUsed: creditsNeeded,
        remainingCredits: user.creditsRemaining - creditsNeeded,
      });

    } finally {
      // Ensure cleanup even if an error occurs
      geminiService.cleanup();
    }

  } catch (error) {
    console.error('Image generation error:', error);
    
    // Return different error messages based on the error type
    if (error instanceof Error) {
      if (error.message.includes('GEMINI_API_KEY') || error.message.includes('IMAGEKIT')) {
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
      if (error.message.includes('Failed to upload')) {
        return NextResponse.json(
          { error: 'Failed to save generated image. Please try again.' }, 
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate image. Please try again.' }, 
      { status: 500 }
    );
  }
}