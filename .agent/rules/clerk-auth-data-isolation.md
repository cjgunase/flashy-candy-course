---
trigger: model_decision
description: Enforce Clerk authentication and strict user data isolation
---

# CLERK AUTHENTICATION & DATA ISOLATION RULES

## 🚨 CRITICAL MANDATE
This project MUST use **Clerk** for ALL authentication and enforce strict **User Data Isolation**.
Users must NEVER be able to access data belonging to other users.

**MANDATORY Rules:**
- ❌ NEVER implement custom authentication (no JWTs, no sessions, no bcrypt).
- ❌ NEVER query data without filtering by the authenticated user's ID (except for strictly public data).
- ✅ ALWAYS use `@clerk/nextjs` for auth components and helpers (`auth()`, `currentUser()`).
- ✅ ALWAYS include a `userId` column in database tables that store user-specific data.
- ✅ ALWAYS filter database queries by `userId` to ensure data isolation.

## 🛡️ ENFORCEMENT POLICY
**NO EXCEPTIONS** - Every data access operation must be scoped to the current user.

## 📋 BEFORE CODING CHECKLIST
**Before writing any data fetching or mutation code:**
1. Identify the authenticated user using `auth()` from `@clerk/nextjs/server`.
2. Ensure the database table has a `userId` column.
3. Verify that the query includes a `where` clause matching `userId`.

## ✅ REQUIRED PATTERNS

### Auth Check & Data Fetching (Server Components / Actions)
```typescript
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { someTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getUserData() {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // ✅ CORRECT - Filter by userId
  const data = await db.query.someTable.findMany({
    where: eq(someTable.userId, userId),
  });
  
  return data;
}
```

### Schema Definition
```typescript
// src/db/schema.ts
import { pgTable, text } from "drizzle-orm/pg-core";

export const someTable = pgTable("some_table", {
  // ... other fields
  userId: text("user_id").notNull(), // ✅ REQUIRED for user-specific data
});
```

### Incorrect Usage
```typescript
// ❌ WRONG - No user filter (Returns data for ALL users)
const data = await db.select().from(someTable);

// ❌ WRONG - Custom Auth
const session = await getCustomSession(); 
```

## 🚨 VIOLATION CONSEQUENCES
Any code that allows cross-user data access is a CRITICAL SECURITY VULNERABILITY and will be rejected.