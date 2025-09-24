import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { imageKitService } from '@/lib/imagekit';
import { prisma } from '@/lib/prisma';
import { GeminiService } from '@/lib/gemini';

// Plan validation function for image merging
async function validateMergePlanLimits(userId: string) {
  const { has } = await auth();
  
  // Determine user plan
  let plan = 'free';
  if (has && has({ plan: 'max_ultimate' })) {
    plan = 'max_ultimate';
  } else if (has && has({ plan: 'pro_plan' })) {
    plan = 'pro_plan';
  }

  // Plan definitions for merging
  const planLimits = {
    free: { maxMergesPerMonth: 1 },
    pro_plan: { maxMergesPerMonth: 8 },
    max_ultimate: { maxMergesPerMonth: -1 } // unlimited
  };

  const currentPlan = planLimits[plan as keyof typeof planLimits];

  // Check monthly usage limit (skip for unlimited plans)
  if (currentPlan.maxMergesPerMonth !== -1) {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!user) {
      return { valid: false, error: 'User not found' };
    }

    // For now, we'll count compositions in the photoshoot table with a specific tag
    // You might want to create a separate table for compositions later
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    monthEnd.setHours(23, 59, 59, 999);

    const currentMergeUsage = await prisma.photoshoot.count({
      where: {
        userId: user.id,
        style: 'composition', // We'll use this to identify merges
        createdAt: {
          gte: monthStart,
          lte: monthEnd
        }
      }
    });

    if (currentMergeUsage >= currentPlan.maxMergesPerMonth) {
      return {
        valid: false,
        error: `You've reached your monthly limit of ${currentPlan.maxMergesPerMonth} image merge${currentPlan.maxMergesPerMonth === 1 ? '' : 's'}. ${
          plan === 'free' ? 'Upgrade to Pro for 8 merges/month!' : 'Upgrade to Max Ultimate for unlimited merges!'
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

    // Validate merge plan limits
    const planValidation = await validateMergePlanLimits(userId);
    if (!planValidation.valid) {
      return NextResponse.json({ error: planValidation.error }, { status: 403 });
    }

    const formData = await req.formData();
    const image1 = formData.get('image1') as File;
    const image2 = formData.get('image2') as File;
    const prompt = formData.get('prompt') as string;
    const aspectRatio = formData.get('aspectRatio') as string;

    if (!image1 || !image2) {
      return NextResponse.json({ error: 'Exactly 2 images are required' }, { status: 400 });
    }

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Validate file types and sizes
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const images = [image1, image2];

    for (const image of images) {
      if (!allowedTypes.includes(image.type)) {
        return NextResponse.json({ 
          error: `Unsupported file type: ${image.type}. Allowed types: ${allowedTypes.join(', ')}` 
        }, { status: 400 });
      }
      
      if (image.size > maxFileSize) {
        return NextResponse.json({ 
          error: `File too large: ${image.name}. Maximum size: ${maxFileSize / 1024 / 1024}MB` 
        }, { status: 400 });
      }
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    try {
      // Convert images to buffers for Gemini
      const imageBuffers = await Promise.all(
        images.map(async (image) => ({
          buffer: Buffer.from(await image.arrayBuffer()),
          mimeType: image.type
        }))
      );

      console.log('🎯 Starting image composition process...');
      
      // Initialize Gemini service
      const geminiService = new GeminiService();

      // Generate composition using Gemini
      console.log('🎨 Generating composition with Gemini...');
      const generatedBuffer = await geminiService.generateImageFromComposition(
        prompt,
        imageBuffers
      );

      console.log('✅ Composition generated successfully, uploading to ImageKit...');

      // Upload the generated composition to ImageKit with aspect ratio handling
      console.log('📤 Uploading to ImageKit with aspect ratio:', aspectRatio);
      const uploadResult = await imageKitService.uploadImage(
        generatedBuffer,
        'composition.png',
        userId,
        {
          folder: `/compositions/${userId}`,
          tags: [
            'composition', 
            'ai-generated', 
            'professional',
            aspectRatio ? `ar-${aspectRatio}` : '1-1',
            'standard'
          ],
          aspectRatio: aspectRatio || '1-1'  // Pass aspect ratio to service for smart cropping
        }
      );

      console.log('✅ ImageKit upload successful with smart cropping applied');

      // Generate responsive URLs with aspect ratio
      console.log('📏 Generating responsive URLs for aspect ratio:', aspectRatio);
      const responsiveUrls = imageKitService.getResponsiveUrls(uploadResult.url, aspectRatio);
      console.log('📏 Responsive URLs generated:', responsiveUrls);

      // Generate B&W versions immediately for instant access
      console.log('⚫ Generating B&W URLs for aspect ratio:', aspectRatio);
      const bwUrls = imageKitService.generateBWUrls(uploadResult.url, aspectRatio);
      console.log('⚫ B&W URLs generated:', bwUrls);

      // Save to database with B&W URL
      console.log('💾 Saving to database with B&W data:', {
        bwImageUrl: bwUrls.original,
        bwUrls: bwUrls,
        aspectRatio: aspectRatio
      });

      const photoshoot = await prisma.photoshoot.create({
        data: {
          userId: user.id,
          originalImageUrl: uploadResult.url,
          generatedImageUrl: uploadResult.url,
          thumbnailUrl: uploadResult.thumbnailUrl,
          bwImageUrl: bwUrls.original, // Store the B&W original for quick access
          imageKitFileId: uploadResult.fileId,
          style: 'composition',
          originalPrompt: prompt,
          enhancedPrompt: null,
          status: 'completed',
          metadata: {
            responsiveUrls,
            bwUrls,  // Store all B&W variations
            aspectRatio,
            compositionType: 'multi-image',
            inputImages: images.length,
            generatedAt: new Date().toISOString(),
            originalFileNames: images.map(img => img.name)
          }
        },
      });

      console.log('💾 Database save successful:', {
        photoshootId: photoshoot.id,
        storedBwImageUrl: photoshoot.bwImageUrl,
        metadataKeys: Object.keys(photoshoot.metadata || {})
      });

      console.log('📊 Image URLs generated:', {
        originalUrl: uploadResult.url,
        thumbnailUrl: uploadResult.thumbnailUrl,
        responsiveUrls,
        bwUrls
      });

      console.log('🎉 Image composition completed successfully!');

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
          enhancedPrompt: null,
          createdAt: photoshoot.createdAt,
        },
      });

    } catch (error) {
      console.error('Composition generation error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('GEMINI') || error.message.includes('API')) {
          return NextResponse.json(
            { error: 'AI service temporarily unavailable. Please try again.' },
            { status: 503 }
          );
        }
        if (error.message.includes('quota') || error.message.includes('QUOTA_EXCEEDED')) {
          return NextResponse.json(
            { error: 'AI service quota exceeded. Please try again later.' },
            { status: 429 }
          );
        }
        if (error.message.includes('safety') || error.message.includes('SAFETY')) {
          return NextResponse.json(
            { error: 'Content filtered for safety. Please try different images or prompt.' },
            { status: 400 }
          );
        }
        if (error.message.includes('IMAGEKIT')) {
          return NextResponse.json(
            { error: 'Image upload service error. Please try again.' },
            { status: 500 }
          );
        }
      }

      return NextResponse.json(
        { error: 'Failed to generate image composition. Please try again.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Image composition API error:', error);
    
    return NextResponse.json(
      { error: 'Failed to process image composition request. Please try again.' }, 
      { status: 500 }
    );
  }
}