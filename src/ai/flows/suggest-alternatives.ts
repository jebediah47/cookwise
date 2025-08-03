'use server';

/**
 * @fileOverview Suggests alternative ingredients for a recipe using AI.
 *
 * - suggestIngredientAlternatives - A function that suggests ingredient alternatives.
 * - SuggestIngredientAlternativesInput - The input type for the suggestIngredientAlternatives function.
 * - SuggestIngredientAlternativesOutput - The return type for the suggestIngredientAlternatives function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestIngredientAlternativesInputSchema = z.object({
  recipeName: z.string().describe('The name of the recipe.'),
  missingIngredient: z.string().describe('The ingredient that is missing.'),
  availableIngredients: z
    .string()
    .describe('A comma separated list of ingredients that are available.'),
});
export type SuggestIngredientAlternativesInput = z.infer<
  typeof SuggestIngredientAlternativesInputSchema
>;

const SuggestIngredientAlternativesOutputSchema = z.object({
  alternatives: z
    .string()
    .describe(
      'A comma separated list of alternative ingredients that can be used instead of the missing ingredient.'
    ),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the suggested alternatives, considering the recipe and available ingredients.'
    ),
});
export type SuggestIngredientAlternativesOutput = z.infer<
  typeof SuggestIngredientAlternativesOutputSchema
>;

export async function suggestIngredientAlternatives(
  input: SuggestIngredientAlternativesInput
): Promise<SuggestIngredientAlternativesOutput> {
  return suggestIngredientAlternativesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestIngredientAlternativesPrompt',
  input: {schema: SuggestIngredientAlternativesInputSchema},
  output: {schema: SuggestIngredientAlternativesOutputSchema},
  prompt: `You are a helpful cooking assistant. A user is missing an ingredient for a recipe and wants you to suggest alternatives based on available ingredients.
All quantities in your suggestions must use the metric system (e.g., grams, ml) or common kitchen units (e.g., cup, teaspoon). Do not use imperial units like pounds or ounces.

Recipe Name: {{{recipeName}}}
Missing Ingredient: {{{missingIngredient}}}
Available Ingredients: {{{availableIngredients}}}

Suggest suitable alternative ingredients that the user can use instead of the missing ingredient, considering the recipe and available ingredients. Provide a clear reasoning for your suggestions.

Alternatives:`, // The rest will be filled by the model
});

const suggestIngredientAlternativesFlow = ai.defineFlow(
  {
    name: 'suggestIngredientAlternativesFlow',
    inputSchema: SuggestIngredientAlternativesInputSchema,
    outputSchema: SuggestIngredientAlternativesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
