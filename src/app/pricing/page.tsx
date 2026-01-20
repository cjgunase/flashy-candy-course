import { auth } from "@clerk/nextjs/server";
import { PricingTable } from '@clerk/nextjs';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function PricingPage() {
    const { userId } = await auth();
    const backLink = userId ? "/dashboard" : "/";
    const backText = userId ? "Back to Dashboard" : "Back to Home";

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-10">
            <div className="w-full max-w-6xl px-4 mb-8 flex items-center">
                <Link href={backLink}>
                    <Button variant="ghost" className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        {backText}
                    </Button>
                </Link>
            </div>

            <div className="text-center mb-10 max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-5 duration-500">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                    Upgrade Your Plan
                </h1>
                <p className="text-xl text-muted-foreground">
                    Unlock unlimited decks, AI-powered generation, and premium features.
                </p>
            </div>

            <div className="w-full max-w-7xl px-4 flex justify-center animate-in fade-in slide-in-from-bottom-10 duration-700 delay-100">
                <PricingTable />
            </div>
        </div>
    );
}
