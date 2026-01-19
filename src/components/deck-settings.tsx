'use client';

import { useState } from 'react';
import { updateDeck, deleteDeck } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Trash2 } from 'lucide-react';

type Deck = {
    id: number;
    title: string;
    description: string | null;
};

export function DeckSettings({ deck }: { deck: Deck }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Deck Settings</DialogTitle>
                    <DialogDescription>
                        Update your deck information or delete it permanently.
                    </DialogDescription>
                </DialogHeader>

                <form action={async (formData) => {
                    await updateDeck(formData);
                    setOpen(false);
                }} className="space-y-4 py-4">
                    <input type="hidden" name="id" value={deck.id} />
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" defaultValue={deck.title} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            defaultValue={deck.description || ''}
                            placeholder="Optional description"
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save Changes</Button>
                    </DialogFooter>
                </form>

                <div className="border-t pt-4 mt-4">
                    <h4 className="text-sm font-medium text-destructive mb-2">Danger Zone</h4>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="w-full">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Deck
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your deck and all cards inside it.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <form action={deleteDeck}>
                                    <input type="hidden" name="id" value={deck.id} />
                                    <AlertDialogAction type="submit" className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                        Delete
                                    </AlertDialogAction>
                                </form>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </DialogContent>
        </Dialog>
    );
}
