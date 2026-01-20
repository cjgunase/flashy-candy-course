"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sparkles } from "lucide-react";
import { generateCards } from "@/app/actions";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface GenerateCardsButtonProps {
    deckId: number;
    isPro: boolean;
}

export function GenerateCardsButton({ deckId, isPro }: GenerateCardsButtonProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleGenerate = async () => {
        startTransition(async () => {
            try {
                const formData = new FormData();
                formData.append("deckId", deckId.toString());
                // Leave prompt empty - the generateCards action will use deck title and description
                formData.append("prompt", "");
                await generateCards(formData);
            } catch (error) {
                console.error("Failed to generate cards:", error);
            }
        });
    };

    if (isPro) {
        return (
            <Button
                onClick={handleGenerate}
                disabled={isPending}
                className="gap-2"
                variant="default"
            >
                <Sparkles className="h-4 w-4" />
                {isPending ? "Generating cards..." : "Generate cards with AI"}
            </Button>
        );
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        onClick={() => router.push("/pricing")}
                        className="gap-2"
                        variant="default"
                    >
                        <Sparkles className="h-4 w-4" />
                        Generate cards with AI
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>This is a paid feature. Upgrade to Pro to use AI generation.</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
