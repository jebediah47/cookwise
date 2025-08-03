import { redirect } from 'next/navigation';

export default function DeprecatedOnboardingPage() {
  redirect('/app/onboarding');
}
