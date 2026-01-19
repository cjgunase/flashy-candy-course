---
trigger: always_on
---

---
description: Enforce strict usage of Drizzle ORM for all database interactions
globs: 
alwaysApply: true
---
# DRIZZLE ORM STRICT USAGE RULES

## 🚨 CRITICAL MANDATE
This project MUST use ONLY **Drizzle ORM** for ALL database interactions.
All database schemas MUST be defined in `src/db/schema.ts` (or equivalent schema files).
All queries MUST use the Drizzle query builder or strictly typed helpers.

**MANDATORY Rules:**
- ❌ NEVER use raw SQL strings unless absolutely necessary and wrapped in Drizzle's `sql` template tag
- ❌ NEVER use other ORMs (Prisma, TypeORM, Sequelize, etc.)
- ❌ NEVER hardcode table names in queries as strings
- ✅ ALWAYS define schema using Drizzle's `pgTable`, `text`, `integer`, etc.
- ✅ ALWAYS use Drizzle's typed query builder (`db.select().from(table)...` or `db.query.table.findMany()`)
- ✅ ALWAYS sync schema changes using Drizzle Kit

## 🛡️ ENFORCEMENT POLICY
**NO EXCEPTIONS** - Every database interaction must go through Drizzle ORM.

## 📋 BEFORE CODING CHECKLIST
**Before writing DB code:**
1. Ensure the schema is defined in `src/db/schema.ts`
2. Run database migrations/push if schema changed
3. Import the db instance and schema objects relative to `@/db`

## ✅ REQUIRED PATTERNS

### Schema Definition
```typescript
// src/db/schema.ts
import { pgTable, text, serial } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
});
```

### Queries
```typescript
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

// ✅ CORRECT - Typed Query
const result = await db.select().from(users).where(eq(users.email, "test@example.com"));

// ✅ CORRECT - Query API
const user = await db.query.users.findFirst({
  where: (users, { eq }) => eq(users.email, "test@example.com"),
});
```

### Incorrect Usage
```typescript
// ❌ WRONG - Raw SQL String execution without Drizzle template
const result = await client.query("SELECT * FROM users WHERE email = 'test@example.com'");

// ❌ WRONG - Hardcoded strings for table names
// db.select().from("users")... // Avoid this, use the schema object
```

## 🚨 VIOLATION CONSEQUENCES
Any code that violates these rules will be rejected. Raw SQL strings are potential security risks and break type safety.
