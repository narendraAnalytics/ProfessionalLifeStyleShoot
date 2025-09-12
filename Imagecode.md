## Step 1: System Prompt for Enhancement Model
Here's a powerful system prompt for the enhancement model:
const ENHANCEMENT_SYSTEM_PROMPT = `You are an elite Creative Director at a world-class product photography and marketing studio that serves Fortune 500 brands like Apple, Nike, Chanel, and Tesla. Your expertise spans luxury fashion, tech products, lifestyle brands, and commercial advertising.

Your role is to transform basic user prompts into detailed, professional photography briefs that result in stunning, magazine-quality images that could appear in Vogue, Forbes, or high-end advertising campaigns.

When enhancing prompts, you must:

1. VISUAL COMPOSITION:
- Specify exact camera angles (eye-level, bird's eye, dutch angle, low angle hero shot)
- Define focal length and depth of field (85mm portrait, 24mm wide, f/1.4 bokeh)
- Describe rule of thirds, golden ratio, or symmetrical composition
- Include negative space and visual hierarchy considerations

2. LIGHTING SETUP:
- Detail lighting style (Rembrandt, butterfly, split, loop, broad, short)
- Specify light quality (soft diffused, hard dramatic, golden hour, blue hour)
- Include rim lighting, fill lights, and background separation
- Mention practical lights in scene if applicable

3. COLOR SCIENCE:
- Define color grading (cinematic teal-orange, moody desaturated, vibrant commercial)
- Specify color temperature (warm 3200K, neutral 5600K, cool 6500K)
- Include complementary or analogous color schemes
- Mention brand color integration if applicable

4. STYLING & PROPS:
- Describe wardrobe in detail (textures, fabrics, brands, accessories)
- Specify prop placement and relevance
- Include environmental storytelling elements
- Define the overall aesthetic (minimalist, maximalist, luxury, street, editorial)

5. MOOD & ATMOSPHERE:
- Capture the emotional tone (confident, mysterious, joyful, sophisticated)
- Describe the energy level (dynamic action, serene calm, intense focus)
- Include weather or environmental conditions if relevant
- Specify time of day and seasonal context

6. TECHNICAL SPECIFICATIONS:
- Output: Ultra high resolution, 8K quality, RAW format
- Post-processing style: Clean commercial, film emulation, HDR
- Aspect ratio for intended use (16:9, 1:1, 9:16, 2:3)
- Print-ready quality with proper color space

7. BRAND ALIGNMENT:
- Consider target demographic (Gen Z, millennials, luxury consumers, professionals)
- Match brand voice (playful, serious, innovative, traditional)
- Include subtle product placement if commercial
- Ensure cultural sensitivity and inclusivity

SEARCH ENHANCEMENT:
Use Google Search to research:
- Current photography trends in the specific industry
- Competitor campaign styles
- Cultural references and symbolism
- Technical photography terminology
- Brand guidelines and visual identity

Transform simple prompts into comprehensive creative briefs that any world-class photographer would be excited to execute. The enhanced prompt should be 150-350 words, technically precise, visually rich, and commercially viable.

Remember: You're creating prompts for images that will be used in professional campaigns, social media advertising, magazine editorials, and brand presentations. Every detail matters.`;

## Combined Gemini Service
Create src/lib/gemini.ts:

import {
  GoogleGenAI,
  LiveServerMessage,
  MediaResolution,
  Modality,
  Session,
} from '@google/genai';
import mime from 'mime';

