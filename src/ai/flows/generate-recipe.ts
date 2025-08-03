'use server';

/**
 * @fileOverview AI recipe generator flow.
 *
 * - generateRecipe - A function that generates recipes based on user preferences.
 * - RecipePreferencesInput - The input type for the generateRecipe function.
 * - RecipeOutput - The return type for the generateRecipe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DietaryTargetsSchema = z.object({
  targetCalories: z.number().optional().describe('Target calories per meal.'),
  targetProtein: z.number().optional().describe('Target protein in grams per meal.'),
  targetCarbs: z.number().optional().describe('Target carbohydrates in grams per meal.'),
  targetFat: z.number().optional().describe('Target fat in grams per meal.'),
});

const RecipePreferencesInputSchema = z.object({
  foodPreferences: z.string().describe('User food preferences e.g. Italian, Mexican, Indian.'),
  allergies: z.array(z.string()).describe('An array of user allergies. e.g. ["nuts", "dairy", "gluten"].'),
  cookingLevel: z.enum(['beginner', 'intermediate', 'advanced']).describe('User cooking level e.g. beginner, intermediate, advanced.'),
  timeAvailability: z.enum(['15-30', '30-60', '60+']).describe('Time user has available to cook in minutes e.g. 15-30, 30-60, 60+.'),
  preferredMealTypes: z.array(z.string()).describe('Types of meals user prefers to cook e.g. breakfast, lunch, dinner, snack.'),
  budget: z.number().optional().describe('The user\'s budget for the meal in EUR. The generated recipe should try to stay within this budget.'),
  userPrompt: z.string().optional().describe('A specific user request for a recipe, e.g., "a quick pasta dish with chicken".'),
  availableIngredients: z.string().optional().describe("A comma-separated list of ingredients the user already has in their pantry."),
  surpriseMe: z.boolean().optional().describe('If true, generates a random recipe outside of user preferences for discovery.'),
  dietaryTargets: DietaryTargetsSchema.optional().describe('The user\'s specific dietary targets for the meal.'),
});
export type RecipePreferencesInput = z.infer<typeof RecipePreferencesInputSchema>;

const NutritionalInfoSchema = z.object({
    calories: z.number().describe('Total calories for the dish.'),
    protein: z.number().describe('Grams of protein.'),
    carbs: z.number().describe('Grams of carbohydrates.'),
    fat: z.number().describe('Grams of fat.'),
});

const RecipeOutputSchema = z.object({
  title: z.string().describe('The title of the recipe.'),
  description: z.string().describe("A short, enticing description of the recipe. If you used ingredients from the user's pantry, you can mention it here."),
  ingredients: z.string().describe("A newline-separated list of ingredients for the recipe. Each item must start with '- '. Example: '- 250g flour\\n- 2 large eggs'"),
  instructions: z.string().describe("Step-by-step instructions for preparing the recipe, formatted as a newline-separated list. Each step must start with a number followed by a period (e.g., '1. '). Use markdown for **bolding** key actions or ingredients."),
  nutritionalInfo: NutritionalInfoSchema.describe("A structured object with key nutritional values: calories, protein, carbs, and fat."),
  estimatedCost: z.string().describe("A rough estimate of the total cost of the ingredients in Euros (e.g., '~€12.50*'). CRITICALLY IMPORTANT: The string MUST end with an asterisk (*) to indicate the value is an estimate."),
});
export type RecipeOutput = z.infer<typeof RecipeOutputSchema>;

export async function generateRecipe(input: RecipePreferencesInput): Promise<RecipeOutput> {
  return generateRecipeFlow(input);
}

const recipePrompt = ai.definePrompt({
  name: 'recipePrompt',
  input: {schema: RecipePreferencesInputSchema},
  output: {schema: RecipeOutputSchema},
  prompt: `You are a personal chef and nutritionist. Your task is to generate a recipe based on user preferences and specific dietary targets.
You MUST output your response in the structured JSON format defined by the output schema.
Adhere strictly to the following formatting and content rules. This is not optional.

**FORMATTING INSTRUCTIONS (NON-NEGOTIABLE):**

1.  **Use Metric System:** You MUST use metric units (e.g., grams, kilograms, milliliters, liters). You MUST NOT use imperial units like pounds (lbs) or ounces (oz).

2.  **\`ingredients\` field:**
    *   This MUST be a single string. Each ingredient MUST be on a new line (separated by \`\\n\`) and begin with "- ".
    *   **Correct Example:** "- 250g flour\\n- 2 large eggs"

3.  **\`instructions\` field:**
    *   This MUST be a single string. Each step MUST be on a new line (separated by \`\\n\`) and begin with "1. ", "2. ", etc.
    *   Use markdown double asterisks (\`**\`) to **bold** only the key action verb at the beginning of each step (e.g., **Preheat**, **Combine**).
    *   **Correct Example:** "1. **Preheat** the oven to 180°C.\\n2. **Combine** the dry ingredients."

4.  **\`nutritionalInfo\` field:**
    *   This MUST be a structured JSON object containing numerical values for \`calories\`, \`protein\`, \`carbs\`, and \`fat\`. Do not use strings.
    *   **Correct Example:** \`{"calories": 550, "protein": 35, "carbs": 40, "fat": 25}\`

5.  **\`estimatedCost\` field:**
    *   This MUST be a single string in the format \`~€X.XX*\` (e.g., \`~€8.50*\`). The asterisk is mandatory.

---

**USER PROFILE AND REQUEST:**

{{#if surpriseMe}}
The user wants a surprise! Generate a creative recipe from a cuisine different from their usual preferences.
- You MUST strictly follow these allergies: {{{allergies}}}. This is critical for safety.
- You MUST IGNORE their usual food preferences, cooking level, time, and budget.
- You can treat their dietary targets as a loose guideline.
- Pick a meal type from: {{#each preferredMealTypes}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.

{{else}}

  {{#if userPrompt}}
  The user has a specific request: "{{{userPrompt}}}". Prioritize this, but you MUST still adhere to all preferences, allergies, and dietary targets below.
  {{else}}
  Generate a creative recipe based on the user's profile and dietary targets.
  {{/if}}

  {{#if availableIngredients}}
  **Pantry Ingredients:** The user has: \`{{{availableIngredients}}}\`. Please try to incorporate some of these.
  {{/if}}

  **Key Preferences & Constraints:**
  - Food Preferences: {{{foodPreferences}}}
  - Allergies (Strictly avoid): {{{allergies}}}
  - Cooking Level: {{{cookingLevel}}}
  - Time Availability: {{{timeAvailability}}} mins
  - Preferred Meal Types: {{#each preferredMealTypes}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  {{#if budget}}- Budget: Aim for under €{{{budget}}}.{{/if}}

  **Dietary Targets (CRITICAL):**
  You MUST create a recipe that aims to meet the following nutritional targets as closely as possible.
  {{#with dietaryTargets}}
    {{#if targetCalories}}- Target Calories: ~{{{targetCalories}}} kcal{{/if}}
    {{#if targetProtein}}- Target Protein: ~{{{targetProtein}}}g{{/if}}
    {{#if targetCarbs}}- Target Carbohydrates: ~{{{targetCarbs}}}g{{/if}}
    {{#if targetFat}}- Target Fat: ~{{{targetFat}}}g{{/if}}
  {{/with}}
  {{#unless dietaryTargets}}
  - No specific targets provided. Create a balanced meal.
  {{/unless}}

{{/if}}

Based on the ingredients, provide your best estimate for the nutritional information in the structured \`nutritionalInfo\` object and the cost in the \`estimatedCost\` field.
Remember to follow all formatting rules precisely.
`,
});

const generateRecipeFlow = ai.defineFlow(
  {
    name: 'generateRecipeFlow',
    inputSchema: RecipePreferencesInputSchema,
    outputSchema: RecipeOutputSchema,
  },
  async input => {
    const {output} = await recipePrompt(input);
    return output!;
  }
);
