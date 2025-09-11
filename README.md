# Professional Lifestyle Shoot - AI-Powered Application

A full-stack AI-powered lifestyle shoot application built with Next.js, TypeScript, Prisma, and Google Gemini AI.

## 📁 Project Structure

```
ProfessionalLifeStyleShoot/
├── frontend/                    # Next.js Frontend Application
│   ├── src/
│   │   ├── app/                # Next.js App Router
│   │   │   ├── layout.tsx      # Root layout
│   │   │   ├── page.tsx        # Home page
│   │   │   ├── globals.css     # Global styles
│   │   │   └── favicon.ico     # App icon
│   │   ├── components/
│   │   │   └── ui/             # shadcn/ui components
│   │   └── lib/
│   │       └── utils.ts        # Utility functions
│   ├── public/                 # Static assets
│   ├── .env                    # Environment variables (not in git)
│   ├── .env.example            # Environment template
│   ├── components.json         # shadcn/ui config
│   ├── next.config.ts          # Next.js configuration
│   ├── tailwind.config.ts      # Tailwind CSS config
│   ├── tsconfig.json           # TypeScript config
│   └── package.json            # Dependencies and scripts
├── backend/                    # Backend Utilities & Types
│   ├── src/
│   │   ├── lib/                # Core libraries
│   │   │   ├── prisma.ts       # Prisma client setup
│   │   │   ├── clerk.ts        # Clerk authentication
│   │   │   ├── gemini.ts       # Google Gemini AI models
│   │   │   └── stripe.ts       # Stripe payments
│   │   ├── types/              # TypeScript type definitions
│   │   └── utils/              # Utility functions
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   ├── .env                    # Environment variables (not in git)
│   ├── .env.example            # Environment template
│   ├── tsconfig.json           # TypeScript config
│   └── package.json            # Dependencies and scripts
├── claude.md                   # Project setup instructions
└── README.md                   # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (recommended: Neon)

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd ProfessionalLifeStyleShoot

# Install dependencies for both frontend and backend
cd frontend && npm install
cd ../backend && npm install
```

### 2. Environment Configuration

**Frontend (.env):**
```bash
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your values
```

**Backend (.env):**
```bash
cp backend/.env.example backend/.env  
# Edit backend/.env with your values
```

### 3. Database Setup

```bash
cd backend
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to database
```

### 4. Development

```bash
# Start frontend (from frontend directory)
cd frontend
npm run dev            # http://localhost:3000

# Start backend development (from backend directory) 
cd backend
npm run dev            # For utility development
```

## 🛠 Available Scripts

### Frontend Scripts
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Backend Scripts
- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Development with nodemon
- `npm run start` - Start production server
- `npm run type-check` - TypeScript type checking
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with test data

## 🏗 Tech Stack

### Frontend
- **Framework:** Next.js 15.5.3 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** shadcn/ui + Radix UI
- **Authentication:** Clerk
- **Payments:** Stripe
- **API Calls:** TanStack React Query
- **Forms:** React Hook Form + Zod validation
- **Notifications:** Sonner

### Backend
- **Runtime:** Node.js with TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** Clerk Backend SDK
- **AI Integration:** Google Gemini AI
  - `gemini-2.0-flash-exp` (Text processing)
  - `gemini-2.5-flash-image-preview` (Image analysis)
- **Payments:** Stripe
- **Security:** Helmet, Rate limiting
- **Logging:** Winston

### Development Tools
- **Language:** TypeScript throughout
- **Linting:** ESLint
- **Process Management:** Nodemon
- **Database Tools:** Prisma Studio

## 🔑 Environment Variables

### Frontend Required
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend Required
```env
DATABASE_URL="postgresql://..."
CLERK_SECRET_KEY=sk_test_...
GEMINI_API_KEY=your_gemini_api_key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PORT=3001
NODE_ENV=development
```

## 📦 Key Features

- ✅ **Authentication:** Clerk integration with middleware
- ✅ **UI Framework:** Modern component library with shadcn/ui
- ✅ **Database:** Prisma ORM with PostgreSQL
- ✅ **AI Integration:** Google Gemini models for text and image processing
- ✅ **Payments:** Stripe integration ready
- ✅ **Type Safety:** Full TypeScript implementation
- ✅ **Development Tools:** Hot reloading, type checking, linting

## 🔄 Development Workflow

1. **Database Changes:**
   ```bash
   cd backend
   # Update prisma/schema.prisma
   npm run db:push          # Push to database
   npm run db:generate      # Update Prisma client
   ```

2. **Adding UI Components:**
   ```bash
   cd frontend
   npx shadcn@latest add <component-name>
   ```

3. **API Development:**
   - Use Next.js API routes in `frontend/src/app/api/`
   - Import backend utilities from `../../../backend/src/lib/`

## 📋 Next Steps

- [ ] Complete database schema design
- [ ] Implement authentication middleware
- [ ] Set up API routes for Gemini AI integration
- [ ] Configure Stripe webhooks
- [ ] Add ImageKit integration (planned)
- [ ] Implement core application features

## 🤝 Contributing

1. Follow the existing code structure and conventions
2. Use TypeScript throughout
3. Follow the component patterns established by shadcn/ui
4. Ensure all environment variables are documented
5. Run type checking before commits: `npm run type-check`

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Google Gemini API](https://ai.google.dev/gemini-api/docs)
- [shadcn/ui Components](https://ui.shadcn.com/docs)