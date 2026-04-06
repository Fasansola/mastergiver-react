/**
 * Suspended account page — /business/suspended
 *
 * Shown when a business account has been suspended (typically due to a failed
 * payment or cancelled subscription). There is no sidebar — the user cannot
 * access the dashboard until the issue is resolved.
 *
 * Provides a support email link and a sign-out option.
 */

import Nextlink from 'next/link';
import BusinessAuthCard from '@/components/business/auth/BusinessAuthCard';
import { Heading, Link, Stack, Text } from '@chakra-ui/react';

const SuspendedPage = () => {
  return (
    <BusinessAuthCard>
      <Stack gap="8" align="center">
        {/* Icon */}
        <div style={{ fontSize: '48px' }}>⚠️</div>

        {/* Heading + explanation */}
        <Stack gap="4" align="center">
          <Heading
            className="font-display"
            fontSize="bigheading"
            fontWeight="700"
            textAlign="center"
            lineHeight="1.2em"
            color="text.heading"
          >
            Account suspended
          </Heading>

          <Text fontSize="body" textAlign="center" color="text.primary">
            Your MasterGiver business account has been suspended. This usually
            happens when a subscription payment fails or the subscription is
            cancelled.
          </Text>

          <Text fontSize="small" textAlign="center" color="text.muted">
            To restore access, please contact our support team and we&apos;ll
            help you get back up and running.
          </Text>
        </Stack>

        {/* Actions */}
        <Stack gap="4" align="center" w="100%">
          {/* Support email */}
          <Link asChild w="100%">
            <Nextlink
              href="mailto:support@mastergiver.com"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#2F2B77',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '20px',
                height: '64px',
                borderRadius: '8px',
                textDecoration: 'none',
                boxShadow: '0px 8px 10px -6px #E2E1FF, 0px 20px 25px -5px #D4D1FF',
              }}
            >
              Contact Support
            </Nextlink>
          </Link>

          {/* Sign out link */}
          <Link color="text.muted" fontSize="small" textDecor="none">
            <Nextlink href="/business/signin">
              Sign out and use a different account
            </Nextlink>
          </Link>
        </Stack>
      </Stack>
    </BusinessAuthCard>
  );
};

export default SuspendedPage;
