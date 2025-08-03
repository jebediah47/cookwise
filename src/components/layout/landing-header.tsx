
"use client";

import Link from "next/link";
import { ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export function LandingHeader() {
  return (
    <header className="bg-background/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 border-b">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center justify-center">
          <ChefHat className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-bold font-headline">Cookwise</span>
        </Link>
        <nav className="ml-auto hidden md:flex gap-4 sm:gap-6">
          <Link href="/#features" className="text-sm font-medium hover:underline underline-offset-4">
            Features
          </Link>
          <Link href="/#pricing" className="text-sm font-medium hover:underline underline-offset-4">
            Pricing
          </Link>
          <Link href="#faq" className="text-sm font-medium hover:underline underline-offset-4">
            FAQ
          </Link>
        </nav>
        <div className="ml-4 hidden md:flex items-center gap-2">
            <SignedOut>
                <SignInButton mode="modal">
                    <Button variant="ghost">Log In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                    <Button>Sign Up</Button>
                </SignUpButton>
            </SignedOut>
            <SignedIn>
                <UserButton afterSignOutUrl="/" />
            </SignedIn>
        </div>
      </div>
    </header>
  );
}
