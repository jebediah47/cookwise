"use client";

import { useUserPreferences } from "@/hooks/use-user-preferences";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Target, TrendingUp, TrendingDown, Minus, Utensils, Info } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Pie, PieChart, Cell, Legend } from "recharts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Recipe, NutritionalInfo } from "@/lib/types";

const COLORS = {
    protein: "hsl(var(--chart-1))",
    carbs: "hsl(var(--chart-2))",
    fat: "hsl(var(--chart-3))",
};

export default function NutritionHubPage() {
    const { loading, plannedRecipes, savedRecipes, preferences } = useUserPreferences();
    const targets = preferences?.dietaryTargets;
    const recipesInPlan = savedRecipes.filter(r => !!plannedRecipes[r.title]);

    if (loading) {
        return <NutritionHubSkeleton />;
    }

    const hasPlan = recipesInPlan.length > 0;
    const hasTargets = targets && (targets.targetCalories || targets.targetProtein || targets.targetCarbs || targets.targetFat);

    let averageDailyNutrition: NutritionalInfo = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    if (hasPlan) {
        const weeklyTotals: NutritionalInfo = { calories: 0, protein: 0, carbs: 0, fat: 0 };
        for (const recipe of recipesInPlan) {
            const frequency = plannedRecipes[recipe.title] || 0;
            weeklyTotals.calories += (recipe.nutritionalInfo.calories || 0) * frequency;
            weeklyTotals.protein += (recipe.nutritionalInfo.protein || 0) * frequency;
            weeklyTotals.carbs += (recipe.nutritionalInfo.carbs || 0) * frequency;
            weeklyTotals.fat += (recipe.nutritionalInfo.fat || 0) * frequency;
        }
        averageDailyNutrition = {
            calories: Math.round(weeklyTotals.calories / 7),
            protein: Math.round(weeklyTotals.protein / 7),
            carbs: Math.round(weeklyTotals.carbs / 7),
            fat: Math.round(weeklyTotals.fat / 7),
        };
    }

    const macroData = [
        { name: 'Protein', value: averageDailyNutrition.protein, fill: COLORS.protein },
        { name: 'Carbs', value: averageDailyNutrition.carbs, fill: COLORS.carbs },
        { name: 'Fat', value: averageDailyNutrition.fat, fill: COLORS.fat },
    ].filter(d => d.value > 0);

    const comparisonData = [
        { name: 'Calories', plan: averageDailyNutrition.calories, target: targets?.targetCalories || 0 },
        { name: 'Protein', plan: averageDailyNutrition.protein, target: targets?.targetProtein || 0 },
        { name: 'Carbs', plan: averageDailyNutrition.carbs, target: targets?.targetCarbs || 0 },
        { name: 'Fat', plan: averageDailyNutrition.fat, target: targets?.targetFat || 0 },
    ].filter(d => d.target > 0);

    const caloriesComparisonData = comparisonData.filter(d => d.name === 'Calories');
    const macrosComparisonData = comparisonData.filter(d => d.name !== 'Calories');

    const getComplianceScore = (recipe: Recipe) => {
        if (!targets) return 0;
        let score = 0;
        let totalTargets = 0;
        if (targets.targetCalories) {
            totalTargets++;
            score += 1 - Math.abs((recipe.nutritionalInfo.calories - targets.targetCalories) / targets.targetCalories);
        }
        if (targets.targetProtein) {
            totalTargets++;
            score += 1 - Math.abs((recipe.nutritionalInfo.protein - targets.targetProtein) / targets.targetProtein);
        }
        if (targets.targetCarbs) {
            totalTargets++;
            score += 1 - Math.abs((recipe.nutritionalInfo.carbs - targets.targetCarbs) / targets.targetCarbs);
        }
        if (targets.targetFat) {
            totalTargets++;
            score += 1 - Math.abs((recipe.nutritionalInfo.fat - targets.targetFat) / targets.targetFat);
        }
        return totalTargets > 0 ? (score / totalTargets) * 100 : 0;
    };

    const compliantRecipes = savedRecipes
        .map(recipe => ({ ...recipe, compliance: getComplianceScore(recipe) }))
        .filter(recipe => recipe.compliance > 0)
        .sort((a, b) => b.compliance - a.compliance)
        .slice(0, 5);


    const renderStatCard = (title: string, planValue: number, targetValue?: number) => {
        const hasTarget = typeof targetValue === 'number' && targetValue > 0;
        const difference = hasTarget ? planValue - targetValue : 0;
        const Icon = difference > 0 ? TrendingUp : difference < 0 ? TrendingDown : Minus;
        const colorClass = difference > 0 ? 'text-orange-500' : difference < 0 ? 'text-blue-500' : 'text-muted-foreground';

        return (
            <Card>
                <CardHeader className="pb-2">
                    <CardDescription>{title}</CardDescription>
                    <CardTitle className="text-4xl">{planValue.toLocaleString()}{title === 'Calories' ? ' kcal' : 'g'}</CardTitle>
                </CardHeader>
                <CardContent>
                    {hasTarget ? (
                        <div className={`text-xs flex items-center ${colorClass}`}>
                            <Icon className="h-4 w-4 mr-1" />
                            <span>{difference > 0 ? `+${difference.toLocaleString()}` : difference.toLocaleString()} from target ({targetValue.toLocaleString()})</span>
                        </div>
                    ) : (
                        <p className="text-xs text-muted-foreground">No target set</p>
                    )}
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <div className="mb-8">
                <h1 className="text-4xl font-bold tracking-tight">Nutrition Hub</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Analyze your meal plans and track progress towards your dietary goals.
                </p>
            </div>

            {!hasPlan ? (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <Utensils className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-xl font-medium">No Active Meal Plan</h3>
                    <p className="mt-2 text-muted-foreground">
                        Create a meal plan from your favorite recipes to see your nutrition analysis here.
                    </p>
                </div>
            ) : (
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Average Daily Nutrition</CardTitle>
                            <CardDescription>Based on your current 7-day meal plan.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {renderStatCard('Calories', averageDailyNutrition.calories, targets?.targetCalories)}
                            {renderStatCard('Protein', averageDailyNutrition.protein, targets?.targetProtein)}
                            {renderStatCard('Carbs', averageDailyNutrition.carbs, targets?.targetCarbs)}
                            {renderStatCard('Fat', averageDailyNutrition.fat, targets?.targetFat)}
                        </CardContent>
                    </Card>

                    <div className="grid gap-8 lg:flex lg:items-stretch">
                        <Card className="lg:w-3/5">
                            <CardHeader>
                                <CardTitle>Plan vs. Targets</CardTitle>
                                <CardDescription>A visual comparison of your average daily intake against your goals.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                {!hasTargets ? (
                                    <Alert>
                                        <Target className="h-4 w-4" />
                                        <AlertTitle>No targets set!</AlertTitle>
                                        <AlertDescription>
                                            Set your dietary targets in the Settings page to see a comparison here.
                                        </AlertDescription>
                                    </Alert>
                                ) : (
                                    <>
                                        {caloriesComparisonData.length > 0 && (
                                            <div>
                                                 <h4 className="text-center text-sm font-medium text-muted-foreground mb-2">Calories (kcal)</h4>
                                                <ResponsiveContainer width="100%" height={120}>
                                                    <BarChart data={caloriesComparisonData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                                        <Tooltip cursor={{ fill: 'hsl(var(--muted))', radius: 'var(--radius)' }} contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }} />
                                                        <Legend />
                                                        <Bar dataKey="plan" name="Your Plan" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                                        <Bar dataKey="target" name="Your Target" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        )}
                                        {macrosComparisonData.length > 0 && (
                                            <div>
                                                 <h4 className="text-center text-sm font-medium text-muted-foreground mb-2">Macronutrients (g)</h4>
                                                <ResponsiveContainer width="100%" height={200}>
                                                     <BarChart data={macrosComparisonData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}g`} />
                                                        <Tooltip cursor={{ fill: 'hsl(var(--muted))', radius: 'var(--radius)' }} contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }} />
                                                         <Legend />
                                                        <Bar dataKey="plan" name="Your Plan" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                                        <Bar dataKey="target" name="Your Target" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </Card>
                         <Card className="lg:w-2/5 flex flex-col">
                            <CardHeader>
                                <CardTitle>Macro Breakdown</CardTitle>
                                <CardDescription>Average distribution of protein, carbs, and fat.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow min-h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={macroData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="80%" labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                            const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                                            const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                                            return (
                                                <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
                                                    {`${(percent * 100).toFixed(0)}%`}
                                                </text>
                                            );
                                        }}>
                                            {macroData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                                        </Pie>
                                        <Tooltip
                                            cursor={{ fill: 'hsl(var(--muted))' }}
                                            contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                    {hasTargets && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Recipes for Your Goals</CardTitle>
                                <CardDescription>These recipes from your favorites are the best match for your current dietary targets.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {compliantRecipes.length > 0 ? (
                                    <div className="space-y-4">
                                        {compliantRecipes.map(recipe => (
                                            <div key={recipe.title} className="flex justify-between items-center p-3 border rounded-lg">
                                                <p className="font-semibold">{recipe.title}</p>
                                                <p className="text-sm text-primary font-bold">{recipe.compliance.toFixed(0)}% Match</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <Alert>
                                        <Info className="h-4 w-4" />
                                        <AlertTitle>No matching favorites</AlertTitle>
                                        <AlertDescription>
                                            We couldn't find any recipes in your favorites that are a strong match for your current goals. Try generating some new ones!
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
}


function NutritionHubSkeleton() {
    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <div className="mb-8">
                <Skeleton className="h-10 w-1/3 mb-3" />
                <Skeleton className="h-6 w-1/2" />
            </div>
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-7 w-1/4" />
                        <Skeleton className="h-5 w-1/2" />
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {[...Array(4)].map((_, i) => (
                            <Card key={i}>
                                <CardHeader className="pb-2">
                                    <Skeleton className="h-4 w-1/3" />
                                    <Skeleton className="h-9 w-1/2" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-4 w-3/4" />
                                </CardContent>
                            </Card>
                        ))}
                    </CardContent>
                </Card>
                <div className="grid gap-8 lg:grid-cols-5">
                    <Card className="lg:col-span-3">
                         <CardHeader>
                            <Skeleton className="h-7 w-1/3" />
                            <Skeleton className="h-5 w-2/3" />
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <Skeleton className="h-[120px] w-full" />
                            <Skeleton className="h-[200px] w-full" />
                        </CardContent>
                    </Card>
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <Skeleton className="h-7 w-1/2" />
                             <Skeleton className="h-5 w-3/4" />
                        </CardHeader>
                        <CardContent className="flex justify-center">
                             <Skeleton className="h-[250px] w-[250px] rounded-full" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
