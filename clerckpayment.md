// Light glassmorphism with proper shadows
Billing is enabled!
You are all set up. Next, add our <PricingTable /> component to your app, so your users can subscribe to your plans. Then use our SDKs to gate functionality in your app's codebase by using our has() method and <Protect /> component. Learn more by reading our guide.


Plans appear in some Clerk components depending on what kind of plan it is. All plans can appear in the <PricingTable /> component. If it's a user plan, it can appear in the <UserProfile /> component. When adding a feature to a plan, it will also automatically appear in the corresponding plan. When creating or editing a feature, if you'd like to hide it from appearing in Clerk components, you can toggle the Publicly available option off.


---
title: Clerk billing for B2C SaaS
description: Clerk billing is a feature that allows you to create and manage
  plans and features for your application.
sdk: nextjs, react, expo, react-router, astro, tanstack-react-start, remix,
  nuxt, vue, js-frontend, expressjs, fastify, js-backend
sdkScoped: "true"
canonical: /docs/:sdk:/billing/b2c-saas
lastUpdated: 2025-09-10T21:12:22.000Z
availableSdks: nextjs,react,expo,react-router,astro,tanstack-react-start,remix,nuxt,vue,js-frontend,expressjs,fastify,js-backend
notAvailableSdks: chrome-extension,android,ios,nodejs,go,ruby,sdk-development
activeSdk: nextjs
---

