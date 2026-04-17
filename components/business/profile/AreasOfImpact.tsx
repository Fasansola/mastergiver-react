/**
 * AreasOfImpact — public business profile.
 *
 * Renders the business's selected causes as coloured chips. The colour for
 * each chip comes from the Cause record stored in the database — the same
 * colour used in the Phase 1 individual user profiles, keeping the two
 * panels visually consistent.
 *
 * Only rendered when at least one cause is linked to the business.
 */

import { Flex, Grid, Image, Text } from '@chakra-ui/react';

interface Cause {
  id: string;
  name: string;
  icon: string | null;
  color: string; // hex colour from the Cause model, e.g. "#A3E4D7"
}

interface AreasOfImpactProps {
  causes: Cause[];
}

const AreasOfImpact = ({ causes }: AreasOfImpactProps) => {
  return (
    <Grid
      gap="4"
      w="100%"
      columnSpan={{ base: '1', md: '3' }}
      templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}
    >
      {causes.map((cause) => (
        <Flex
          key={cause.id}
          gap="1"
          py={{ base: '3', lg: '4' }}
          // pl="2"
          px={{ base: '4', lg: '5' }}
          bgColor={cause.color}
          borderRadius="12px"
          align="center"
        >
          {cause.icon && (
            <Image
              src={cause.icon}
              alt={cause.name}
              width={9}
              height={9}
              objectFit="contain"
            />
          )}
          <Text fontWeight="500" fontSize="subheading" color="white">
            {cause.name}
          </Text>
        </Flex>
      ))}
    </Grid>
  );
};

export default AreasOfImpact;
