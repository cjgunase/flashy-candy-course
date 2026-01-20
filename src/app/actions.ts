'use server'

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { decks, cards } from "@/db/schema";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq, and, count } from "drizzle-orm";
import { checkIsPro } from "@/lib/subscription";
import { generateText, Output } from "ai";
import { openai } from "@ai-sdk/openai";

const createDeckSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
});

const createCardSchema = z.object({
    front: z.string().min(1, "Front text is required"),
    back: z.string().min(1, "Back text is required"),
    deckId: z.coerce.number(),
});

const updateDeckSchema = z.object({
    id: z.coerce.number(),
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
});

const deleteDeckSchema = z.object({
    id: z.coerce.number(),
});

const updateCardSchema = z.object({
    id: z.coerce.number(),
    front: z.string().min(1, "Front text is required"),
    back: z.string().min(1, "Back text is required"),
    deckId: z.coerce.number(),
});

const deleteCardSchema = z.object({
    id: z.coerce.number(),
    deckId: z.coerce.number(),
});

export async function createDeck(formData: FormData) {
    const { userId, has, sessionClaims, orgId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const validatedFields = createDeckSchema.safeParse({
        title: formData.get("title"),
        description: formData.get("description"),
    });

    if (!validatedFields.success) {
        throw new Error("Invalid fields");
    }

    const isPro = has({ permission: "unlimited_decks" }) || has({ role: "org:admin" }) || await checkIsPro(userId, orgId);

    if (!isPro) {
        const [deckCount] = await db.select({ value: count() }).from(decks).where(eq(decks.userId, userId));
        if (deckCount && deckCount.value >= 3) {
            throw new Error("Free plan limit reached. Upgrade to Pro to create more decks.");
        }
    }

    const { title, description } = validatedFields.data;

    const [newDeck] = await db.insert(decks).values({
        userId,
        title,
        description: description || "",
    }).returning();

    revalidatePath("/dashboard");
    redirect(`/dashboard/${newDeck.id}`);
}

export async function createCard(formData: FormData) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const validatedFields = createCardSchema.safeParse({
        front: formData.get("front"),
        back: formData.get("back"),
        deckId: formData.get("deckId"),
    });

    if (!validatedFields.success) {
        console.error(validatedFields.error);
        throw new Error("Invalid fields");
    }

    const { front, back, deckId } = validatedFields.data;

    // Verify deck ownership
    const deck = await db.query.decks.findFirst({
        where: (decks, { eq, and }) => and(eq(decks.id, deckId), eq(decks.userId, userId)),
    });

    if (!deck) {
        throw new Error("Deck not found or unauthorized");
    }

    await db.insert(cards).values({
        deckId,
        front,
        back,
    });

    revalidatePath(`/dashboard/${deckId}`);
}

