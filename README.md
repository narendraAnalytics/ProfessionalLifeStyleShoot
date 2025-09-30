# Professional Lifestyle Shoot - AI-Powered Photography Platform

![Professional Lifestyle Shoot Banner](./public/readmeimage.png)

> *An advanced AI-powered professional lifestyle photography platform that transforms your vision into stunning reality using cutting-edge technology.*

## 🚀 Overview

ProfessionalLifeStyleShoot is a comprehensive full-stack web application that leverages artificial intelligence to create professional lifestyle photoshoots. Built with modern web technologies, it offers users an intuitive interface to generate, customize, and manage AI-powered photography sessions with authentication, payment processing, and dynamic content delivery.

## 📁 Current Project Structure

```
ProfessionalLifeStyleShoot/
├── src/
│   ├── app/                          # Next.js App Router (Primary)
│   │   ├── layout.tsx               # Root layout with Clerk & custom favicon
│   │   ├── page.tsx                 # Landing page entry point
│   │   ├── favicon.ico              # Custom professional icon
│   │   ├── icon.png                 # Backup icon format
│   │   ├── globals.css              # Global Tailwind styles
│   │   ├── dashboard/               # Protected dashboard routes
│   │   ├── gallery/                 # Image gallery features
│   │   ├── sign-in/[[...sign-in]]/  # Clerk authentication
│   │   ├── sign-up/[[...sign-up]]/  # Clerk registration
│   │   └── api/                     # API routes
│   │       ├── generate-image/      # AI image generation
│   │       ├── gallery/             # Gallery management
│   │       ├── users/               # User management
│   │       └── compose-images/      # Image composition
│   │
│   ├── landing-new/                 # ✅ ACTIVE Landing Pages
│   │   ├── NewLandingPage.tsx       # Main landing with banner ads
│   │   ├── page.tsx                 # Landing route
│   │   └── components/              # Active landing components
│   │       ├── NewHeroSection.tsx   # Dynamic hero with rotating text
│   │       ├── NewNavbar.tsx        # Auth-aware navigation
│   │       ├── NewPricingSection.tsx # Pricing cards
│   │       ├── HowItWorksSection.tsx # Feature explanation
│   │       ├── PortfolioSection.tsx  # Portfolio showcase
│   │       ├── ContactSection.tsx   # Contact form
│   │       ├── Footer.tsx           # Site footer
│   │       └── ImageCarousel.tsx    # Background carousel
│   │
│   ├── components/                  # 🧪 TESTING/BACKUP Code
│   │   ├── ui/                      # shadcn/ui components (Active)
│   │   └── *.tsx                    # Original components (Testing)
│   │
│   └── hooks/                       # Custom React hooks
│
├── public/                          # Static Assets
│   ├── images/
│   │   └── iconWebsite.png         # Custom app icon
│   ├── readmeimage.png             # README banner
│   ├── BannerImage.png             # Advertisement banner
│   ├── BrightShoot.jpeg            # Banner side image (logged out)
│   ├── Sareeshoot.jpeg             # Banner side image (logged out)
│   ├── DiamoundShoot.jpeg          # Banner side image (logged in)
│   └── DressPhotoshoot.jpeg        # Banner side image (logged in)
│
├── prisma/
│   └── schema.prisma               # Database schema
│
├── CLAUDE.md                       # Development setup instructions
├── .env.example                    # Environment template
├── components.json                 # shadcn/ui configuration
├── tailwind.config.ts              # Tailwind configuration
├── next.config.ts                  # Next.js configuration
└── package.json                    # Dependencies & scripts
```

## ⚡ Key Features (Currently Working)

### 🎯 **Dynamic Banner Advertisement System**
- **Auto-timeout**: Banners close automatically after 10 seconds
- **Manual close**: Users can close banners with X button
- **Authentication-aware**: Different images for logged in vs logged out users
- **Session storage**: Prevents banner spam with smart session management
- **Responsive design**: Beautiful gradient styling with hover effects

### 🔐 **Authentication & User Management**
- **Clerk Integration**: Complete auth system with custom styling
- **Protected Routes**: Dashboard and user-specific content
- **User Sync**: Automatic user data synchronization
- **Custom Auth UI**: Branded sign-in/sign-up experience

### 🎨 **Professional Landing Experience**
- **Dynamic Hero Section**: Rotating text with "Model", "Brand", "Designer", "Creator", "Content"
- **Gradient Typography**: Custom amber-orange-red gradient for "Professional Reality"
- **Background Carousel**: Dynamic image carousel with smooth transitions
- **Auth-Conditional Content**: Different CTAs for logged in vs logged out users

### 🖼️ **Image Management**
- **AI Image Generation**: Gemini AI integration for content creation
- **Gallery System**: Personal and public galleries
- **Image Composition**: Advanced image editing capabilities
- **Dynamic Loading**: Optimized image delivery

## 🛠 Tech Stack & Dependencies

### **Core Framework**
```json
"next": "15.5.3"                    // Latest Next.js with App Router & Turbopack
"react": "19.1.0"                   // Latest React 19
"react-dom": "19.1.0"               // React DOM renderer
"typescript": "^5"                  // TypeScript for type safety
```

### **Authentication & Security**
```json
"@clerk/nextjs": "^6.31.10"        // Authentication platform
"@clerk/themes": "^2.4.18"         // Custom auth themes
"@clerk/types": "^4.85.0"          // Clerk TypeScript types
```

