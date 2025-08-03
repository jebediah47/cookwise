"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserPreferences } from "@/hooks/use-user-preferences";
import { RecipeCard } from "@/components/recipe-card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { HeartCrack, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FavoritesPage() {
  const { preferences, savedRecipes, removeRecipe, loading, isOnboardingComplete } = useUserPreferences();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const filteredRecipes = savedRecipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const isRecipeSaved = (recipeTitle: string) => {
    return savedRecipes.some(r => r.title === recipeTitle);
  }

  if (loading) {
    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <Skeleton className="h-12 w-1/3 mb-4" />
            <Skeleton className="h-8 w-2/3 mb-8" />
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-96 w-full rounded-lg" />)}
            </div>
        </div>
    )
  }

  if (!isOnboardingComplete) {
    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <ListTodo className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-xl font-medium">Complete Your Profile</h3>
                <p className="mt-2 text-muted-foreground">
                    Please complete your profile to start saving your favorite recipes.
                </p>
                <Button onClick={() => router.push('/app/onboarding')} className="mt-6">
                    Go to Onboarding
                </Button>
            </div>
        </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">My Favorite Recipes</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Your collection of saved culinary inspirations.
        </p>
      </div>

      {savedRecipes.length > 0 && (
        <div className="mb-8 max-w-sm">
          <Input
            type="text"
            placeholder="Search your favorites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-base"
          />
        </div>
      )}

      {filteredRecipes.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {filteredRecipes.map((recipe, index) => (
            <RecipeCard 
                key={index} 
                recipe={recipe} 
                isSaved={isRecipeSaved(recipe.title)} 
                onRemove={() => removeRecipe(recipe.title)}
                preferences={preferences}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <HeartCrack className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-xl font-medium">No Recipes Found</h3>
          <p className="mt-2 text-muted-foreground">
            {savedRecipes.length === 0 
                ? "You haven't saved any recipes yet. Go generate some!" 
                : "No recipes match your search."}
          </p>
        </div>
      )}
    </div>
  );
}
