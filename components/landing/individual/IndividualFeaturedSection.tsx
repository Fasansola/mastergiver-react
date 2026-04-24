/**
 * IndividualFeaturedSection — "Why Become a MasterGiver?" features section.
 *
 * Typography matches the original Django template:
 *   - big-heading: 3rem / weight 700 / line-height 160% (section title)
 *   - heading: 2rem / weight 700 / line-height 150% (feature headings)
 *   - big-text: 1.25rem / line-height 160% (body copy)
 * Background: #F7F8FA (.secondary-bg from variables.css)
 */
import { Box, Container, Heading, Stack, Text } from '@chakra-ui/react';
import Image from 'next/image';
import featured1 from '@/public/individual/featured-1.png';
import featured2 from '@/public/individual/featured-2.png';
import featured3 from '@/public/individual/featured-3.png';

interface FeatureItemProps {
  image: { src: string };
  alt: string;
  heading: string;
  body: string;
  isLast?: boolean;
}

const FeatureItem = ({ image, alt, heading, body, isLast }: FeatureItemProps) => (
  <Stack
    direction={{ base: 'column', lg: 'row' }}
    align="center"
    gap={{ base: '6', lg: '0' }}
    py={{ base: '40px', lg: '48px' }}
    borderBottom={isLast ? 'none' : 'solid 1px'}
    borderColor="border.default"
    maxW="1000px"
    mx="auto"
    textAlign={{ base: 'center', lg: 'left' }}
  >
    {/* Image */}
    <Box
      w={{ base: '100%', lg: '50%' }}
      display="flex"
      justifyContent={{ base: 'center', lg: 'flex-end' }}
      pr={{ base: '0', lg: '16' }}
      pb={{ base: '8', lg: '0' }}
    >
      <Box w={{ base: '80%', lg: '90%' }} maxW="366px">
        <Image
          src={image.src}
          alt={alt}
          width={366}
          height={300}
          style={{ width: '100%', height: 'auto' }}
        />
      </Box>
    </Box>

    {/* Text */}
    <Stack w={{ base: '100%', lg: '50%' }} gap="5" maxW="480px">
      <Heading
        fontWeight="700"
        fontSize={{ base: '7vw', md: '28px', lg: '2rem' }}
        lineHeight="150%"
        color="brand.primary"
      >
        {heading}
      </Heading>
      <Text
        fontSize="1.25rem"
        lineHeight="160%"
        color="text.primary"
      >
        {body}
      </Text>
    </Stack>
  </Stack>
);

const features = [
  {
    image: featured1,
    alt: 'Manage and showcase your impact',
    heading: 'Manage and Showcase Your Impact',
    body: 'MasterGiver is your all-in-one platform to organize, track, and quantify your giving efforts—helping you build an online presence that reflects your values.',
  },
  {
    image: featured2,
    alt: 'Advance your career',
    heading: 'Advance Your Career',
    body: 'Givers are known for their altruism and teamwork. Your MasterGiver profile will attract more job opportunities and improve your career advancement.',
  },
  {
    image: featured3,
    alt: 'Enhance your online reputation',
    heading: 'Enhance Your Online Reputation',
    body: 'Showcase your dedication to helping others and demonstrate your commitment to making a positive impact, thereby building a positive image and standing out online.',
  },
];

const IndividualFeaturedSection = () => {
  return (
    <Stack bgColor="#F7F8FA">
      <Container py={{ base: '48px', lg: '80px' }}>
        <Heading
          fontWeight="700"
          fontSize={{ base: '9vw', md: '2.6rem', lg: '3rem' }}
          lineHeight="160%"
          color="text.heading"
          textAlign="center"
          mb={{ base: '4', lg: '2' }}
        >
          Why Become a MasterGiver?
        </Heading>

        <Stack gap="0">
          {features.map((f, i) => (
            <FeatureItem
              key={f.heading}
              image={f.image}
              alt={f.alt}
              heading={f.heading}
              body={f.body}
              isLast={i === features.length - 1}
            />
          ))}
        </Stack>
      </Container>
    </Stack>
  );
};

export default IndividualFeaturedSection;
