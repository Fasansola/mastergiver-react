/**
 * WhyImportantSection — "Why the Community Impact Layer is Becoming More Important"
 *
 * Image on the left, two icon-rows on the right explaining the two macro
 * shifts: customer behavior change and AI/search engine evaluation.
 */
import { Container, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import NextImage from 'next/image';
import OutReachIcon from '@/public/reputation/Req Outreach.png';
import CommunityPeopleIcon from '@/public/reputation/Community icon.svg';
import AIBotIcon from '@/public/reputation/AI Bot.svg';
import LandingH from '@/components/landing/LandingH';

const shifts = [
  {
    image: CommunityPeopleIcon,
    title: 'Customer Behavior & Expectations',
    description:
      "Consumers prefer to spend money with businesses that demonstrate genuine local involvement. What's changing is they increasingly expect to be able to verify it before making a decision.",
  },
  {
    image: AIBotIcon,
    title: 'AI and Search Engine Evaluation',
    description:
      "Tools like Google's AI Overviews and ChatGPT recommend businesses based on structured, readable signals. Scattered social posts don't register. A structured reputation record does.",
  },
];

const WhyImportantSection = () => {
  return (
    <Stack bg="white">
      <Container py={{ base: '60px', lg: '100px' }}>
        <Stack
          direction={{ base: 'column', lg: 'row' }}
          gap={{ base: '10', lg: '20' }}
          align="center"
          flexWrap="nowrap"
          justify="space-between"
        >
          <Stack w={{ base: '100%', lg: '42%' }} align="start">
            <NextImage
              src={OutReachIcon}
              alt="Community Outreach"
              style={{ width: '100%', height: 'auto', maxWidth: '540px' }}
            />
          </Stack>

          <Stack w={{ base: '100%', lg: '50%' }} gap="10">
            <Stack gap="10">
              <LandingH>
                Why the Community Impact Layer is Becoming More Important
              </LandingH>
              <Text
                className="font-body"
                lineHeight="170%"
                color="text.primary"
                maxW="560px"
              >
                Two major shifts mean that community involvement which isn&apos;t
                organized is increasingly invisible.
              </Text>
              <Grid gap="10">
                {shifts.map(({ image, title, description }, i) => (
                  <Stack
                    gap="6"
                    borderRadius="12px"
                    align={{ base: 'center', md: 'start' }}
                    textAlign={{ base: 'center', md: 'start' }}
                    direction={{ base: 'column', md: 'row' }}
                    key={i}
                  >
                    <NextImage alt={title} src={image} width={80} height={80} />
                    <Stack gap="4">
                      <Heading
                        className="font-display"
                        fontSize="28px"
                        color="brand.primary"
                      >
                        {title}
                      </Heading>
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
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
};

export default WhyImportantSection;