### **AI & Image Processing**
```json
"@google/generative-ai": "^0.24.1" // Gemini AI integration
"imagekit": "^6.0.0"               // Image optimization
"imagekitio-react": "^4.3.0"       // React ImageKit components
"@imagekit/react": "^5.0.1"        // Additional ImageKit features
```

### **UI Components & Styling**
```json
"tailwindcss": "^4"                 // Latest Tailwind CSS
"framer-motion": "^12.23.12"       // Animation library
"lucide-react": "^0.543.0"         // Icon library
"embla-carousel-react": "^8.6.0"   // Carousel components
"sonner": "^2.0.7"                 // Toast notifications

// Radix UI Components (shadcn/ui)
"@radix-ui/react-accordion": "^1.2.12"
"@radix-ui/react-alert-dialog": "^1.1.15"
"@radix-ui/react-dialog": "^1.1.15"
"@radix-ui/react-dropdown-menu": "^2.1.16"
"@radix-ui/react-navigation-menu": "^1.2.14"
// ... and 15+ more Radix components
```

### **Database & Backend**
```json
"prisma": "^6.16.0"                // Database toolkit
"@prisma/client": "^6.16.2"        // Prisma client
```

### **Payments & Business Logic**
```json
"stripe": "^18.5.0"                // Payment processing
"@stripe/stripe-js": "^7.9.0"      // Stripe frontend
```

### **Forms & Validation**
```json
"react-hook-form": "^7.62.0"       // Form management
"@hookform/resolvers": "^5.2.1"    // Form validation resolvers
"zod": "^4.1.5"                    // Schema validation
```

### **State Management & API**
```json
"@tanstack/react-query": "^5.87.4" // Server state management
```

### **Communication & Email**
```json
"@emailjs/browser": "^4.4.1"       // Email service integration
```

### **Utilities**
```json
"class-variance-authority": "^0.7.1" // Component variants
"clsx": "^2.1.1"                    // Conditional classes
"tailwind-merge": "^3.3.1"          // Tailwind class merging
"date-fns": "^4.1.0"                // Date utilities
"mime": "^4.0.7"                    // MIME type detection
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production with Turbopack
npm run start        # Start production server
npm run lint         # Run ESLint

# Database (if using Prisma)
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema to database
npx prisma studio    # Open Prisma Studio
```

## 🚀 Quick Start

### 1. Installation
```bash
git clone <repository-url>
cd ProfessionalLifeStyleShoot
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env with your actual values
```

### 3. Required Environment Variables
```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# ImageKit
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_...
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id/
IMAGEKIT_PRIVATE_KEY=private_...

# Stripe Payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 4. Development
```bash
npm run dev
# Open http://localhost:3000
```

## 🎨 Design System

### **Color Palette**
- **Primary Gradients**: Cyan → Emerald → Blue
- **Hero Text**: Amber → Orange → Red (`Professional Reality`)
- **Backgrounds**: Dynamic gradient overlays
- **Interactive Elements**: Purple → Pink gradients

### **Typography**
- **Primary Font**: Geist Sans
- **Monospace**: Geist Mono  
- **Gradient Text**: Custom CSS with `bg-clip-text`

### **Animation System**
- **Framer Motion**: Page transitions and micro-interactions
- **CSS Animations**: Custom keyframes for text rotation
- **Hover Effects**: Scale, brightness, and blur transformations

## 📱 Features Implementation Status

### ✅ **Completed Features**
- [x] **Landing Page System**: Dynamic content with auth awareness
- [x] **Banner Advertisement**: Auto-timeout + manual close functionality
- [x] **Authentication Flow**: Complete Clerk integration
- [x] **Responsive Design**: Mobile-first approach with Tailwind
- [x] **Custom Branding**: Professional icon and gradient styling
- [x] **Image Management**: Basic upload and display capabilities
- [x] **Navigation System**: Auth-conditional menu and CTAs

### 🚧 **In Development**
- [ ] **AI Image Generation**: Full Gemini AI integration
- [ ] **Payment System**: Stripe subscription handling
- [ ] **User Dashboard**: Personal gallery and settings
- [ ] **Advanced Image Editing**: Composition and enhancement tools

### 📋 **Planned Features**
- [ ] **Portfolio Builder**: User portfolio creation tools
- [ ] **Social Features**: Sharing and collaboration
- [ ] **Analytics Dashboard**: Usage and performance metrics
- [ ] **Mobile App**: React Native companion app

## 📚 Development Notes

### **Component Architecture**
- `src/landing-new/`: **Active production components**
- `src/components/`: **Testing and backup code** (not currently used in production)
- `src/app/`: **Next.js App Router** with API routes

### **Authentication Flow**
- Clerk handles all auth logic with custom UI theming
- Protected routes use middleware for access control
- User data sync happens automatically on sign-in

### **Banner System Logic**
```typescript
// Different session keys for auth states
const sessionKey = `bannerAdSeen_${isSignedIn ? 'loggedIn' : 'loggedOut'}`

// Auto-timeout functionality
useEffect(() => {
  if (showAdModal) {
    const timer = setTimeout(() => handleCloseAdModal(), 10000)
    return () => clearTimeout(timer)
  }
}, [showAdModal])
```

## 🤝 Contributing

1. Follow existing code patterns and conventions
2. Use TypeScript throughout the application
3. Implement responsive design with Tailwind CSS
4. Test authentication flows with Clerk
5. Ensure proper error handling and user feedback
6. Update this README when adding new features

## 📄 License

This project is proprietary and confidential.

---

**Built with ❤️ using Next.js 15, React 19, and cutting-edge AI technology.**

