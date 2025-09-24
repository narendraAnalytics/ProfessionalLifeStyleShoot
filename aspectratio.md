Looking at the current code, when users upgrade their Clerk subscription, the subscriptionTier field in your database will NOT automatically update. Here's what
   happens:

  Current sync behavior:
  - src/app/api/users/sync/route.ts:18 only syncs basic profile data (email, firstName, lastName, username, profileImageUrl)
  - src/hooks/useUserSync.ts:35 calls this sync endpoint but doesn't handle subscription data
  - New users get subscriptionTier: "free" by default from prisma/schema.prisma:18

  The problem: When users upgrade to pro plan in Clerk, your database still shows them as "free" tier, so they'll still be limited to 2 images instead of 15.

  Solution needed: You need to implement Clerk webhooks to listen for subscription changes and update the subscriptionTier field accordingly. The webhook should:      

  1. Listen for user.updated events from Clerk
  2. Check the user's current subscription status
  3. Update the subscriptionTier field to match ("free", "pro_plan", or "max_ultimate")

  Without this webhook, users who upgrade will continue to see free plan limits until you manually update their database record.