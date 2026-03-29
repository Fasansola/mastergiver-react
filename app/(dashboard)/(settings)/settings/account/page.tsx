import { redirect } from 'next/navigation';
import { requireCompletedOnboarding } from '@/lib/auth/session';
import { Stack, HStack, Text, Separator } from '@chakra-ui/react';
import { LuLock } from 'react-icons/lu';
import EmailSection from '@/components/settings/EmailSection';
import PasswordSection from '@/components/settings/PasswordSection';
import DeleteAccountSection from '@/components/settings/DeleteAccountSection';

export const dynamic = 'force-dynamic';

const AccountSettingsPage = async () => {
  const user = await requireCompletedOnboarding();

  if (!user.profile) {
    redirect('/onboarding/create-profile');
  }

  return (
    <Stack gap="8" w="100%">
      {/* ── Username ──────────────────────────────────────── */}
      <Stack gap="4">
        <Text fontWeight="600" fontSize="subheading" color="text.heading">
          Username
        </Text>
        <HStack
          px="4"
          py="3"
          bg="background.page"
          border="1px solid"
          borderColor="border.default"
          borderRadius="card"
          justify="space-between"
        >
          <HStack gap="2">
            <LuLock size={16} color="#575C62" />
            <Text color="text.primary">@{user.profile.username}</Text>
          </HStack>
          <Text fontSize="small" color="text.secondary">
            Username cannot be changed
          </Text>
        </HStack>
      </Stack>

      <Separator borderColor="border.default" />

      {/* ── Email ─────────────────────────────────────────── */}
      <EmailSection
        currentEmail={user.email}
        pendingEmail={user.pendingEmail ?? null}
      />

      <Separator borderColor="border.default" />

      {/* ── Password ──────────────────────────────────────── */}
      <PasswordSection />

      <Separator borderColor="border.default" />

      {/* ── Delete Account ────────────────────────────────── */}
      <DeleteAccountSection />
    </Stack>
  );
};

export default AccountSettingsPage;
