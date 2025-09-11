Step-by-Step Setup Procedure
Phase 1: Frontend Setup (Next.js)
Step 1: Initialize Frontend

Navigate to main project folder
Create and enter frontend directory
Initialize Next.js with TypeScript and App Router
Choose Tailwind CSS during setup
Enable ESLint

Packages to Install:

next (latest)
react
react-dom
typescript
@types/react
@types/react-dom
@types/node
tailwindcss
postcss
autoprefixer

Step 2: Add UI Components (shadcn/ui)

Initialize shadcn/ui configuration
Install component library dependencies

Packages to Install:

@radix-ui/react-* (various components as needed)
class-variance-authority
clsx
tailwind-merge
lucide-react (for icons)

Reference: https://ui.shadcn.com/docs/installation/next
Step 3: Authentication (Clerk)

Set up Clerk for Next.js
Configure middleware and providers

Packages to Install:

@clerk/nextjs
@clerk/themes (optional for styling)

Reference: https://clerk.com/docs/quickstarts/nextjs
Step 4: Image Management (ImageKit)

Install ImageKit React SDK

Packages to Install:

imagekitio-react
imagekit-javascript

Reference: https://docs.imagekit.io/getting-started/quickstart-guides/react
Step 5: Payment Integration (Stripe via Clerk)

Set up Stripe with Clerk Payments

Packages to Install:

@stripe/stripe-js
stripe

Reference:

https://clerk.com/docs/components/payments/overview
https://stripe.com/docs/stripe-js/react

Phase 2: Backend Setup (Node.js + Prisma)
Step 1: Initialize Backend

Navigate to backend directory
Initialize Node.js project with TypeScript
Set up Express server structure

Packages to Install:

express
@types/express
typescript
ts-node
nodemon (dev dependency)
dotenv
cors
@types/cors

Step 2: Database ORM (Prisma + Neon)

Initialize Prisma with PostgreSQL
Configure Neon database connection

Packages to Install:

prisma (dev dependency)
@prisma/client

Reference:

https://www.prisma.io/docs/getting-started/quickstart
https://neon.tech/docs/guides/prisma

Step 3: Authentication Backend (Clerk SDK)

Set up Clerk backend SDK for API protection

Packages to Install:

@clerk/clerk-sdk-node
@clerk/backend

Reference: https://clerk.com/docs/backend/overview
Step 4: Gemini AI Integration

Set up Google Generative AI SDK

Packages to Install:

@google/generative-ai

Reference: https://ai.google.dev/gemini-api/docs/quickstart?lang=node
Step 5: Stripe Backend

Configure Stripe webhook handlers

Packages to Install:

stripe (backend version)
body-parser (for webhook raw body parsing)

Phase 3: Environment Configuration
Frontend Environment Variables
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL
NEXT_PUBLIC_CLERK_SIGN_UP_URL
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
NEXT_PUBLIC_API_URL
Backend Environment Variables
DATABASE_URL (Neon PostgreSQL)
CLERK_SECRET_KEY
GEMINI_API_KEY
IMAGEKIT_PRIVATE_KEY
IMAGEKIT_PUBLIC_KEY
IMAGEKIT_URL_ENDPOINT
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
PORT
Phase 4: Development Tools & Additional Packages
Frontend Additional Tools
Packages to Install:

axios or @tanstack/react-query (API calls)
react-hook-form (form handling)
zod (validation)
@hookform/resolvers
sonner or react-hot-toast (notifications)
zustand or jotai (state management if needed)

Backend Additional Tools
Packages to Install:

helmet (security)
compression (performance)
express-rate-limit (rate limiting)
joi or zod (validation)
winston or pino (logging)
multer (file uploads if handling locally)

Phase 5: Project Configuration Files
Required Configuration Files

Frontend:

next.config.js - Next.js configuration
tailwind.config.ts - Tailwind setup
components.json - shadcn/ui config
middleware.ts - Clerk middleware


Backend:

prisma/schema.prisma - Database schema
tsconfig.json - TypeScript config
.env files for both environments



Key Documentation References

Next.js 14+: https://nextjs.org/docs
Clerk Documentation: https://clerk.com/docs
Prisma + Neon: https://neon.tech/docs/guides/prisma-guide
Gemini API: https://ai.google.dev/gemini-api/docs
ImageKit Integration: https://docs.imagekit.io/
Stripe with Clerk: https://clerk.com/docs/components/payments/overview
shadcn/ui Components: https://ui.shadcn.com/docs

Development Workflow Order

Set up frontend with basic routing
Configure Clerk authentication on frontend
Initialize backend with Express
Set up Prisma with Neon database
Implement Clerk SDK on backend
Integrate Gemini API for both models
Set up ImageKit for media handling
Implement Stripe payment flow
Connect frontend to backend APIs
Test end-to-end functionality

Important Notes

Use TypeScript throughout for type safety
Implement proper error handling from the start
Set up ESLint and Prettier for code consistency
Use environment variables for all sensitive data
Implement proper CORS configuration
Set up git repository with .gitignore early
Consider using Docker for consistent development environment
Plan your Prisma schema carefully before implementation
Test Gemini API rate limits and implement queuing if needed
Ensure ImageKit webhook handlers for optimization events

This setup will give you a robust, scalable architecture for your AI-powered lifestyle shoot application with all modern best practices included.