/**
 * About Us page — /about
 *
 * Long-form brand narrative explaining MasterGiver's mission and why
 * community impact matters for business reputation.
 * Header/footer provided by app/(public)/layout.tsx.
 */

import type { Metadata } from 'next';
import { Box, Button, Container, Heading, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Community Impact & Business Reputation | About MasterGiver',
  description:
    'Community impact is one of the most overlooked drivers of business reputation. MasterGiver helps businesses turn their community involvement into trust, visibility, and growth.',
  alternates: { canonical: 'https://mastergiver.com/about' },
  openGraph: {
    title: 'Community Impact & Business Reputation | About MasterGiver',
    description:
      'Community impact is one of the most overlooked drivers of business reputation. MasterGiver helps businesses turn their community involvement into trust, visibility, and growth.',
    url: 'https://mastergiver.com/about',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Community Impact & Business Reputation | About MasterGiver',
    description:
      'Community impact is one of the most overlooked drivers of business reputation. MasterGiver helps businesses turn their community involvement into trust, visibility, and growth.',
  },
};

/* Shared styles for the pull-quote block used across multiple sections */
const quoteBlockStyle = {
  borderLeft: '4px solid #BDBDFA',
  borderRadius: '0 16px 16px 0',
  border: '1px solid #BDBDFA',
  background: '#FFFFFF',
};

