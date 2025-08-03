"use client";

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SignUpButton } from '@clerk/nextjs';


const pantryStaples = ["Olive Oil", "Onions", "Garlic", "Canned Tomatoes", "Pasta"];

export function InteractivePantryDemo() {
    const [pantryItems, setPantryItems] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showCTA, setShowCTA] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const { ref, inView } = useInView({
        triggerOnce: true, // Only trigger the animation once
        threshold: 0.5,    // Trigger when 50% of the component is visible
    });

    useEffect(() => {
        if (!inView) return;

        const timer = setInterval(() => {
            if (currentIndex < pantryStaples.length) {
                setIsAnimating(true);
                // Short delay to allow for animation
                setTimeout(() => {
                    setPantryItems(prev => [...prev, pantryStaples[currentIndex]]);
                    setCurrentIndex(prev => prev + 1);
                    setIsAnimating(false);
                }, 300);
            } else {
                setShowCTA(true);
                clearInterval(timer);
            }
        }, 1500); // Add an item every 1.5 seconds

        return () => clearInterval(timer);
    }, [inView, currentIndex]); // Rerun effect if inView changes or currentIndex changes

    return (
        <div ref={ref} className="w-full">
            <Card className="w-full max-w-2xl lg:max-w-4xl mx-auto shadow-lg overflow-hidden border-primary/20 transition-all duration-300">
                <CardHeader className="text-center bg-muted/50 pb-4">
                    <CardTitle className="text-2xl font-headline">Reduce Waste, Save Money</CardTitle>
                    <CardDescription>Our AI skips ingredients you already own.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2">
                        <Input
                            readOnly
                            value={inView && isAnimating ? pantryStaples[currentIndex] : ""}
                            placeholder={inView ? "Adding items from your pantry..." : "Scroll down to see the magic..."}
                            className="font-mono text-center transition-all duration-300"
                        />
                        <Button variant="outline" size="icon" className="shrink-0" disabled>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="min-h-[88px] p-4 bg-muted rounded-lg border flex items-center justify-center">
                        {pantryItems.length === 0 && !isAnimating ? (
                             <p className="text-sm text-muted-foreground">Your pantry items will appear here...</p>
                        ) : (
                            <div className="flex flex-wrap gap-2 justify-center">
                                {pantryItems.map((item, index) => (
                                    <Badge key={`${item}-${index}`} variant="secondary" className="text-base py-1 px-3 animate-in fade-in zoom-in-95">
                                        {item}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="p-4 justify-center min-h-[76px]">
                     <div className={cn("transition-opacity duration-500", showCTA ? "opacity-100" : "opacity-0 pointer-events-none")}>
                         <SignUpButton>
                            <Button size="lg">
                                <Sparkles className="mr-2 h-5 w-5" />
                                Start Your Smart List
                            </Button>
                        </SignUpButton>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
