import { GoogleGenerativeAI } from '@google/generative-ai'

if (!process.env.GEMINI_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY')
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export const geminiFlashModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
export const geminiVisionModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-image-preview' })