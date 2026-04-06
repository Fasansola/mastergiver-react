/**
 * ImpactStats — public business profile.
 *
 * Displays the three Impact Summary numbers as a horizontal stat strip:
 *   - Years of Community Involvement
 *   - Total Community Contributions ($)
 *   - Active Community Partners & Programs
 *
 * Only stats with non-null values are rendered. If all three are null this
 * component should not be mounted (the page guards this before rendering).
 */

import { Heading, Stack, Text } from '@chakra-ui/react';
import Image from 'next/image';
import impact from '@/public/business-assets/impact.svg';
import donated from '@/public/business-assets/donated.svg';
import partnership from '@/public/business-assets/partnership.svg';

interface ImpactStatsProps {
  yearsOfInvolvement: number | null;
  totalContributions: string | null; // Decimal serialised as string by page
  activePartners: number | null;
}

/** Format a decimal string as a compact dollar amount, e.g. "5000" → "$5,000". */
function formatContributions(value: string): string {
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000)
    return `$${num.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  return `$${num}`;
}

interface StatItemProps {
  image: string;
  value: string;
  label: string;
}

const StatItem = ({ image, value, label }: StatItemProps) => (
  <Stack
    align="center"
    py="6"
    px="4"
    bgColor="#FBF9F7"
    gap="6"
    w="100%"
    borderRadius="12px"
    border="solid 0.5px #E9EAED"
    boxShadow="0px 1px 3px 0px #0000000A"
  >
    <Image src={image} alt={label} width="48" height="48" />
    <Stack textAlign="center">
      <Heading
        className="font-body"
        color="text.primary"
        fontWeight="800"
        fontSize="heading"
      >
        {value}
      </Heading>
      <Text
        className="font-body"
        fontSize="small"
        fontWeight="500"
        color="text.primary"
      >
        {label}
      </Text>
    </Stack>
  </Stack>
);

const ImpactStats = ({
  yearsOfInvolvement,
  totalContributions,
  activePartners,
}: ImpactStatsProps) => {
  const stats: { image: string; value: string; label: string }[] = [];

  if (yearsOfInvolvement !== null) {
    stats.push({
      image: impact.src,
      value: `${yearsOfInvolvement} Years`,
      label: 'Community Impact',
    });
  }
  if (totalContributions !== null) {
    stats.push({
      image: donated.src,
      value: `${formatContributions(totalContributions)}+`,
      label: 'Total Donated',
    });
  }
  if (activePartners !== null) {
    stats.push({
      image: partnership.src,
      value: `${activePartners}`,
      label: 'Active Partnerships',
    });
  }

  return (
    <Stack direction={{ base: 'column', lg: 'row' }} w="100%" gap="4">
      {stats.map((s) => (
        <StatItem
          key={s.label}
          value={s.value}
          label={s.label}
          image={s.image}
        />
      ))}
    </Stack>
  );
};

export default ImpactStats;
