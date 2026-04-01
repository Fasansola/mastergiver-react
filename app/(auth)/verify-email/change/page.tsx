import { Flex, Heading, Text, Button } from '@chakra-ui/react';
import Link from 'next/link';
import Image from 'next/image';
import ErrorIcon from '@/public/components-assets/error-svgrepo-com.svg';
import { verifyNewEmailAction } from '@/lib/actions/account.actions';
import { verifyTokenAndRedirect } from '@/lib/auth/verify-token-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Confirm Email Change | MasterGiver',
  description: 'Confirm your new email address',
};

interface Props {
  searchParams: Promise<{ token?: string }>;
}

export default async function VerifyEmailChangePage({ searchParams }: Props) {
  const { token } = await searchParams;

  const outcome = await verifyTokenAndRedirect({
    token,
    verifyFn: verifyNewEmailAction,
    successRedirect: '/settings/account',
  });

  // Only reached on error — success redirects to /settings/account.

  const title =
    outcome.error === 'missing-token'
      ? 'Invalid Verification Link'
      : 'Verification Failed';

  const message =
    outcome.error === 'missing-token'
      ? 'This link is missing or incomplete. Return to your account settings to request a new one.'
      : outcome.error;

  return (
    <Flex direction="column" gap="40px" align="center" width="100%">
      <Flex direction="column" gap="32px" align="center" width="100%">
        <Image alt="error icon" src={ErrorIcon} width={106} height={106} />
        <Flex direction="column" gap="16px" align="center" width="100%">
          <Heading
            fontSize="heading"
            color="text.heading"
            fontWeight="600"
            maxW="600px"
            textAlign="center"
          >
            {title}
          </Heading>
          <Text color="text.primary" textAlign="center">
            {message}
          </Text>
        </Flex>
      </Flex>
      <Button variant="outline">
        <Link href="/settings/account">Back to Settings</Link>
      </Button>
    </Flex>
  );
}
