"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';

const sampleRecipes = [
  {
    title: 'Spicy Chicken Tacos',
    description: 'A quick and fiery taco recipe perfect for a weeknight dinner.',
    tags: ['Chicken', 'Spicy', 'Mexican', 'Dinner']
  },
  {
    title: 'Creamy Tomato Pasta',
    description: 'A comforting and simple vegetarian pasta dish ready in 30 minutes.',
    tags: ['Pasta', 'Vegetarian', 'Italian', 'Quick']
  },
  {
    title: 'Healthy Berry Smoothie',
    description: 'A refreshing and nutritious smoothie to kickstart your morning.',
    tags: ['Smoothie', 'Healthy', 'Breakfast', 'Vegan']
  },
  {
    title: 'Classic Beef Burger',
    description: 'A juicy, delicious, and satisfying homemade beef burger.',
    tags: ['Beef', 'Burger', 'American', 'Comfort Food']
  },
  {
    title: 'Vegetable Stir-Fry',
    description: 'A versatile and healthy stir-fry you can customize with any vegetable.',
    tags: ['Vegetarian', 'Asian', 'Healthy', 'Dinner']
  },
  {
    title: 'Hearty Lentil Soup',
    description: 'A warm and nourishing soup that\'s both cheap and easy to make.',
    tags: ['Soup', 'Vegan', 'Healthy', 'Budget-friendly']
  },
  {
    title: 'Gourmet Grilled Cheese',
    description: 'An elevated take on a classic comfort food, with cheddar and sourdough.',
    tags: ['Sandwich', 'Vegetarian', 'Comfort Food', 'Lunch']
  },
  {
    title: 'Simple Fluffy Omelette',
    description: 'A perfect omelette recipe for a quick and protein-packed breakfast.',
    tags: ['Eggs', 'Breakfast', 'Quick', 'Gluten-Free']
  },
  {
    title: 'Avocado Toast Deluxe',
    description: 'The trendy breakfast staple with a sprinkle of feta and chili flakes.',
    tags: ['Breakfast', 'Vegetarian', 'Healthy', 'Quick']
  },
  {
    title: 'Chicken Caesar Salad',
    description: 'A timeless salad with grilled chicken, croutons, and creamy dressing.',
    tags: ['Salad', 'Chicken', 'Lunch', 'Classic']
  }
];

export function InteractiveRecipeGenerator() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGenerating(true);
      setTimeout(() => {
          setIsFading(true);
          setTimeout(() => {
              setCurrentIndex((prevIndex) => (prevIndex + 1) % sampleRecipes.length);
              setIsFading(false);
          }, 300); // fade out duration
          
          setTimeout(() => {
            setIsGenerating(false);
          }, 1000); // "generating" state duration
      }, 500);

    }, 6000); // Change recipe every 6 seconds

    return () => clearInterval(interval);
  }, []);

  const currentRecipe = sampleRecipes[currentIndex];

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl bg-card/80 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <div className={cn("transition-opacity duration-300 min-h-[72px]", isFading ? 'opacity-0' : 'opacity-100')}>
            <CardTitle className="text-2xl font-headline">{currentRecipe.title}</CardTitle>
            <CardDescription>{currentRecipe.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
         <div className={cn("transition-opacity duration-300 space-y-4 min-h-[140px]", isFading ? 'opacity-0' : 'opacity-100')}>
            <h4 className="font-semibold text-sm text-muted-foreground">Example Recipe Includes:</h4>
             <ul className="list-disc list-inside text-sm space-y-1">
                <li>Step-by-step instructions</li>
                <li>Full ingredient list with quantities</li>
                <li>Estimated cost and nutritional info</li>
                <li>Personalized tips based on your profile</li>
             </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled={isGenerating}>
            {isGenerating ? (
                <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                </>
            ) : (
                <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate New Recipe
                </>
            )}
        </Button>
      </CardFooter>
    </Card>
  );
}
