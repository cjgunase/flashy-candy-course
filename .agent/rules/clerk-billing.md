---
description: Enforce usage of Clerk Billing for subscriptions and payments
globs: 
alwaysApply: true
---
# CLERK BILLING STRICT USAGE RULES

## 🚨 CRITICAL MANDATE
This project MUST use **Clerk Billing** for ALL subscription and payment management.
Do NOT use Stripe APIs directly for subscriptions.
Do NOT create custom subscription tables in the database (unless for caching/syncing, but Clerk is the source of truth).

**Defined Plans:**
- `free_user`
- `pro`

**Defined Features:**
- `3_deck_limit`
- `unlimited_decks`
- `ai_flashcard_generation`

## ✅ REQUIRED PATTERNS

### Server-Side Access Control
Use the `has()` helper from `auth()` to check for plans or features.

```typescript
import { auth } from '@clerk/nextjs/server';

export async function MyPage() {
  const { has } = await auth();

  // Check Plan
  if (has({ plan: 'pro' })) {
    // ...
  }

  // Check Feature
  if (has({ feature: 'ai_flashcard_generation' })) {
    // ...
  }
}
```

### Client-Side Access Control (React Components)
Use the `<Protect>` component to conditionally render UI based on plans or features.

```tsx
import { Protect } from '@clerk/nextjs';

export default function FeatureComponent() {
  return (
    <Protect
      feature="ai_flashcard_generation"
      fallback={<p>Upgrade to Pro to use AI generation</p>}
    >
      <AiGenerator />
    </Protect>
  );
}
```

### Pricing Page
Use the `<PricingTable />` component for the pricing UI.

```tsx
// src/app/pricing/page.tsx
import { PricingTable } from '@clerk/nextjs';

export default function PricingPage() {
  return (
    <div className="flex justify-center py-10">
      <PricingTable />
    </div>
  );
}
```

## 🛡️ ENFORCEMENT POLICY
- Interactions with billing/plans must go through Clerk.
- Do not implement custom billing logic (like credit systems or plan management) outside of Clerk unless it's an extension of Clerk's features.
