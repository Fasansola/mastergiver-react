/**
 * Business payment confirmation page — /business/confirm
 *
 * This Server Component reads the ?session_id query parameter that Stripe
 * appends to the success_url after a checkout completes. It passes the value
 * (or null if the user hasn't paid yet) to the interactive <ConfirmPage>
 * client component which handles both states.
 *
 * The card wrapper and fonts are applied here so <ConfirmPage> stays focused
 * on interaction logic only.
 */

import { type SearchParams } from 'next/dist/server/request/search-params';
import { Stack } from '@chakra-ui/react';
import ConfirmPage from '@/components/business/confirm/ConfirmPage';

interface ConfirmPageProps {
  searchParams: Promise<SearchParams>;
}

const BusinessConfirmPage = async ({ searchParams }: ConfirmPageProps) => {
  const params = await searchParams;

  // Stripe appends ?session_id=cs_... to the success_url after payment
  const sessionId =
    typeof params.session_id === 'string' ? params.session_id : null;

  return (
    <Stack
      bgColor="#FFFFFF"
      maxW="1000px"
      w="100%"
      p={{ base: '8', md: '16' }}
      borderRadius="16px"
      boxShadow="0px 1px 2px 0px #4646490F, 0px 5px 3px 0px #4646490A"
    >
      <ConfirmPage sessionId={sessionId} />
    </Stack>
  );
};

export default BusinessConfirmPage;
