"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { LandingHeader } from '@/components/layout/landing-header';
import { LandingFooter } from '@/components/layout/landing-footer';
import { BookOpenCheck, Target, Truck, CalendarDays, CheckCircle, HelpCircle, Sparkles } from 'lucide-react';
import { ScrollReveal } from '@/components/scroll-reveal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState, useEffect, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from "@/lib/utils";
import { InteractiveRecipeGenerator } from '@/components/interactive-recipe-generator';
import Autoplay from "embla-carousel-autoplay";
import { Separator } from '@/components/ui/separator';
import { InteractivePantryDemo } from '@/components/interactive-pantry-demo';
import { SignUpButton } from '@clerk/nextjs';

const featuredRecipes = [
  {
    title: 'Perfect Scrambled Eggs',
    description: 'A breakfast classic, made foolproof.',
    imageUrl: 'https://i.ibb.co/v6GXxL3D/perfect-scrambled-eggs.png',
    aiHint: 'scrambled eggs',
    ingredients: ['2 large eggs', '2 tbsp milk', '1 tbsp butter', 'Salt & pepper'],
    nutritionalInfo: ['Calories: 250', 'Protein: 15g', 'Fat: 20g'],
  },
  {
    title: 'One-Pan Lemon Herb Chicken',
    description: 'A delicious, easy-to-clean-up weeknight dinner.',
    imageUrl: 'https://i.ibb.co/QvGT93B7/chicken-skillet.png',
    aiHint: 'roast chicken vegetables',
    ingredients: ['2 chicken breasts', '1 lb potatoes', '1 lemon', 'Rosemary'],
    nutritionalInfo: ['Calories: 450', 'Protein: 40g', 'Carbs: 30g'],
  },
  {
    title: 'Basic Stir-Fry',
    description: 'A versatile dish you can customize with any ingredients.',
    imageUrl: 'https://i.ibb.co/v649cV8K/basic-stir-fry.jpg',
    aiHint: 'stir fry',
    ingredients: ['1 cup rice', '1 bell pepper', '1 onion', 'Soy sauce'],
    nutritionalInfo: ['Calories: 380', 'Protein: 10g', 'Fat: 5g'],
  },
  {
    title: 'Caprese Salad Skewers',
    description: "A simple, elegant appetizer that's always a crowd-pleaser.",
    imageUrl: 'https://i.ibb.co/Kp8tpVVL/caprese-skewers.jpg',
    aiHint: 'caprese salad',
    ingredients: ['Cherry tomatoes', 'Mozzarella balls', 'Fresh basil', 'Balsamic glaze'],
    nutritionalInfo: ['Calories: 150', 'Protein: 8g', 'Fat: 12g'],
  },
  {
    title: 'Quick Avocado Toast',
    description: 'A healthy and satisfying breakfast or snack.',
    imageUrl: 'https://i.ibb.co/b5zmxZ6K/avocado-toast.png',
    aiHint: 'avocado toast',
    ingredients: ['1 slice of bread', '1/2 avocado', 'Red pepper flakes', 'Lemon juice'],
    nutritionalInfo: ['Calories: 220', 'Protein: 6g', 'Fat: 15g'],
  },
  {
    title: '3-Ingredient Peanut Butter Cookies',
    description: 'Incredibly easy cookies with no flour required.',
    imageUrl: 'https://i.ibb.co/gxL2ZBh/peanut-butter-cookies.png',
    aiHint: 'peanut butter cookies',
    ingredients: ['1 cup peanut butter', '1 cup sugar', '1 large egg'],
    nutritionalInfo: ['Calories: 180 (per cookie)', 'Protein: 5g', 'Carbs: 15g'],
  },
];

const testimonials = [
  {
    quote: "Cookwise turned me from a microwave-chef into a confident home cook! I can't believe I made risotto.",
    name: 'Georgia L.',
    title: 'University Student',
  },
  {
    quote: "The allergies feature is a lifesaver! I can finally cook without worrying about my gluten intolerance.",
    name: 'Michalis P.',
    title: 'Busy Dad',
  },
  {
    quote: "I'm finally learning basic cooking skills without feeling intimidated. Thank you, Cookwise!",
    name: 'Petros G.',
    title: 'University Student',
  },
  {
    quote: "Hitting my protein goals is so much easier with the Nutrition Hub. The meal planning is a game-changer for my diet.",
    name: 'Kostas S.',
    title: 'Fitness Enthusiast',
  },
  {
    quote: "I save so much time and money with the grocery list and delivery features. My weeknights are finally stress-free.",
    name: 'Maria G.',
    title: 'Working Professional',
  },
  {
    quote: "I love exploring new recipes without breaking the bank. Cookwise helps me create amazing meals on a student budget.",
    name: 'Xenia V.',
    title: 'Broke University Student',
  }
];


