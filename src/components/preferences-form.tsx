
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { UserPreferences } from "@/lib/types";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

const dietaryTargetsSchema = z.object({
    targetCalories: z.coerce.number().optional(),
    targetProtein: z.coerce.number().optional(),
    targetCarbs: z.coerce.number().optional(),
    targetFat: z.coerce.number().optional(),
});

const preferencesSchema = z.object({
  foodPreferences: z.string().min(3, "Please tell us a bit about your food preferences."),
  allergies: z.array(z.string()).optional(),
  budget: z.coerce.number().positive({ message: "Budget must be a positive number." }).optional(),
  dietaryTargets: dietaryTargetsSchema.optional(),
  cookingLevel: z.enum(["beginner", "intermediate", "advanced"]),
  timeAvailability: z.enum(["15-30", "30-60", "60+"]),
  preferredMealTypes: z.array(z.string()).refine((value) => value.length > 0, {
    message: "You have to select at least one meal type.",
  }),
});

const mealTypes = [
  { id: "breakfast", label: "Breakfast" },
  { id: "lunch", label: "Lunch" },
  { id: "dinner", label: "Dinner" },
  { id: "snack", label: "Snack" },
];

interface PreferencesFormProps {
  defaultValues?: Partial<UserPreferences>;
  onSubmit: (data: UserPreferences) => void;
  submitButtonText?: string;
}

