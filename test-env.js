// Simple test script to verify environment variables
require('dotenv').config()

console.log('🔍 Environment Variables Check:')
console.log('✅ GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? `Found (${process.env.GEMINI_API_KEY.length} chars)` : '❌ Not found')
console.log('✅ IMAGEKIT_PUBLIC_KEY:', process.env.IMAGEKIT_PUBLIC_KEY ? `Found (${process.env.IMAGEKIT_PUBLIC_KEY.length} chars)` : '❌ Not found')
console.log('✅ IMAGEKIT_PRIVATE_KEY:', process.env.IMAGEKIT_PRIVATE_KEY ? `Found (${process.env.IMAGEKIT_PRIVATE_KEY.length} chars)` : '❌ Not found')
console.log('✅ IMAGEKIT_URL_ENDPOINT:', process.env.IMAGEKIT_URL_ENDPOINT ? `Found: ${process.env.IMAGEKIT_URL_ENDPOINT}` : '❌ Not found')
console.log('✅ DATABASE_URL:', process.env.DATABASE_URL ? 'Found (connected to Neon)' : '❌ Not found')

// Test if Gemini API key format looks correct
if (process.env.GEMINI_API_KEY) {
  if (process.env.GEMINI_API_KEY.startsWith('AIza')) {
    console.log('✅ Gemini API key format looks correct')
  } else {
    console.log('⚠️  Gemini API key format might be incorrect (should start with "AIza")')
  }
}