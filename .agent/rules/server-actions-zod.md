---
trigger: model_decision
description: Enforce strict usage of Server Components for data retrieval, Server Actions for mutations, and Zod for validation
---

# SERVER ACTIONS & DATA VALIDATION STRICT RULES

## 🚨 CRITICAL MANDATE
This project enforces a strict separation of concerns for data access and mutation, along with rigorous validation.

**MANDATORY Rules:**
- ❌ NEVER fetch data in Client Components (no `useEffect` data fetching).
- ❌ NEVER use API Routes (`pages/api` or `app/api`) for data mutations if Server Actions can be used.
- ❌ NEVER use `FormData` as the direct argument type for Server Actions.
- ❌ NEVER skip input validation.
- ✅ ALWAYS use **Server Components** for data retrieval.
- ✅ ALWAYS use **Server Actions** for all database updates, deletes, and inserts.
- ✅ ALWAYS use **Zod** for data validation.
- ✅ ALWAYS define explicit TypeScript interfaces/types for Server Action inputs.

## 🛡️ ENFORCEMENT POLICY
**NO EXCEPTIONS** - All data flows must adhere to this architecture.

## 📋 DATA ACCESS PATTERNS

### Data Retrieval
**Context**: Fetching data to display to the user.
**Rule**: Must be done in Server Components directly (e.g., in `page.tsx` or `layout.tsx`).

```typescript
// ✅ CORRECT - Server Component
import { db } from "@/db";
import { users } from "@/db/schema";

export default async function UserProfile({ params }: { params: { id: string } }) {
  // Direct DB access in Server Component
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, Number(params.id)),
  });

  return <div>{user?.name}</div>;
}
```

### Data Mutation
**Context**: Creating, updating, or deleting data.
**Rule**: Must be done via Server Actions.

```typescript
// ✅ CORRECT - Server Action
"use server"

import { db } from "@/db";
import { users } from "@/db/schema";
import { updateUserSchema } from "@/lib/validators/user"; // Zod schema
import { revalidatePath } from "next/cache";

export async function updateUserAction(input: z.infer<typeof updateUserSchema>) {
  // 1. Validate input (double check even if typed)
  const parsed = updateUserSchema.parse(input);
  
  // 2. Perform DB operation
  await db.update(users).set(parsed).where(eq(users.id, parsed.id));
  
  // 3. Revalidate cache
  revalidatePath("/profile");
}
```

## ✅ VALIDATION STANDARDS

### Zod Usage
All data entering the system (via Server Actions) MUST be validated with Zod.

```typescript
// src/lib/validators/todo.ts
import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  completed: z.boolean().default(false),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
```

### Server Action Signatures
Do **NOT** use `FormData` directly in your Server Action logic if possible. Instead, extract the data in the form handler or component and pass a typed object to the server action.

```typescript
// ❌ WRONG - Using FormData directly as type
export async function createTodo(formData: FormData) {
  const title = formData.get("title"); // Unsafe, untyped
  // ...
}

// ✅ CORRECT - Typed Input
export async function createTodo(input: CreateTodoInput) {
  // input is typed and ready to be validated by Zod
  const data = createTodoSchema.parse(input);
  // ...
}
```

## 🚨 VIOLATION CONSEQUENCES
Code that uses `useEffect` for fetching, API routes for standard mutations, or lacks Zod validation will be rejected.