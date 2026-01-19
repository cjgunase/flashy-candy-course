"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, RotateCw } from "lucide-react"

interface StudySessionProps {
    cards: {
        id: number
        front: string
        back: string
        deckId: number
    }[]
}

export function StudySession({ cards }: StudySessionProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isFlipped, setIsFlipped] = useState(false)

    if (cards.length === 0) {
        return (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <h3 className="text-lg font-semibold mb-2">No cards found</h3>
                <p className="text-muted-foreground">Add cards to this deck to start studying.</p>
            </div>
        )
    }

    const currentCard = cards[currentIndex]

    const handleNext = () => {
        setIsFlipped(false)
        setCurrentIndex((prev) => (prev + 1) % cards.length)
    }

    const handlePrev = () => {
        setIsFlipped(false)
        setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length)
    }

    const handleFlip = () => {
        setIsFlipped(!isFlipped)
    }

    return (
        <div className="flex flex-col items-center justify-center max-w-2xl mx-auto space-y-6">
            <div className="text-sm text-muted-foreground">
                Card {currentIndex + 1} of {cards.length}
            </div>

            <div
                className="w-full aspect-video cursor-pointer perspective-1000"
                onClick={handleFlip}
            >
                <Card className="w-full h-full flex items-center justify-center p-8 text-center text-2xl relative transition-all duration-300 transform-style-3d">
                    <CardContent className="flex items-center justify-center h-full w-full">
                        <div className="prose dark:prose-invert">
                            {isFlipped ? currentCard.back : currentCard.front}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={handlePrev} disabled={cards.length <= 1}>
                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                <Button onClick={handleFlip}>
                    <RotateCw className="mr-2 h-4 w-4" /> {isFlipped ? "Show Front" : "Show Back"}
                </Button>
                <Button variant="outline" onClick={handleNext} disabled={cards.length <= 1}>
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
