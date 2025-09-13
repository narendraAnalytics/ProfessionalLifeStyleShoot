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
2. LIGHTING TECHNIQUE: Soft box, natural window light, rim lighting, golden hour
3. BRAND CONTEXT: Lifestyle setting, aspirational mood, target demographic appeal
4. COMPOSITION: Rule of thirds, depth of field, negative space for text overlay
5. COLOR PALETTE: Complementary tones, brand-safe colors, mood consistency
6. FACE COMPOSITION: Complete face visibility, no cropping at forehead/chin/sides, full head framing
7. TECHNICAL SPECS: Sharp focus, professional depth, high-end finish, full face framing

BRAND PHOTOGRAPHY FOCUS:
- Lifestyle over studio shots
- Aspirational but authentic
- Space for branding elements
- Target audience appeal
- Commercial usability
- Complete face visibility, no cutting or cropping

Examples:
Input: "Professional headshots"
Output: "Executive lifestyle portrait, confident professional in modern office setting, soft natural window lighting, neutral business attire, shallow depth of field, clean composition with negative space, complete face visible with no cropping, aspirational yet approachable expression, commercial-grade quality"

Input: "Fashion portrait"
Output: "Upscale lifestyle fashion portrait, contemporary urban background, golden hour rim lighting, styled wardrobe with brand appeal, rule of thirds composition, warm color palette, authentic confident pose, complete face visible with full head framing, commercial photography aesthetic, space for text overlay"

Create prompts that produce brand-ready, commercial-quality lifestyle imagery.`;

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
  async enhancePrompt(userPrompt: string): Promise<string> {
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

      // Send enhancement request with system prompt
      const enhancementPrompt = `${ENHANCEMENT_SYSTEM_PROMPT}\n\nEnhance this prompt for professional photography: "${userPrompt}"`;
      console.log('📤 Sending enhancement request...');
      
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
      return await this.enhancePromptFallback(userPrompt);
    }
  }

  // Fallback enhancement using standard model
  private async enhancePromptFallback(userPrompt: string): Promise<string> {
    console.log('🔄 Using fallback enhancement method');
    try {
      const model = this.standardAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
      const result = await model.generateContent([
        ENHANCEMENT_SYSTEM_PROMPT,
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
      let fileIndex = 0;
      
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