export default function LandingPage() {
    const [isAnnual, setIsAnnual] = useState(false);
    const [typedText, setTypedText] = useState("");
    const [typingCompleted, setTypingCompleted] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const autoplayPluginRecipes = useRef(
        Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })
    );

     const autoplayPluginTestimonials = useRef(
        Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })
    );

    useEffect(() => {
        setMounted(true);

        const fullText = "Your AI-Powered Kitchen Coach";
        let i = 0;
        const intervalId = setInterval(() => {
            if (i < fullText.length) {
                setTypedText(fullText.slice(0, i + 1));
                i++;
            } else {
                clearInterval(intervalId);
                setTypingCompleted(true);
            }
        }, 100); // Adjust typing speed (ms)

        return () => clearInterval(intervalId);
    }, []); // Empty dependency array ensures this runs only once

    // Prevent hydration mismatch for typing animation
    const displayText = mounted ? typedText : "";
    const showCursor = mounted && typingCompleted;

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <LandingHeader />
            <main className="flex-1 pt-16">
                {/* Hero Section */}
                <section className="w-full py-12 md:py-20 lg:py-16 xl:py-16 bg-muted/20">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                            <ScrollReveal className="flex flex-col justify-center space-y-4">
                                <div className="space-y-2">
                                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                                        Cookwise: <span className="bg-gradient-to-r from-primary to-rose-500 bg-clip-text text-transparent">{displayText}</span>
                                        <span className={cn(
                                            "ml-1 font-light text-primary",
                                            showCursor && "endless-blink"
                                        )}>|</span>
                                    </h1>
                                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                        Step-by-step recipes, hands-free guidance, and smart tips—perfect for beginners.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                    <SignUpButton>
                                        <Button size="lg">
                                            Get Started Free
                                        </Button>
                                    </SignUpButton>
                                </div>
                            </ScrollReveal>
                            <ScrollReveal delay={200} className="lg:order-last flex items-center justify-center">
                               <InteractiveRecipeGenerator />
                            </ScrollReveal>
                        </div>
                    </div>
                </section>

                {/* Key Benefits Section */}
                <section id="features" className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container mx-auto px-4 md:px-6">
                        <ScrollReveal className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <Badge variant="outline">Key Features</Badge>
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Why You'll Love Cookwise</h2>
                                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    We make cooking simple, fun, and accessible for everyone, regardless of your skill level.
                                </p>
                            </div>
                        </ScrollReveal>
                        <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-4 lg:gap-16 mt-12">
                            <ScrollReveal delay={0} className="grid gap-1 text-center">
                                <BookOpenCheck className="h-10 w-10 mx-auto text-primary" />
                                <h3 className="text-lg font-bold">Guided Cooking</h3>
                                <p className="text-sm text-muted-foreground">Simple, clear instructions that guide you every step of the way.</p>
                            </ScrollReveal>
                            <ScrollReveal delay={150} className="grid gap-1 text-center">
                                <Target className="h-10 w-10 mx-auto text-primary" />
                                <h3 className="text-lg font-bold">Dietary Goals</h3>
                                <p className="text-sm text-muted-foreground">Tailor recipes to your nutritional needs, from high-protein to low-carb.</p>
                            </ScrollReveal>
                            <ScrollReveal delay={300} className="grid gap-1 text-center">
                                <Truck className="h-10 w-10 mx-auto text-primary" />
                                <h3 className="text-lg font-bold">Easy Delivery</h3>
                                <p className="text-sm text-muted-foreground">Get ingredients delivered with our integrated supermarket partners.</p>
                            </ScrollReveal>
                            <ScrollReveal delay={450} className="grid gap-1 text-center">
                                <CalendarDays className="h-10 w-10 mx-auto text-primary" />
                                <h3 className="text-lg font-bold">Meal Planning</h3>
                                <p className="text-sm text-muted-foreground">Generate weekly grocery lists in seconds and save time.</p>
                            </ScrollReveal>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="w-full py-12 md:py-16 lg:py-20 bg-muted/20">
                     <div className="container mx-auto grid items-center justify-center gap-4 px-4 text-center md:px-6">
                        <ScrollReveal className="space-y-3">
                            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">How It Works</h2>
                            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                Getting started with Cookwise is as easy as 1-2-3.
                            </p>
                        </ScrollReveal>
                        <div className="mx-auto w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-8 mt-8">
                            <ScrollReveal delay={0} className="flex flex-col items-center gap-4">
                                <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">1</div>
                                <h3 className="font-bold">Choose a Recipe</h3>
                                <p className="text-sm text-muted-foreground">Browse our library or let our AI generate a custom recipe for you.</p>
                            </ScrollReveal>
                            <ScrollReveal delay={150} className="flex flex-col items-center gap-4">
                                <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">2</div>
                                <h3 className="font-bold">Follow AI Prompts</h3>
                                <p className="text-sm text-muted-foreground">Our AI coach provides clear, step-by-step instructions.</p>
                            </ScrollReveal>
                            <ScrollReveal delay={300} className="flex flex-col items-center gap-4">
                                <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">3</div>
                                <h3 className="font-bold">Enjoy Your Meal</h3>
                                <p className="text-sm text-muted-foreground">Impress yourself (and others!) with your delicious creation.</p>
                            </ScrollReveal>
                        </div>
                         <ScrollReveal delay={200} className="flex justify-center mt-12">
                           <InteractivePantryDemo />
                        </ScrollReveal>
                    </div>
                </section>
                
                {/* Featured Recipes Section */}
                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container mx-auto px-4 md:px-6">
                        <ScrollReveal>
                            <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl font-headline mb-12">
                                Beginner-Friendly Recipes
                            </h2>
                        </ScrollReveal>
                        <ScrollReveal delay={200}>
                            <Carousel 
                                className="w-full max-w-5xl mx-auto"
                                plugins={[autoplayPluginRecipes.current]}
                                opts={{
                                    align: "start",
                                    loop: true,
                                }}
                            >
                                <CarouselContent className="-ml-4">
                                    {featuredRecipes.map((recipe, index) => (
                                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                                             <Card 
                                                className="h-full flex flex-col overflow-hidden transition-all duration-300"
                                                onMouseEnter={() => { setHoveredIndex(index); autoplayPluginRecipes.current.stop(); }}
                                                onMouseLeave={() => { setHoveredIndex(null); autoplayPluginRecipes.current.play(); }}
                                            >
                                                {/* Use a relative container to stack the default and hover views */}
                                                <div className="relative flex-grow">
                                                    {/* Default View (Image + Title/Description) */}
                                                    <div className={cn(
                                                        "flex flex-col h-full w-full transition-opacity duration-300", 
                                                        hoveredIndex === index ? 'opacity-0' : 'opacity-100'
                                                    )}>
                                                        <Image 
                                                            src={recipe.imageUrl} 
                                                            width={600} 
                                                            height={400} 
                                                            alt={recipe.title} 
                                                            className="object-cover aspect-[3/2]" 
                                                            data-ai-hint={recipe.aiHint} 
                                                        />
                                                        <div className="p-4 flex-grow">
                                                            <h3 className="font-headline text-xl font-semibold">{recipe.title}</h3>
                                                            <p className="text-sm text-muted-foreground mt-2">{recipe.description}</p>
                                                        </div>
                                                    </div>

                                                    {/* Hover View (Ingredients + Nutrition) */}
                                                    <div className={cn(
                                                        "absolute inset-0 w-full h-full transition-opacity duration-300 p-4 space-y-2 bg-card overflow-y-auto", 
                                                        hoveredIndex === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
                                                    )}>
                                                        <h3 className="font-headline text-xl font-semibold">{recipe.title}</h3>
                                                        <Separator />
                                                        <div>
                                                            <h4 className="font-semibold text-base mt-1">Ingredients:</h4>
                                                            <ul className="list-disc list-inside text-sm text-muted-foreground mt-1 space-y-1">
                                                                {recipe.ingredients.map(ing => <li key={ing}>{ing}</li>)}
                                                            </ul>
                                                        </div>
                                                         <div>
                                                            <h4 className="font-semibold text-base mt-2">Nutrition:</h4>
                                                             <div className="flex flex-wrap gap-2 mt-1">
                                                                {recipe.nutritionalInfo.map(info => (
                                                                    <Badge key={info} variant="secondary" className="text-sm font-normal">{info}</Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                        </ScrollReveal>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/20">
                    <div className="container mx-auto px-4 md:px-6">
                        <ScrollReveal>
                            <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl font-headline mb-12">
                                What Our Users Say
                            </h2>
                        </ScrollReveal>
                        <ScrollReveal delay={200}>
                            <Carousel
                                opts={{
                                    align: "start",
                                    loop: true,
                                }}
                                plugins={[autoplayPluginTestimonials.current]}
                                className="w-full max-w-6xl mx-auto"
                            >
                                <CarouselContent className="-ml-4">
                                    {testimonials.map((testimonial, index) => (
                                        <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                            <Card className="h-full flex flex-col">
                                                <CardContent className="pt-6 flex-grow flex flex-col justify-between">
                                                    <p className="italic mb-4 text-center">"{testimonial.quote}"</p>
                                                    <div className="flex items-center gap-4 mt-auto">
                                                        <div>
                                                            <p className="font-semibold">{testimonial.name}</p>
                                                            <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className="hidden lg:inline-flex" />
                                <CarouselNext className="hidden lg:inline-flex" />
                            </Carousel>
                        </ScrollReveal>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container mx-auto px-4 md:px-6">
                        <ScrollReveal className="text-center space-y-4 mb-12">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Find the Perfect Plan</h2>
                            <p className="max-w-2xl mx-auto text-muted-foreground md:text-xl">
                                Start for free and upgrade when you're ready to unlock more powerful features.
                            </p>
                        </ScrollReveal>
                        {mounted && (
                            <ScrollReveal delay={100} className="flex items-center justify-center gap-4 mb-10">
                                <Label htmlFor="billing-cycle" className={!isAnnual ? 'text-foreground' : 'text-muted-foreground'}>Monthly</Label>
                                <Switch
                                    id="billing-cycle"
                                    checked={isAnnual}
                                    onCheckedChange={setIsAnnual}
                                />
                                 <div className="flex items-center gap-2">
                                    <Label htmlFor="billing-cycle" className={isAnnual ? 'text-foreground' : 'text-muted-foreground'}>Annually</Label>
                                    <Badge variant="secondary">Save 18%</Badge>
                                 </div>
                            </ScrollReveal>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                           <ScrollReveal delay={0}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Free</CardTitle>
                                        <CardDescription>Basic recipes & guidance</CardDescription>
                                        <p className="flex items-baseline text-4xl font-bold pt-2">
                                            <span className="text-2xl font-normal mr-1">€</span>
                                            <span>0</span>
                                            <span className="text-lg font-normal text-muted-foreground">/month</span>
                                        </p>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <ul className="space-y-2 text-sm">
                                            <li className="flex items-center gap-2"><CheckCircle className="text-primary w-4 h-4"/> 10 AI-generated recipes/month</li>
                                            <li className="flex items-center gap-2"><CheckCircle className="text-primary w-4 h-4"/> Basic guided cooking</li>
                                        </ul>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="w-full" variant="outline">Get Started</Button>
                                    </CardFooter>
                                </Card>
                            </ScrollReveal>
                             <ScrollReveal delay={150}>
                                <Card className="border-primary border-2 relative">
                                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>
                                    <CardHeader>
                                        <CardTitle>Pro</CardTitle>
                                        <CardDescription>Advanced features for the aspiring chef</CardDescription>
                                        {isAnnual ? (
                                            <p className="flex items-baseline text-4xl font-bold pt-2">
                                                <span className="text-2xl font-normal mr-1">€</span>
                                                <span>79</span>
                                                <span className="text-lg font-normal text-muted-foreground">/year</span>
                                            </p>
                                        ) : (
                                            <p className="flex items-baseline text-4xl font-bold pt-2">
                                                <span className="text-2xl font-normal mr-1">€</span>
                                                <span>7,99</span>
                                                <span className="text-lg font-normal text-muted-foreground">/month</span>
                                            </p>
                                        )}
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <ul className="space-y-2 text-sm">
                                            <li className="flex items-center gap-2"><CheckCircle className="text-primary w-4 h-4"/> Unlimited recipes</li>
                                            <li className="flex items-center gap-2"><CheckCircle className="text-primary w-4 h-4"/> Advanced guided cooking</li>
                                            <li className="flex items-center gap-2"><CheckCircle className="text-primary w-4 h-4"/> Meal planning & grocery lists</li>
                                            <li className="flex items-center gap-2"><CheckCircle className="text-primary w-4 h-4"/> Custom nutrition insights</li>
                                        </ul>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="w-full">Upgrade to Pro</Button>
                                    </CardFooter>
                                </Card>
                             </ScrollReveal>
                            <ScrollReveal delay={300}>
                                <Card className={cn(isAnnual && "bg-muted/40")}>
                                    <CardHeader>
                                        <CardTitle>Student</CardTitle>
                                        <CardDescription>{isAnnual ? "Annual plan not available." : "All Pro features, discounted for students"}</CardDescription>
                                        <p className={cn("flex items-baseline text-4xl font-bold pt-2", isAnnual && "opacity-60")}>
                                            <span className="text-2xl font-normal mr-1">€</span>
                                            <span>2,99</span>
                                            <span className="text-lg font-normal text-muted-foreground">/month</span>
                                        </p>
                                    </CardHeader>
                                    <CardContent className={cn("space-y-4", isAnnual && "opacity-60")}>
                                        <ul className="space-y-2 text-sm">
                                            <li className="flex items-center gap-2"><CheckCircle className="text-primary w-4 h-4"/> All Pro features</li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="text-primary w-4 h-4"/>
                                                <span>Requires verification</span>
                                                <TooltipProvider>
                                                    <Tooltip delayDuration={100}>
                                                        <TooltipTrigger>
                                                            <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Proof of student status like a student ID is required.</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </li>
                                        </ul>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="w-full" variant="outline" disabled={isAnnual}>Get Student Plan</Button>
                                    </CardFooter>
                                </Card>
                            </ScrollReveal>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-muted/20">
                    <div className="container mx-auto px-4 md:px-6">
                        <ScrollReveal>
                             <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl font-headline mb-12">
                                Frequently Asked Questions
                            </h2>
                        </ScrollReveal>
                        <ScrollReveal delay={200}>
                            <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>How does the AI recipe generation work?</AccordionTrigger>
                                    <AccordionContent>
                                        <p>It's simple! You fill out your profile with your food preferences, allergies, dietary goals, and cooking skill level. Our AI then uses this information to create personalized recipes just for you. You can also give it a specific prompt, like "a quick vegan pasta dish," for more tailored results.</p>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>Can Cookwise help me use the ingredients I already have?</AccordionTrigger>
                                    <AccordionContent>
                                        <p>Absolutely! On the Meal Planner page, you can list ingredients you already own in your pantry. When you generate a grocery list, the AI will automatically exclude these items, helping you reduce food waste and save money.</p>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger>What is the Meal Planner feature?</AccordionTrigger>
                                    <AccordionContent>
                                        <p>The Meal Planner is your secret weapon for weekly organization. You can select your favorite saved recipes, decide how many times you want to cook each one, and Cookwise will automatically generate a single, consolidated grocery list with all the quantities scaled up for your week's plan.</p>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-4">
                                    <AccordionTrigger>How does the grocery delivery work?</AccordionTrigger>
                                    <AccordionContent>
                                        <p>Once you've created a meal plan, Cookwise provides estimated price quotes from our partner supermarkets. You can choose the best option for you and schedule a delivery right from the app. You can then track the status of your order on the "Deliveries" page.</p>
                                    </AccordionContent>
                                </AccordionItem>
                                 <AccordionItem value="item-5">
                                    <AccordionTrigger>Do I have to schedule a delivery to use the grocery list?</AccordionTrigger>
                                    <AccordionContent>
                                        <p>Not at all! If you prefer to do your own shopping, you can simply save any generated grocery list to your "My Lists" page. This lets you keep a record of your shopping needs to take to the store yourself, giving you complete flexibility.</p>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </ScrollReveal>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container mx-auto px-4 md:px-6">
                        <ScrollReveal>
                            <div className="relative rounded-lg bg-muted/50 p-8 md:p-12 overflow-hidden text-center">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-rose-500/10 opacity-50 -z-10"></div>
                                <h2 className="text-3xl md:text-4xl font-bold tracking-tighter font-headline">Ready to Unlock Your Inner Chef?</h2>
                                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl mt-4 mb-8">
                                    Stop ordering takeout and start creating amazing meals. Your culinary adventure begins with a single click. It's free to get started!
                                </p>
                                <SignUpButton>
                                    <Button size="lg" className="text-lg py-6 px-10">
                                        <Sparkles className="mr-2 h-5 w-5" />
                                        Sign Up for Free
                                    </Button>
                                </SignUpButton>
                            </div>
                        </ScrollReveal>
                    </div>
                </section>
            </main>
            <LandingFooter />
        </div>
    );
}

    