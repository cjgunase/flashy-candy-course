"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { generateDeckWithAI } from "@/app/actions";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function GenerateDeckButton({ isPro }: { isPro: boolean }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        startTransition(async () => {
            try {
                await generateDeckWithAI(prompt);
                setOpen(false);
                setPrompt("");
            } catch (error) {
                console.error("Failed to generate deck:", error);
                // In a real app, show a toast here
            }
        });
    };

    if (!isPro) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="h-full">
                            <Button
                                variant="outline"
                                className="h-full w-full flex flex-col items-center justify-center p-8 border-dashed border-2 gap-4 hover:border-primary/50 hover:bg-accent/5 opacity-80"
                                onClick={() => router.push("/pricing")}
                            >
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Sparkles className="h-6 w-6 text-primary" />
                                </div>
                                <div className="text-center">
                                    <h3 className="font-bold text-lg">Generate with AI</h3>
                                    <p className="text-sm text-muted-foreground mt-1">Upgrade to Pro</p>
                                </div>
                            </Button>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Upgrade to Pro to create AI decks</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="h-full w-full flex flex-col items-center justify-center p-8 border-dashed border-2 gap-4 hover:border-primary/50 hover:bg-accent/5"
                >
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-center">
                        <h3 className="font-bold text-lg">Generate with AI</h3>
                        <p className="text-sm text-muted-foreground mt-1">Create a deck instantly</p>
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Generate Deck with AI</DialogTitle>
                    <DialogDescription>
                        Describe what you want to learn. expecting 10-20 cards.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="prompt">Topic or Description</Label>
                        <Textarea
                            id="prompt"
                            placeholder="e.g., Photosynthesis, The French Revolution, Python Data Structures..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={4}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleGenerate} disabled={isPending || !prompt.trim()}>
                        {isPending ? (
                            <>
                                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Generate Deck
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
