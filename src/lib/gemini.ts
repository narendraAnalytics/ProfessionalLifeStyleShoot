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

// Concise Professional Photography Enhancement System Prompt
const ENHANCEMENT_SYSTEM_PROMPT = `You are a professional photography director. Transform simple prompts into clear, concise photography instructions.

KEEP IT SHORT: Maximum 50-80 words. Focus on essential visual elements only.

Include these key elements:
1. SUBJECT: What is the main focus
2. LIGHTING: Natural light, studio light, golden hour, etc.
3. COMPOSITION: Close-up, wide shot, portrait, etc.
4. STYLE: Professional, creative, commercial, lifestyle
5. BACKGROUND: Simple description

Example:
Input: "Professional headshots"
Output: "Professional corporate headshot, clean studio lighting, neutral background, confident expression, business attire, sharp focus, modern style"

Make it clear and actionable for AI image generation. No long descriptions or technical jargon.`;

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
          onopen: () => console.debug('Opened'),
          onmessage: (message: LiveServerMessage) => {
            this.responseQueue.push(message);
          },
          onerror: (e: ErrorEvent) => console.debug('Error:', e.message),
          onclose: (e: CloseEvent) => console.debug('Close:', e.reason),
        },
        config
      });

      // Send enhancement request with system prompt
      this.session.sendClientContent({
        turns: [
          `${ENHANCEMENT_SYSTEM_PROMPT}\n\nEnhance this prompt for professional photography: "${userPrompt}"`
        ]
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
      
      return enhancedPrompt || userPrompt;
    } catch (error) {
      console.error('Enhancement error:', error);
      // Fallback to standard model if live API fails
      return await this.enhancePromptFallback(userPrompt);
    }
  }

  // Fallback enhancement using standard model
  private async enhancePromptFallback(userPrompt: string): Promise<string> {
    try {
      const model = this.standardAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
      const result = await model.generateContent([
        ENHANCEMENT_SYSTEM_PROMPT,
        `Enhance this prompt for professional photography: "${userPrompt}"`
      ]);
      return result.response.text();
    } catch (error) {
      console.error('Fallback enhancement error:', error);
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

  // Generate image using enhanced prompt (exact structure from Geminicode.md lines 134-179)
  async generateImage(enhancedPrompt: string): Promise<Buffer> {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
    
    const config = {
      responseModalities: ['IMAGE', 'TEXT'],
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

    try {
      const response = await ai.models.generateContentStream({
        model,
        config,
        contents,
      });
      
      let fileIndex = 0;
      for await (const chunk of response) {
        if (!chunk.candidates || !chunk.candidates[0].content || !chunk.candidates[0].content.parts) {
          continue;
        }
        if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
          const inlineData = chunk.candidates[0].content.parts[0].inlineData;
          const buffer = Buffer.from(inlineData.data || '', 'base64');
          return buffer;
        }
        else {
          console.log(chunk.text);
        }
      }

      throw new Error('No image generated in response');
    } catch (error) {
      console.error('Image generation error:', error);
      
      // More specific error messages
      if (error instanceof Error) {
        if (error.message.includes('quota')) {
          throw new Error('API quota exceeded. Please try again later.');
        }
        if (error.message.includes('not supported')) {
          throw new Error('Image generation not available with current API key.');
        }
        if (error.message.includes('safety')) {
          throw new Error('Content filtered for safety. Please try a different prompt.');
        }
        if (error.message.includes('API key not valid')) {
          throw new Error('Invalid API key for image generation.');
        }
      }
      
      throw new Error('Failed to generate image. Please try again.');
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