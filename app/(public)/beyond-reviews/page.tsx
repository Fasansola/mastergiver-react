/**
 * Beyond Reviews page — /beyond-reviews
 *
 * Explains why star ratings alone no longer differentiate a business and
 * introduces MasterGiver's Verified Community Impact as the next trust layer.
 * Header / footer provided by app/(public)/layout.tsx.
 */

import type { Metadata } from 'next';
import {
  Button,
  Container,
  Grid,
  Heading,
  HStack,
  Separator,
  Span,
  Stack,
  Text,
} from '@chakra-ui/react';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import { HERO_GRADIENT } from '@/lib/theme/gradients';
import EyebrowPill from '@/components/landing/EyebrowPill';

import badge from '@/public/beyond-reviews/Frame (4).svg';
import flag from '@/public/beyond-reviews/Flag.svg';
import footerIcon from '@/public/beyond-reviews/footer.svg';
import Customers from '@/public/beyond-reviews/customers.svg';
import Secure from '@/public/beyond-reviews/Secure.svg';
import Search from '@/public/beyond-reviews/Search.svg';

import Store from '@/public/beyond-reviews/store.svg';
import Network from '@/public/beyond-reviews/network-review.svg';
import Share from '@/public/beyond-reviews/share.svg';
import Feedback from '@/public/beyond-reviews/feedback.svg';

import Chart from '@/public/beyond-reviews/Chart.png';

import Structure from '@/public/beyond-reviews/structure.svg';
import Office from '@/public/beyond-reviews/office.svg';
import Award from '@/public/beyond-reviews/award.svg';
import Acknowledge from '@/public/beyond-reviews/acknowledge.svg';

export const metadata: Metadata = {
  title: 'Beyond Reviews — Verified Community Impact | MasterGiver',
  description:
    'Your competitors have 4.8 stars too. MasterGiver Verified Community Impact is the new trust layer that shows customers — and AI — exactly what kind of business you really are.',
};

// ─── Data ────────────────────────────────────────────────────────────────────

interface StatsInterface {
  icon: StaticImageData;
  value: number;
  unit: string;
  heading: string;
  description: string;
}

const statsData: StatsInterface[] = [
  {
    icon: Customers,
    value: 87,
    unit: '%',
    heading: 'Consumers prefer businesses with visible community ties.',
    description: 'Community involvement is a key factor in earning trust.',
  },
  {
    icon: Secure,
    value: 3,
    unit: 'x',
    heading: 'More trust signals compared to reviews alone.',
    description:
      'Verified impact creates deeper trust and stronger differentiation.',
  },
  {
    icon: Search,
    value: 62,
    unit: '%',
    heading:
      'Of businesses are invisible to AI search — even with strong reviews.',
    description:
      'Most businesses lack the signals AI systems rely on to surface results.',
  },
];

const benefits = [
  {
    image: Store,
    title: 'Your competitor has great reviews too',
    description:
      '80% of local businesses now have 4+ stars. Differentiating on ratings alone is nearly impossible.',
  },
  {
    image: Network,
    title: "AI doesn't rank you higher for stars",
    description:
      'Google AI, ChatGPT, and local search are surfacing businesses with richer, broader reputation signals — not just star counts.',
  },
  {
    image: Share,
    title: 'Reviews tell half the story',
    description:
      'They show customers were satisfied. They say nothing about who you are, what you stand for, or why someone should choose you over the business next door.',
  },
  {
    image: Feedback,
    title: 'Customers now compare values, not just ratings',
    description:
      "Increasingly, people are choosing businesses that reflect their own values. Without visible proof of yours, you're invisible to that decision.",
  },
];

