import { config } from 'dotenv';
config();

import '@/ai/flows/recipe-summary.ts';
import '@/ai/flows/generate-recipe.ts';
import '@/ai/flows/suggest-alternatives.ts';
import '@/ai/flows/generate-grocery-list.ts';
import '@/ai/flows/analyze-meal-plan.ts';
