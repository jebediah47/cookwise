'use server';

/**
 * @fileOverview Generates a consolidated and categorized grocery list from a list of recipes, scaled by frequency.
 *
 * - generateGroceryList - A function that creates a grocery list for a weekly meal plan.
 * - GroceryListInput - The input type for the generateGroceryList function.
 * - GroceryListOutput - The return type for the generateGroceryList function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PlannedRecipeSchema = z.object({
  title: z.string(),
  ingredients: z.string().describe("A newline-separated list of ingredients for the recipe. Each item must start with '- '. Example: '- 250g flour\\n- 2 large eggs'"),
  frequency: z.number().int().positive().describe("The number of times this recipe will be cooked in a week."),
});

const GroceryListItemSchema = z.object({
    item: z.string().describe("The name of the consolidated grocery item."),
    estimatedCost: z.string().describe("A rough estimate of the item's cost in Euros (e.g., '~€2.50*'). The string MUST end with an asterisk (*) to indicate the value is an estimate."),
});

const GroceryListCategorySchema = z.object({
  category: z.string().describe("The name of the grocery category (e.g., 'Produce', 'Meat & Seafood')."),
  items: z.array(GroceryListItemSchema).describe("The list of consolidated ingredients for this category, each with a name and estimated cost."),
});

const GroceryListOutputSchema = z.object({
  groceryList: z.array(GroceryListCategorySchema).describe("A list of grocery categories, each with its own list of consolidated items."),
});
export type GroceryListOutput = z.infer<typeof GroceryListOutputSchema>;

const GroceryListInputSchema = z.object({
  plannedRecipes: z.array(PlannedRecipeSchema).describe("An array of recipes the user plans to cook, each with its title, ingredients, and weekly frequency."),
  availableIngredients: z.array(z.string()).optional().describe("A list of ingredients the user already has in their pantry."),
});
export type GroceryListInput = z.infer<typeof GroceryListInputSchema>;


export async function generateGroceryList(input: GroceryListInput): Promise<GroceryListOutput> {
  return generateGroceryListFlow(input);
}

const prompt = ai.definePrompt({
  name: 'groceryListPrompt',
  input: {schema: GroceryListInputSchema},
  output: {schema: GroceryListOutputSchema},
  prompt: `You are an expert grocery list creator for weekly meal planning. Your task is to generate a consolidated, practical, and categorized grocery list based on a set of recipes and how many times the user will cook them in a week.

**CRITICAL INSTRUCTIONS (Follow these strictly):**

1.  **Scale by Frequency:** This is the most important step. For each recipe provided, you MUST multiply its ingredient quantities by the provided \`frequency\`. For example, if a recipe calls for "2 chicken breasts" and its frequency is 3, you must use "6 chicken breasts" in your calculations for the consolidated list.

2.  **Consolidate & Sum Quantities:** After scaling, you MUST combine all identical ingredients from all the planned recipes into a single entry. Sum their total scaled quantities. For example, if scaled Recipe A needs "600g of flour" and scaled Recipe B needs "500g of flour", the final list MUST show "1.1kg of flour".

3.  **Generalize to Practical Units:** You MUST adjust final quantities to reflect standard purchasing units. It's impractical to buy "half an onion".
    *   If a recipe calls for a fraction of a whole item (like "1/2 onion" or "1/4 cabbage"), round up to the nearest whole unit (e.g., "1 onion", "1 cabbage") *after* scaling and consolidating.
    *   For packaged goods like cheese, olives, or canned items, if a recipe calls for a measured amount (e.g., "125g feta", "60g olives"), list a standard package size instead (e.g., "1 container of feta cheese", "1 jar of olives", "1 can of chickpeas") if it makes sense for the final consolidated amount.
    *   For common pantry staples (like salt, pepper, oil, flour, sugar, common spices), if the user needs them and does not list them in their available ingredients, just list the ingredient name (e.g., "Olive Oil", "All-purpose flour"). Assume they will buy a standard container.

4.  **Exclude Available Ingredients:** You MUST check the \`availableIngredients\` list provided by the user. If an ingredient is on this list, DO NOT include it in the final grocery list, no matter how much is needed.

5.  **Categorize Everything:** Group all resulting ingredients into logical grocery store categories. Use standard categories like:
    *   Produce
    *   Meat & Seafood
    *   Dairy & Eggs
    *   Bakery & Breads
    *   Pantry Staples
    *   Spices & Seasonings
    *   Frozen Foods
    *   Beverages
    *   Other

6.  **Use Metric System:** All quantities MUST be in metric units (e.g., grams, kg, ml, l) or common kitchen/packaging units (e.g., "1 can", "1 bunch"). You MUST NOT use imperial units like pounds (lbs) or ounces (oz).

7.  **Estimate Item Costs:** For each individual item on the final list, provide a rough estimated cost in Euros. The string MUST be in the format \`~€X.XX*\` (e.g., \`~€1.50*\`). The asterisk is mandatory.

8.  **Format Correctly:** Your entire output must be a single JSON object that conforms to the output schema. No extra text or explanations.

**USER-PROVIDED INFORMATION:**

{{#if availableIngredients}}
**Ingredients User Already Has (EXCLUDE FROM LIST):**
{{{availableIngredients}}}
{{/if}}

**Recipes to Process for the Weekly Plan:**

{{#each plannedRecipes}}
- **Recipe: {{this.title}}**
  - **Weekly Frequency:** {{this.frequency}}
  - **Base Ingredients:**
  {{{this.ingredients}}}
{{/each}}

Generate the scaled and consolidated grocery list now.
`,
});

const generateGroceryListFlow = ai.defineFlow(
  {
    name: 'generateGroceryListFlow',
    inputSchema: GroceryListInputSchema,
    outputSchema: GroceryListOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