const repsCardData: {
  image: StaticImageData;
  title: string;
  description: string;
}[] = [
  {
    image: Acknowledge,
    title: 'Verified Community Impact Profile',
    description:
      'A public-facing, search-indexed reputation page dedicated to your business. Documents your giving, sponsorships, nonprofit support, and community engagement — all in one verifiable place.',
  },
  {
    image: Award,
    title: 'Verified Reputation Badge',
    description:
      'Display your badge on your website, email signature, storefront, and marketing. Instantly signals: this is a business that gives back — before a single word is read.',
  },
  {
    image: Office,
    title: 'GOOD Businesses Directory Listing',
    description:
      'Be featured in a growing directory of values-driven local businesses. Customers searching for community-committed businesses will find you here before they find your competition.',
  },
  {
    image: Structure,
    title: 'Structured Reputation Signals',
    description:
      "Your impact is formatted so search engines and AI systems can read and use it when recommending local businesses. This isn't just feel-good — it's reputation strategy.",
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

const BeyondReviews = () => {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <Stack style={{ background: HERO_GRADIENT }}>
        <Container py="80px" px={{ base: '4', md: '6' }}>
          <Stack align="center" gap="10">
            <Stack align="center" gap="10">
              {/* Eyebrow pill */}
              <EyebrowPill
                icon={badge}
                label="INTRODUCING VERIFIED COMMUNITY IMPACT"
              />

              {/* Headlines */}
              <Stack align="center" gap="4" textAlign="center">
                <Stack gap="0">
                  <Heading
                    className="font-display"
                    wordSpacing="0.1em"
                    fontSize={{ base: '32px', md: '56px', lg: '80px' }}
                    fontWeight="700"
                    lineHeight="140%"
                    color="brand.primary"
                  >
                    Your Reviews Are Great.
                  </Heading>
                  <Heading
                    className="font-display"
                    wordSpacing="0.1em"
                    color="brand.primary"
                    fontSize={{ base: '32px', md: '56px', lg: '80px' }}
                    fontWeight="700"
                    lineHeight="140%"
                  >
                    So Is Everyone Else&apos;s.
                  </Heading>
                </Stack>
                <Text
                  color="text.secondary"
                  fontSize="20px"
                  maxW="838px"
                  lineHeight="170%"
                >
                  Your competitors have 4.8 stars too, which means reviews alone
                  no longer set you apart.{' '}
                  <Span color="brand.primary" fontWeight="bold">
                    Verified Community Impact
                  </Span>{' '}
                  is the new trust layer that shows customers — and AI — exactly
                  what kind of business you really are.
                </Text>
              </Stack>
            </Stack>

            {/* CTAs — stack vertically (full-width) on mobile, side-by-side on md+ */}
            <Stack
              direction={{ base: 'column', md: 'row' }}
              gap="4"
              w={{ base: '100%', md: 'auto' }}
            >
              <Link href="/business/signup" style={{ width: '100%' }}>
                <Button
                  fontWeight="700"
                  fontSize="subheading"
                  py="28px"
                  px="24px"
                  borderRadius="8px"
                  bgColor="brand.primary"
                  color="text.white"
                  w="100%"
                >
                  Build My Community Impact Profile
                </Button>
              </Link>
              <Link href="/business/clearview-family-eyecare" style={{ width: '100%' }}>
                <Button
                  fontWeight="700"
                  fontSize="subheading"
                  py="28px"
                  px="24px"
                  border="solid 1px"
                  borderColor="brand.primary"
                  borderRadius="8px"
                  bgColor="background.white"
                  color="brand.primary"
                  w="100%"
                >
                  See Example Profile
                </Button>
              </Link>
            </Stack>
          </Stack>
        </Container>
      </Stack>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <Stack
        backgroundColor="background.page"
        py={{ base: '12', md: '60px' }}
        px={{ base: '4', md: '6' }}
        border="1px solid"
        borderColor="border.accentBorder"
      >
        <Container
          border="1px solid"
          borderColor="border.accentBorder"
          bgColor="background.white"
          p={{ base: '6', md: '40px' }}
          borderRadius="16px"
        >
          {/* Stack switches to row on desktop */}
          <Stack
            direction={{ base: 'column', lg: 'row' }}
            align="stretch"
            gap={{ base: '8', lg: '60px' }}
          >
            {statsData.map((stat, index) => (
              <>
                <StatsCards key={index} stat={stat} />
                {index !== statsData.length - 1 ? (
                  <>
                    {/* Horizontal divider between cards on mobile */}
                    <Separator
                      borderColor="border.accentBorder"
                      display={{ base: 'block', lg: 'none' }}
                    />
                    {/* Vertical divider between cards on desktop */}
                    <Separator
                      orientation="vertical"
                      borderColor="border.accentBorder"
                      display={{ base: 'none', lg: 'block' }}
                    />
                  </>
                ) : null}
              </>
            ))}
          </Stack>
        </Container>
      </Stack>

      {/* ── WHY REVIEWS AREN'T ENOUGH ────────────────────────────────────── */}
      <Stack
        style={{ background: HERO_GRADIENT }}
        borderBottom="1px solid"
        borderColor="border.accentBorder"
      >
        <Container
          py={{ base: '80px', lg: '120px' }}
          px={{ base: '4', md: '6' }}
          alignItems="center"
          display="flex"
          flexDir="column"
          gap="16"
        >
          <Stack textAlign="center" align="center" gap="6">
            <Stack>
              <Heading
                className="font-display"
                wordSpacing="0.1em"
                fontSize={{ base: '28px', md: '36px', lg: '48px' }}
                fontWeight="700"
                lineHeight="140%"
                color="brand.primary"
              >
                You&apos;ve Done Everything Right.
              </Heading>
              <Heading
                className="font-display"
                wordSpacing="0.1em"
                fontSize={{ base: '28px', md: '36px', lg: '48px' }}
                fontWeight="700"
                lineHeight="140%"
                color="brand.primary"
              >
                And You&apos;re Still Getting Overlooked.
              </Heading>
            </Stack>
            <Text color="text.primary" lineHeight="170%" fontSize="subheading">
              You built your rating. Earned your reviews. Optimized your Google
              profile. Here&apos;s the brutal truth nobody&apos;s telling you:
            </Text>
          </Stack>

          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
            gap="5"
            w="100%"
          >
            {benefits.map(({ image, title, description }, i) => (
              <Stack
                px={{ base: '6', lg: '12' }}
                py={{ base: '6', lg: '20' }}
                gap="6"
                bg="background.white"
                boxShadow="0px 1px 2px 0px #4646490F, 0px 5px 3px 0px #4646490A"
                borderRadius="12px"
                border="0.5px solid"
                borderColor="border.default"
                align="center"
                textAlign="center"
                w="100%"
                key={i}
              >
                <Stack gap="10" align="center">
                  <Image alt={title} src={image} width={80} height={80} />
                  <Heading
                    className="font-display"
                    wordSpacing="0.1em"
                    fontSize="28px"
                    color="brand.primary"
                  >
                    {title}
                  </Heading>
                </Stack>
                <Text
                  className="font-body"
                  lineHeight="180%"
                  fontSize="body"
                  color="text.primary"
                >
                  {description}
                </Text>
              </Stack>
            ))}
          </Grid>

          {/* Pull-quote */}
          <Stack
            padding="6"
            borderRadius="0 16px 16px 0"
            border="1px solid"
            borderLeft="4px solid"
            borderColor="brand.lightPrimary"
            bg="background.white"
            maxW="1032px"
          >
            <Text
              className="font-body"
              fontSize={{ base: '18px', lg: '21px' }}
              lineHeight="170%"
              textAlign="start"
            >
              Reviews got you here. But the businesses pulling ahead right now
              are the ones building a reputation that goes deeper than a star
              rating — that&apos;s where verified community impact changes
              everything.
            </Text>
          </Stack>
        </Container>
      </Stack>

      {/* ── WHAT YOU GET ─────────────────────────────────────────────────── */}
      <Stack bgColor="background.white">
        <Container
          py="80px"
          px={{ base: '4', md: '6' }}
          flexDir={{ base: 'column', md: 'row' }}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={{ base: '12', md: '60px' }}
        >
          <Image
            src={Chart}
            alt="Chart"
            style={{ maxWidth: '480px', width: '100%', height: 'auto' }}
          />

          <Stack align="center" gap="10" maxW="740px">
            <Stack align="center" gap="10">
              {/* Eyebrow pill */}
              <EyebrowPill icon={flag} label="EVERYTHING INCLUDED" />

              <Stack align="center" gap="10" textAlign="center">
                <Stack gap="2">
                  <Heading
                    className="font-display"
                    wordSpacing="0.1em"
                    color="brand.primary"
                    fontSize={{ base: '32px', lg: '48px' }}
                    fontWeight="700"
                    lineHeight="140%"
                  >
                    One Profile.
                  </Heading>
                  <Heading
                    className="font-display"
                    wordSpacing="0.1em"
                    fontSize={{ base: '32px', lg: '48px' }}
                    fontWeight="700"
                    lineHeight="140%"
                    color="brand.primary"
                  >
                    Complete Reputation.
                  </Heading>
                </Stack>
                <Text
                  color="text.secondary"
                  fontSize="body"
                  maxW="838px"
                  lineHeight="170%"
                >
                  Everything you need to build a reputation that works harder
                  than any review ever could.
                </Text>
              </Stack>
            </Stack>

            {/* Feature cards */}
            <Grid templateColumns="1fr" gap="4" w="100%">
              {repsCardData.map(({ image, title, description }, i) => (
                <Stack
                  p="8"
                  flexDir={{ base: 'column', md: 'row' }}
                  key={i}
                  gap="10"
                  bg={{ base: 'background.white', md: 'background.subtle' }}
                  boxShadow="0px 1px 2px 0px #4646490F, 0px 5px 3px 0px #4646490A"
                  border="0.5px solid"
                  borderColor="border.default"
                  borderRadius="16px"
                  textAlign="start"
                >
                  <Image alt={title} src={image} width={72} height={72} />
                  <Stack gap={{ base: '6', md: '4' }}>
                    <Heading
                      className="font-display"
                      wordSpacing="0.1em"
                      fontSize="28px"
                      color="brand.primary"
                    >
                      {title}
                    </Heading>

                    <Separator
                      display={{ base: 'block', md: 'none' }}
                      width="60px"
                      border="2px solid"
                      borderColor="#B38600"
                    />
                    <Text
                      color="text.primary"
                      className="font-body"
                      lineHeight="180%"
                      fontSize="body"
                    >
                      {description}
                    </Text>
                  </Stack>
                </Stack>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Stack>

      {/* ── BOTTOM CTA ───────────────────────────────────────────────────── */}
      <Stack bgColor="brand.primary">
        <Container py="80px" px={{ base: '4', md: '6' }}>
          <Stack align="center" gap="16">
            <Stack align="center" gap="10">
              {/* Eyebrow pill */}
              <EyebrowPill
                icon={footerIcon}
                label="YOUR COMPETITORS ARE STILL JUST COLLECTING REVIEWS"
                variant="dark"
              />

              <Stack align="center" gap="10" textAlign="center">
                <Stack gap="4">
                  <Heading
                    className="font-display"
                    wordSpacing="0.1em"
                    fontSize={{ base: '28px', md: '36px', lg: '48px' }}
                    fontWeight="700"
                    lineHeight="140%"
                    color="text.white"
                  >
                    The Businesses That Win Tomorrow
                  </Heading>
                  {/* #AECCFF — light-blue accent on the dark brand.primary bg,
                      intentional one-off colour for this section */}
                  <Heading
                    className="font-display"
                    wordSpacing="0.1em"
                    color="#AECCFF"
                    fontSize={{ base: '28px', md: '36px', lg: '48px' }}
                    fontWeight="700"
                    lineHeight="140%"
                  >
                    Are Building Their Edge Today.
                  </Heading>
                </Stack>
                <Text
                  className="font-body"
                  color="text.white"
                  fontSize="body"
                  maxW="838px"
                  lineHeight="170%"
                >
                  You&apos;ve already done the hard part — serving your
                  community, giving back, showing up. Now let the world see it.
                  <br />
                  Add Verified Community Impact and build the reputation layer
                  your competitors can&apos;t copy overnight.
                </Text>
              </Stack>
            </Stack>

            <Link
              href="/business/signup"
              style={{ width: '100%', maxWidth: '400px' }}
            >
              <Button
                fontWeight="700"
                fontSize="subheading"
                py="32px"
                px="48px"
                borderRadius="8px"
                bgColor="brand.lightPrimary"
                color="text.white"
                w="100%"
              >
                Get Started
              </Button>
            </Link>
          </Stack>
        </Container>
      </Stack>
    </>
  );
};

// ─── StatsCards sub-component ─────────────────────────────────────────────────

const StatsCards = ({ stat }: { stat: StatsInterface }) => {
  return (
    <Stack bgColor="background.white" gap="6" flex="1" py="20px">
      <HStack gap="6" alignItems="end">
        <Image
          alt="Community Impact"
          src={stat.icon}
          width={100}
          height={100}
        />
        <Heading
          className="font-display"
          wordSpacing="0.1em"
          fontSize="80px"
          lineHeight="100%"
          color="brand.primary"
        >
          {stat.value}
          <Span fontSize="40px" className="font-display">
            {stat.unit}
          </Span>
        </Heading>
      </HStack>

      <Separator width="60px" border="1px solid" borderColor="brand.primary" />

      <Stack gap="4">
        <Heading
          className="font-display"
          wordSpacing="0.1em"
          lineHeight="140%"
          fontSize="bigheading"
          color="text.heading"
          fontWeight="700"
        >
          {stat.heading}
        </Heading>
        <Text
          className="font-body"
          color="text.primary"
          fontSize="body"
          lineHeight="180%"
          maxW="330px"
        >
          {stat.description}
        </Text>
      </Stack>
    </Stack>
  );
};

export default BeyondReviews;
