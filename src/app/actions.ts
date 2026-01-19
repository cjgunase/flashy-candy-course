'use server'

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { decks, cards } from "@/db/schema";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq, and } from "drizzle-orm";

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
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const validatedFields = createDeckSchema.safeParse({
        title: formData.get("title"),
        description: formData.get("description"),
    });

    if (!validatedFields.success) {
        throw new Error("Invalid fields");
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
