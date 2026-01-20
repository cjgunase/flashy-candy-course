"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sparkles } from "lucide-react";
import { createDeckWithAI } from "@/app/actions";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

interface CreateDeckWithAIButtonProps {
    title: string;
    description: string;
    isPro: boolean;
    disabled?: boolean;
}

export function CreateDeckWithAIButton({ title, description, isPro, disabled }: CreateDeckWithAIButtonProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleGenerate = async () => {
        if (!title.trim()) {
            alert("Please enter a title first");
            return;
        }

        startTransition(async () => {
            try {
                await createDeckWithAI({
                    title,
                    description,
                });
            } catch (error) {
                console.error("Failed to create deck with AI:", error);
                alert(error instanceof Error ? error.message : "Failed to create deck with AI");
            }
        });
    };

    if (isPro) {
        return (
            <Button
                type="button"
                onClick={handleGenerate}
                disabled={isPending || disabled || !title.trim()}
                className="gap-2"
                variant="secondary"
            >
                <Sparkles className="h-4 w-4" />
                {isPending ? "Creating with AI..." : "Create with AI"}
            </Button>
        );
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        type="button"
                        onClick={() => router.push("/pricing")}
                        className="gap-2"
                        variant="secondary"
                    >
                        <Sparkles className="h-4 w-4" />
                        Create with AI
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>This is a paid feature. Upgrade to Pro to use AI generation.</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
