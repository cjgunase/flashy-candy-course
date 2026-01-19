
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { decks } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, BookOpen, ArrowRight, Settings } from "lucide-react";

export default async function DashboardPage() {
    const { userId } = await auth();

    if (!userId) {
        return <div>Please sign in to view your dashboard.</div>;
    }

    const userDecks = await db.select().from(decks).where(eq(decks.userId, userId)).orderBy(desc(decks.createdAt));

    return (
        <div className="container mx-auto p-8">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                        My Decks
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">Manage your flashcards and master your subjects.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Create New Deck Card */}
                <Link href="/dashboard/create" className="group h-full">
                    <div className="h-full border-3 border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-accent/10 rounded-xl flex flex-col items-center justify-center p-8 transition-all cursor-pointer min-h-[220px]">
                        <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                            <Plus className="h-7 w-7 text-primary" />
                        </div>
                        <h3 className="font-bold text-xl text-foreground">Create New Deck</h3>
                        <p className="text-sm text-muted-foreground mt-2 text-center max-w-[200px]">Start a new collection of flashcards to study</p>
                    </div>
                </Link>

                {userDecks.map((deck) => (
                    <Card key={deck.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 flex flex-col overflow-hidden relative border-muted/60">
                        {/* Card Highlight Decoration */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl leading-tight">
                                <span className="line-clamp-1">{deck.title}</span>
                            </CardTitle>
                            <CardDescription className="line-clamp-2 min-h-[2.5rem] mt-2">
                                {deck.description || "No description provided."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow pt-0">
                            <div className="flex items-center text-sm text-muted-foreground bg-secondary/50 p-2 rounded-md w-fit">
                                <BookOpen className="mr-2 h-3.5 w-3.5" />
                                <span>Flashcard Set</span>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0 flex gap-2">
                            <Button asChild variant="default" className="w-full bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 border-0 shadow-md">
                                <Link href={`/dashboard/${deck.id}/study`}>
                                    Study Now
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="icon" className="shrink-0" title="Manage Deck">
                                <Link href={`/dashboard/${deck.id}`}>
                                    <Settings className="h-4 w-4" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
