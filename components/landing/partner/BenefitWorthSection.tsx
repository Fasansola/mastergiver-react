/**
 * BenefitWorthSection — "A Benefit Worth Sharing"
 *
 * Four white cards explaining why partner organizations love the program:
 * meaningful benefit, rewards givers, reinforces mission, zero management.
 */
import { Container, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import NextImage from 'next/image';
import CalenderIcon from '@/public/partner/Calender.svg';
import TimerIcon from '@/public/partner/24Timer.svg';
import MissionIcon from '@/public/partner/Mission Reinforce.svg';
import MemberIcon from '@/public/partner/Member benefit.svg';
import LandingH from '@/components/landing/LandingH';

const benefits = [
  {
    image: MemberIcon,
    title: 'Adds a Meaningful Member Benefit',
    description: 'Something that can help your business members or sponsors.',
  },
  {
    image: TimerIcon,
    title: 'Rewards Businesses That Give Back',
    description:
      'MasterGiver helps businesses leverage their generosity into an online reputation that drives customers.',
  },
  {
    image: MissionIcon,
    title: 'Reinforces Your Mission',
    description:
      "Sharing MasterGiver signals your organization's commitment to the local business community.",
  },
  {
    image: CalenderIcon,
    title: 'Zero Ongoing Management',
    description:
      'No cost, no contracts, and no management time. Share once and MasterGiver handles the rest.',
  },
];

const BenefitWorthSection = () => {
  return (
    <Stack bgColor="#F7F8FA" borderY="1px solid #E9EAED">
      <Container
        py={{ base: '60px', lg: '100px' }}
        alignItems="center"
        display="flex"
        flexDir="column"
        gap="12"
      >
        <Stack textAlign="center" align="center" gap="6">
          <Stack w="100%" maxW="872px">
            <LandingH>A Benefit Worth Sharing</LandingH>
          </Stack>
          <Text color="text.primary" maxW="832px" lineHeight="180%">
            Community partners appreciate the MasterGiver Partner program
            because it lets them offer a real benefit to the businesses that
            support them, with zero lift on their end.
          </Text>
        </Stack>

        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
          gap="5"
          w="100%"
        >
          {benefits.map(({ image, title, description }, i) => (
            <Stack
              p={{ base: '6', lg: '10' }}
              gap="6"
              bg="white"
              boxShadow="0px 1px 2px 0px #4646490F, 0px 5px 3px 0px #4646490A"
              borderRadius="12px"
              border="0.5px solid #DCDFE3"
              align="center"
              textAlign="center"
              w="100%"
              key={i}
            >
              <Stack gap="10" align="center">
                <NextImage alt={title} src={image} width={100} height={100} />
                <Heading
                  className="font-display"
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
      </Container>
    </Stack>
  );
};

export default BenefitWorthSection;
