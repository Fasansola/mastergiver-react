'use client';

// SCHEMA

import { saveProfileBasics } from '@/lib/actions/onboarding.actions';
import {
  Flex,
  Separator,
  Button,
  Field,
  Input,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import z from 'zod';
// import ProfilePictureUpload from './ProfilePictureUpload';
import dynamic from 'next/dynamic';
import LocationSelector from './LocationSelector';
import ProfilePictureUploadSkeleton from './skeletons/ProfilePictureUploadSkeleton';

const ProfilePictureUpload = dynamic(
  () => import('./ProfilePictureUpload'),
  { ssr: false, loading: () => <ProfilePictureUploadSkeleton /> } // ✅ renders only on client — Chakra IDs are stable, no mismatch
);

const createProfileSchema = z.object({
  profilePicture: z.string().url().nullable().optional(),
  aboutMe: z
    .string()
    .max(255, 'About Me must be 255 characters or less')
    .optional(),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
});

// TYPES

export type CreateProfileFormValues = z.infer<typeof createProfileSchema>;

interface CreateProfileProps {
  initialData: {
    username: string;
    profilePicture: string | null;
    aboutMe: string | null;
    state: string | null;
    city: string | null;
  };
}

const CreateProfileForm = ({
  initialData: { username, profilePicture, aboutMe, state, city },
}: CreateProfileProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const methods = useForm<CreateProfileFormValues>({
    resolver: zodResolver(createProfileSchema),
    defaultValues: {
      profilePicture: profilePicture ?? null,
      aboutMe: aboutMe ?? '',
      state: state ?? '',
      city: city ?? '',
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;

  const aboutMeValue = watch('aboutMe') ?? '';

  // Handle submit
  async function onSubmit(values: CreateProfileFormValues) {
    setServerError(null);
    setIsSubmitting(true);

    const result = await saveProfileBasics({
      profilePicture: values.profilePicture ?? undefined,
      aboutMe: values.aboutMe ?? '',
      state: values.state,
      city: values.city,
    });

    if (!result.success) {
      setServerError(result.error ?? 'Something went wrong');
      setIsSubmitting(false);
      return;
    }

    router.push('/onboarding/what-i-care-about');
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        style={{ width: '100%' }}
      >
        <Flex gap="10" direction="column" width={'100%'}>
          <ProfilePictureUpload currentImageURL={profilePicture} />
          <Separator variant="solid" borderColor="border.accentBorder" />
          <Flex direction="column" gap="6">
            {/* Username - display only */}
            <Field.Root>
              <Field.Label color="text.primary">Username</Field.Label>
              <Input value={username} disabled readOnly className="inputForm" />
              <Field.HelperText color="text.secondary">
                Username cannot be changed after it is set.
              </Field.HelperText>
            </Field.Root>

            <LocationSelector />

            {/* About Me */}
            <Field.Root invalid={!!errors.aboutMe}>
              <Flex justify="space-between" align="center" width={'100%'}>
                <Field.Label color="text.primary">About Me</Field.Label>
                <Text fontSize="small" color="text.primary">
                  {aboutMeValue.length} / 255
                </Text>
              </Flex>
              <Textarea
                {...register('aboutMe')}
                maxLength={255}
                rows={4}
                className="inputForm"
                color="text.primary"
                placeholder="Your Personal and Professional Bio here"
              />
              <Field.ErrorText>{errors.aboutMe?.message}</Field.ErrorText>
            </Field.Root>
          </Flex>
          <Button
            type="submit"
            width="fit"
            loading={isSubmitting}
            loadingText="Saving..."
          >
            Next
          </Button>
        </Flex>
      </form>
    </FormProvider>
  );
};

export default CreateProfileForm;
