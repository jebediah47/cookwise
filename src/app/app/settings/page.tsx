"use client";

import { useRouter } from "next/navigation";
import { useUserPreferences } from "@/hooks/use-user-preferences";
import { PreferencesForm } from "@/components/preferences-form";
import type { UserPreferences } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardEdit } from "lucide-react";

export default function SettingsPage() {
  const { preferences, savePreferences, loading, isOnboardingComplete } = useUserPreferences();
  const { toast } = useToast();
  const router = useRouter();

  const handleSettingsUpdate = (data: UserPreferences) => {
    savePreferences(data);
    toast({
      title: "Preferences Updated!",
      description: "Your new settings have been saved.",
    });
  };

  if (loading) {
     return (
        <div className="container mx-auto max-w-2xl py-12 px-4 md:px-6">
            <div className="mb-10">
                <Skeleton className="h-10 w-1/2 mb-3" />
                <Skeleton className="h-6 w-3/4" />
            </div>
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/3" />
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    {[...Array(3)].map((_, i) => (
                        <div className="space-y-2" key={i}>
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ))}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <div className="flex flex-col space-y-2 pt-2">
                            <Skeleton className="h-6 w-1/3" />
                            <Skeleton className="h-6 w-1/3" />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Skeleton className="h-11 w-32" />
                </CardFooter>
            </Card>
        </div>
    )
  }

  if (!isOnboardingComplete) {
    return (
        <div className="container mx-auto max-w-2xl py-12 px-4 md:px-6">
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <ClipboardEdit className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-xl font-medium">Complete Your Profile</h3>
                <p className="mt-2 text-muted-foreground">
                    Please complete your profile to manage your settings.
                </p>
                <Button onClick={() => router.push('/app/onboarding')} className="mt-6">
                    Go to Onboarding
                </Button>
            </div>
        </div>
    )
  }

  if (!preferences) {
    // This case should not be hit if loading is false and onboarding is complete,
    // but it satisfies TypeScript and acts as a safeguard.
    return null;
  }

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4 md:px-6">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Your Preferences</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Update your profile at any time to keep your recipe suggestions tailored to you.
        </p>
      </div>
      <PreferencesForm
        onSubmit={handleSettingsUpdate}
        defaultValues={preferences}
        submitButtonText="Save Changes"
      />
    </div>
  );
}