> \[!WARNING]
>
> This feature is currently in Beta. The low-level JavaScript APIs exposed via `Clerk.billing` are experimental and may undergo breaking changes. To mitigate potential disruptions, we recommend [pinning](https://docs.renovatebot.com/dependency-pinning/#what-is-dependency-pinning) your SDK and `clerk-js` package versions.

Clerk billing for B2C SaaS allows you to create plans and manage subscriptions **for individual users** in your application. If you'd like to charge companies or organizations, see [Billing for B2B SaaS](/docs/billing/b2b-saas). You can also combine both B2C and B2B billing in the same application.

## Enable billing

To enable billing for your application, navigate to the [**Billing Settings**](https://dashboard.clerk.com/last-active?path=billing/settings) page in the Clerk Dashboard. This page will guide you through enabling billing for your application.

Clerk billing costs just 0.7% per transaction, plus Stripe's transaction fees which are paid directly to Stripe. Clerk Billing is **not** the same as Stripe Billing. Plans and pricing are managed directly through the Clerk Dashboard and won't sync with your existing Stripe products or plans. Clerk uses Stripe **only** for payment processing, so you don't need to set up Stripe Billing.

### Payment gateway

Once you have enabled billing, you will see the following **Payment gateway** options for collecting payments via Stripe:

* **Clerk development gateway**: A shared **test** Stripe account so developers can get started testing and building with billing **in development** without needing to create and configure a Stripe account.
* **Stripe account**: Use your own Stripe account.

## Create a plan

Subscription plans are what your users subscribe to. There is no limit to the number of plans you can create.

To create a plan, navigate to the [**Plans**](https://dashboard.clerk.com/last-active?path=billing/plans) page in the Clerk Dashboard. Here, you can create, edit, and delete plans. To setup B2C billing, select the **Plans for Users** tab and select **Add Plan**. When creating a plan, you can also create features for the plan; see the next section for more information.

> \[!TIP]
> What is the **Publicly available** option?
>
> ***
>
> Plans appear in some Clerk components depending on what kind of plan it is. All plans can appear in the `<PricingTable />` component. If it's a user plan, it can appear in the `<UserProfile />` component. When creating or editing a plan, if you'd like to hide it from appearing in Clerk components, you can toggle the **Publicly available** option off.

## Add features to a plan

Features make it easy to give entitlements to your plans. You can add any number of features to a plan.

You can add a feature to a plan when you are creating a plan. To add it after a plan is created:

1. Navigate to the [**Plans**](https://dashboard.clerk.com/last-active?path=billing/plans) page in the Clerk Dashboard.
2. Select the plan you'd like to add a feature to.
3. In the **Features** section, select **Add Feature**.

> \[!TIP]
> What is the **Publicly available** option?
>
> ***
>
> Plans appear in some Clerk components depending on what kind of plan it is. All plans can appear in the `<PricingTable />` component. If it's a user plan, it can appear in the `<UserProfile />` component. When adding a feature to a plan, it will also automatically appear in the corresponding plan. When creating or editing a feature, if you'd like to hide it from appearing in Clerk components, you can toggle the **Publicly available** option off.

## Create a pricing page

You can create a pricing page by using the <SDKLink href="/docs/:sdk:/components/billing/pricing-table" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<PricingTable /></SDKLink> component. This component displays a table of plans and features that users can subscribe to. **It's recommended to create a dedicated page**, as shown in the following example.

<If sdk="nextjs">
  ```tsx {{ filename: 'app/pricing/page.tsx' }}
  import { PricingTable } from '@clerk/nextjs'

  export default function PricingPage() {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
        <PricingTable />
      </div>
    )
  }
  ```
</If>

## Control access with features and plans

You can use Clerk's features and plans to gate access to the content. There are a few ways to do this, but the recommended approach is to either use the [`has()`](/docs/references/backend/types/auth-object#has) method or the <SDKLink href="/docs/:sdk:/components/protect" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue"]} code={true}>\<Protect></SDKLink> component.

The `has()` method is available for any JavaScript framework, while `<Protect>` is only available for React-based frameworks.

### Example: Using `has()`

Use the `has()` method to test if the user has access to a **plan**:

```jsx
const hasPremiumAccess = has({ plan: 'gold' })
```

Or a **feature**:

```jsx
const hasPremiumAccess = has({ feature: 'widgets' })
```

The [`has()`](/docs/references/backend/types/auth-object#has) method checks if the user has been granted a specific type of access control (role, permission, feature, or plan) and returns a boolean value. It is available on the [`auth` object](/docs/references/backend/types/auth-object) on the server. Depending on the framework you are using, you will access the `auth` object differently.

<Tabs items={[ "Plan", "Feature"]}>
  <Tab>
    The following example demonstrates how to use `has()` to check if a user has a plan.

        <If sdk="nextjs">
          ```tsx {{ filename: 'app/bronze-content/page.tsx' }}
          import { auth } from '@clerk/nextjs/server'

          export default async function BronzeContentPage() {
            const { has } = await auth()

            const hasBronzePlan = has({ plan: 'bronze' })

            if (!hasBronzePlan) return <h1>Only subscribers to the Bronze plan can access this content.</h1>

            return <h1>For Bronze subscribers only</h1>
          }
          ```
        </If>
  </Tab>

  <Tab>
    The following example demonstrates how to use `has()` to check if a user has a feature.

        <If sdk="nextjs">
          ```tsx {{ filename: 'app/premium-content/page.tsx' }}
          import { auth } from '@clerk/nextjs/server'

          export default async function PremiumContentPage() {
            const { has } = await auth()

            const hasPremiumAccess = has({ feature: 'premium_access' })

            if (!hasPremiumAccess)
              return <h1>Only subscribers with the Premium Access feature can access this content.</h1>

            return <h1>Our Exclusive Content</h1>
          }
          ```
        </If>
  </Tab>
</Tabs>

### Example: Using `<Protect>`

The <SDKLink href="/docs/:sdk:/components/protect" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue"]} code={true}>\<Protect></SDKLink> component protects content or even entire routes by checking if the user has been granted a specific type of access control (role, permission, feature, or plan). You can pass a `fallback` prop to `<Protect>` that will be rendered if the user does not have the access control.

<Tabs items={["Plan", "Feature"]}>
  <Tab>
    The following example demonstrates how to use `<Protect>` to protect a page by checking if the user has a plan.

        <If sdk="nextjs">
          ```tsx {{ filename: 'app/protected-content/page.tsx' }}
          import { Protect } from '@clerk/nextjs'

          export default function ProtectedContentPage() {
            return (
              <Protect
                plan="bronze"
                fallback={<p>Only subscribers to the Bronze plan can access this content.</p>}
              >
                <h1>Exclusive Bronze Content</h1>
                <p>This content is only visible to Bronze subscribers.</p>
              </Protect>
            )
          }
          ```
        </If>
  </Tab>

  <Tab>
    The following example demonstrates how to use `<Protect>` to protect a page by checking if the user has a feature.

        <If sdk="nextjs">
          ```tsx {{ filename: 'app/protected-premium-content/page.tsx' }}
          import { Protect } from '@clerk/nextjs'

          export default function ProtectedPremiumContentPage() {
            return (
              <Protect
                feature="premium_access"
                fallback={<p>Only subscribers with the Premium Access feature can access this content.</p>}
              >
                <h1>Exclusive Premium Content</h1>
                <p>This content is only visible to users with Premium Access feature.</p>
              </Protect>
            )
          }
          ```
        </If>
  </Tab>
</Tabs>
