import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';

export default async function OnboardingPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  if (user.onboarding?.isCompleted) {
    redirect('/dashboard');
  }

  const currentStep = user.onboarding?.currentStep || 1;

  //   Redirect to current step

  switch (currentStep) {
    case 1:
      redirect('/onboarding/create-profile');
    case 2:
      redirect('/onboarding/what-i-care-about');
    case 3:
      redirect('/onboarding/preview');
    default:
      redirect('/onboarding/create-profile');
  }
}
