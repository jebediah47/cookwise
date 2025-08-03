
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserPreferences } from "@/hooks/use-user-preferences";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ClipboardList, ListOrdered, Trash2, Store, Check, ChevronRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { SavedList, SupermarketQuote } from "@/lib/types";

export default function MyListsPage() {
    const { savedLists, loading, removeSavedList, saveDeliveryPlan } = useUserPreferences();
    const router = useRouter();

    const [selectedSupermarkets, setSelectedSupermarkets] = useState<Record<string, string | null>>({});
    const [currentListQuotes, setCurrentListQuotes] = useState<Record<string, SupermarketQuote[]>>({});

    useEffect(() => {
        const oneDay = 24 * 60 * 60 * 1000;
        const updatedQuotes: Record<string, SupermarketQuote[]> = {};

        savedLists.forEach(list => {
            if (list.supermarketQuotes) {
                const listAge = new Date().getTime() - new Date(list.createdAt).getTime();
                if (listAge > oneDay) {
                    updatedQuotes[list.id] = list.supermarketQuotes.map(quote => ({
                        ...quote,
                        totalCost: quote.totalCost * (1 + (Math.random() - 0.5) * 0.1) // +/- 5% change
                    }));
                } else {
                    updatedQuotes[list.id] = list.supermarketQuotes;
                }
            }
        });
        setCurrentListQuotes(updatedQuotes);
    }, [savedLists]);

    const handleSelectSupermarket = (listId: string, supermarketName: string) => {
        setSelectedSupermarkets(prev => ({ ...prev, [listId]: supermarketName }));
    };

    const handleScheduleDelivery = (list: SavedList) => {
        const selectedSupermarketName = selectedSupermarkets[list.id];
        if (!selectedSupermarketName) return;
        
        const quotes = currentListQuotes[list.id] || list.supermarketQuotes;
        const selectedSupermarket = quotes.find(q => q.name === selectedSupermarketName);

        if (!selectedSupermarket) return;

        saveDeliveryPlan({
            id: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            supermarket: selectedSupermarket,
            recipes: list.recipes,
            groceryList: list.groceryList,
            status: "Order Placed",
        });

        removeSavedList(list.id, true); // Silently remove the list after ordering
        router.push('/app/delivery-status');
    };

    if (loading) {
        return (
             <div className="container mx-auto py-12 px-4 md:px-6">
                <div className="mb-8">
                    <div className="h-10 w-1/3 mb-3 bg-muted animate-pulse rounded-md" />
                    <div className="h-6 w-1/2 bg-muted animate-pulse rounded-md" />
                </div>
                 <div className="space-y-4">
                    <div className="h-64 w-full bg-muted animate-pulse rounded-lg" />
                    <div className="h-64 w-full bg-muted animate-pulse rounded-lg" />
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">My Saved Lists</h1>
                    <p className="mt-2 text-lg text-muted-foreground">
                        Your saved grocery lists for personal shopping trips or future deliveries.
                    </p>
                </div>
            </div>

            {savedLists.length > 0 ? (
                <div className="space-y-6">
                    {savedLists.map(list => {
                         const quotes = currentListQuotes[list.id] || list.supermarketQuotes;
                         const selectedSupermarketName = selectedSupermarkets[list.id];
                        return (
                        <Card key={list.id}>
                            <CardHeader>
                                <CardTitle className="text-2xl">Grocery List</CardTitle>
                                <CardDescription>
                                    Created on: {new Date(list.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} at {new Date(list.createdAt).toLocaleTimeString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>
                                            <div className="flex items-center gap-2">
                                                <ListOrdered />
                                                View Grocery List ({list.groceryList.groceryList.reduce((sum, cat) => sum + cat.items.length, 0)} items)
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="space-y-4 pt-4">
                                             {list.groceryList.groceryList.map(({ category, items }) => (
                                                <div key={category}>
                                                    <h4 className="font-semibold mb-2">{category}</h4>
                                                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                                        {items.map(item => <li key={item.item}>{item.item} ({item.estimatedCost})</li>)}
                                                    </ul>
                                                </div>
                                            ))}
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>

                                {list.supermarketQuotes && list.supermarketQuotes.length > 0 && (
                                    <>
                                        <Separator className="my-6" />
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold">Schedule a Delivery</h3>
                                            <div className="space-y-2">
                                                {quotes.map(quote => (
                                                    <button key={quote.name} onClick={() => handleSelectSupermarket(list.id, quote.name)} className="w-full text-left">
                                                        <Card className={`p-4 transition-all ${selectedSupermarketName === quote.name ? 'border-primary ring-2 ring-primary' : 'hover:border-primary/50'}`}>
                                                            <div className="flex justify-between items-center">
                                                                <div className="flex items-center gap-4">
                                                                    <Store className="h-8 w-8 text-primary" />
                                                                    <div>
                                                                        <p className="font-bold">{quote.name}</p>
                                                                        <p className="text-sm text-muted-foreground">Click to select for delivery</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-4">
                                                                    <p className="text-xl font-bold">~€{quote.totalCost.toFixed(2).replace('.',',')}*</p>
                                                                    {selectedSupermarketName === quote.name && <Check className="h-6 w-6 text-primary" />}
                                                                </div>
                                                            </div>
                                                        </Card>
                                                    </button>
                                                ))}
                                            </div>
                                             <Button onClick={() => handleScheduleDelivery(list)} disabled={!selectedSupermarketName} className="w-full sm:w-auto">
                                                Schedule with {selectedSupermarketName || '...'} <ChevronRight className="ml-2 h-5 w-5"/>
                                            </Button>
                                             <p className="text-xs text-muted-foreground text-center pt-2">*All costs are estimates and may vary based on product availability and promotions.</p>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                            <CardFooter className="bg-muted/50 p-4 flex justify-between items-center rounded-b-lg">
                                <p className="font-semibold text-lg">Estimated Original Cost:</p>
                                <div className="flex items-center gap-4">
                                    <p className="text-xl font-bold">~€{list.totalCost.toFixed(2).replace('.',',')}*</p>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                             <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4"/></Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete your saved list.
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => removeSavedList(list.id)}>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </CardFooter>
                        </Card>
                    )})}
                </div>
            ) : (
                 <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-xl font-medium">No Saved Lists Yet</h3>
                    <p className="mt-2 text-muted-foreground">
                        Create a meal plan and save it to see your lists here.
                    </p>
                    <Button onClick={() => window.location.href='/app/grocery-list'} className="mt-6">
                        Create a Meal Plan
                    </Button>
                </div>
            )}
        </div>
    )
}