export function PreferencesForm({
  defaultValues,
  onSubmit,
  submitButtonText = "Save and Start Cooking",
}: PreferencesFormProps) {
  const [currentAllergy, setCurrentAllergy] = useState("");
  const form = useForm<UserPreferences>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      foodPreferences: defaultValues?.foodPreferences || "",
      allergies: defaultValues?.allergies || [],
      budget: defaultValues?.budget,
      dietaryTargets: defaultValues?.dietaryTargets || {},
      cookingLevel: defaultValues?.cookingLevel || "beginner",
      timeAvailability: defaultValues?.timeAvailability || "30-60",
      preferredMealTypes: defaultValues?.preferredMealTypes || ["dinner"],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Core Profile</CardTitle>
                    <CardDescription>The basics of your taste and kitchen habits.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <FormField
                        control={form.control}
                        name="foodPreferences"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Food Preferences</FormLabel>
                            <FormControl>
                                <Textarea
                                placeholder="e.g., I love spicy Mexican food, enjoy vegetarian dishes, or prefer simple Italian pasta."
                                {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Describe the types of food, cuisines, or flavors you enjoy.
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                    <FormField
                    control={form.control}
                    name="allergies"
                    render={({ field }) => {
                        const handleAddAllergy = () => {
                            const trimmedAllergy = currentAllergy.trim();
                            const currentAllergies = Array.isArray(field.value) ? field.value : [];
                            if (trimmedAllergy && !currentAllergies.includes(trimmedAllergy)) {
                                field.onChange([...currentAllergies, trimmedAllergy]);
                                setCurrentAllergy("");
                            }
                        };

                        const handleRemoveAllergy = (allergyToRemove: string) => {
                             const currentAllergies = Array.isArray(field.value) ? field.value : [];
                            field.onChange(
                                currentAllergies.filter((allergy: string) => allergy !== allergyToRemove)
                            );
                        };

                        return (
                        <FormItem>
                            <FormLabel>Allergies or Dietary Restrictions</FormLabel>
                            <FormControl>
                                <div className="flex items-center gap-2">
                                <Input
                                    placeholder="e.g., Peanuts"
                                    value={currentAllergy}
                                    onChange={(e) => setCurrentAllergy(e.target.value)}
                                    onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddAllergy();
                                    }
                                    }}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={handleAddAllergy}
                                    disabled={!currentAllergy.trim()}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                                </div>
                            </FormControl>
                            <FormDescription>
                                List any ingredients to avoid. Press Enter or click '+' to add.
                            </FormDescription>
                            <FormMessage />
                            {Array.isArray(field.value) && field.value.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-2">
                                {field.value.map((allergy: string) => (
                                    <Badge
                                    key={allergy}
                                    variant="secondary"
                                    className="flex items-center gap-2 pl-3 pr-1 py-1 text-sm"
                                    >
                                    {allergy}
                                    <button
                                        type="button"
                                        className="rounded-full p-0.5 transition-colors hover:bg-background/50"
                                        onClick={() => handleRemoveAllergy(allergy)}
                                        aria-label={`Remove ${allergy}`}
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                    </Badge>
                                ))}
                                </div>
                            )}
                        </FormItem>
                        );
                    }}
                    />

                    <FormField
                    control={form.control}
                    name="cookingLevel"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Cooking Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select your cooking experience" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormDescription>
                            How comfortable are you in the kitchen?
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="timeAvailability"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Time Availability</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select your usual cooking time" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="15-30">15-30 minutes</SelectItem>
                            <SelectItem value="30-60">30-60 minutes</SelectItem>
                            <SelectItem value="60+">60+ minutes</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormDescription>
                            How much time do you typically have to prepare a meal?
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    
                    <FormField
                    control={form.control}
                    name="preferredMealTypes"
                    render={() => (
                        <FormItem>
                        <FormLabel>Preferred Meal Types</FormLabel>
                        <FormDescription>
                            Which types of meals are you most interested in?
                        </FormDescription>
                        <div className="space-y-2 pt-2">
                            {mealTypes.map((item) => (
                            <FormField
                                key={item.id}
                                control={form.control}
                                name="preferredMealTypes"
                                render={({ field }) => {
                                return (
                                    <FormItem key={item.id} className="flex flex-row items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                        checked={(field.value || []).includes(item.id)}
                                        onCheckedChange={(checked) => {
                                            return checked
                                            ? field.onChange([...(field.value || []), item.id])
                                            : field.onChange(
                                                (field.value || []).filter(
                                                    (value) => value !== item.id
                                                )
                                                )
                                        }}
                                        />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        {item.label}
                                    </FormLabel>
                                    </FormItem>
                                )
                                }}
                            />
                            ))}
                        </div>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Dietary & Budget Goals</CardTitle>
                    <CardDescription>Use these optional settings to fine-tune your recipes.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Meal Budget (€)</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="e.g., 15"
                                    name={field.name}
                                    onBlur={field.onBlur}
                                    ref={field.ref}
                                    value={field.value ?? ""}
                                    onChange={(e) => field.onChange(e.target.value === '' ? undefined : e.target.valueAsNumber)}
                                />
                            </FormControl>
                            <FormDescription>
                                Your approximate budget per meal. Leave blank if none.
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <FormField
                            control={form.control}
                            name="dietaryTargets.targetCalories"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Target Calories (kcal)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="500"
                                            name={field.name}
                                            onBlur={field.onBlur}
                                            ref={field.ref}
                                            value={field.value ?? ""}
                                            onChange={(e) => field.onChange(e.target.value === '' ? undefined : e.target.valueAsNumber)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dietaryTargets.targetProtein"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Target Protein (g)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="30"
                                            name={field.name}
                                            onBlur={field.onBlur}
                                            ref={field.ref}
                                            value={field.value ?? ""}
                                            onChange={(e) => field.onChange(e.target.value === '' ? undefined : e.target.valueAsNumber)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dietaryTargets.targetCarbs"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Target Carbs (g)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="50"
                                            name={field.name}
                                            onBlur={field.onBlur}
                                            ref={field.ref}
                                            value={field.value ?? ""}
                                            onChange={(e) => field.onChange(e.target.value === '' ? undefined : e.target.valueAsNumber)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dietaryTargets.targetFat"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Target Fat (g)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="20"
                                            name={field.name}
                                            onBlur={field.onBlur}
                                            ref={field.ref}
                                            value={field.value ?? ""}
                                            onChange={(e) => field.onChange(e.target.value === '' ? undefined : e.target.valueAsNumber)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </CardContent>
            </Card>

            <Button type="submit" size="lg">{submitButtonText}</Button>
        </div>
      </form>
    </Form>
  );
}
