'use server';

/**
 * @fileOverview AI-powered meal plan analysis flow.
 *
 * - analyzeMealPlan - A function that analyzes a weekly meal plan against user's dietary targets.
 * - MealPlanAnalysisInput - The input type for the analyzeMealPlan function.
 * - MealPlanAnalysisOutput - The return type for the analyzeMealPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NutritionalInfoSchema = z.object({
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
});

const RecipeInfoSchema = z.object({
  title: z.string(),
  nutritionalInfo: NutritionalInfoSchema,
  frequency: z.number().int().positive(),
});

const DietaryTargetsSchema = z.object({
  targetCalories: z.number().optional(),
  targetProtein: z.number().optional(),
  targetCarbs: z.number().optional(),
  targetFat: z.number().optional(),
});

const MealPlanAnalysisInputSchema = z.object({
  recipes: z.array(RecipeInfoSchema),
  dietaryTargets: DietaryTargetsSchema.optional(),
});
export type MealPlanAnalysisInput = z.infer<typeof MealPlanAnalysisInputSchema>;

const MealPlanAnalysisOutputSchema = z.object({
  analysis: z.string().describe("A markdown-formatted analysis of the meal plan, including a summary, comparison to targets, and actionable suggestions."),
});
export type MealPlanAnalysisOutput = z.infer<typeof MealPlanAnalysisOutputSchema>;


export async function analyzeMealPlan(input: MealPlanAnalysisInput): Promise<MealPlanAnalysisOutput> {
  return analyzeMealPlanFlow(input);
}

const analyzeMealPlanPrompt = ai.definePrompt({
  name: 'analyzeMealPlanPrompt',
  input: {schema: MealPlanAnalysisInputSchema},
  output: {schema: MealPlanAnalysisOutputSchema},
  prompt: `You are an expert nutritionist and meal planning coach. Your task is to analyze a user's weekly meal plan based on the provided recipes and their dietary targets.

**INSTRUCTIONS:**

1.  **Calculate Average Daily Nutrition:**
    *   For each recipe, multiply its nutritional values by its weekly \`frequency\`.
    *   Sum up the total weekly values for calories, protein, carbs, and fat.
    *   Divide the total weekly values by 7 to get the average daily nutrition.

2.  **Compare to Targets:**
    *   Compare the calculated average daily nutrition against the user's \`dietaryTargets\`.
    *   Clearly state whether the user is on track, over, or under their goals for each metric they have provided.

3.  **Provide a Summary and Actionable Advice:**
    *   Write a concise, encouraging summary of the analysis.
    *   Use **bold markdown** for key terms (e.g., **protein**, **calories**).
    *   Provide specific, actionable suggestions. For example, if protein is too low, suggest adding a high-protein snack or swapping a recipe. If calories are too high, suggest a smaller portion size or a lighter alternative.
    *   Keep the tone helpful and supportive, not critical.
    *   The entire output must be a single markdown-formatted string in the \`analysis\` field.

---

**USER'S DIETARY TARGETS (Per Meal Average):**
{{#with dietaryTargets}}
  - Calories: {{targetCalories}} kcal
  - Protein: {{targetProtein}}g
  - Carbohydrates: {{targetCarbs}}g
  - Fat: {{targetFat}}g
{{else}}
  - No specific targets provided. Provide a general wellness analysis.
{{/with}}

---

**USER'S WEEKLY MEAL PLAN:**

{{#each recipes}}
- **Recipe:** {{this.title}}
  - **Frequency:** {{this.frequency}} times a week
  - **Nutrition (per serving):** Calories: {{this.nutritionalInfo.calories}}, Protein: {{this.nutritionalInfo.protein}}g, Carbs: {{this.nutritionalInfo.carbs}}g, Fat: {{this.nutritionalInfo.fat}}g
{{/each}}

---

Please generate the analysis now.
`,
});

const analyzeMealPlanFlow = ai.defineFlow(
  {
    name: 'analyzeMealPlanFlow',
    inputSchema: MealPlanAnalysisInputSchema,
    outputSchema: MealPlanAnalysisOutputSchema,
  },
  async input => {
    const {output} = await analyzeMealPlanPrompt(input);
    return output!;
  }
);
