import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { imageKitService } from '@/lib/imagekit';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    const style = formData.get('style') as string || 'upload';
    const description = formData.get('description') as string || '';

    if (!files.length) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    // Validate file types and sizes
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ 
          error: `Unsupported file type: ${file.type}. Allowed types: ${allowedTypes.join(', ')}` 
        }, { status: 400 });
      }
      
      if (file.size > maxFileSize) {
        return NextResponse.json({ 
          error: `File too large: ${file.name}. Maximum size: ${maxFileSize / 1024 / 1024}MB` 
        }, { status: 400 });
      }
    }

    // Check user credits
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, creditsRemaining: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const creditsNeeded = files.length; // 1 credit per uploaded image
    if (user.creditsRemaining < creditsNeeded) {
      return NextResponse.json({ 
        error: `Insufficient credits. Need ${creditsNeeded}, have ${user.creditsRemaining}` 
      }, { status: 403 });
    }

    // Convert files to buffers for upload
    const imageData = await Promise.all(
      files.map(async (file) => ({
        buffer: Buffer.from(await file.arrayBuffer()),
        fileName: file.name,
        size: file.size,
        type: file.type
      }))
    );

    try {
      // Upload images to ImageKit
      const uploadResults = await imageKitService.uploadMultipleImages(
        imageData,
        userId,
        {
          folder: `/uploads/${userId}`,
          tags: ['user-upload', style, new Date().toISOString().split('T')[0]], // Add date tag
        }
      );

      // Save to database
      const photoshootPromises = uploadResults.map(async (result, index) => {
        return prisma.photoshoot.create({
          data: {
            userId: user.id,
            originalImageUrl: result.url,
            generatedImageUrl: result.url, // Same as original for uploads
            thumbnailUrl: result.thumbnailUrl,
            imageKitFileId: result.fileId,
            style: style,
            originalPrompt: description || `Uploaded image: ${result.fileName}`,
            enhancedPrompt: null,
            status: 'completed',
            creditsUsed: 1,
            metadata: {
              originalFileName: result.fileName,
              fileSize: imageData[index].size,
              fileType: imageData[index].type,
              uploadedAt: new Date().toISOString()
            }
          },
        });
      });

      const photoshoots = await Promise.all(photoshootPromises);

      // Update user credits
      await prisma.user.update({
        where: { clerkId: userId },
        data: {
          creditsRemaining: { decrement: creditsNeeded },
          creditsUsed: { increment: creditsNeeded },
        },
      });

      // Generate responsive URLs for each image
      const processedImages = uploadResults.map((result, index) => ({
        id: photoshoots[index].id,
        imageUrl: result.url,
        thumbnailUrl: result.thumbnailUrl,
        responsiveUrls: imageKitService.getResponsiveUrls(result.url),
        fileName: result.fileName,
        style: style,
        uploadedAt: photoshoots[index].createdAt,
        metadata: photoshoots[index].metadata
      }));

      return NextResponse.json({
        success: true,
        images: processedImages,
        totalUploaded: files.length,
        creditsUsed: creditsNeeded,
        remainingCredits: user.creditsRemaining - creditsNeeded,
      });

    } catch (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload images. Please try again.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Image upload error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('IMAGEKIT')) {
        return NextResponse.json(
          { error: 'Image service configuration error' }, 
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to process image upload. Please try again.' }, 
      { status: 500 }
    );
  }
}

// Also support GET to fetch uploaded images
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const style = searchParams.get('style');

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const whereClause: any = { userId: user.id };
    if (style) {
      whereClause.style = style;
    }

    const photoshoots = await prisma.photoshoot.findMany({
      where: whereClause,
      select: {
        id: true,
        originalImageUrl: true,
        generatedImageUrl: true,
        thumbnailUrl: true,
        style: true,
        originalPrompt: true,
        enhancedPrompt: true,
        status: true,
        createdAt: true,
        metadata: true
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });

    // Add responsive URLs to each photoshoot
    const processedPhotoshoots = photoshoots.map(photoshoot => ({
      ...photoshoot,
      responsiveUrls: imageKitService.getResponsiveUrls(photoshoot.generatedImageUrl)
    }));

    return NextResponse.json({
      success: true,
      images: processedPhotoshoots,
      pagination: {
        limit,
        offset,
        total: processedPhotoshoots.length
      }
    });

  } catch (error) {
    console.error('Fetch images error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}