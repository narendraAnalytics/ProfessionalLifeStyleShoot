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

    const { photoshootId, feedback, newPrompt } = await req.json();

    if (!photoshootId) {
      return NextResponse.json({ error: 'Photoshoot ID is required' }, { status: 400 });
    }

    if (!feedback && !newPrompt) {
      return NextResponse.json({ error: 'Either feedback or new prompt is required' }, { status: 400 });
    }

    // Check user credits
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, creditsRemaining: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const creditsNeeded = 3; // Cost for refinement
    if (user.creditsRemaining < creditsNeeded) {
      return NextResponse.json({ 
        error: `Insufficient credits. Need ${creditsNeeded}, have ${user.creditsRemaining}` 
      }, { status: 403 });
    }

    // Get original photoshoot
    const originalPhotoshoot = await prisma.photoshoot.findFirst({
      where: { 
        id: photoshootId,
        userId: user.id // Ensure user owns this photoshoot
      },
      select: {
        id: true,
        originalPrompt: true,
        enhancedPrompt: true,
        style: true
      }
    });

    if (!originalPhotoshoot) {
      return NextResponse.json({ error: 'Photoshoot not found' }, { status: 404 });
    }

    const geminiService = new GeminiService();

    try {
      let refinementResult;

      if (newPrompt) {
        // Generate entirely new image based on new prompt
        const enhancedPrompt = await geminiService.enhancePrompt(newPrompt.trim());
        const imageBuffer = await geminiService.generateImage(enhancedPrompt);
        
        refinementResult = {
          prompt: enhancedPrompt,
          image: imageBuffer
        };
      } else if (feedback) {
        // Refine existing image based on feedback
        const basePrompt = originalPhotoshoot.enhancedPrompt || originalPhotoshoot.originalPrompt;
        refinementResult = await geminiService.refineImage(basePrompt, feedback);
      } else {
        throw new Error('Invalid refinement request');
      }

      // Upload refined image to ImageKit
      const uploadResult = await imageKitService.uploadImage(
        refinementResult.image,
        'ai-refined.png',
        userId,
        {
          folder: `/photoshoots/${userId}/refined`,
          tags: ['ai-generated', 'refined', originalPhotoshoot.style, 'variation'],
        }
      );

      // Create new photoshoot entry for the refined image
      const refinedPhotoshoot = await prisma.photoshoot.create({
        data: {
          userId: user.id,
          originalImageUrl: uploadResult.url,
          generatedImageUrl: uploadResult.url,
          thumbnailUrl: uploadResult.thumbnailUrl,
          imageKitFileId: uploadResult.fileId,
          style: originalPhotoshoot.style,
          originalPrompt: newPrompt || `${originalPhotoshoot.originalPrompt} (refined)`,
          enhancedPrompt: refinementResult.prompt,
          status: 'completed',
          creditsUsed: creditsNeeded,
          parentPhotoshootId: originalPhotoshoot.id, // Link to original
          metadata: {
            refinementType: newPrompt ? 'new_prompt' : 'feedback_based',
            feedback: feedback || null,
            refinedAt: new Date().toISOString(),
            originalPhotoshootId: originalPhotoshoot.id
          }
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

      // Clean up resources
      geminiService.cleanup();

      return NextResponse.json({
        success: true,
        refinedPhotoshoot: {
          id: refinedPhotoshoot.id,
          imageUrl: uploadResult.url,
          thumbnailUrl: uploadResult.thumbnailUrl,
          responsiveUrls,
          style: refinedPhotoshoot.style,
          originalPrompt: refinedPhotoshoot.originalPrompt,
          enhancedPrompt: refinedPhotoshoot.enhancedPrompt,
          createdAt: refinedPhotoshoot.createdAt,
          parentId: originalPhotoshoot.id,
          metadata: refinedPhotoshoot.metadata
        },
        creditsUsed: creditsNeeded,
        remainingCredits: user.creditsRemaining - creditsNeeded,
      });

    } finally {
      // Ensure cleanup even if an error occurs
      geminiService.cleanup();
    }

  } catch (error) {
    console.error('Chat refinement error:', error);
    
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
    }

    return NextResponse.json(
      { error: 'Failed to refine image. Please try again.' }, 
      { status: 500 }
    );
  }
}

// GET endpoint to fetch refinement history for a photoshoot
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const photoshootId = searchParams.get('photoshootId');

    if (!photoshootId) {
      return NextResponse.json({ error: 'Photoshoot ID is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get original photoshoot and all its refinements
    const [originalPhotoshoot, refinements] = await Promise.all([
      prisma.photoshoot.findFirst({
        where: { 
          id: photoshootId,
          userId: user.id
        },
        select: {
          id: true,
          originalImageUrl: true,
          generatedImageUrl: true,
          thumbnailUrl: true,
          style: true,
          originalPrompt: true,
          enhancedPrompt: true,
          createdAt: true,
          metadata: true
        }
      }),
      prisma.photoshoot.findMany({
        where: { 
          parentPhotoshootId: photoshootId,
          userId: user.id
        },
        select: {
          id: true,
          originalImageUrl: true,
          generatedImageUrl: true,
          thumbnailUrl: true,
          style: true,
          originalPrompt: true,
          enhancedPrompt: true,
          createdAt: true,
          metadata: true
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    if (!originalPhotoshoot) {
      return NextResponse.json({ error: 'Photoshoot not found' }, { status: 404 });
    }

    // Add responsive URLs to all images
    const processedOriginal = {
      ...originalPhotoshoot,
      responsiveUrls: imageKitService.getResponsiveUrls(originalPhotoshoot.generatedImageUrl),
      isOriginal: true
    };

    const processedRefinements = refinements.map(refinement => ({
      ...refinement,
      responsiveUrls: imageKitService.getResponsiveUrls(refinement.generatedImageUrl),
      isOriginal: false
    }));

    return NextResponse.json({
      success: true,
      original: processedOriginal,
      refinements: processedRefinements,
      totalRefinements: refinements.length
    });

  } catch (error) {
    console.error('Fetch refinements error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch refinement history' },
      { status: 500 }
    );
  }
}