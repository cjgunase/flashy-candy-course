import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] w-full flex-col items-center justify-center px-4 py-10 text-center sm:px-8">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          FlashyCardy
        </h1>
        <p className="max-w-[42rem] text-lg text-muted-foreground sm:text-xl">
          Master any subject with flash speed.
        </p>
      </div>

      <div className="mt-8 flex gap-4">
        <SignedOut>
          <SignInButton mode="modal">
            <Button size="lg" className="min-w-[120px]">Login</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button size="lg" variant="secondary" className="min-w-[120px]">Sign Up</Button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <Button size="lg" asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </SignedIn>
      </div>
    </div>
  );
}
