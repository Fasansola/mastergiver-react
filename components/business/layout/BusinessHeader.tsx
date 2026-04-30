/**
 * Site header for all /business/* pages, the home route (/), and public
 * business profiles (/business/[slug]).
 *
 * Three usage modes:
 *   1. Dashboard   — isDashboard=true (passed by dashboard layout). Shows a
 *      mobile hamburger drawer at base/md. No auth buttons — middleware already
 *      guarantees a signed-in business session here.
 *   2. Public / unauthenticated — isDashboard=false (default). Fetches the
 *      session server-side; shows Login + Sign Up buttons when no business
 *      session is found, nothing extra when already signed in.
 *   3. Auth pages  — same as mode 2 but called without props; logo only when
 *      the user is already signed in (edge case — middleware redirects them away).
 */

import { Box, Container, Flex, HStack } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import siteLogo from '@/public/brand-assets/Mastergiver_logo.svg';
import BusinessMobileMenu from './BusinessMobileMenu';
import BusinessSidebar from './BusinessSidebar';
import BusinessHeaderButtons from './BusinessHeaderButtons';
import StickyHeaderWrapper from '@/components/layout/StickyHeaderWrapper';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';

interface BusinessHeaderProps {
  isDashboard?: boolean;
  bgColor?: string;
  hideAuthButtons?: boolean;
}

const BusinessHeader = async ({
  isDashboard,
  bgColor,
  hideAuthButtons,
}: BusinessHeaderProps) => {
  // On public pages check whether the visitor has an active business session.
  // Skip the DB call entirely in dashboard mode — middleware already confirmed it.
  let hasBusinessSession = false;

  if (!isDashboard) {
    const session = await auth();
    if (session?.user?.id) {
      const business = await prisma.business.findUnique({
        where: { ownerId: session.user.id },
        select: { id: true },
      });
      hasBusinessSession = !!business;
    }
  }

  return (
    <>
      {/* Spacer keeps 100px gap in the document flow so content doesn't slide under the fixed header */}
      <Box height="100px" flexShrink={0} />
      <StickyHeaderWrapper
        style={{ background: bgColor ?? 'white', borderBottom: '1px solid #DCDFE3' }}
      >
        <Flex height="100px" align="center" justify="center">
          <Container className="flex align-middle justify-between">
            {/* Logo — links to home */}
            <Link href="/">
              <HStack align="start">
                <Image
                  src={siteLogo}
                  alt="MasterGiver Logo"
                  width={140}
                  height={60}
                />
              </HStack>
            </Link>

            {isDashboard ? (
              /* Mobile hamburger — only in dashboard context, hidden at lg+ */
              <Box display={{ base: 'flex', lg: 'none' }} alignItems="center">
                <BusinessMobileMenu>
                  <BusinessSidebar isDrawer />
                </BusinessMobileMenu>
              </Box>
            ) : !hasBusinessSession && !hideAuthButtons ? (
              <>
                {/* Desktop auth buttons — hidden on mobile */}
                <Box display={{ base: 'none', lg: 'flex' }} alignItems="center">
                  <BusinessHeaderButtons />
                </Box>

                {/* Mobile — Login + Sign Up */}
                <Box display={{ base: 'flex', lg: 'none' }} alignItems="center">
                  <BusinessHeaderButtons />
                </Box>
              </>
            ) : null}
          </Container>
        </Flex>
      </StickyHeaderWrapper>
    </>
  );
};

export default BusinessHeader;
