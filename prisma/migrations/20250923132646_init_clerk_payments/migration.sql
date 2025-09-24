-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "username" TEXT,
    "profileImageUrl" TEXT,
    "subscriptionTier" TEXT NOT NULL DEFAULT 'free',
    "clerkCustomerId" TEXT,
    "stripeCustomerId" TEXT,
    "subscriptionId" TEXT,
    "subscriptionStatus" TEXT NOT NULL DEFAULT 'inactive',
    "subscriptionPeriodStart" TIMESTAMP(3),
    "subscriptionPeriodEnd" TIMESTAMP(3),
    "planChangeScheduled" TEXT,
    "currentPeriodImages" INTEGER NOT NULL DEFAULT 0,
    "currentPeriodMerges" INTEGER NOT NULL DEFAULT 0,
    "lastUsageReset" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hasCommercialLicense" BOOLEAN NOT NULL DEFAULT false,
    "hasApiAccess" BOOLEAN NOT NULL DEFAULT false,
    "hasCustomBranding" BOOLEAN NOT NULL DEFAULT false,
    "maxQuality" TEXT NOT NULL DEFAULT 'standard',
    "lifetimeValue" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "firstPaidDate" TIMESTAMP(3),
    "lastPaymentDate" TIMESTAMP(3),
    "creditsRemaining" INTEGER NOT NULL DEFAULT 2,
    "creditsUsed" INTEGER NOT NULL DEFAULT 0,
    "totalCredits" INTEGER NOT NULL DEFAULT 2,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."photoshoots" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "originalImageUrl" TEXT NOT NULL,
    "generatedImageUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "bwImageUrl" TEXT,
    "imageKitFileId" TEXT,
    "style" TEXT NOT NULL DEFAULT 'professional',
    "originalPrompt" TEXT NOT NULL,
    "enhancedPrompt" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "creditsUsed" INTEGER NOT NULL DEFAULT 1,
    "parentPhotoshootId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "photoshoots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."photoshoot_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionName" TEXT,
    "description" TEXT,
    "totalPhotoshoots" INTEGER NOT NULL DEFAULT 0,
    "totalCreditsUsed" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "photoshoot_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."image_compositions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "outputImageUrl" TEXT NOT NULL,
    "sourceImageUrls" JSONB NOT NULL,
    "compositionType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'processing',
    "creditsUsed" INTEGER NOT NULL DEFAULT 1,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "image_compositions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_clerkId_key" ON "public"."users"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE INDEX "photoshoots_userId_createdAt_idx" ON "public"."photoshoots"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "photoshoots_status_idx" ON "public"."photoshoots"("status");

-- CreateIndex
CREATE INDEX "photoshoots_parentPhotoshootId_idx" ON "public"."photoshoots"("parentPhotoshootId");

-- CreateIndex
CREATE INDEX "photoshoot_sessions_userId_createdAt_idx" ON "public"."photoshoot_sessions"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "image_compositions_userId_createdAt_idx" ON "public"."image_compositions"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "image_compositions_status_idx" ON "public"."image_compositions"("status");

-- AddForeignKey
ALTER TABLE "public"."photoshoots" ADD CONSTRAINT "photoshoots_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."photoshoots" ADD CONSTRAINT "photoshoots_parentPhotoshootId_fkey" FOREIGN KEY ("parentPhotoshootId") REFERENCES "public"."photoshoots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."image_compositions" ADD CONSTRAINT "image_compositions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
