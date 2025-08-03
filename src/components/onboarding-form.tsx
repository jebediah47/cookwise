"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { UserPreferences } from "@/lib/types";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

const dietaryTargetsSchema = z.object({
    targetCalories: z.coerce.number().optional(),
    targetProtein: z.coerce.number().optional(),
    targetCarbs: z.coerce.number().optional(),
    targetFat: z.coerce.number().optional(),
});

const preferencesSchema = z.object({
  foodPreferences: z.string().min(3, { message: "Please describe your food preferences." }),
  allergies: z.array(z.string()).optional(),
  budget: z.coerce.number().positive({ message: "Budget must be a positive number." }).optional(),
  dietaryTargets: dietaryTargetsSchema.optional(),
  cookingLevel: z.enum(["beginner", "intermediate", "advanced"], {
    required_error: "Please select your cooking level.",
  }),
  timeAvailability: z.enum(["15-30", "30-60", "60+"], {
    required_error: "Please select your time availability.",
  }),
  preferredMealTypes: z.array(z.string()).refine((value) => value.length > 0, {
    message: "Please select at least one meal type.",
  }),
});

const mealTypes = [
  { id: "breakfast", label: "Breakfast" },
  { id: "lunch", label: "Lunch" },
  { id: "dinner", label: "Dinner" },
  { id: "snack", label: "Snack" },
];

const steps = [
  {
    id: "foodPreferences",
    title: "Food Preferences",
    description: "What kind of food do you enjoy?",
    fields: ["foodPreferences"],
  },
  {
    id: "allergies",
    title: "Allergies & Restrictions",
    description: "Anything we should avoid?",
    fields: ["allergies"],
  },
   {
    id: "dietaryTargets",
    title: "Dietary Targets (Optional)",
    description: "Set your approximate goals per meal.",
    fields: ["dietaryTargets"],
  },
  {
    id: "cookingLevel",
    title: "Cooking Experience",
    description: "How comfortable are you in the kitchen?",
    fields: ["cookingLevel"],
  },
  {
    id: "timeAvailability",
    title: "Cooking Time",
    description: "How much time do you usually have for cooking?",
    fields: ["timeAvailability"],
  },
  {
    id: "preferredMealTypes",
    title: "Favorite Meals",
    description: "Which meals do you usually cook?",
    fields: ["preferredMealTypes"],
  },
];

export function OnboardingForm({ onSubmit }: { onSubmit: (data: UserPreferences) => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentAllergy, setCurrentAllergy] = useState("");

  const form = useForm<UserPreferences>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      foodPreferences: "",
      allergies: [],
      dietaryTargets: {
          targetCalories: 500,
          targetProtein: 30,
          targetCarbs: 50,
          targetFat: 20,
      },
      cookingLevel: "beginner",
      timeAvailability: "30-60",
      preferredMealTypes: ["dinner"],
    },
    mode: "onChange",
  });

  const { trigger, handleSubmit, watch } = form;
  const allergies = watch("allergies");

  const handleNext = async () => {
    const fields = steps[currentStep].fields as (keyof UserPreferences)[];
    const output = await trigger(fields, { shouldFocus: true });

    if (!output) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep((step) => step + 1);
    } else {
      await handleSubmit(onSubmit)();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
    }
  };

  const progressValue = ((currentStep + 1) / steps.length) * 100;

  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()}>
        <Card>
          <CardHeader>
            <Progress value={progressValue} className="mb-4" />
            <CardTitle>{steps[currentStep].title}</CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </CardHeader>

          <CardContent className="min-h-[220px]">
            {currentStep === 0 && (
              <FormField
                control={form.control}
                name="foodPreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Preferences</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., I love spicy Mexican food, enjoy vegetarian dishes, or prefer simple Italian pasta."
                        {...field}
                        rows={5}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {currentStep === 1 && (
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
                      <FormLabel>Allergies</FormLabel>
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
                      {Array.isArray(allergies) && allergies.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {allergies.map((allergy: string) => (
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
            )}
            
            {currentStep === 2 && (
                <div className="space-y-6">
                    <FormField
                        control={form.control}
                        name="dietaryTargets.targetCalories"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex justify-between items-center">
                                    <FormLabel>Calories (kcal)</FormLabel>
                                    <span className="text-sm font-medium">{field.value}</span>
                                </div>
                                <FormControl>
                                    <Slider defaultValue={[field.value || 500]} max={1500} step={50} onValueChange={(value) => field.onChange(value[0])}/>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="dietaryTargets.targetProtein"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex justify-between items-center">
                                    <FormLabel>Protein (g)</FormLabel>
                                    <span className="text-sm font-medium">{field.value}</span>
                                </div>
                                <FormControl>
                                    <Slider defaultValue={[field.value || 30]} max={100} step={5} onValueChange={(value) => field.onChange(value[0])}/>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="dietaryTargets.targetCarbs"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex justify-between items-center">
                                    <FormLabel>Carbs (g)</FormLabel>
                                    <span className="text-sm font-medium">{field.value}</span>
                                </div>
                                <FormControl>
                                    <Slider defaultValue={[field.value || 50]} max={150} step={5} onValueChange={(value) => field.onChange(value[0])}/>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="dietaryTargets.targetFat"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex justify-between items-center">
                                    <FormLabel>Fat (g)</FormLabel>
                                    <span className="text-sm font-medium">{field.value}</span>
                                </div>
                                <FormControl>
                                    <Slider defaultValue={[field.value || 20]} max={100} step={5} onValueChange={(value) => field.onChange(value[0])}/>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
            )}
            
            {currentStep === 3 && (
                 <FormField
                control={form.control}
                name="cookingLevel"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Cooking Level</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="beginner" /></FormControl>
                          <FormLabel className="font-normal">Beginner</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="intermediate" /></FormControl>
                          <FormLabel className="font-normal">Intermediate</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="advanced" /></FormControl>
                          <FormLabel className="font-normal">Advanced</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {currentStep === 4 && (
                <FormField
                control={form.control}
                name="timeAvailability"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Time per Meal</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="15-30" /></FormControl>
                          <FormLabel className="font-normal">15-30 minutes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="30-60" /></FormControl>
                          <FormLabel className="font-normal">30-60 minutes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="60+" /></FormControl>
                          <FormLabel className="font-normal">60+ minutes</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
             {currentStep === 5 && (
                <FormField
                control={form.control}
                name="preferredMealTypes"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                        <FormLabel>Meal Types</FormLabel>
                        <FormDescription>
                            Select the types of meals you are interested in.
                        </FormDescription>
                    </div>
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
                                  checked={field.value?.includes(item.id)}
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

          </CardContent>
          <CardFooter className="justify-between">
            {currentStep > 0 && (
              <Button type="button" onClick={handlePrev} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
             {currentStep === 0 && <div/>}
            <Button type="button" onClick={handleNext}>
              {currentStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
