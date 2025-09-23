import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { GeminiService } from '@/lib/gemini';
import { imageKitService } from '@/lib/imagekit';
import { prisma } from '@/lib/prisma';

// Plan validation function
async function validatePlanLimits(userId: string, aspectRatio: string) {
  const { has } = await auth();
  
  // Determine user plan
  let plan = 'free';
  if (has && has({ plan: 'max_ultimate' })) {
    plan = 'max_ultimate';
  } else if (has && has({ plan: 'pro_plan' })) {
    plan = 'pro_plan';
  }

  // Plan definitions
  const planLimits = {
    free: {
      maxImagesPerMonth: 2,
      allowedAspectRatios: ['1:1']
    },
    pro_plan: {
      maxImagesPerMonth: 15,
      allowedAspectRatios: ['1:1', '16:9', '9:16', '4:3', '3:4', '21:9']
    },
    max_ultimate: {
      maxImagesPerMonth: -1, // unlimited
      allowedAspectRatios: ['1:1', '16:9', '9:16', '4:3', '3:4', '21:9', '2:3', '3:2']
    }
  };

  const currentPlan = planLimits[plan as keyof typeof planLimits];

  // Check aspect ratio restriction
  if (!currentPlan.allowedAspectRatios.includes(aspectRatio || '1:1')) {
    return {
      valid: false,
      error: `${aspectRatio} aspect ratio is not available on your ${plan === 'free' ? 'Free' : plan.replace('_', ' ')} plan. ${
        plan === 'free' ? 'Upgrade to Pro for all aspect ratios!' : 'Upgrade to Max Ultimate for all aspect ratios!'
      }`
    };
  }

  // Check monthly usage limit (skip for unlimited plans)
  if (currentPlan.maxImagesPerMonth !== -1) {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!user) {
      return { valid: false, error: 'User not found' };
    }

    // Calculate current month usage
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    monthEnd.setHours(23, 59, 59, 999);

    const currentUsage = await prisma.photoshoot.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: monthStart,
          lte: monthEnd
        }
      }
    });

    if (currentUsage >= currentPlan.maxImagesPerMonth) {
      return {
        valid: false,
        error: `You've reached your monthly limit of ${currentPlan.maxImagesPerMonth} images. ${
          plan === 'free' ? 'Upgrade to Pro for 15 images/month!' : 'Upgrade to Max Ultimate for unlimited images!'
        }`
      };
    }
  }

  return { valid: true };
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt, enhancedPrompt, style, skipEnhancement, aspectRatio } = await req.json();

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json({ error: 'Valid prompt is required' }, { status: 400 });
    }

    // Validate plan limits and restrictions
    const planValidation = await validatePlanLimits(userId, aspectRatio || '1:1');
    if (!planValidation.valid) {
      return NextResponse.json({ error: planValidation.error }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Initialize services
    const geminiService = new GeminiService();
    let finalPrompt = prompt.trim();
    let actualEnhancedPrompt = enhancedPrompt;

    try {
      // Enhance prompt if not already enhanced or if skipEnhancement is false
      // Always re-enhance for aspect ratio-specific instructions if aspectRatio is provided
      if (!skipEnhancement && !enhancedPrompt) {
        console.log('🔄 Enhancing prompt first with aspect ratio:', aspectRatio);
        actualEnhancedPrompt = await geminiService.enhancePrompt(finalPrompt, aspectRatio);
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

      // Upload to ImageKit with enhanced aspect ratio transformation
      console.log('📤 Uploading to ImageKit with aspect ratio:', aspectRatio);
      const uploadResult = await imageKitService.uploadImage(
        imageBuffer,
        'ai-generated.png',
        userId,
        {
          folder: `/photoshoots/${userId}`,
          tags: [
            'ai-generated', 
            'professional', 
            style || 'general', 
            aspectRatio ? `ar-${aspectRatio}` : '1-1',
            'standard'
          ],
          aspectRatio: aspectRatio || '1-1'  // Pass aspect ratio to service for smart cropping
        }
      );
      console.log('✅ ImageKit upload successful with smart cropping applied');

      // Generate responsive URLs with aspect ratio
      console.log('📏 Generating responsive URLs for aspect ratio:', aspectRatio)
      const responsiveUrls = imageKitService.getResponsiveUrls(uploadResult.url, aspectRatio);
      console.log('📏 Responsive URLs generated:', responsiveUrls)
      
      // Generate B&W versions immediately for instant access
      console.log('⚫ Generating B&W URLs for aspect ratio:', aspectRatio)
      const bwUrls = imageKitService.generateBWUrls(uploadResult.url, aspectRatio);
      console.log('⚫ B&W URLs generated:', bwUrls)

      // Save to database with B&W URL
      console.log('💾 Saving to database with B&W data:', {
        bwImageUrl: bwUrls.original,
        bwUrls: bwUrls,
        aspectRatio: aspectRatio
      })
      
      const photoshoot = await prisma.photoshoot.create({
        data: {
          userId: user.id,
          originalImageUrl: uploadResult.url,
          generatedImageUrl: uploadResult.url,
          thumbnailUrl: uploadResult.thumbnailUrl,
          bwImageUrl: bwUrls.original, // Store the B&W original for quick access
          imageKitFileId: uploadResult.fileId,
          style: style || 'professional',
          originalPrompt: prompt,
          enhancedPrompt: actualEnhancedPrompt,
          status: 'completed',
          metadata: {
            responsiveUrls,
            bwUrls,  // Store all B&W variations
            aspectRatio
          }
        },
      });

      console.log('💾 Database save successful:', {
        photoshootId: photoshoot.id,
        storedBwImageUrl: photoshoot.bwImageUrl,
        metadataKeys: Object.keys(photoshoot.metadata || {})
      })

      // Credits system disabled for now

      console.log('📊 Image URLs generated:', {
        originalUrl: uploadResult.url,
        thumbnailUrl: uploadResult.thumbnailUrl,
        responsiveUrls,
        bwUrls
      });

      // Clean up Gemini service resources
      geminiService.cleanup();

      return NextResponse.json({
        success: true,
        photoshoot: {
          id: photoshoot.id,
          imageUrl: uploadResult.url,
          thumbnailUrl: uploadResult.thumbnailUrl,
          bwImageUrl: photoshoot.bwImageUrl,
          responsiveUrls,
          bwUrls, // Include B&W responsive URLs
          style: photoshoot.style,
          originalPrompt: photoshoot.originalPrompt,
          enhancedPrompt: photoshoot.enhancedPrompt,
          createdAt: photoshoot.createdAt,
        },
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