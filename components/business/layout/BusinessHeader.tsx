/**
 * Site header for all /business/* pages (auth layouts and dashboard).
 *
 * Two usage modes:
 *   1. Auth pages  — rendered without props; shows only the logo.
 *   2. Dashboard   — rendered with logo/companyName/progressPercent props from
 *      the dashboard layout. On mobile (base/md) it shows a hamburger that
 *      opens a drawer containing the full business sidebar. On desktop (lg+)
 *      the sidebar is already visible in the layout so nothing extra is shown.
 */

import { Box, Container, Flex, HStack } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import siteLogo from '@/public/brand-assets/Mastergiver_logo.svg';
import BusinessMobileMenu from './BusinessMobileMenu';
import BusinessSidebar from './BusinessSidebar';

interface BusinessHeaderProps {
  /** Business logo URL — only passed in dashboard context */
  businessLogo?: string | null;
  companyName?: string | null;
  progressPercent?: number;
}

const BusinessHeader = ({
  businessLogo,
  companyName,
  progressPercent,
}: BusinessHeaderProps) => {
  // We're in dashboard context when progressPercent has been supplied
  const isDashboard = progressPercent !== undefined;

  return (
    <Flex
      height={100}
      align="center"
      justify="center"
      bg="background.white"
      borderColor="border.accentBorder"
      borderWidth="1px"
      pos="sticky"
      top="0"
      zIndex="100"
    >
      <Container className="flex align-middle justify-between">
        {/* Logo — links to home */}
        <Link href="/">
          <HStack align="start">
            <Image src={siteLogo} alt="MasterGiver Logo" width={140} height={60} />
          </HStack>
        </Link>

        {/* Mobile hamburger — only in dashboard context, hidden at lg+ */}
        {isDashboard && (
          <Box display={{ base: 'flex', lg: 'none' }} alignItems="center">
            <BusinessMobileMenu>
              <BusinessSidebar
                logo={businessLogo ?? null}
                companyName={companyName ?? null}
                progressPercent={progressPercent}
              />
            </BusinessMobileMenu>
          </Box>
        )}
      </Container>
    </Flex>
  );
};

export default BusinessHeader;