export async function updateDeck(formData: FormData) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const validatedFields = updateDeckSchema.safeParse({
        id: formData.get("id"),
        title: formData.get("title"),
        description: formData.get("description"),
    });

    if (!validatedFields.success) {
        throw new Error("Invalid fields");
    }

    const { id, title, description } = validatedFields.data;

    const [updatedDeck] = await db.update(decks)
        .set({ title, description, updatedAt: new Date() })
        .where(and(eq(decks.id, id), eq(decks.userId, userId)))
        .returning();

    if (!updatedDeck) {
        throw new Error("Deck not found or unauthorized");
    }

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/${id}`);
}

export async function deleteDeck(formData: FormData) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const validatedFields = deleteDeckSchema.safeParse({
        id: formData.get("id"),
    });

    if (!validatedFields.success) {
        throw new Error("Invalid fields");
    }

    const { id } = validatedFields.data;

    const [deletedDeck] = await db.delete(decks)
        .where(and(eq(decks.id, id), eq(decks.userId, userId)))
        .returning();

    if (!deletedDeck) {
        throw new Error("Deck not found or unauthorized");
    }

    revalidatePath("/dashboard");
    redirect("/dashboard");
}

export async function updateCard(formData: FormData) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const validatedFields = updateCardSchema.safeParse({
        id: formData.get("id"),
        front: formData.get("front"),
        back: formData.get("back"),
        deckId: formData.get("deckId"),
    });

    if (!validatedFields.success) {
        throw new Error("Invalid fields");
    }

    const { id, front, back, deckId } = validatedFields.data;

    // Verify deck ownership
    const deck = await db.query.decks.findFirst({
        where: (decks, { eq, and }) => and(eq(decks.id, deckId), eq(decks.userId, userId)),
    });

    if (!deck) {
        throw new Error("Deck not found or unauthorized");
    }

    const [updatedCard] = await db.update(cards)
        .set({ front, back, updatedAt: new Date() })
        .where(eq(cards.id, id))
        .returning();

    if (!updatedCard) {
        throw new Error("Card not found");
    }

    revalidatePath(`/dashboard/${deckId}`);
}

export async function deleteCard(formData: FormData) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const validatedFields = deleteCardSchema.safeParse({
        id: formData.get("id"),
        deckId: formData.get("deckId"),
    });

    if (!validatedFields.success) {
        throw new Error("Invalid fields");
    }

    const { id, deckId } = validatedFields.data;

    // Verify ownership
    const deck = await db.query.decks.findFirst({
        where: (decks, { eq, and }) => and(eq(decks.id, deckId), eq(decks.userId, userId)),
    });

    if (!deck) {
        throw new Error("Deck not found or unauthorized");
    }

    await db.delete(cards)
        .where(eq(cards.id, id));

    revalidatePath(`/dashboard/${deckId}`);
}

export async function generateCards(formData: FormData) {
    const { userId, has, orgId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const deckId = Number(formData.get("deckId"));
    const prompt = formData.get("prompt") as string;

    if (!deckId) throw new Error("Deck ID required");

    const isPro = has({ permission: "ai_flashcard_generation" }) || await checkIsPro(userId, orgId);

    if (!isPro) {
        throw new Error("Pro plan required for AI generation");
    }

    const deck = await db.query.decks.findFirst({
        where: (decks, { eq, and }) => and(eq(decks.id, deckId), eq(decks.userId, userId))
    });

    if (!deck) throw new Error("Deck not found");

    const { output } = await generateText({
        model: openai("gpt-4o"),
        output: Output.object({
            schema: z.object({
                flashcards: z.array(z.object({
                    front: z.string().describe("The question or concept on the front of the card"),
                    back: z.string().describe("The answer or explanation on the back of the card"),
                })),
            }),
        }),
        prompt: prompt || `Generate 20 flashcards for a deck titled "${deck.title}". Description: "${deck.description || "No description provided"}". Focus on key concepts and definitions.`,
    });

    if (output.flashcards.length > 0) {
        await db.insert(cards).values(
            output.flashcards.map(card => ({
                deckId: deck.id,
                front: card.front,
                back: card.back,
            }))
        );
    }

    revalidatePath(`/dashboard/${deckId}`);
}

export async function generateDeckWithAI(prompt: string) {
    const { userId, has, orgId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const isPro = has({ permission: "unlimited_decks" }) || has({ role: "org:admin" }) || await checkIsPro(userId, orgId);

    if (!isPro) {
        throw new Error("Pro plan required for AI generation");
    }

    const { output } = await generateText({
        model: openai("gpt-4o"),
        output: Output.object({
            schema: z.object({
                title: z.string().describe("A catchy title for the flashcard deck"),
                description: z.string().describe("A brief description of what the deck covers"),
                cards: z.array(z.object({
                    front: z.string().describe("The question or concept"),
                    back: z.string().describe("The answer or explanation"),
                })).min(5).max(20),
            }),
        }),
        prompt: `Generate a flashcard deck about: "${prompt}". Create a title, description, and 10-15 cards.`,
    });

    const [newDeck] = await db.insert(decks).values({
        userId,
        title: output.title,
        description: output.description,
    }).returning();

    if (output.cards.length > 0) {
        await db.insert(cards).values(
            output.cards.map(card => ({
                deckId: newDeck.id,
                front: card.front,
                back: card.back,
            }))
        );
    }

    revalidatePath("/dashboard");
    redirect(`/dashboard/${newDeck.id}`);
}

const createDeckWithAISchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
});

export async function createDeckWithAI(input: z.infer<typeof createDeckWithAISchema>) {
    const { userId, has, orgId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Validate input
    const validatedFields = createDeckWithAISchema.parse(input);
    const { title, description } = validatedFields;

    // Check if user has AI generation permission
    const isPro = has({ permission: "ai_flashcard_generation" }) || await checkIsPro(userId, orgId);

    if (!isPro) {
        throw new Error("Pro plan required for AI card generation");
    }

    // Check deck limit for non-pro users (this shouldn't happen but double check)
    const hasUnlimitedDecks = has({ permission: "unlimited_decks" }) || has({ role: "org:admin" }) || await checkIsPro(userId, orgId);

    if (!hasUnlimitedDecks) {
        const [deckCount] = await db.select({ value: count() }).from(decks).where(eq(decks.userId, userId));
        if (deckCount && deckCount.value >= 3) {
            throw new Error("Free plan limit reached. Upgrade to Pro to create more decks.");
        }
    }

    // Create the deck first
    const [newDeck] = await db.insert(decks).values({
        userId,
        title,
        description: description || "",
    }).returning();

    // Generate 20 cards using AI
    const { output } = await generateText({
        model: openai("gpt-4o"),
        output: Output.object({
            schema: z.object({
                flashcards: z.array(z.object({
                    front: z.string().describe("The question or concept on the front of the card"),
                    back: z.string().describe("The answer or explanation on the back of the card"),
                })),
            }),
        }),
        prompt: `Generate exactly 20 flashcards for a deck titled "${title}". ${description ? `Description: "${description}".` : ""} Focus on key concepts, definitions, and important information. Make the cards educational and well-structured.`,
    });

    // Insert the generated cards
    if (output.flashcards.length > 0) {
        await db.insert(cards).values(
            output.flashcards.map(card => ({
                deckId: newDeck.id,
                front: card.front,
                back: card.back,
            }))
        );
    }

    revalidatePath("/dashboard");
    redirect(`/dashboard/${newDeck.id}`);
}
