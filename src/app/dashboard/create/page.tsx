
import { createDeck } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function CreateDeckPage() {
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
                    <form action={createDeck} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" placeholder="e.g., Biology 101" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" placeholder="Optional description..." />
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit">Create Deck</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
