/**
 * /admin/directory — Admin panel for managing the GOOD Businesses directory.
 *
 * Shows all ACTIVE + published businesses. Admins toggle featuredInDirectory
 * to control which ones appear in the public directory.
 */

import { Container, Box, Heading, Stack, Text, Grid, HStack, Separator } from '@chakra-ui/react';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import DirectoryToggle from '@/components/admin/DirectoryToggle';
import { LuMapPin, LuBuilding2 } from 'react-icons/lu';

export const dynamic = 'force-dynamic';

const AdminDirectoryPage = async () => {
  const businesses = await prisma.business.findMany({
    where: { status: 'ACTIVE', published: true },
    select: {
      id: true,
      companyName: true,
      slug: true,
      logo: true,
      city: true,
      state: true,
      tagline: true,
      featuredInDirectory: true,
      createdAt: true,
    },
    orderBy: { companyName: 'asc' },
  });

  const featuredCount = businesses.filter((b) => b.featuredInDirectory).length;

  return (
    <Container maxW="1200px">
      <Stack gap="8">

        {/* Header */}
        <Stack gap="2">
          <HStack justify="space-between" align="start" flexWrap="wrap" gap="4">
            <Stack gap="1">
              <Heading
                as="h1"
                className="font-display"
                fontWeight="700"
                fontSize={{ base: '24px', lg: '30px' }}
                color="#1E1B4B"
              >
                Directory Management
              </Heading>
              <Text className="font-body" fontSize="14px" color="#6B7280">
                Control which businesses appear in the public GOOD Businesses directory.
              </Text>
            </Stack>

            {/* Stats */}
            <HStack gap="4">
              <Box
                bg="background.white"
                border="1px solid #E8EBFF"
                borderRadius="10px"
                px="16px"
                py="10px"
                textAlign="center"
              >
                <Text fontSize="22px" fontWeight="700" color="#2F2B77" className="font-body">
                  {featuredCount}
                </Text>
                <Text fontSize="11px" color="#9CA3AF" className="font-body" fontWeight="600" textTransform="uppercase" letterSpacing="0.5px">
                  In Directory
                </Text>
              </Box>
              <Box
                bg="background.white"
                border="1px solid #E8EBFF"
                borderRadius="10px"
                px="16px"
                py="10px"
                textAlign="center"
              >
                <Text fontSize="22px" fontWeight="700" color="#6B7280" className="font-body">
                  {businesses.length}
                </Text>
                <Text fontSize="11px" color="#9CA3AF" className="font-body" fontWeight="600" textTransform="uppercase" letterSpacing="0.5px">
                  Total Active
                </Text>
              </Box>
            </HStack>
          </HStack>
        </Stack>

        <Separator borderColor="#E8EBFF" />

        {/* Business list */}
        {businesses.length === 0 ? (
          <Stack align="center" py="20" gap="3">
            <Box color="#D1D5DB" display="flex">
              <LuBuilding2 size={40} />
            </Box>
            <Text className="font-body" fontSize="15px" color="#9CA3AF">
              No active businesses yet.
            </Text>
          </Stack>
        ) : (
          <Grid
            templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}
            gap="4"
          >
            {businesses.map((b) => (
              <Box
                key={b.id}
                bg="background.white"
                border="1px solid"
                borderColor={b.featuredInDirectory ? '#DDD8FF' : '#F3F4F6'}
                borderRadius="14px"
                p="5"
                transition="border-color 0.2s"
              >
                <HStack justify="space-between" align="start" gap="4">
                  {/* Business info */}
                  <HStack gap="3" align="start" flex="1" minW="0">
                    {/* Logo / initials */}
                    {b.logo ? (
                      <Box
                        w="48px"
                        h="48px"
                        borderRadius="10px"
                        overflow="hidden"
                        position="relative"
                        flexShrink="0"
                        border="1px solid #F0EEF8"
                      >
                        <Image
                          src={b.logo}
                          alt={`${b.companyName ?? 'Business'} logo`}
                          fill
                          sizes="48px"
                          style={{ objectFit: 'cover' }}
                        />
                      </Box>
                    ) : (
                      <Box
                        w="48px"
                        h="48px"
                        borderRadius="10px"
                        bg="linear-gradient(145deg, #3730A3 0%, #2F2B77 100%)"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexShrink="0"
                      >
                        <Text color="white" fontWeight="700" fontSize="16px" className="font-body">
                          {(b.companyName ?? 'B').charAt(0).toUpperCase()}
                        </Text>
                      </Box>
                    )}

                    <Stack gap="0.5" minW="0">
                      <Text
                        fontWeight="700"
                        fontSize="14px"
                        color="#1E1B4B"
                        className="font-body"
                        lineClamp={1}
                      >
                        {b.companyName ?? '—'}
                      </Text>
                      {(b.city || b.state) && (
                        <HStack gap="1">
                          <Box color="#9CA3AF" display="flex">
                            <LuMapPin size={11} />
                          </Box>
                          <Text fontSize="12px" color="#9CA3AF" className="font-body">
                            {[b.city, b.state].filter(Boolean).join(', ')}
                          </Text>
                        </HStack>
                      )}
                      {b.tagline && (
                        <Text
                          fontSize="12px"
                          color="#6B7280"
                          className="font-body"
                          lineClamp={1}
                          mt="1"
                        >
                          {b.tagline}
                        </Text>
                      )}
                    </Stack>
                  </HStack>

                  {/* Toggle */}
                  <DirectoryToggle
                    businessId={b.id}
                    initialFeatured={b.featuredInDirectory}
                    companyName={b.companyName}
                  />
                </HStack>
              </Box>
            ))}
          </Grid>
        )}
      </Stack>
    </Container>
  );
};

export default AdminDirectoryPage;
