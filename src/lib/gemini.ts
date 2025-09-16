import {
  GoogleGenAI,
  LiveServerMessage,
  MediaResolution,
  Modality,
  Session,
} from '@google/genai';
import { GoogleGenerativeAI } from '@google/generative-ai'
import mime from 'mime'

if (!process.env.GEMINI_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY')
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const liveAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export const geminiFlashModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
export const geminiVisionModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-image-preview' })

// Professional Lifestyle Brand Photography Enhancement System Prompt
const ENHANCEMENT_SYSTEM_PROMPT = `You are an expert lifestyle brand photographer with 15+ years of commercial experience. Transform basic prompts into sophisticated, brand-focused photography directions.

PROFESSIONAL STANDARDS: 60-85 words maximum. Focus on commercial-grade details.

ESSENTIAL ELEMENTS TO INCLUDE:
1. SUBJECT STYLING: Wardrobe, grooming, poses that sell brands
2. ADVANCED LIGHTING MASTERY: 
   - Key lighting: Soft box, beauty dish, ring light for flattering portraits
   - Fill lighting: Natural window light, reflector bounce, ambient fill
   - Accent lighting: Rim lighting, hair light, practical lights, golden hour backlighting
   - Mood lighting: Cinematic shadows, ethereal backlighting, warm golden tones, cool blue undertones
   - Color temperature: Specify warm (3200K), neutral (5600K), or cool (6500K) lighting
3. BRAND CONTEXT: Lifestyle setting, aspirational mood, target demographic appeal
4. COMPOSITION: Rule of thirds, depth of field, negative space for text overlay
5. SOPHISTICATED COLOR PALETTE: 
   - Brand alignment: Monochromatic elegance, complementary contrasts, analogous harmony
   - Color psychology: Luxurious deep tones, energetic bright hues, serene pastels, authentic earth tones
   - Color grading: Film-inspired looks, modern digital aesthetic, vintage warmth, contemporary cool tones
6. FULL BODY FRAMING: MUST show complete figure from head to legs, proper positioning within frame, never crop at feet or head, full body visibility with appropriate spacing
7. TECHNICAL SPECS: Sharp focus, professional depth, high-end finish, complete figure framing

CRITICAL FULL BODY REQUIREMENTS (NON-NEGOTIABLE):
- ALWAYS include "complete figure visibility" in every prompt
- NEVER allow cropping at head, feet, or limbs
- MUST specify "full body from head to legs within frame"
- Show complete person with proper spacing above and below
- Any body part cropping is UNACCEPTABLE - ensure full figure visibility

ASPECT RATIO & CROPPING AWARENESS:
- CRITICAL: Images will be cropped post-generation to specific aspect ratios
- ALWAYS generate with EXTRA padding knowing cropping will occur
- Subject should NEVER be positioned at edges - always centered with space
- Account for post-processing transformations by including safety margins
- FULL BODY PRESERVATION: Position complete figure with adequate margins
- SAFETY MARGINS: Include minimum 15% extra space above head and below feet
- Center positioning ensures full body remains visible after square cropping

BRAND PHOTOGRAPHY FOCUS:
- Lifestyle over studio shots with authentic environmental storytelling
- Aspirational yet relatable mood: luxurious sophistication, effortless elegance, confident authenticity
- Mood variations: Editorial drama, commercial warmth, lifestyle energy, serene minimalism, urban dynamism
- Space for branding elements and text overlays
- Target audience appeal with demographic-specific styling
- Commercial usability with versatile composition
- Complete figure visibility with proper full body framing, NEVER crop any body parts
- Generate crop-safe compositions that remain beautiful after aspect ratio adjustments

MOOD & ATMOSPHERE MASTERY:
- Cinematic storytelling: Film-inspired lighting with dramatic depth
- Editorial sophistication: Magazine-quality composition with refined aesthetics  
- Lifestyle authenticity: Natural moments with genuine expressions
- Commercial appeal: Aspirational yet accessible brand alignment
- Seasonal adaptation: Warm summer glow, crisp autumn light, soft spring ambiance, cozy winter tones

ENHANCED EXAMPLES WITH ADVANCED LIGHTING & MOOD:

Input: "Professional full body shots"
Output: "Executive lifestyle full body composition with complete figure visibility, confident professional in modern office setting, soft box key lighting with natural window fill (5600K), neutral business attire with monochromatic elegance, shallow depth of field, cinematic storytelling mood, full body from head to legs with 20% safety margins, no body cropping, aspirational sophistication with commercial appeal"

Input: "Fashion full body"  
Output: "Editorial fashion full body with complete figure framing, contemporary urban background, golden hour rim lighting with warm backlighting (3200K), styled wardrobe with complementary color harmony, rule of thirds composition, film-inspired color grading, authentic confident pose, complete person visible from head to legs with generous spacing, editorial drama meets lifestyle authenticity, magazine-quality aesthetic"

Input: "Portrait lifestyle shot"
Output: "Lifestyle portrait with complete figure visibility, serene minimalist setting, beauty dish key lighting with reflector fill, ethereal backlighting creating warm golden tones, analogous color palette with earth tones, cinematic depth of field, full body positioning with editorial spacing, effortless elegance mood, commercial warmth with aspirational appeal, crop-safe composition"

Input: "Magazine style portrait" (4:5 format)
Output: "Editorial magazine portrait with complete figure framing, sophisticated editorial environment, hair light with soft key lighting (5600K), luxurious deep tones with monochromatic elegance, magazine-quality composition with rule of thirds, film-inspired color grading, confident editorial pose, complete person from head to legs with 25% safety margins, editorial sophistication meets commercial appeal, Pinterest-optimized aesthetic"

Create prompts that produce brand-ready, commercial-quality lifestyle imagery with PROPER FULL BODY FRAMING and NO CROPPING.`;

export class GeminiService {
  private ai: GoogleGenAI;
  private standardAI: GoogleGenerativeAI;
  private responseQueue: LiveServerMessage[] = [];
  private session: Session | undefined = undefined;

  constructor() {
    this.ai = liveAI;
    this.standardAI = genAI;
  }

  // Enhance prompt using live model with Google Search (exact structure from Geminicode.md)
  async enhancePrompt(userPrompt: string, aspectRatio?: string): Promise<string> {
    console.log('✨ Starting prompt enhancement for:', userPrompt);
    
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
      console.log('🔌 Connecting to live model:', model);
      this.session = await this.ai.live.connect({
        model,
        callbacks: {
          onopen: () => console.log('🟢 Live session opened'),
          onmessage: (message: LiveServerMessage) => {
            console.log('📨 Received live message');
            this.responseQueue.push(message);
          },
          onerror: (e: ErrorEvent) => console.error('🔴 Live session error:', e.message),
          onclose: (e: CloseEvent) => console.log('🔒 Live session closed:', e.reason),
        },
        config
      });

      // Build aspect ratio context
      const aspectRatioContext = this.getAspectRatioContext(aspectRatio);
      
      // Send enhancement request with system prompt and aspect ratio context
      const enhancementPrompt = `${ENHANCEMENT_SYSTEM_PROMPT}\n\n${aspectRatioContext}\n\nEnhance this prompt for professional photography: "${userPrompt}"`;
      console.log('📤 Sending enhancement request with aspect ratio:', aspectRatio);
      
      this.session.sendClientContent({
        turns: [enhancementPrompt]
      });

      const turn = await this.handleTurn();
      this.session.close();
      
      // Extract text from the turn messages
      let enhancedPrompt = '';
      for (const message of turn) {
        if (message.serverContent?.modelTurn?.parts) {
          const part = message.serverContent.modelTurn.parts[0];
          if (part?.text) {
            enhancedPrompt += part.text;
          }
        }
      }
      
      const finalPrompt = enhancedPrompt.trim() || userPrompt;
      console.log('✅ Prompt enhancement completed:', finalPrompt);
      return finalPrompt;
    } catch (error) {
      console.error('🔴 Enhancement error:', error);
      // Fallback to standard model if live API fails
      return await this.enhancePromptFallback(userPrompt, aspectRatio);
    }
  }

  // Get aspect ratio-specific composition context
  private getAspectRatioContext(aspectRatio?: string): string {
    if (!aspectRatio) {
      return "COMPOSITION: Generate with generous padding on all sides to accommodate potential cropping.";
    }

    switch (aspectRatio) {
      case '1-1':
      case '1:1':
        return `ASPECT RATIO CONTEXT: Square (1:1) final output - Generate with EXTRA padding on ALL sides (top, bottom, left, right). Subject should be centered with generous space around for square cropping. CRITICAL: Include 25-30% extra headroom above subject knowing image will be cropped to square.`;
      
      case '9-16':
      case '9:16':
        return `ASPECT RATIO CONTEXT: Portrait (9:16) final output - PERFECT for full body shots. Generate complete figure from head to legs with proper vertical positioning. Subject should be centered with balanced spacing above and below. CRITICAL: Show entire body within frame with 10-15% margin above head and below feet. This vertical format naturally accommodates full human figure beautifully.`;
      
      case '4-5':
      case '4:5':
        return `ASPECT RATIO CONTEXT: Portrait Post (4:5) final output - PERFECT for magazine-style editorial compositions. Generate with balanced vertical composition showing complete figure with professional editorial spacing. Dimensions 1080x1350. CRITICAL: Position subject with 20-25% margin above head and below feet for elegant portrait post cropping. Ideal for Instagram portrait posts, Pinterest pins, and magazine covers - maintain sophisticated editorial aesthetic with proper full-body framing.`;
      
      default:
        return `ASPECT RATIO CONTEXT: Custom ratio (${aspectRatio}) - Generate with generous padding on all sides, especially above the head. CRITICAL: Account for post-generation cropping by including extra space around subject.`;
    }
  }

  // Fallback enhancement using standard model
  private async enhancePromptFallback(userPrompt: string, aspectRatio?: string): Promise<string> {
    console.log('🔄 Using fallback enhancement method');
    try {
      const model = this.standardAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
      const aspectRatioContext = this.getAspectRatioContext(aspectRatio);
      const result = await model.generateContent([
        ENHANCEMENT_SYSTEM_PROMPT,
        aspectRatioContext,
        `Enhance this prompt for professional photography: "${userPrompt}"`
      ]);
      const enhanced = result.response.text().trim();
      console.log('✅ Fallback enhancement completed:', enhanced);
      return enhanced;
    } catch (error) {
      console.error('🔴 Fallback enhancement error:', error);
      console.log('⚠️ Returning original prompt as fallback');
      return userPrompt; // Return original prompt as last resort
    }
  }

  // Handle turn function (exact structure from Geminicode.md lines 16-27)
  private async handleTurn(): Promise<LiveServerMessage[]> {
    const turn: LiveServerMessage[] = [];
    let done = false;
    while (!done) {
      const message = await this.waitMessage();
      turn.push(message);
      if (message.serverContent && message.serverContent.turnComplete) {
        done = true;
      }
    }
    return turn;
  }

  // Wait message function (exact structure from Geminicode.md lines 29-42)
  private async waitMessage(): Promise<LiveServerMessage> {
    let done = false;
    let message: LiveServerMessage | undefined = undefined;
    while (!done) {
      message = this.responseQueue.shift();
      if (message) {
        this.handleModelTurn(message);
        done = true;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
    return message!;
  }

  // Handle model turn function (exact structure from Geminicode.md lines 44-56)
  private handleModelTurn(message: LiveServerMessage) {
    if (message.serverContent?.modelTurn?.parts) {
      const part = message.serverContent?.modelTurn?.parts?.[0];

      if (part?.fileData) {
        console.log(`File: ${part?.fileData.fileUri}`);
      }

      if (part?.text) {
        console.log(part?.text);
      }
    }
  }

  // Generate image composition from multiple images (following chatimage.md structure)
  async generateImageFromComposition(enhancedPrompt: string, images: { buffer: Buffer; mimeType: string }[]): Promise<Buffer> {
    console.log('🎨 Starting image composition generation with enhanced prompt:', enhancedPrompt);
    console.log('🖼️ Number of input images:', images.length);
    
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    if (images.length !== 2) {
      throw new Error('Exactly 2 images are required for composition');
    }

    try {
      // Convert images to base64 format as per chatimage.md
      const imagePrompts = images.map((img, index) => ({
        inlineData: {
          mimeType: img.mimeType,
          data: img.buffer.toString('base64'),
        },
      }));

      // Create the prompt array following chatimage.md structure
      const prompt = [
        ...imagePrompts,
        { text: enhancedPrompt },
      ];

      console.log('📤 Sending composition request to gemini-2.5-flash-image-preview');
      
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: prompt,
      });

      console.log('📥 Received composition response, processing...');

      // Process response to extract image
      if (!response.candidates || !response.candidates[0] || !response.candidates[0].content) {
        throw new Error('Invalid response structure from Gemini API');
      }

      if (!response.candidates[0].content.parts) {
        throw new Error('No parts found in response content');
      }

      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          console.log('📝 Received text response:', part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          if (!imageData) {
            throw new Error('No image data found in response part');
          }
          const buffer = Buffer.from(imageData, 'base64');
          console.log('✅ Successfully created composition buffer, size:', buffer.length, 'bytes');
          return buffer;
        }
      }

      console.error('❌ No image data found in composition response');
      throw new Error('No image generated in composition response');
    } catch (error) {
      console.error('💥 Image composition error:', error);
      
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });

        if (error.message.includes('quota') || error.message.includes('QUOTA_EXCEEDED')) {
          throw new Error('API quota exceeded. Please try again later.');
        }
        if (error.message.includes('not supported') || error.message.includes('MODEL_NOT_FOUND')) {
          throw new Error('Image composition model not available. Please check your API key permissions.');
        }
        if (error.message.includes('safety') || error.message.includes('SAFETY')) {
          throw new Error('Content filtered for safety. Please try a different prompt or images.');
        }
        if (error.message.includes('API key not valid') || error.message.includes('INVALID_API_KEY')) {
          throw new Error('Invalid API key for image composition.');
        }
        if (error.message.includes('PERMISSION_DENIED')) {
          throw new Error('API key does not have permission to generate image compositions.');
        }
        if (error.message.includes('RESOURCE_EXHAUSTED')) {
          throw new Error('API resources exhausted. Please try again later.');
        }
      }
      
      throw new Error(`Failed to generate image composition: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Generate image using enhanced prompt (exact structure from Geminicode.md)
  async generateImage(enhancedPrompt: string): Promise<Buffer> {
    console.log('🎨 Starting image generation with enhanced prompt:', enhancedPrompt);
    
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    // Use the class instance (already configured with @google/genai package)
    
    const config = {
      responseModalities: [
        'IMAGE',
        'TEXT',
      ],
    };
    const model = 'gemini-2.5-flash-image-preview';
    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: enhancedPrompt,
          },
        ],
      },
    ];

    console.log('📤 Sending request to model:', model);
    console.log('⚙️ Config:', JSON.stringify(config, null, 2));

    try {
      const response = await this.ai.models.generateContentStream({
        model,
        config,
        contents,
      });
      
      console.log('📥 Received response, processing chunks...');
      const fileIndex = 0;
      
      for await (const chunk of response) {
        console.log(`📦 Processing chunk ${fileIndex + 1}`);
        
        if (!chunk.candidates || !chunk.candidates[0].content || !chunk.candidates[0].content.parts) {
          console.log('⏭️ Skipping chunk - missing required structure');
          continue;
        }
        
        // Match exact structure from Geminicode.md lines 53-63
        if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
          const inlineData = chunk.candidates[0].content.parts[0].inlineData;
          console.log('🖼️ Found image data:', {
            mimeType: inlineData.mimeType,
            dataLength: inlineData.data?.length || 0
          });
          
          const buffer = Buffer.from(inlineData.data || '', 'base64');
          console.log('✅ Successfully created image buffer, size:', buffer.length, 'bytes');
          return buffer;
        }
        else {
          console.log('📝 Received text response:', chunk.text);
        }
      }

      console.error('❌ No image data found in any chunk');
      throw new Error('No image generated in response');
    } catch (error) {
      console.error('💥 Image generation error:', error);
      
      // More specific error messages
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });

        if (error.message.includes('quota') || error.message.includes('QUOTA_EXCEEDED')) {
          throw new Error('API quota exceeded. Please try again later.');
        }
        if (error.message.includes('not supported') || error.message.includes('MODEL_NOT_FOUND')) {
          throw new Error('Image generation model not available. Please check your API key permissions.');
        }
        if (error.message.includes('safety') || error.message.includes('SAFETY')) {
          throw new Error('Content filtered for safety. Please try a different prompt.');
        }
        if (error.message.includes('API key not valid') || error.message.includes('INVALID_API_KEY')) {
          throw new Error('Invalid API key for image generation.');
        }
        if (error.message.includes('PERMISSION_DENIED')) {
          throw new Error('API key does not have permission to generate images.');
        }
        if (error.message.includes('RESOURCE_EXHAUSTED')) {
          throw new Error('API resources exhausted. Please try again later.');
        }
      }
      
      throw new Error(`Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

  // Clean up resources
  cleanup() {
    if (this.session) {
      this.session.close();
      this.session = undefined;
    }
    this.responseQueue = [];
  }
}