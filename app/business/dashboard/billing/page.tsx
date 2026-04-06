/**
 * Billing Settings page — /business/dashboard/billing
 *
 * Server Component. Fetches the business's subscription status and renewal
 * date from the database, then renders three card sections:
 *
 *   1. CurrentPlanCard   — plan name, status badge, renewal date, price
 *   2. ManageBillingCard — button to open the Stripe Customer Portal
 *   3. PaymentHistoryCard — table of past invoices (fetches its own data)
 *
 * CurrentPlanCard receives its data as props (no client-side fetch needed
 * for static subscription info). The other two cards are Client Components
 * that handle their own async operations.
 */

import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import CurrentPlanCard from '@/components/business/billing/CurrentPlanCard';
import ManageBillingCard from '@/components/business/billing/ManageBillingCard';
import PaymentHistoryCard from '@/components/business/billing/PaymentHistoryCard';
import { Container, Heading, Stack, Text } from '@chakra-ui/react';

const BillingPage = async () => {
  const session = await auth();
  if (!session?.user?.id) redirect('/business/signin');

  const business = await prisma.business.findUnique({
    where: { ownerId: session.user.id },
    select: {
      status: true,
      currentPeriodEnd: true,
    },
  });

  if (!business) redirect('/business/signup');

  // Serialise DateTime → ISO string so it crosses the Server→Client boundary.
  // CurrentPlanCard receives this as a plain string, not a Date object.
  const currentPeriodEnd = business.currentPeriodEnd
    ? business.currentPeriodEnd.toISOString()
    : null;

  return (
    <Container p={{ base: '4', md: '6', lg: '10' }}>
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
            Billing & Subscriptions
          </Heading>
          <Text color="text.secondary">
            Manage your subscription, payment method, and invoices.
          </Text>
        </Stack>

        {/* Three card sections stacked vertically */}
        <Stack gap="6">
          <CurrentPlanCard
            status={business.status}
            currentPeriodEnd={currentPeriodEnd}
          />
          <ManageBillingCard />
          <PaymentHistoryCard />
        </Stack>
      </Stack>
    </Container>
  );
};

export default BillingPage;
