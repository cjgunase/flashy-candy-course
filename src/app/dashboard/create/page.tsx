
import { CreateDeckForm } from "@/components/create-deck-form";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { decks } from "@/db/schema";
import { eq, count } from "drizzle-orm";


export default async function CreateDeckPage() {


    const { userId, has, orgId } = await auth();
    if (!userId) redirect("/");

    // Check if user has pro plan or unlimited_decks feature
    const isPro = has({ plan: "pro" }) || has({ feature: "unlimited_decks" }) || has({ role: "org:admin" });
    // Check if user has ai_flashcard_generation feature
    const hasAIGeneration = has({ plan: "pro" }) || has({ feature: "ai_flashcard_generation" });

    if (!isPro) {
        const [deckCount] = await db.select({ value: count() }).from(decks).where(eq(decks.userId, userId));
        if (deckCount && deckCount.value >= 3) {
            redirect("/pricing");
        }
    }
    return (
        <div className="container mx-auto max-w-2xl p-8">
            <Button variant="ghost" asChild className="mb-6 pl-0">
                <Link href="/dashboard">
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Link>
            </Button>
            <Card>
                <CardHeader>
                    <CardTitle>Create a New Deck</CardTitle>
                    <CardDescription>Give your new flashcard deck a name and description.</CardDescription>
                </CardHeader>
                <CardContent>
                    <CreateDeckForm isPro={hasAIGeneration} />
                </CardContent>
            </Card>
        </div>
    );
}
