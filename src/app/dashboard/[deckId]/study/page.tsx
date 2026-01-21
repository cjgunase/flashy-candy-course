import { StudySession } from "@/components/study-session";
import { db } from "@/db";
import { cards, decks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function StudyPage({ params }: { params: Promise<{ deckId: string }> }) {
    const { userId } = await auth();
    if (!userId) return <div>Sign in to view</div>;

    const { deckId } = await params;
    const deckIdNum = parseInt(deckId);

    if (isNaN(deckIdNum)) return notFound();

    const deck = await db.query.decks.findFirst({
        where: (decks, { eq, and }) => and(eq(decks.id, deckIdNum), eq(decks.userId, userId))
    });

    if (!deck) return notFound();

    const deckCards = await db.select().from(cards).where(eq(cards.deckId, deckIdNum));

    return (
        <div className="container mx-auto p-8">
            <div className="mb-6">
                <Button variant="ghost" asChild className="mb-4 pl-0">
                    <Link href="/dashboard">
                        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                    </Link>
                </Button>
                <div className="flex flex-col items-center">
                    <h1 className="text-3xl font-bold">{deck.title}</h1>
                    {deck.description && <p className="text-muted-foreground mt-2">{deck.description}</p>}
                </div>
            </div>

            <StudySession cards={deckCards} />
        </div>
    );
}
