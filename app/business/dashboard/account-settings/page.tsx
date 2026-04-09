/**
 * Account Settings page — /business/dashboard/account-settings
 *
 * Server Component. Reads the current user's email and business name from
 * the database so the form fields are pre-filled on load.
 *
 * Renders two independent card sections:
 *   1. AccountInfoCard  — update Business Name and Email
 *   2. ChangePasswordCard — update login password
 *
 * The cards handle their own submission and show inline feedback — no
 * page-level state is needed here.
 */

import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import AccountInfoCard from '@/components/business/account-settings/AccountInfoCard';
import ChangePasswordCard from '@/components/business/account-settings/ChangePasswordCard';
import { Container, Stack, Text, Heading } from '@chakra-ui/react';

const AccountSettingsPage = async () => {
  const session = await auth();
  if (!session?.user?.id) redirect('/business/signin');

  // Fetch the minimum data needed to pre-fill the form fields.
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      email: true,
      business: { select: { companyName: true } },
    },
  });

  if (!user?.business) redirect('/business/signup');

  const defaultValues = {
    companyName: user.business.companyName ?? '',
    email: user.email ?? '',
  };

  return (
    <Container p="0">
      <Stack gap="8">
        {/* Page heading */}
        <Stack gap="5">
          <Heading
            className="font-display"
            fontWeight="700"
            fontSize="bigheading"
            lineHeight="120%"
            color="text.primary"
          >
            Account Settings
          </Heading>
          <Text color="text.secondary">
            Manage your business name, email, and password.
          </Text>
        </Stack>

        {/* Two card sections stacked vertically */}
        <AccountInfoCard defaultValues={defaultValues} />
        <ChangePasswordCard />
      </Stack>
    </Container>
  );
};

export default AccountSettingsPage;
