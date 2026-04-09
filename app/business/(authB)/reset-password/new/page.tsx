/**
 * Business new password page — /business/reset-password/new
 *
 * Step 2 of password reset. The user arrives here by clicking the link in
 * the reset email, which looks like:
 *   /business/reset-password/new?token=<hex-string>
 *
 * This Server Component reads the token from the URL search params and passes
 * it as a prop to <NewPasswordForm>. If no token is present in the URL, we
 * show a clear error rather than rendering a broken form.
 */

import type { Metadata } from 'next';
import { type SearchParams } from 'next/dist/server/request/search-params';
import BusinessAuthCard from '@/components/business/auth/BusinessAuthCard';
import NewPasswordForm from '@/components/business/auth/NewPasswordForm';
import Nextlink from 'next/link';
import { Heading, Link, Stack, Text } from '@chakra-ui/react';
import { redirectIfBusinessSession } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Set New Password | MasterGiver Business',
  description: 'Create a new password for your MasterGiver business account.',
};

interface NewPasswordPageProps {
  searchParams: Promise<SearchParams>;
}

const BusinessNewPasswordPage = async ({ searchParams }: NewPasswordPageProps) => {
  await redirectIfBusinessSession();

  const params = await searchParams;
  const token = typeof params.token === 'string' ? params.token : null;

  // If there is no token in the URL, the link is broken or already used
  if (!token) {
    return (
      <BusinessAuthCard>
        <Stack gap="6" align="center">
          <Stack gap="4" align="center">
            <Heading
              className="font-display"
              fontSize="bigheading"
              fontWeight="700"
              textAlign="center"
              lineHeight="1.2em"
              color="text.heading"
            >
              Invalid reset link
            </Heading>
            <Text fontSize="body" textAlign="center" color="text.primary">
              This password reset link is missing or invalid. Reset links expire
              after 1 hour and can only be used once.
            </Text>
          </Stack>
          <Link color="brand.primary" fontWeight="600" textDecor="none" fontSize="subheading">
            <Nextlink href="/business/reset-password">Request a new link →</Nextlink>
          </Link>
        </Stack>
      </BusinessAuthCard>
    );
  }

  return (
    <BusinessAuthCard>
      <NewPasswordForm token={token} />
    </BusinessAuthCard>
  );
};

export default BusinessNewPasswordPage;
