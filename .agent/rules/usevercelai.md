---
trigger: model_decision
description: Enforce usage of Vercel AI SDK for all AI features
---

# VERCEL AI SDK STRICT USAGE RULES

## 🚨 CRITICAL MANDATE
This project MUST use the **Vercel AI SDK** (`ai`, `@ai-sdk/openai`) for ALL AI-powered features, specifically for AI flashcard generation.

**MANDATORY Rules:**
- ❌ NEVER use the OpenAI SDK directly (`openai` npm package) without the Vercel AI SDK wrapper.
- ❌ NEVER use LangChain or other AI frameworks unless explicitly requested.
- ✅ ALWAYS use `generateText` or `streamText` from `ai`.
- ✅ ALWAYS use structured outputs with `zod` for data generation.

## 📋 PREFERRED CODING PATTERNS

### Structured Flashcard Generation
Use `generateText` with `Output.object` and `zod` schema to ensure type-safe structured responses.
Specifically for flashcards, ensure the schema returns an array of objects with `front` and `back` properties.

```typescript
import { generateText, Output } from 'ai';
import { openai } from "@ai-sdk/openai";
import { z } from 'zod'; // Ensure zod is imported

// Example: Generating a set of flashcards
const { output } = await generateText({
  model: openai("gpt-4o"), // Use appropriate model (e.g., gpt-4o, gpt-3.5-turbo)
  output: Output.object({
    schema: z.object({
      flashcards: z.array(
        z.object({
          front: z.string().describe("The question or concept on the front of the card"),
          back: z.string().describe("The answer or explanation on the back of the card"),
        })
      ),
    }),
  }),
  prompt: 'Generate 10 flashcards about cellular respiration for a biology student.',
});

// Access the result
const cards = output.flashcards; // typed as { front: string; back: string }[]
```

## 🔧 INSTALLATION
Ensure these packages are installed:
```bash
npm install ai @ai-sdk/openai zod
```