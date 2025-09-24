/*
  Warnings:

  - You are about to drop the column `creditsUsed` on the `image_compositions` table. All the data in the column will be lost.
  - You are about to drop the column `creditsUsed` on the `photoshoots` table. All the data in the column will be lost.
  - You are about to drop the column `currentPeriodImages` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `currentPeriodMerges` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastUsageReset` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `planChangeScheduled` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionPeriodEnd` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionPeriodStart` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `photoshoot_sessions` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "public"."image_compositions" DROP COLUMN "creditsUsed";

-- AlterTable
ALTER TABLE "public"."photoshoots" DROP COLUMN "creditsUsed";

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "currentPeriodImages",
DROP COLUMN "currentPeriodMerges",
DROP COLUMN "lastUsageReset",
DROP COLUMN "planChangeScheduled",
DROP COLUMN "subscriptionPeriodEnd",
DROP COLUMN "subscriptionPeriodStart";

-- DropTable
DROP TABLE "public"."photoshoot_sessions";
