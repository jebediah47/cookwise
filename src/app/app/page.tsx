
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserPreferences } from "@/hooks/use-user-preferences";
import { generateRecipe } from "@/ai/flows/generate-recipe";
import type { Recipe } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { RecipeCard } from "@/components/recipe-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Ban, ChefHat, Wand2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const loadingMessages = [
    "Preheating the AI oven...",
    "Consulting with our digital sous-chef...",
    "Sourcing the freshest pixels...",
    "Simmering the data to perfection...",
    "Adding a pinch of creativity...",
    "Finely chopping the algorithms...",
    "Garnishing the results...",
];

function AiLoadingState() {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
        }, 2000); // Change message every 2 seconds

        return () => clearInterval(intervalId);
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-3xl">Just a moment...</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center text-center space-y-6 min-h-[300px]">
                <div className="relative">
                    <Sparkles className="h-20 w-20 text-primary animate-pulse" />
                    <Sparkles className="h-8 w-8 text-primary/70 absolute -top-2 -left-2 animate-ping" />
                     <Sparkles className="h-6 w-6 text-primary/50 absolute bottom-0 -right-4 animate-ping delay-500" />
                </div>
                <p className="text-lg text-muted-foreground font-medium transition-opacity duration-500">
                    {loadingMessages[currentMessageIndex]}
                </p>
            </CardContent>
        </Card>
    )
}

export default function Home() {
  const router = useRouter();
  const { preferences, loading, isOnboardingComplete, saveRecipe, savedRecipes, availableIngredients } = useUserPreferences();
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userPrompt, setUserPrompt] = useState("");
  const [promptBudget, setPromptBudget] = useState<number | undefined>();

  useEffect(() => {
    if (!loading && !isOnboardingComplete) {
      router.push("/app/onboarding");
    }
  }, [loading, isOnboardingComplete, router]);

  const handleGenerateRecipe = async (prompt?: string, surprise = false) => {
    if (!preferences) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedRecipe(null);

    // If a prompt is passed, use it, otherwise use the state.
    const finalPrompt = prompt !== undefined ? prompt : userPrompt;
    if (prompt !== undefined) {
      setUserPrompt(prompt);
    }
    
    try {
      const recipe = await generateRecipe({ 
        ...preferences, 
        userPrompt: finalPrompt,
        budget: promptBudget,
        availableIngredients: availableIngredients.join(', '),
        surpriseMe: surprise,
        dietaryTargets: preferences.dietaryTargets,
      });
      setGeneratedRecipe(recipe);
    } catch (e) {
      console.error(e);
      setError("Sorry, we couldn't generate a recipe at this time. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };


  const handleSurpriseMe = () => {
    setUserPrompt(""); 
    setPromptBudget(undefined);
    handleGenerateRecipe(undefined, true);
  }

  if (loading || !isOnboardingComplete) {
    return (
      <div className="space-y-4 p-4 md:p-6">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  const isRecipeSaved = (recipeTitle: string) => {
    return savedRecipes.some(r => r.title === recipeTitle);
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Your Next Culinary Adventure
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
          Ready to cook something amazing? Our AI chef can whip up a personalized recipe based on your profile, or you can give it a specific idea to work with!
        </p>
        <div className="w-full max-w-lg space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="text"
                placeholder="e.g., 'A vegan lasagna' or 'something with chicken'"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                className="text-base text-center flex-grow"
                disabled={isGenerating}
              />
              <Input
                type="number"
                placeholder="Budget (€)"
                value={promptBudget ?? ""}
                onChange={(e) => setPromptBudget(e.target.value === '' ? undefined : e.target.valueAsNumber)}
                className="text-base text-center sm:w-32"
                disabled={isGenerating}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                size="lg"
                onClick={() => handleGenerateRecipe()}
                disabled={isGenerating}
                >
                <Sparkles className="mr-2 h-5 w-5" />
                {isGenerating && userPrompt ? "Generating..." : "Generate Recipe"}
                </Button>
                <Button
                size="lg"
                variant="outline"
                onClick={handleSurpriseMe}
                disabled={isGenerating}
                >
                <Wand2 className="mr-2 h-5 w-5" />
                Surprise Me!
                </Button>
            </div>
        </div>
      </div>

      <div className="mt-12">
        {error && (
          <Alert variant="destructive">
            <Ban className="h-4 w-4" />
            <AlertTitle>Generation Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isGenerating && <AiLoadingState />}

        {generatedRecipe && (
          <RecipeCard 
            recipe={generatedRecipe} 
            isSaved={isRecipeSaved(generatedRecipe.title)}
            onSave={() => saveRecipe(generatedRecipe)}
            preferences={preferences}
          />
        )}

        {!generatedRecipe && !isGenerating && !error && (
            <div className="text-center py-10 border-2 border-dashed rounded-lg">
                <ChefHat className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-xl font-medium">Need some inspiration?</h3>
                <p className="mt-2 text-muted-foreground">Click a suggestion below to get started.</p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Button variant="ghost" onClick={() => handleGenerateRecipe("A high-protein lunch idea")}>High-Protein Lunch</Button>
                    <Button variant="ghost" onClick={() => handleGenerateRecipe("A quick and easy dinner")}>Quick Dinner</Button>
                    <Button variant="ghost" onClick={() => handleGenerateRecipe("A low-carb breakfast")}>Low-Carb Breakfast</Button>
                    <Button variant="ghost" onClick={() => handleGenerateRecipe("A healthy vegetarian meal")}>Healthy Vegetarian Meal</Button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
