import ImageKit from 'imagekit';

if (!process.env.IMAGEKIT_PRIVATE_KEY) {
  throw new Error('Missing IMAGEKIT_PRIVATE_KEY')
}

if (!process.env.IMAGEKIT_PUBLIC_KEY) {
  throw new Error('Missing IMAGEKIT_PUBLIC_KEY')
}

if (!process.env.IMAGEKIT_URL_ENDPOINT) {
  throw new Error('Missing IMAGEKIT_URL_ENDPOINT')
}

export class ImageKitService {
  private imagekit: ImageKit;

  constructor() {
    this.imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
    });
  }

  async uploadImage(
    buffer: Buffer, 
    fileName: string, 
    userId: string,
    options?: {
      folder?: string;
      tags?: string[];
      useUniqueFileName?: boolean;
    }
  ): Promise<{ url: string; fileId: string; thumbnailUrl: string }> {
    try {
      const timestamp = Date.now();
      const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
      const finalFileName = options?.useUniqueFileName !== false 
        ? `${timestamp}_${sanitizedFileName}` 
        : sanitizedFileName;

      const response = await this.imagekit.upload({
        file: buffer,
        fileName: finalFileName,
        folder: options?.folder || `/photoshoots/${userId}`,
        tags: options?.tags || ['ai-generated', 'professional'],
        useUniqueFileName: false, // We handle this ourselves above
        transformation: {
          pre: 'w-800,h-800,c-at_max,q-90', // Optimize uploaded images
        }
      });

      // Generate thumbnail URL
      const thumbnailUrl = this.getOptimizedUrl(response.url, [
        { width: 300, height: 300, crop: 'at_max' },
        { quality: 80, format: 'webp' }
      ]);

      return {
        url: response.url,
        fileId: response.fileId,
        thumbnailUrl,
      };
    } catch (error) {
      console.error('ImageKit upload error:', error);
      throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Upload multiple images in batch
  async uploadMultipleImages(
    images: { buffer: Buffer; fileName: string }[],
    userId: string,
    options?: {
      folder?: string;
      tags?: string[];
    }
  ): Promise<Array<{ url: string; fileId: string; thumbnailUrl: string; fileName: string }>> {
    const uploadPromises = images.map(async (image, index) => {
      try {
        const result = await this.uploadImage(
          image.buffer,
          image.fileName,
          userId,
          {
            ...options,
            useUniqueFileName: true
          }
        );
        return {
          ...result,
          fileName: image.fileName
        };
      } catch (error) {
        console.error(`Failed to upload image ${index + 1}:`, error);
        throw error;
      }
    });

    try {
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Batch upload error:', error);
      throw new Error('Failed to upload one or more images');
    }
  }

  // Generate optimized URLs with transformations
  getOptimizedUrl(url: string, transformations?: Array<Record<string, any>>): string {
    const defaultTransformations = [
      {
        quality: 90,
        format: 'webp',
      },
    ];

    return this.imagekit.url({
      path: url,
      transformation: transformations || defaultTransformations,
    });
  }

  // Generate responsive image URLs for different screen sizes
  getResponsiveUrls(url: string): {
    small: string;
    medium: string;
    large: string;
    original: string;
  } {
    return {
      small: this.getOptimizedUrl(url, [
        { width: 400, height: 400, crop: 'at_max' },
        { quality: 80, format: 'webp' }
      ]),
      medium: this.getOptimizedUrl(url, [
        { width: 800, height: 800, crop: 'at_max' },
        { quality: 85, format: 'webp' }
      ]),
      large: this.getOptimizedUrl(url, [
        { width: 1200, height: 1200, crop: 'at_max' },
        { quality: 90, format: 'webp' }
      ]),
      original: this.getOptimizedUrl(url, [
        { quality: 95, format: 'auto' }
      ])
    };
  }

  // Delete an image from ImageKit
  async deleteImage(fileId: string): Promise<void> {
    try {
      await this.imagekit.deleteFile(fileId);
    } catch (error) {
      console.error('ImageKit delete error:', error);
      throw new Error(`Failed to delete image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get image details
  async getImageDetails(fileId: string) {
    try {
      return await this.imagekit.getFileDetails(fileId);
    } catch (error) {
      console.error('ImageKit get details error:', error);
      throw new Error(`Failed to get image details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // List images for a user
  async listUserImages(
    userId: string, 
    options?: {
      limit?: number;
      skip?: number;
      tags?: string;
    }
  ) {
    try {
      return await this.imagekit.listFiles({
        path: `/photoshoots/${userId}`,
        limit: options?.limit || 20,
        skip: options?.skip || 0,
        tags: options?.tags,
        sort: 'DESC_CREATED'
      });
    } catch (error) {
      console.error('ImageKit list images error:', error);
      throw new Error(`Failed to list images: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Generate authentication parameters for client-side uploads
  getAuthenticationParameters(token?: string, expire?: number) {
    const defaultExpire = Math.floor(Date.now() / 1000) + (60 * 60); // 1 hour from now
    const defaultToken = Math.random().toString(36).substring(2, 15);

    return this.imagekit.getAuthenticationParameters(
      token || defaultToken, 
      expire || defaultExpire
    );
  }

  // Create image variations for A/B testing
  async createImageVariations(
    originalUrl: string,
    variations: Array<{
      name: string;
      transformations: Array<Record<string, any>>;
    }>
  ): Promise<Array<{ name: string; url: string }>> {
    return variations.map(variation => ({
      name: variation.name,
      url: this.getOptimizedUrl(originalUrl, variation.transformations)
    }));
  }

  // Analyze image and extract metadata
  async analyzeImage(fileId: string) {
    try {
      const details = await this.getImageDetails(fileId);
      
      return {
        size: details.size,
        width: details.width,
        height: details.height,
        format: details.fileType,
        hasTransparency: details.hasAlpha,
        colorProfile: details.embeddedMetadata?.ColorSpace,
        createdAt: details.createdAt,
        updatedAt: details.updatedAt,
        tags: details.tags,
        AITags: details.AITags,
      };
    } catch (error) {
      console.error('Image analysis error:', error);
      throw new Error(`Failed to analyze image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Create a singleton instance
export const imageKitService = new ImageKitService();