/*
  Warnings:

  - You are about to drop the column `creditsRemaining` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `creditsUsed` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `totalCredits` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "creditsRemaining",
DROP COLUMN "creditsUsed",
DROP COLUMN "totalCredits";
