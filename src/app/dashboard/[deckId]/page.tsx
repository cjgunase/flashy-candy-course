
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { decks, cards } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createCard } from "@/app/actions";
import Link from "next/link";
import { ChevronLeft, Plus } from "lucide-react";
import { DeckSettings } from "@/components/deck-settings";
import { CardItem } from "@/components/card-item";

export default async function DeckPage({ params }: { params: Promise<{ deckId: string }> }) {
    const { userId } = await auth();
    if (!userId) return <div>Sign in to view</div>;

    const { deckId } = await params;
    const deckIdNum = parseInt(deckId);
    if (isNaN(deckIdNum)) return notFound();

    const deck = await db.query.decks.findFirst({
        where: (decks, { eq, and }) => and(eq(decks.id, deckIdNum), eq(decks.userId, userId))
    });

    if (!deck) return notFound();

    const deckCards = await db.select()
        .from(cards)
        .where(eq(cards.deckId, deckIdNum))
        .orderBy(desc(cards.createdAt));

    return (
        <div className="container mx-auto p-8">
            <div className="mb-6">
                <Button variant="ghost" asChild className="mb-4 pl-0">
                    <Link href="/dashboard">
                        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                    </Link>
                </Button>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold">{deck.title}</h1>
                            <DeckSettings deck={deck} />
                        </div>
                        {deck.description && <p className="text-muted-foreground mt-2">{deck.description}</p>}
                    </div>
                    <Button asChild>
                        <Link href={`/dashboard/${deckId}/study`}>
                            Study Deck ({deckCards.length} cards)
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Add Card Form */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-8">
                        <CardContent className="pt-6">
                            <h2 className="text-xl font-semibold mb-4">Add New Card</h2>
                            <form action={createCard} className="space-y-4">
                                <input type="hidden" name="deckId" value={deckId} />
                                <div className="space-y-2">
                                    <Label htmlFor="front">Front</Label>
                                    <Textarea id="front" name="front" placeholder="Question or term" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="back">Back</Label>
                                    <Textarea id="back" name="back" placeholder="Answer or definition" required />
                                </div>
                                <Button type="submit" className="w-full">
                                    <Plus className="mr-2 h-4 w-4" /> Add Card
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Cards List */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-xl font-semibold mb-0">Cards ({deckCards.length})</h2>
                    {deckCards.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/50">
                            <p className="text-muted-foreground">No cards in this deck yet.</p>
                            <p className="text-sm text-muted-foreground mt-1">Use the form to add your first card.</p>
                        </div>
                    ) : (
                        deckCards.map((card) => (
                            <CardItem key={card.id} card={card} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
