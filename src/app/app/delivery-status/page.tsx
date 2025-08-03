"use client";

import { useUserPreferences } from "@/hooks/use-user-preferences";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Truck, Package, PackageCheck, History, ListOrdered } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function DeliveryStatusPage() {
    const { deliveryPlans, loading, clearDeliveryPlans } = useUserPreferences();

    if (loading) {
        return (
             <div className="container mx-auto py-8 px-4 md:px-6">
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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Order Placed':
                return <Package className="h-6 w-6 text-yellow-500" />;
            case 'Processing':
                return <Package className="h-6 w-6 text-blue-500" />;
            case 'Out for Delivery':
                return <Truck className="h-6 w-6 text-orange-500" />;
            case 'Delivered':
                return <PackageCheck className="h-6 w-6 text-green-500" />;
            default:
                return <Package className="h-6 w-6" />;
        }
    }

    const getStatusColor = (status: string) => {
         switch (status) {
            case 'Delivered':
                return "secondary";
            default:
                return "default";
        }
    }


    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Your Deliveries</h1>
                    <p className="mt-2 text-lg text-muted-foreground">
                        Track your scheduled grocery deliveries here.
                    </p>
                </div>
                {deliveryPlans.length > 0 && (
                     <Button variant="destructive" onClick={clearDeliveryPlans}>
                        <History className="mr-2 h-4 w-4" /> Clear History
                    </Button>
                )}
            </div>

            {deliveryPlans.length > 0 ? (
                <div className="space-y-6">
                    {deliveryPlans.map(plan => (
                        <Card key={plan.id}>
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-2xl">Order from {plan.supermarket.name}</CardTitle>
                                        <CardDescription>
                                            Placed on: {new Date(plan.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} at {new Date(plan.createdAt).toLocaleTimeString()}
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                                        {getStatusIcon(plan.status)}
                                        <div>
                                            <p className="text-sm text-muted-foreground">Status</p>
                                            <p className="font-bold">{plan.status}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Separator className="my-4" />
                                <Accordion type="single" collapsible>
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>
                                            <div className="flex items-center gap-2">
                                                <ListOrdered />
                                                View Grocery List ({plan.groceryList.groceryList.reduce((sum, cat) => sum + cat.items.length, 0)} items)
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="space-y-4 pt-4">
                                             {plan.groceryList.groceryList.map(({ category, items }) => (
                                                <div key={category}>
                                                    <h4 className="font-semibold mb-2">{category}</h4>
                                                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                                        {items.map(item => <li key={item.item}>{item.item}</li>)}
                                                    </ul>
                                                </div>
                                            ))}
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                            <CardFooter className="bg-muted/50 p-4 flex justify-between items-center rounded-b-lg">
                                <p className="font-semibold text-lg">Total Cost:</p>
                                <p className="text-xl font-bold">€{plan.supermarket.totalCost.toFixed(2).replace('.',',')}</p>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                 <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <Truck className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-xl font-medium">No Deliveries Yet</h3>
                    <p className="mt-2 text-muted-foreground">
                        Create a meal plan and schedule a delivery to see it here.
                    </p>
                    <Button onClick={() => window.location.href='/app/grocery-list'} className="mt-6">
                        Create a Meal Plan
                    </Button>
                </div>
            )}
        </div>
    )
}
