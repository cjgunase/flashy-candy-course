
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">


      <main className="flex-1">
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
          <div className="flex max-w-[980px] flex-col items-start gap-2">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
              Master Any Subject <br className="hidden sm:inline" />
              with Flash Speed
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground">
              The ultimate AI-powered flashcard tool designed for accelerated learning.
              Beautiful, intuitive, and scientifically proven.
            </p>
          </div>
          <div className="flex gap-4">
            <Button size="lg" asChild>
              <Link href="/dashboard">Get Started Free</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="#">View Demo</Link>
            </Button>
          </div>
        </section>

        <section id="features" className="container py-8 md:py-12 lg:py-24">
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Smart Spaced Repetition</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Our algorithm adapts to your learning pace to maximize retention.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>AI Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Turn any detailed notes or PDFs into flashcards instantly.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Beautiful Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Track your progress with stunning, interactive charts.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="py-6 md:px-8 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; 2024 FlashyCardy Course. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
