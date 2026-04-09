/**
 * ReputationHeroSection — hero for the /reputation page.
 *
 * Gradient background with headline about the missing marketing layer,
 * an explanatory pull-quote, CTA button, and a verified impact image.
 */
import {
  Box,
  Button,
  Container,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import NextImage from 'next/image';
import VerifiedImpact from '@/public/reputation/VerifiedImpact.png';

const ReputationHeroSection = () => {
  return (
    <Stack bg="linear-gradient(107.69deg, #F3F6FF 0%, #F1F5FF 100%)">
      <Container
        pt={{ base: '40px', lg: '64px' }}
        pb={{ base: '60px', lg: '100px' }}
      >
        <Stack
          direction={{ base: 'column', lg: 'row' }}
          gap={{ base: '10', lg: '6' }}
          align="center"
        >
          <Stack w={{ base: '100%', lg: '50%' }} gap="10">
            <Stack gap="10" maxW={{ base: '100%', lg: '640px' }}>
              <Heading
                className="font-display"
                fontWeight="700"
                fontSize={{ base: '38px', md: '52px', lg: '74px' }}
                lineHeight="120%"
                color="brand.primary"
              >
                The Missing Layer in Local Business Marketing
              </Heading>
              <Stack gap="6">
                <Text
                  className="font-body"
                  fontSize={{ base: '18px', lg: '21px' }}
                  lineHeight="170%"
                  color="text.primary"
                >
                  Most local businesses have invested in at least some of the
                  core building blocks of their online presence — search
                  visibility, customer reviews, maybe some advertising or press
                  coverage.
                </Text>
                <Text
                  className="font-body"
                  fontSize={{ base: '18px', lg: '21px' }}
                  lineHeight="170%"
                  color="text.primary"
                >
                  But there&apos;s one reputation layer that almost no business
                  has organized: how they show up for the community they serve.
                </Text>
              </Stack>
              <Stack
                padding="6"
                borderRadius="0 16px 16px 0"
                border="1px solid"
                borderLeft="4px solid"
                borderColor="#BDBDFA"
                bg="#FFFFFF"
              >
                <Text
                  className="font-body"
                  fontSize={{ base: '16px', lg: '20px' }}
                  lineHeight="170%"
                  textAlign="start"
                >
                  This page explains where community reputation fits, why it
                  matters now, and what it looks like when it&apos;s structured.
                </Text>
              </Stack>
            </Stack>

            <Stack gap="8">
              <Box w={{ base: '100%', lg: 'fit-content' }}>
                <Link href="/business/signup">
                  <Button
                    bg="#2F2B77"
                    color="white"
                    fontWeight="700"
                    fontSize={{ base: '16px', lg: '20px' }}
                    lineHeight="160%"
                    borderRadius="8px"
                    px={{ base: '12', lg: '8' }}
                    py="4"
                    h="auto"
                    w="100%"
                    whiteSpace="normal"
                    boxShadow="0px 8px 10px -6px #E2E1FF, 0px 20px 25px -5px #D4D1FF"
                  >
                    See How This Works
                  </Button>
                </Link>
              </Box>
            </Stack>
          </Stack>
          <Stack w={{ base: '100%', lg: '50%' }} align="end">
            <NextImage
              src={VerifiedImpact}
              alt="Verified Impact"
              style={{ width: '100%', height: 'auto', maxWidth: '540px' }}
            />
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
};

export default ReputationHeroSection;
