import CreateProfileForm from '@/components/onboarding/CreateProfileForm';
import { getOnboardingData } from '@/lib/actions/onboarding.actions';
import { requireIncompleteOnboarding } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CreateProfilePage() {
  await requireIncompleteOnboarding();

  const data = await getOnboardingData();

  if (!data.success || !data.data?.profile) {
    redirect('/dashboard');
  }

  const { profile } = data.data;

  return (
    <CreateProfileForm
      initialData={{
        username: profile.username,
        profilePicture: profile.profilePicture,
        aboutMe: profile.aboutMe,
        state: profile.state,
        city: profile.city,
      }}
    />
  );
}
