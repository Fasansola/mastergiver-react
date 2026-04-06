/**
 * PartnerCards — public business profile.
 *
 * Renders the "Our Community Partners & Programs" section as a grid of cards.
 * Each card shows an optional image, the organisation name, and a description.
 *
 * Only rendered when the business has at least one partner saved.
 */

import { Separator, Stack, Text } from '@chakra-ui/react';
import Image from 'next/image';

interface Partner {
  id: string;
  name: string;
  description: string;
  image: string | null;
}

interface PartnerCardsProps {
  partners: Partner[];
}

const PartnerCards = ({ partners }: PartnerCardsProps) => {
  return (
    <Stack gap="10">
      {partners.map((p, i) => (
        <>
          {i !== 0 && <Separator />}
          <Stack direction={{ base: 'column', sm: 'row' }} gap="6" key={p.id}>
            {/* Partner image */}
            {p.image && (
              <Image
                width="120"
                height="120"
                src={p.image}
                alt={p.name}
                style={{
                  objectFit: 'cover',
                  borderRadius: '100%',
                  height: '120px',
                  minWidth: '120px',
                }}
              />
            )}

            <Stack gap="4" flexShrink="1">
              <Text className="font-body" fontWeight="800" color="text.primary">
                {p.name}
              </Text>
              <Text className="font-body" color="text.secondary">
                {p.description}
              </Text>
            </Stack>
          </Stack>
        </>
      ))}
    </Stack>
  );
};

export default PartnerCards;
