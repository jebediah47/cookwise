"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, Check, ArrowUp, ArrowDown, Minus } from "lucide-react";
import type { Recipe, UserPreferences, NutritionalInfo } from "@/lib/types";
import { Separator } from "./ui/separator";
import ReactMarkdown from 'react-markdown';
import { cn } from "@/lib/utils";


interface RecipeCardProps {
  recipe: Recipe;
  isSaved: boolean;
  onSave?: () => void;
  onRemove?: () => void;
  preferences: UserPreferences | null;
}

const parseList = (text: string) => {
  return text.split('\n').map(item => item.trim().replace(/^- /, '')).filter(Boolean);
};

const NutritionItem = ({ label, value, unit, target }: { label: string, value?: number, unit: string, target?: number }) => {
    if (value === undefined || value === null) return null;

    const hasTarget = typeof target === 'number' && target > 0;
    const difference = hasTarget ? value - target : 0;
    const Icon = difference > 5 ? ArrowUp : difference < -5 ? ArrowDown : Minus;
    const color = difference > 5 ? 'text-orange-500' : difference < -5 ? 'text-blue-500' : 'text-green-600';

    return (
        <div className="flex-1 min-w-[120px] p-3 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{value}{unit}</p>
            {hasTarget && (
                <div className={cn("flex items-center justify-center text-xs", color)}>
                    <Icon className="h-3 w-3 mr-1" />
                    <span>{difference > 0 ? `+${difference.toFixed(0)}` : difference.toFixed(0)} vs target</span>
                </div>
            )}
        </div>
    )
}

export function RecipeCard({ recipe, isSaved, onSave, onRemove, preferences }: RecipeCardProps) {
  // Graceful handling for recipes saved with old string format
  if (!recipe.nutritionalInfo || typeof recipe.nutritionalInfo !== 'object') {
     return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <CardTitle className="text-3xl">{recipe.title}</CardTitle>
                <CardDescription>{recipe.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-destructive">This recipe has an outdated format and cannot be fully displayed.</p>
            </CardContent>
        </Card>
     )
  }
  
  const ingredientsList = parseList(recipe.ingredients);
  const instructionsList = parseList(recipe.instructions);

  const targets = preferences?.dietaryTargets;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-3xl">{recipe.title}</CardTitle>
        <CardDescription>{recipe.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 flex-grow">
        {recipe.estimatedCost && (
            <>
                <div>
                    <h3 className="text-xl font-headline font-semibold mb-2">Estimated Cost</h3>
                    <p className="text-lg font-bold">{recipe.estimatedCost}</p>
                    <p className="text-xs text-muted-foreground">*Cost is an estimate and may vary based on location and store.</p>
                </div>
                <Separator/>
            </>
        )}
        <div>
          <h3 className="text-xl font-headline font-semibold mb-3">Nutritional Information</h3>
          <div className="flex flex-wrap gap-4">
              <NutritionItem label="Calories" value={recipe.nutritionalInfo.calories} unit=" kcal" target={targets?.targetCalories} />
              <NutritionItem label="Protein" value={recipe.nutritionalInfo.protein} unit="g" target={targets?.targetProtein} />
              <NutritionItem label="Carbs" value={recipe.nutritionalInfo.carbs} unit="g" target={targets?.targetCarbs} />
              <NutritionItem label="Fat" value={recipe.nutritionalInfo.fat} unit="g" target={targets?.targetFat} />
          </div>
        </div>
        <Separator/>
        <div>
          <h3 className="text-xl font-headline font-semibold mb-3">Ingredients</h3>
          <ul className="space-y-2 list-disc list-inside text-foreground/90">
            {ingredientsList.map((item, index) => (
              <li key={index}>
                 <ReactMarkdown components={{ p: 'span' }}>{item}</ReactMarkdown>
              </li>
            ))}
          </ul>
        </div>
        <Separator/>
        <div>
          <h3 className="text-xl font-headline font-semibold mb-3">Instructions</h3>
          <ol className="space-y-3 list-decimal list-inside text-foreground/90">
            {instructionsList.map((item, index) => (
              <li key={index}>
                <ReactMarkdown components={{ p: 'span' }}>{item}</ReactMarkdown>
              </li>
            ))}
          </ol>
        </div>
      </CardContent>
      <CardFooter>
        {onSave && (
          <Button onClick={onSave} disabled={isSaved} variant={isSaved ? "secondary" : "default"}>
            {isSaved ? <Check className="mr-2 h-4 w-4" /> : <Heart className="mr-2 h-4 w-4" />}
            {isSaved ? "Saved to Favorites" : "Save to Favorites"}
          </Button>
        )}
        {onRemove && (
          <Button onClick={onRemove} variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Remove from Favorites
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
