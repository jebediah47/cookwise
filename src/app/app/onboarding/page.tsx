"use client";

import { useRouter } from "next/navigation";
import { useUserPreferences } from "@/hooks/use-user-preferences";
import { OnboardingForm } from "@/components/onboarding-form";
import type { UserPreferences } from "@/lib/types";

export default function OnboardingPage() {
  const router = useRouter();
  const { savePreferences } = useUserPreferences();

  const handleOnboardingSubmit = (data: UserPreferences) => {
    savePreferences(data);
    router.push("/app");
  };

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4 md:px-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Welcome to Cookwise!</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Let's get to know you a little better. Your answers will help us find the perfect recipes for you.
        </p>
      </div>
      <OnboardingForm onSubmit={handleOnboardingSubmit} />
    </div>
  );
}
