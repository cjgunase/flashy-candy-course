'use client';

import { useState } from 'react';
import { updateCard, deleteCard } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Trash2 } from 'lucide-react';

type CardData = {
    id: number;
    front: string;
    back: string;
    deckId: number;
};

export function CardItem({ card }: { card: CardData }) {
    const [editOpen, setEditOpen] = useState(false);

    return (
        <Card className="group hover:border-primary/50 transition-colors relative">
            <CardContent className="p-4 space-y-3">
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm rounded-md p-1 shadow-sm">
                    <Dialog open={editOpen} onOpenChange={setEditOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                <Pencil className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Card</DialogTitle>
                            </DialogHeader>
                            <form action={async (formData) => {
                                await updateCard(formData);
                                setEditOpen(false);
                            }} className="space-y-4">
                                <input type="hidden" name="id" value={card.id} />
                                <input type="hidden" name="deckId" value={card.deckId} />
                                <div className="space-y-2">
                                    <Label htmlFor="front">Front</Label>
                                    <Textarea id="front" name="front" defaultValue={card.front} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="back">Back</Label>
                                    <Textarea id="back" name="back" defaultValue={card.back} required />
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Save</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <form action={deleteCard}>
                        <input type="hidden" name="id" value={card.id} />
                        <input type="hidden" name="deckId" value={card.deckId} />
                        <Button variant="ghost" size="icon" type="submit" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </form>
                </div>

                <div>
                    <div className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-1">Front</div>
                    <div className="bg-muted/30 p-2 rounded-md min-h-[40px] whitespace-pre-wrap">{card.front}</div>
                </div>
                <div>
                    <div className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-1">Back</div>
                    <div className="bg-muted/30 p-2 rounded-md min-h-[40px] whitespace-pre-wrap">{card.back}</div>
                </div>
            </CardContent>
        </Card>
    );
}