const AboutPage = () => {
  return (
    <Stack gap="0" className="font-body">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <Stack bg="linear-gradient(107.69deg, #F3F6FF 0%, #F1F5FF 100%)">
        <Container
          pt={{ base: '40px', lg: '72px' }}
          pb={{ base: '60px', lg: '100px' }}
          maxW="860px"
        >
          <Stack gap={{ base: '6', lg: '8' }}>
            <Text
              fontWeight="700"
              fontSize="14px"
              letterSpacing="1.16px"
              textTransform="uppercase"
              color="brand.primary"
            >
              About MasterGiver
            </Text>

            <Heading
              className="font-display"
              fontWeight="700"
              fontSize={{ base: '36px', md: '52px', lg: '64px' }}
              lineHeight="120%"
              color="brand.primary"
            >
              The Good You Do Is Invisible. And It&apos;s Costing You.
            </Heading>

            <Stack gap="5">
              <Text fontSize={{ base: '18px', lg: '20px' }} lineHeight="170%" color="text.primary">
                There&apos;s a certain kind of business that people trust more.
              </Text>
              <Text fontSize={{ base: '18px', lg: '20px' }} lineHeight="170%" color="text.primary">
                It&apos;s not always the biggest.
                <br />
                It&apos;s not always the cheapest.
              </Text>
              <Text fontSize={{ base: '18px', lg: '20px' }} lineHeight="170%" color="text.primary">
                But it&apos;s the one you&apos;ve seen show up—again and again—in the community.
              </Text>
              <Text fontSize={{ base: '18px', lg: '20px' }} lineHeight="170%" color="text.primary">
                They sponsor the local event.
                <br />
                They support the nonprofit down the street.
                <br />
                They&apos;re present in ways that go beyond the transaction.
              </Text>
              <Text fontSize={{ base: '18px', lg: '20px' }} lineHeight="170%" color="text.primary">
                Over time, that presence turns into something real. Something felt.
              </Text>
              <Text fontSize={{ base: '18px', lg: '20px' }} lineHeight="170%" color="text.primary" fontWeight="600">
                It becomes reputation.
              </Text>
              <Text fontSize={{ base: '18px', lg: '20px' }} lineHeight="170%" color="text.primary">
                And yet, for most businesses, that reputation is never fully formed. Not because the
                work isn&apos;t being done — but because it isn&apos;t being captured in a way that lasts.
              </Text>
            </Stack>
          </Stack>
        </Container>
      </Stack>

      {/* ── SECTION 2 ────────────────────────────────────────────────────── */}
      <Stack bg="white">
        <Container
          py={{ base: '60px', lg: '100px' }}
          maxW="860px"
        >
          <Stack gap={{ base: '6', lg: '8' }}>
            <Heading
              className="font-display"
              fontWeight="700"
              fontSize={{ base: '28px', md: '38px', lg: '48px' }}
              lineHeight="120%"
              color="text.heading"
            >
              You&apos;re Showing Up in Your Community,
              <br />
              But It&apos;s Not Building Your Reputation
            </Heading>

            <Text fontSize={{ base: '17px', lg: '19px' }} lineHeight="170%" color="text.primary">
              Community involvement tends to live in moments.
            </Text>
            <Text fontSize={{ base: '17px', lg: '19px' }} lineHeight="170%" color="text.primary">
              A logo on a sponsor page.
              <br />
              A post that gets a few likes and disappears.
              <br />
              A mention that fades as quickly as it came.
            </Text>
            <Text fontSize={{ base: '17px', lg: '19px' }} lineHeight="170%" color="text.primary">
              Individually, these moments matter. Collectively, they should be powerful.
            </Text>
            <Text fontSize={{ base: '17px', lg: '19px' }} lineHeight="170%" color="text.primary">
              But they rarely add up to something cohesive. Something that clearly communicates:
            </Text>

            <Box style={quoteBlockStyle} p="6">
              <Text
                className="font-display"
                fontSize={{ base: '18px', lg: '22px' }}
                lineHeight="160%"
                color="brand.primary"
                fontWeight="700"
              >
                This is a business that shows up.
              </Text>
            </Box>

            <Text fontSize={{ base: '17px', lg: '19px' }} lineHeight="170%" color="text.primary">
              Instead, the impact stays fragmented. Felt by some, remembered by a few, but largely
              invisible when it matters most: when someone is deciding who to trust.
            </Text>
          </Stack>
        </Container>
      </Stack>

      {/* ── SECTION 3 ────────────────────────────────────────────────────── */}
      <Stack bg="#F7F8FA">
        <Container
          py={{ base: '60px', lg: '100px' }}
          maxW="860px"
        >
          <Stack gap={{ base: '6', lg: '8' }}>
            <Heading
              className="font-display"
              fontWeight="700"
              fontSize={{ base: '28px', md: '38px', lg: '48px' }}
              lineHeight="120%"
              color="text.heading"
            >
              Reputation Should Be Built on
              <br />
              What a Business Actually Does
            </Heading>

            <Text fontSize={{ base: '17px', lg: '19px' }} lineHeight="170%" color="text.primary">
              For years, business reputation has been shaped by reviews, ratings, and word of mouth.
            </Text>
            <Text fontSize={{ base: '17px', lg: '19px' }} lineHeight="170%" color="text.primary">
              Those signals have their place. But they don&apos;t tell the full story.
              <br />
              They don&apos;t capture how a business contributes to the community around it.
              <br />
              They don&apos;t reflect consistency, presence, or intent.
              <br />
              And increasingly, they&apos;re not enough on their own.
            </Text>
            <Text fontSize={{ base: '17px', lg: '19px' }} lineHeight="170%" color="text.primary">
              Because when people choose where to spend their money, they&apos;re not just asking
              &ldquo;Is this business good?&rdquo;
            </Text>
            <Text fontSize={{ base: '17px', lg: '19px' }} lineHeight="170%" color="text.primary">
              They&apos;re asking something deeper:
            </Text>

            <Box style={quoteBlockStyle} p="6">
              <Text
                className="font-display"
                fontSize={{ base: '18px', lg: '22px' }}
                lineHeight="160%"
                color="brand.primary"
                fontWeight="700"
              >
                &ldquo;Is this a business I feel good about choosing?&rdquo;
              </Text>
            </Box>

            <Text fontSize={{ base: '17px', lg: '19px' }} lineHeight="170%" color="text.primary">
              Community impact answers that question. But only if it&apos;s visible.
            </Text>
          </Stack>
        </Container>
      </Stack>

      {/* ── SECTION 4 ────────────────────────────────────────────────────── */}
      <Stack bg="white">
        <Container
          py={{ base: '60px', lg: '100px' }}
          maxW="860px"
        >
          <Stack gap={{ base: '6', lg: '8' }}>
            <Heading
              className="font-display"
              fontWeight="700"
              fontSize={{ base: '28px', md: '38px', lg: '48px' }}
              lineHeight="120%"
              color="text.heading"
            >
              MasterGiver Exists to Make
              <br />
              Community Impact Count
            </Heading>

            <Text fontSize={{ base: '17px', lg: '19px' }} lineHeight="170%" color="text.primary">
              MasterGiver was built on a simple belief:
            </Text>

            <Box style={quoteBlockStyle} p="6">
              <Text
                className="font-display"
                fontSize={{ base: '18px', lg: '22px' }}
                lineHeight="160%"
                color="brand.primary"
                fontWeight="700"
              >
                The good a business does in its community should contribute directly to its reputation.
              </Text>
            </Box>

            <Text fontSize={{ base: '17px', lg: '19px' }} lineHeight="170%" color="text.primary">
              Not occasionally. Not indirectly. But in a clear, lasting, and cumulative way.
            </Text>
            <Text fontSize={{ base: '17px', lg: '19px' }} lineHeight="170%" color="text.primary">
              Instead of living in scattered moments, community impact becomes something that can be
              seen, understood, and built over time.
            </Text>
            <Text fontSize={{ base: '17px', lg: '19px' }} lineHeight="170%" color="text.primary">
              Something that doesn&apos;t fade.
              <br />
              Something that works for the business long after the initial effort.
            </Text>
          </Stack>
        </Container>
      </Stack>

      {/* ── SECTION 5 ────────────────────────────────────────────────────── */}
      <Stack bg="#F7F8FA">
        <Container
          py={{ base: '60px', lg: '100px' }}
          maxW="860px"
        >
          <Stack gap={{ base: '6', lg: '8' }}>
            <Heading
              className="font-display"
              fontWeight="700"
              fontSize={{ base: '28px', md: '38px', lg: '48px' }}
              lineHeight="120%"
              color="text.heading"
            >
              A More Complete Picture of a Business
            </Heading>

            <Text fontSize={{ base: '17px', lg: '19px' }} lineHeight="170%" color="text.primary">
              When community impact is made visible, something shifts.
            </Text>
            <Text fontSize={{ base: '17px', lg: '19px' }} lineHeight="170%" color="text.primary">
              A business is no longer defined only by what it sells or how it&apos;s reviewed. It&apos;s
              understood by how it shows up.
            </Text>
            <Text fontSize={{ base: '17px', lg: '19px' }} lineHeight="170%" color="text.primary">
              That creates a different kind of reputation — one rooted not just in transactions, but
              in contribution. And businesses that are understood this way tend to stand apart.
            </Text>
            <Stack gap="3" pl="4" borderLeft="3px solid #ECEBF8">
              <Text fontSize={{ base: '17px', lg: '19px' }} lineHeight="170%" color="text.primary">
                They&apos;re easier to trust.
              </Text>
              <Text fontSize={{ base: '17px', lg: '19px' }} lineHeight="170%" color="text.primary">
                They&apos;re easier to choose.
              </Text>
            </Stack>
            <Text fontSize={{ base: '17px', lg: '19px' }} lineHeight="170%" color="text.primary">
              Not because they say more — but because they&apos;ve done more, and it&apos;s clear.
            </Text>
          </Stack>
        </Container>
      </Stack>

      {/* ── SECTION 6 ────────────────────────────────────────────────────── */}
      <Stack bg="white">
        <Container
          py={{ base: '60px', lg: '100px' }}
          maxW="860px"
        >
          <Stack gap={{ base: '6', lg: '8' }}>
            <Heading
              className="font-display"
              fontWeight="700"
              fontSize={{ base: '28px', md: '38px', lg: '48px' }}
              lineHeight="120%"
              color="text.heading"
            >
              The Beginning of a New Standard
            </Heading>

            <Text fontSize={{ base: '17px', lg: '19px' }} lineHeight="170%" color="text.primary">
              We believe business reputation is evolving.
            </Text>
            <Text fontSize={{ base: '17px', lg: '19px' }} lineHeight="170%" color="text.primary">
              That what a business does in its community will matter more, not less, in how it is
              discovered, understood, and chosen.
            </Text>
            <Text fontSize={{ base: '17px', lg: '19px' }} lineHeight="170%" color="text.primary">
              And that over time, the businesses that consistently show up will have an advantage
              that compounds.
            </Text>
            <Text fontSize={{ base: '17px', lg: '19px' }} lineHeight="170%" color="text.primary">
              MasterGiver exists to support that shift.
            </Text>
            <Stack gap="2" pl="4" borderLeft="3px solid #ECEBF8">
              <Text fontSize={{ base: '17px', lg: '19px' }} lineHeight="170%" color="text.primary">
                To make community impact visible.
              </Text>
              <Text fontSize={{ base: '17px', lg: '19px' }} lineHeight="170%" color="text.primary">
                To give it structure.
              </Text>
              <Text fontSize={{ base: '17px', lg: '19px' }} lineHeight="170%" color="text.primary">
                And to ensure that the businesses doing the work are recognized for it.
              </Text>
            </Stack>
          </Stack>
        </Container>
      </Stack>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <Stack bg="brand.primary">
        <Container
          py={{ base: '60px', lg: '100px' }}
          maxW="860px"
        >
          <Stack gap={{ base: '6', lg: '8' }} align={{ base: 'start', lg: 'start' }}>
            <Heading
              className="font-display"
              fontWeight="700"
              fontSize={{ base: '28px', md: '38px', lg: '48px' }}
              lineHeight="120%"
              color="white"
            >
              Start With What You&apos;re Already Doing
            </Heading>

            <Text fontSize={{ base: '17px', lg: '19px' }} lineHeight="170%" color="white">
              If your business is already giving back, you&apos;re not starting from zero.
            </Text>
            <Text fontSize={{ base: '17px', lg: '19px' }} lineHeight="170%" color="white">
              You&apos;re starting with something most businesses don&apos;t have:
            </Text>

            <Text
              className="font-display"
              fontSize={{ base: '20px', lg: '24px' }}
              lineHeight="160%"
              color="white"
              fontWeight="700"
            >
              Real impact.
            </Text>

            <Text fontSize={{ base: '17px', lg: '19px' }} lineHeight="170%" color="white">
              MasterGiver simply makes sure it becomes part of your reputation and continues to work
              for you over time.
            </Text>

            <Box w={{ base: '100%', lg: 'fit-content' }} pt="2">
              <Link href="/business/signup">
                <Button
                  bg="white"
                  color="brand.primary"
                  fontWeight="700"
                  fontSize={{ base: '16px', lg: '20px' }}
                  lineHeight="160%"
                  borderRadius="8px"
                  px="10"
                  h="64px"
                  w={{ base: '100%', lg: 'auto' }}
                  boxShadow="0px 8px 10px -6px rgba(0,0,0,0.2), 0px 20px 25px -5px rgba(0,0,0,0.15)"
                  _hover={{ bg: '#ECEBF8' }}
                >
                  Create Your MasterGiver Reputation Profile →
                </Button>
              </Link>
            </Box>
          </Stack>
        </Container>
      </Stack>

    </Stack>
  );
};

export default AboutPage;
