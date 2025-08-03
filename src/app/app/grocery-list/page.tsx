
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserPreferences } from "@/hooks/use-user-preferences";
import { generateGroceryList, type GroceryListOutput } from "@/ai/flows/generate-grocery-list";
import { analyzeMealPlan, type MealPlanAnalysisOutput } from "@/ai/flows/analyze-meal-plan";
import type { PlannedRecipe, SupermarketQuote, Recipe } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ListChecks, ShoppingCart, Ban, ListTodo, Trash, ListX, Minus, Plus, ChefHat, Check, ChevronRight, Store, Info, Save, X, Activity, Loader, Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ReactMarkdown from 'react-markdown';


type PageState = 'selection' | 'generating' | 'comparison';

const loadingMessages = [
    "Checking your pantry...",
    "Combining shopping lists...",
    "Calculating ingredient quantities...",
    "Finding the best deals...",
    "Categorizing your items...",
    "Writing your grocery list...",
    "Almost ready for checkout!",
];

function AiLoadingState() {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-3xl">Creating Your Plan...</CardTitle>
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

export default function GroceryListPage() {
  const { 
    savedRecipes, 
    loading, 
    preferences,
    availableIngredients, 
    saveAvailableIngredients, 
    saveDeliveryPlan,
    groceryList,
    saveGroceryList,
    plannedRecipes,
    updatePlannedRecipes,
    clearMealPlan,
    saveRegularList
  } = useUserPreferences();
  const router = useRouter();

  const [pageState, setPageState] = useState<PageState>('selection');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const [supermarketQuotes, setSupermarketQuotes] = useState<SupermarketQuote[]>([]);
  const [selectedSupermarket, setSelectedSupermarket] = useState<SupermarketQuote | null>(null);
  const [isListManuallyEdited, setIsListManuallyEdited] = useState(false);
  const [baseTotalCost, setBaseTotalCost] = useState(0);
  const [pantryInput, setPantryInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<MealPlanAnalysisOutput | null>(null);
  
  const calculateTotals = (list: GroceryListOutput) => {
    const baseTotal = list.groceryList.reduce((acc, category) => {
        return acc + category.items.reduce((catAcc, item) => {
            const costString = item.estimatedCost.replace('~€', '').replace('*', '').replace(',', '.').trim();
            const cost = parseFloat(costString);
            return catAcc + (isNaN(cost) ? 0 : cost);
        }, 0);
    }, 0);
    setBaseTotalCost(baseTotal);

    const quotes: SupermarketQuote[] = [
        { name: "Supermarket A", totalCost: baseTotal * (1 + (Math.random() - 0.5) * 0.1) }, // +/- 5%
        { name: "Supermarket B", totalCost: baseTotal * (1 + (Math.random() - 0.5) * 0.1) },
        { name: "Supermarket C", totalCost: baseTotal * (1 + (Math.random() - 0.5) * 0.1) },
    ];
    setSupermarketQuotes(quotes);
  };

  useEffect(() => {
    if (groceryList && Object.keys(plannedRecipes).length > 0) {
        setPageState('comparison');
        calculateTotals(groceryList);

        const pristineList = sessionStorage.getItem('cookwise-pristine-grocery-list');
        if (pristineList && JSON.stringify(groceryList) !== pristineList) {
            setIsListManuallyEdited(true);
        }
    }
  }, []); 

  const isRecipeSelected = (title: string) => !!plannedRecipes[title];

  const handleRecipeToggle = (title: string, shouldBeSelected: boolean) => {
    updatePlannedRecipes(prev => {
        const newPlan = {...prev};
        if (shouldBeSelected) {
            if (!newPlan[title]) newPlan[title] = 1;
        } else {
            delete newPlan[title];
        }
        return newPlan;
    });
  }

  const handleFrequencyChange = (title: string, change: 'inc' | 'dec') => {
    updatePlannedRecipes(prev => {
        const newPlan = {...prev};
        const currentFreq = newPlan[title] || 1;
        if (change === 'inc') {
            newPlan[title] = currentFreq + 1;
        } else {
            newPlan[title] = Math.max(1, currentFreq - 1);
        }
        return newPlan;
    });
  }

  const handleAddPantryItem = () => {
    const trimmedItem = pantryInput.trim();
    if (trimmedItem && !availableIngredients.includes(trimmedItem)) {
      saveAvailableIngredients([...availableIngredients, trimmedItem]);
      setPantryInput("");
    }
  };

  const handleRemovePantryItem = (itemToRemove: string) => {
    saveAvailableIngredients(
      availableIngredients.filter((item) => item !== itemToRemove)
    );
  };

  const handleCreatePlan = async () => {
    setPageState('generating');
    setError(null);
    saveGroceryList(null); 
    setSupermarketQuotes([]);
    setSelectedSupermarket(null);

    const recipesToProcess: PlannedRecipe[] = Object.entries(plannedRecipes).map(([title, frequency]) => {
        const recipe = savedRecipes.find(r => r.title === title)!;
        return { title, frequency, ingredients: recipe.ingredients };
    });

    try {
      const result = await generateGroceryList({
        plannedRecipes: recipesToProcess,
        availableIngredients,
      });
      
      saveGroceryList(result);
      sessionStorage.setItem('cookwise-pristine-grocery-list', JSON.stringify(result));
      setIsListManuallyEdited(false);
      calculateTotals(result);
      setPageState('comparison');
    } catch (e) {
      console.error(e);
      setError("Sorry, we couldn't create your plan. The ingredients might be too complex. Please try again with different recipes.");
      setPageState('selection');
    }
  };

  const handleAnalyzePlan = async () => {
    if (!preferences || selectedRecipesCount === 0) return;
    
    setIsAnalyzing(true);
    setAnalysisResult(null);

    const recipesForAnalysis = Object.entries(plannedRecipes).map(([title, frequency]) => {
        const recipe = savedRecipes.find(r => r.title === title)!;
        return {
            title: recipe.title,
            nutritionalInfo: recipe.nutritionalInfo,
            frequency: frequency,
        }
    });

    try {
        const result = await analyzeMealPlan({
            recipes: recipesForAnalysis,
            dietaryTargets: preferences.dietaryTargets,
        });
        setAnalysisResult(result);
    } catch(e) {
        console.error(e);
        toast({
            variant: "destructive",
            title: "Analysis Failed",
            description: "We couldn't analyze your meal plan at this time. Please try again."
        })
    } finally {
        setIsAnalyzing(false);
    }
  }


  const handleItemQuantityChange = (categoryIndex: number, itemIndex: number, newItemValue: string) => {
    if (!groceryList) return;
    
    const updatedList: GroceryListOutput = JSON.parse(JSON.stringify(groceryList));
    updatedList.groceryList[categoryIndex].items[itemIndex].item = newItemValue;
    
    saveGroceryList(updatedList);
    setIsListManuallyEdited(true);
  };
  
  const handleScheduleDelivery = () => {
    if (!selectedSupermarket || !groceryList) return;

    const recipesForPlan: PlannedRecipe[] = Object.entries(plannedRecipes).map(([title, frequency]) => {
        const recipe = savedRecipes.find(r => r.title === title)!;
        return { title, frequency, ingredients: recipe.ingredients };
    });

    saveDeliveryPlan({
        id: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        supermarket: selectedSupermarket,
        recipes: recipesForPlan,
        groceryList: groceryList,
        status: "Order Placed",
    });

    sessionStorage.removeItem('cookwise-pristine-grocery-list');
    setSelectedSupermarket(null);
    setSupermarketQuotes([]);
    setPageState('selection');

    router.push('/app/delivery-status');
  };

  const handleSaveList = () => {
    if (!groceryList || !supermarketQuotes) return;

    const recipesForPlan: PlannedRecipe[] = Object.entries(plannedRecipes).map(([title, frequency]) => {
        const recipe = savedRecipes.find(r => r.title === title)!;
        return { title, frequency, ingredients: recipe.ingredients };
    });

    saveRegularList({
        id: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        recipes: recipesForPlan,
        groceryList: groceryList,
        totalCost: baseTotalCost,
        supermarketQuotes: supermarketQuotes,
    });

    sessionStorage.removeItem('cookwise-pristine-grocery-list');
    setSelectedSupermarket(null);
    setSupermarketQuotes([]);
    setPageState('selection');

    router.push('/app/my-lists');
  }

  const handleBackToEdit = () => {
    setPageState('selection');
    setSelectedSupermarket(null); 
  }

  if (loading) {
    return <GroceryListSkeleton isHeaderVisible={true} />;
  }
  
  const selectedRecipesCount = Object.keys(plannedRecipes).length;

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Meal Planner & Grocery List</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Create a weekly meal plan and get a consolidated grocery list.
        </p>
      </div>

      {pageState === 'selection' && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Create Your Weekly Plan</CardTitle>
            <CardDescription>
              Select the recipes you want to cook this week and how many times you'll make each one.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="grid w-full gap-2">
                <Label htmlFor="available-ingredients">What I Already Have (My Pantry)</Label>
                <div className="flex items-center gap-2">
                    <Input
                        id="available-ingredients"
                        placeholder="e.g., olive oil, salt"
                        value={pantryInput}
                        onChange={(e) => setPantryInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddPantryItem();
                            }
                        }}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleAddPantryItem}
                        disabled={!pantryInput.trim()}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                   Items listed here won't be added to your grocery list. Press Enter or click '+' to add.
                </p>
                {availableIngredients && availableIngredients.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                        {availableIngredients.map((item) => (
                            <Badge
                                key={item}
                                variant="secondary"
                                className="flex items-center gap-2 pl-3 pr-1 py-1 text-sm"
                            >
                                {item}
                                <button
                                    type="button"
                                    className="rounded-full p-0.5 transition-colors hover:bg-background/50"
                                    onClick={() => handleRemovePantryItem(item)}
                                    aria-label={`Remove ${item}`}
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                )}
            </div>
            <Separator />
            <div>
                <h3 className="text-lg font-medium mb-4">Select Recipes for Your Plan</h3>
                {savedRecipes.length > 0 ? (
                    <div className="space-y-4">
                        {savedRecipes.map(recipe => (
                            <div key={recipe.title} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4">
                                <div className="flex items-start gap-4">
                                    <Checkbox id={recipe.title} checked={isRecipeSelected(recipe.title)} onCheckedChange={(checked) => handleRecipeToggle(recipe.title, !!checked)} className="mt-1"/>
                                    <div>
                                        <Label htmlFor={recipe.title} className="font-bold text-base">{recipe.title}</Label>
                                        <p className="text-sm text-muted-foreground">{recipe.description}</p>
                                    </div>
                                </div>
                                {isRecipeSelected(recipe.title) && (
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleFrequencyChange(recipe.title, 'dec')}>
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <span className="font-bold text-lg w-10 text-center">{plannedRecipes[recipe.title]}x</span>
                                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleFrequencyChange(recipe.title, 'inc')}>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ): (
                    <div className="text-center py-10 border-2 border-dashed rounded-lg">
                        <ChefHat className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-medium text-muted-foreground">No Favorite Recipes Found</h3>
                        <p className="text-sm text-muted-foreground">
                            You need to save some recipes to your favorites before you can create a meal plan.
                        </p>
                         <Button onClick={() => router.push('/app')} className="mt-4">Generate Recipes</Button>
                    </div>
                )}
            </div>
          </CardContent>
          <CardFooter className="flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button size="lg" onClick={handleCreatePlan} disabled={selectedRecipesCount === 0}>
                    <ListTodo className="mr-2 h-5 w-5" />
                    Create Plan ({selectedRecipesCount} {selectedRecipesCount === 1 ? 'recipe' : 'recipes'})
                </Button>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            size="lg"
                            variant="secondary"
                            onClick={handleAnalyzePlan}
                            disabled={selectedRecipesCount === 0 || isAnalyzing}
                        >
                            {isAnalyzing ? (
                                <Loader className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <Activity className="mr-2 h-5 w-5" />
                            )}
                            Analyze Plan
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Meal Plan Analysis</DialogTitle>
                        </DialogHeader>
                        <div className="prose prose-sm dark:prose-invert max-h-[60vh] overflow-y-auto">
                          {isAnalyzing && <p>Analyzing your plan...</p>}
                          {analysisResult && <ReactMarkdown>{analysisResult.analysis}</ReactMarkdown>}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            {selectedRecipesCount > 0 && (
                <Button
                    variant="destructive"
                    onClick={clearMealPlan}
                    className="w-full sm:w-auto"
                >
                    <Trash className="mr-2 h-4 w-4" />
                    Clear Plan
                </Button>
            )}
          </CardFooter>
        </Card>
      )}

      {pageState === 'generating' && <AiLoadingState />}

      {pageState === 'comparison' && groceryList && (
        <div className="space-y-8">
            <Card>
                 <CardHeader>
                    <CardTitle>Step 2: Review Your Grocery List</CardTitle>
                    <CardDescription>Here's the consolidated list of ingredients. You can make manual adjustments if needed.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {isListManuallyEdited && (
                        <Alert>
                            <Info className="h-4 w-4" />
                            <AlertTitle>List has been modified</AlertTitle>
                            <AlertDescription>
                                The total cost is based on the original list and may not be accurate. Regenerate the list to get an updated cost estimate.
                            </AlertDescription>
                        </Alert>
                    )}
                    {groceryList.groceryList.map(({ category, items }, categoryIndex) => (
                        <div key={category}>
                        <h3 className="text-xl font-headline font-semibold mb-4">{category}</h3>
                        <div className="space-y-3">
                            {items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-center justify-between gap-4">
                                <Input
                                    value={item.item}
                                    onChange={(e) => handleItemQuantityChange(categoryIndex, itemIndex, e.target.value)}
                                    className="h-9"
                                />
                                <p className="text-sm text-muted-foreground font-medium whitespace-nowrap">{item.estimatedCost}</p>
                            </div>
                            ))}
                        </div>
                        {categoryIndex < groceryList.groceryList.length - 1 && (
                            <Separator className="mt-6" />
                        )}
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Step 3: Save or Schedule</CardTitle>
                    <CardDescription>You can save this list for later or schedule a delivery with a partner supermarket.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {supermarketQuotes.map(quote => (
                        <button key={quote.name} onClick={() => setSelectedSupermarket(quote)} className="w-full text-left">
                            <Card className={`p-4 transition-all ${selectedSupermarket?.name === quote.name ? 'border-primary ring-2 ring-primary' : 'hover:border-primary/50'}`}>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <Store className="h-8 w-8 text-primary" />
                                        <div>
                                            <p className="font-bold">{quote.name}</p>
                                            <p className="text-sm text-muted-foreground">Click to select for delivery</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <p className="text-xl font-bold">~€{quote.totalCost.toFixed(2).replace('.',',')}*</p>
                                        {selectedSupermarket?.name === quote.name && <Check className="h-6 w-6 text-primary" />}
                                    </div>
                                </div>
                            </Card>
                        </button>
                    ))}
                     <p className="text-xs text-muted-foreground text-center pt-2">*All costs are estimates and may vary based on product availability and promotions.</p>
                </CardContent>
                <CardFooter className="flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <Button variant="outline" onClick={handleBackToEdit} className="w-full">Edit Plan</Button>
                      <Button variant="secondary" onClick={handleSaveList} className="w-full">
                        <Save className="mr-2 h-4 w-4" /> Save List
                      </Button>
                    </div>
                    <Button size="lg" onClick={handleScheduleDelivery} disabled={!selectedSupermarket} className="w-full sm:w-auto">
                       Schedule with {selectedSupermarket?.name || '...'} <ChevronRight className="ml-2 h-5 w-5"/>
                    </Button>
                </CardFooter>
            </Card>
        </div>
      )}

       {error && (
          <Alert variant="destructive" className="mt-8">
            <Ban className="h-4 w-4" />
            <AlertTitle>Generation Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
    </div>
  );
}

function GroceryListSkeleton({ isHeaderVisible = false }: { isHeaderVisible?: boolean }) {
  return (
    <div className="space-y-8">
        {isHeaderVisible && (
            <div>
                <Skeleton className="h-10 w-1/3 mb-3" />
                <Skeleton className="h-6 w-1/2" />
            </div>
        )}
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-5 w-3/4 mt-2" />
            </CardHeader>
            <CardContent className="space-y-6">
                {[...Array(3)].map((_, i) => (
                <div key={i}>
                    <Skeleton className="h-6 w-1/4 mb-4" />
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Skeleton className="h-5 w-3/5" />
                        <Skeleton className="h-5 w-1/5" />
                      </div>
                       <div className="flex justify-between">
                        <Skeleton className="h-5 w-4/6" />
                        <Skeleton className="h-5 w-1/6" />
                      </div>
                    </div>
                    {i < 2 && <Separator className="mt-6" />}
                </div>
                ))}
            </CardContent>
             <CardFooter>
                <Skeleton className="h-12 w-40" />
            </CardFooter>
        </Card>
    </div>
  )
}
