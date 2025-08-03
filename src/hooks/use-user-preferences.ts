
"use client";

import { useState, useEffect, useCallback } from "react";
import type { UserPreferences, Recipe, DeliveryPlan, SavedList } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import type { GroceryListOutput } from "@/ai/flows/generate-grocery-list";

const PREFERENCES_KEY = "cookwise-user-preferences";
const SAVED_RECIPES_KEY = "cookwise-saved-recipes";
const GROCERY_LIST_KEY = "cookwise-grocery-list";
const AVAILABLE_INGREDIENTS_KEY = "cookwise-pantry-items";
const PLANNED_RECIPES_KEY = "cookwise-planned-recipes";
const DELIVERY_PLANS_KEY = "cookwise-delivery-plans";
const SAVED_LISTS_KEY = "cookwise-saved-lists";


export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [groceryList, setGroceryList] = useState<GroceryListOutput | null>(null);
  const [availableIngredients, setAvailableIngredients] = useState<string[]>([]);
  const [plannedRecipes, setPlannedRecipes] = useState<{[title: string]: number}>({});
  const [deliveryPlans, setDeliveryPlans] = useState<DeliveryPlan[]>([]);
  const [savedLists, setSavedLists] = useState<SavedList[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedPrefs = localStorage.getItem(PREFERENCES_KEY);
      if (storedPrefs) {
        setPreferences(JSON.parse(storedPrefs));
      }
      const storedRecipes = localStorage.getItem(SAVED_RECIPES_KEY);
      if (storedRecipes) {
        setSavedRecipes(JSON.parse(storedRecipes));
      }
      const storedGroceryList = localStorage.getItem(GROCERY_LIST_KEY);
      if (storedGroceryList) {
        setGroceryList(JSON.parse(storedGroceryList));
      }
       const storedPlannedRecipes = localStorage.getItem(PLANNED_RECIPES_KEY);
      if (storedPlannedRecipes) {
        setPlannedRecipes(JSON.parse(storedPlannedRecipes));
      }
      const storedPantry = localStorage.getItem(AVAILABLE_INGREDIENTS_KEY);
      if (storedPantry) {
        try {
            const parsed = JSON.parse(storedPantry);
            if (Array.isArray(parsed)) {
                setAvailableIngredients(parsed);
            }
        } catch (e) {
            // Fallback for legacy comma-separated string format
            setAvailableIngredients(storedPantry.split(',').map(s => s.trim()).filter(Boolean));
        }
      }
       const storedDeliveryPlans = localStorage.getItem(DELIVERY_PLANS_KEY);
      if (storedDeliveryPlans) {
        setDeliveryPlans(JSON.parse(storedDeliveryPlans));
      }
       const storedSavedLists = localStorage.getItem(SAVED_LISTS_KEY);
      if (storedSavedLists) {
        setSavedLists(JSON.parse(storedSavedLists));
      }
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const savePreferences = useCallback((newPreferences: UserPreferences) => {
    setPreferences(newPreferences);
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(newPreferences));
  }, []);

  const saveRecipe = useCallback((recipeToSave: Recipe) => {
    const isAlreadySaved = savedRecipes.some(r => r.title === recipeToSave.title);
    if (isAlreadySaved) {
      toast({
        title: "Already Saved",
        description: "This recipe is already in your favorites.",
      });
      return;
    }

    const updatedRecipes = [...savedRecipes, recipeToSave];
    setSavedRecipes(updatedRecipes);
    localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(updatedRecipes));
    toast({
      title: "Recipe Saved!",
      description: `"${recipeToSave.title}" has been added to your favorites.`,
    });
  }, [savedRecipes, toast]);
  
  const removeRecipe = useCallback((recipeTitle: string) => {
    const updatedRecipes = savedRecipes.filter((r) => r.title !== recipeTitle);
    setSavedRecipes(updatedRecipes);
    localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(updatedRecipes));
    toast({
      title: "Recipe Removed",
      description: `"${recipeTitle}" has been removed from your favorites.`,
    });
  }, [savedRecipes, toast]);

  const saveGroceryList = useCallback((list: GroceryListOutput | null) => {
    setGroceryList(list);
    if (list) {
      localStorage.setItem(GROCERY_LIST_KEY, JSON.stringify(list));
    } else {
      localStorage.removeItem(GROCERY_LIST_KEY);
    }
  }, []);

  const saveAvailableIngredients = useCallback((ingredients: string[]) => {
    setAvailableIngredients(ingredients);
    localStorage.setItem(AVAILABLE_INGREDIENTS_KEY, JSON.stringify(ingredients));
  }, []);

  const updatePlannedRecipes = useCallback((updater: React.SetStateAction<{[title: string]: number}>) => {
    setPlannedRecipes(prev => {
        const newState = typeof updater === 'function' ? updater(prev) : updater;
        localStorage.setItem(PLANNED_RECIPES_KEY, JSON.stringify(newState));
        return newState;
    })
  }, []);

  const saveDeliveryPlan = useCallback((plan: DeliveryPlan) => {
    const updatedPlans = [plan, ...deliveryPlans];
    setDeliveryPlans(updatedPlans);
    localStorage.setItem(DELIVERY_PLANS_KEY, JSON.stringify(updatedPlans));
     toast({
      title: "Delivery Scheduled!",
      description: `Your order from ${plan.supermarket.name} is on its way.`,
    });
  }, [deliveryPlans, toast]);

  const clearDeliveryPlans = useCallback(() => {
    setDeliveryPlans([]);
    localStorage.removeItem(DELIVERY_PLANS_KEY);
    toast({ title: "Delivery History Cleared" });
  }, [toast]);
  
  const saveRegularList = useCallback((list: SavedList) => {
    const updatedLists = [list, ...savedLists];
    setSavedLists(updatedLists);
    localStorage.setItem(SAVED_LISTS_KEY, JSON.stringify(updatedLists));
    toast({
      title: "List Saved!",
      description: `Your grocery list has been saved to "My Lists".`,
    });
  }, [savedLists, toast]);

  const removeSavedList = useCallback((listId: string, silent = false) => {
    const updatedLists = savedLists.filter((l) => l.id !== listId);
    setSavedLists(updatedLists);
    localStorage.setItem(SAVED_LISTS_KEY, JSON.stringify(updatedLists));
     if (!silent) {
        toast({
            title: "List Removed",
            description: "The saved grocery list has been removed.",
        });
     }
  }, [savedLists, toast]);

  const clearMealPlan = useCallback(() => {
    setPlannedRecipes({});
    localStorage.removeItem(PLANNED_RECIPES_KEY);
    toast({
        title: "Meal Plan Cleared",
        description: "Your recipe selections have been reset."
    });
  }, [toast]);


  const isOnboardingComplete = !!preferences;

  return {
    preferences,
    savePreferences,
    savedRecipes,
    saveRecipe,
    removeRecipe,
    isOnboardingComplete,
    loading,
    groceryList,
    saveGroceryList,
    availableIngredients,
    saveAvailableIngredients,
    deliveryPlans,
    saveDeliveryPlan,
    clearDeliveryPlans,
    plannedRecipes,
    updatePlannedRecipes,
    clearMealPlan,
    savedLists,
    saveRegularList,
    removeSavedList,
  };
}
