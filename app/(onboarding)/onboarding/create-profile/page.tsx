import CreateProfileForm from '@/components/onboarding/CreateProfileForm';
import { getOnboardingDataAction } from '@/lib/actions/onboarding.actions';
import { requireIncompleteOnboarding } from '@/lib/auth/session';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Create Profile | MasterGiver',
  description: 'Complete your MasterGiver profile',
};

export default async function CreateProfilePage() {
  await requireIncompleteOnboarding();

  const data = await getOnboardingDataAction();

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