export class GeminiService {
  private ai: GoogleGenAI;
  private responseQueue: LiveServerMessage[] = [];
  private session: Session | undefined = undefined;

  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });
  }

  // Enhance prompt using live model with Google Search
  async enhancePrompt(userPrompt: string): Promise<string> {
    const model = 'models/gemini-2.5-flash-live-preview';
    
    const tools = [
      { googleSearch: {} },
    ];

    const config = {
      responseModalities: [Modality.TEXT],
      mediaResolution: MediaResolution.MEDIA_RESOLUTION_MEDIUM,
      contextWindowCompression: {
        triggerTokens: '25600',
        slidingWindow: { targetTokens: '12800' },
      },
      tools,
    };

    try {
      this.session = await this.ai.live.connect({
        model,
        callbacks: {
          onopen: () => console.debug('Session opened'),
          onmessage: (message: LiveServerMessage) => {
            this.responseQueue.push(message);
          },
          onerror: (e: ErrorEvent) => console.error('Error:', e.message),
          onclose: (e: CloseEvent) => console.debug('Session closed:', e.reason),
        },
        config
      });

      // Send system prompt and user prompt
      this.session.sendClientContent({
        turns: [
          ENHANCEMENT_SYSTEM_PROMPT,
          `Enhance this prompt for professional product/marketing photography: "${userPrompt}"`
        ]
      });

      const enhancedPrompt = await this.handleTurn();
      this.session.close();
      
      return enhancedPrompt;
    } catch (error) {
      console.error('Enhancement error:', error);
      throw error;
    }
  }

  private async handleTurn(): Promise<string> {
    let fullResponse = '';
    let done = false;
    
    while (!done) {
      const message = await this.waitMessage();
      
      if (message.serverContent?.modelTurn?.parts) {
        const part = message.serverContent.modelTurn.parts[0];
        if (part?.text) {
          fullResponse += part.text;
        }
      }
      
      if (message.serverContent?.turnComplete) {
        done = true;
      }
    }
    
    return fullResponse;
  }

  private async waitMessage(): Promise<LiveServerMessage> {
    while (true) {
      const message = this.responseQueue.shift();
      if (message) {
        return message;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // Generate image using enhanced prompt
  async generateImage(enhancedPrompt: string): Promise<Buffer> {
    const model = 'gemini-2.5-flash-image-preview';
    
    const config = {
      responseModalities: ['IMAGE', 'TEXT'],
    };

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `Create a professional marketing/product photograph based on this brief: ${enhancedPrompt}`,
          },
        ],
      },
    ];

    try {
      const response = await this.ai.models.generateContentStream({
        model,
        config,
        contents,
      });

      for await (const chunk of response) {
        if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
          const inlineData = chunk.candidates[0].content.parts[0].inlineData;
          const buffer = Buffer.from(inlineData.data || '', 'base64');
          return buffer;
        }
      }

      throw new Error('No image generated');
    } catch (error) {
      console.error('Image generation error:', error);
      throw error;
    }
  }

  // Chat refinement for iterative improvements
  async refineImage(
    previousPrompt: string, 
    userFeedback: string
  ): Promise<{ prompt: string; image: Buffer }> {
    // First enhance the refinement request
    const refinedPrompt = await this.enhancePrompt(
      `${previousPrompt}. User feedback: ${userFeedback}`
    );
    
    // Generate new image
    const image = await this.generateImage(refinedPrompt);
    
    return { prompt: refinedPrompt, image };
  }
}

## ImageKit Service
Create src/lib/imagekit.ts:

import ImageKit from 'imagekit';

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
    userId: string
  ): Promise<{ url: string; fileId: string }> {
    try {
      const response = await this.imagekit.upload({
        file: buffer,
        fileName: `${userId}/${Date.now()}_${fileName}`,
        folder: `/photoshoots/${userId}`,
        tags: ['ai-generated', 'professional'],
      });

      return {
        url: response.url,
        fileId: response.fileId,
      };
    } catch (error) {
      console.error('ImageKit upload error:', error);
      throw error;
    }
  }

  getOptimizedUrl(url: string, transformations?: any[]) {
    return this.imagekit.url({
      path: url,
      transformation: transformations || [
        {
          quality: '90',
          format: 'webp',
        },
      ],
    });
  }
}

## API Routes
Enhance Prompt Route
Create src/app/api/enhance-prompt/route.ts:

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { GeminiService } from '@/lib/gemini';
import { ImageKitService } from '@/lib/imagekit';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt, enhancedPrompt, style } = await req.json();

    // Check and update credits
    const user = await prisma.user.update({
      where: { clerkId: userId },
      data: {
        creditsRemaining: { decrement: 1 },
        creditsUsed: { increment: 1 },
      },
    });

    if (user.creditsRemaining < 0) {
      return NextResponse.json({ error: 'No credits remaining' }, { status: 403 });
    }

    // Generate image
    const gemini = new GeminiService();
    const imageBuffer = await gemini.generateImage(enhancedPrompt || prompt);

    // Upload to ImageKit
    const imageKit = new ImageKitService();
    const { url, fileId } = await imageKit.uploadImage(
      imageBuffer,
      'generated.png',
      userId
    );

    // Save to database
    const photoshoot = await prisma.photoshoot.create({
      data: {
        userId: user.id,
        originalImageUrl: url,
        generatedImageUrl: url,
        style: style || 'professional',
        prompt,
        enhancedPrompt,
        status: 'completed',
        creditsUsed: 1,
      },
    });

    return NextResponse.json({
      success: true,
      imageUrl: url,
      photoshootId: photoshoot.id,
      creditsRemaining: user.creditsRemaining,
    });
  } catch (error) {
    console.error('Generate image error:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' }, 
      { status: 500 }
    );
  }
}
