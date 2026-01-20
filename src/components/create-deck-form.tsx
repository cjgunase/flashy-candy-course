"use client";

import { createDeck } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CreateDeckWithAIButton } from "./create-deck-with-ai-button";
import { useState } from "react";

interface CreateDeckFormProps {
    isPro: boolean;
}

export function CreateDeckForm({ isPro }: CreateDeckFormProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    return (
        <form action={createDeck} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    name="title"
                    placeholder="e.g., Biology 101"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    placeholder="Optional description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div className="flex justify-end gap-2">
                <CreateDeckWithAIButton
                    title={title}
                    description={description}
                    isPro={isPro}
                />
                <Button type="submit" disabled={!title.trim()}>
                    Create Deck
                </Button>
            </div>
        </form>
    );
}
