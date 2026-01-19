'use server'

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { decks, cards } from "@/db/schema";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

const createDeckSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
});

const createCardSchema = z.object({
    front: z.string().min(1, "Front text is required"),
    back: z.string().min(1, "Back text is required"),
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
