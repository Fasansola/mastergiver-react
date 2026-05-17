/**
 * /select-panel — Panel selector for users who have both an individual profile
 * and a business account linked to the same email.
 *
 * Shown after login when both records exist. Lets the user choose which
 * experience to enter. Each card redirects to the appropriate dashboard.
 */

import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import { Box, Container, Heading, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import Image from 'next/image';
import siteLogo from '@/public/brand-assets/Mastergiver_logo.svg';
import { LuUser, LuBuilding2, LuArrowRight } from 'react-icons/lu';

const SelectPanelPage = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      email: true,
      profile: { select: { firstName: true } },
      business: { select: { companyName: true, status: true } },
    },
  });

  // If they only have one account type, skip the selector and route directly
  if (!user?.profile && !user?.business) redirect('/onboarding');
  if (user?.profile && !user?.business) redirect('/dashboard');
  if (user?.business && !user?.profile) {
    const status = user.business.status;
    if (status === 'ACTIVE') redirect('/business/dashboard/edit-profile');
    if (status === 'SUSPENDED') redirect('/business/suspended');
    redirect('/business/confirm');
  }

  const businessHref =
    user?.business?.status === 'ACTIVE'
      ? '/business/dashboard/edit-profile'
      : user?.business?.status === 'SUSPENDED'
        ? '/business/suspended'
        : '/business/confirm';

  return (
    <Box minH="100vh" bg="#F8F9FF" display="flex" flexDirection="column">
      {/* Top bar */}
      <Box bg="white" borderBottom="1px solid #E8EBFF" py="4" px="6">
        <Image src={siteLogo} alt="MasterGiver" width={130} height={44} />
      </Box>

      {/* Content */}
      <Box flex="1" display="flex" alignItems="center" justifyContent="center" py="16" px="4">
        <Container maxW="600px">
          <Stack gap="8" align="center">

            {/* Heading */}
            <Stack gap="2" textAlign="center">
              <Heading
                fontSize={{ base: '24px', md: '30px' }}
                fontWeight="700"
                color="#1E1B4B"
                className="font-display"
              >
                Welcome back
              </Heading>
              <Text fontSize="15px" color="#6B7280" className="font-body">
                Choose which account you&apos;d like to continue with.
              </Text>
              <Text fontSize="13px" color="#9CA3AF" className="font-body">
                {user?.email}
              </Text>
            </Stack>

            {/* Panel cards */}
            <Stack gap="4" w="100%">

              {/* Individual card */}
              <Link href="/dashboard" style={{ display: 'block', textDecoration: 'none' }}>
                <Box
                  bg="white"
                  border="1px solid #E8EBFF"
                  borderRadius="16px"
                  p="6"
                  display="flex"
                  alignItems="center"
                  gap="4"
                  cursor="pointer"
                  transition="all 0.15s"
                  _hover={{ borderColor: '#2F2B77', boxShadow: '0 4px 20px rgba(47,43,119,0.08)' }}
                >
                  <Box
                    w="48px"
                    h="48px"
                    borderRadius="12px"
                    bg="#F0EEFF"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink="0"
                    color="#2F2B77"
                    fontSize="22px"
                  >
                    <LuUser />
                  </Box>
                  <Stack gap="0.5" flex="1">
                    <Text fontWeight="700" fontSize="16px" color="#1E1B4B" className="font-body">
                      Individual Profile
                    </Text>
                    <Text fontSize="13px" color="#6B7280" className="font-body">
                      {user?.profile?.firstName
                        ? `Continue as ${user.profile.firstName}`
                        : 'Your personal philanthropic profile'}
                    </Text>
                  </Stack>
                  <Box color="#9CA3AF" fontSize="18px">
                    <LuArrowRight />
                  </Box>
                </Box>
              </Link>

              {/* Business card */}
              <Link href={businessHref} style={{ display: 'block', textDecoration: 'none' }}>
                <Box
                  bg="white"
                  border="1px solid #E8EBFF"
                  borderRadius="16px"
                  p="6"
                  display="flex"
                  alignItems="center"
                  gap="4"
                  cursor="pointer"
                  transition="all 0.15s"
                  _hover={{ borderColor: '#2F2B77', boxShadow: '0 4px 20px rgba(47,43,119,0.08)' }}
                >
                  <Box
                    w="48px"
                    h="48px"
                    borderRadius="12px"
                    bg="#F0EEFF"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink="0"
                    color="#2F2B77"
                    fontSize="22px"
                  >
                    <LuBuilding2 />
                  </Box>
                  <Stack gap="0.5" flex="1">
                    <Text fontWeight="700" fontSize="16px" color="#1E1B4B" className="font-body">
                      Business Dashboard
                    </Text>
                    <Text fontSize="13px" color="#6B7280" className="font-body">
                      {user?.business?.companyName
                        ? `Continue as ${user.business.companyName}`
                        : 'Your business profile and settings'}
                    </Text>
                  </Stack>
                  <Box color="#9CA3AF" fontSize="18px">
                    <LuArrowRight />
                  </Box>
                </Box>
              </Link>
            </Stack>

          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default SelectPanelPage;
