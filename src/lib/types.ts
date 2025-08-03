import type { GroceryListOutput } from "@/ai/flows/generate-grocery-list";

export interface UserPreferences {
  foodPreferences: string;
  allergies: string[];
  cookingLevel: 'beginner' | 'intermediate' | 'advanced';
  timeAvailability: '15-30' | '30-60' | '60+';
  preferredMealTypes: string[];
  budget?: number;
  dietaryTargets?: {
      targetCalories?: number;
      targetProtein?: number;
      targetCarbs?: number;
      targetFat?: number;
  }
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Recipe {
  title: string;
  description: string;
  ingredients: string;
  instructions: string;
  nutritionalInfo: NutritionalInfo;
  estimatedCost: string;
}

export interface PlannedRecipe {
  title: string;
  ingredients: string;
  frequency: number;
}

export interface SupermarketQuote {
    name: string;
    totalCost: number;
}

export interface DeliveryPlan {
    id: string;
    createdAt: string;
    supermarket: SupermarketQuote;
    recipes: PlannedRecipe[];
    groceryList: GroceryListOutput;
    status: "Order Placed" | "Processing" | "Out for Delivery" | "Delivered";
}

export interface SavedList {
    id: string;
    createdAt: string;
    recipes: PlannedRecipe[];
    groceryList: GroceryListOutput;
    totalCost: number;
    supermarketQuotes: SupermarketQuote[];
}
