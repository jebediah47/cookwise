'use server';

/**
 * @fileOverview Generates a short summary of a recipe.
 *
 * - summarizeRecipe - A function that generates a recipe summary.
 * - RecipeSummaryInput - The input type for the summarizeRecipe function.
 * - RecipeSummaryOutput - The return type for the summarizeRecipe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecipeSummaryInputSchema = z.object({
  recipeName: z.string().describe('The name of the recipe.'),
  ingredients: z.array(z.string()).describe('A list of ingredients required for the recipe.'),
  instructions: z.string().describe('The detailed instructions for preparing the recipe.'),
});
export type RecipeSummaryInput = z.infer<typeof RecipeSummaryInputSchema>;

const RecipeSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the recipe including core steps and time commitment.'),
});
export type RecipeSummaryOutput = z.infer<typeof RecipeSummaryOutputSchema>;

export async function summarizeRecipe(input: RecipeSummaryInput): Promise<RecipeSummaryOutput> {
  return summarizeRecipeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recipeSummaryPrompt',
  input: {schema: RecipeSummaryInputSchema},
  output: {schema: RecipeSummaryOutputSchema},
  prompt: `You are a recipe summarization expert. Your goal is to provide a very short summary of a recipe, including core steps and estimated time commitment. Do not be verbose. If you mention any measurements, they must be in the metric system.

Recipe Name: {{recipeName}}
Ingredients: {{ingredients}}
Instructions: {{instructions}}

Summary:`, 
});

const summarizeRecipeFlow = ai.defineFlow(
  {
    name: 'summarizeRecipeFlow',
    inputSchema: RecipeSummaryInputSchema,
    outputSchema: RecipeSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
