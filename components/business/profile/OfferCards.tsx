/**
 * OfferCards — public business profile.
 *
 * Server Component. Renders the "Community Offers" section as a static list.
 * Offers with extra details (code, expiry, link) include an OfferDetailTrigger
 * — a small client component that handles only the dialog interaction.
 */

import { Heading, Separator, Stack, Text } from '@chakra-ui/react';
import OfferDetailTrigger from './OfferDetailTrigger';

interface Offer {
  id: string;
  title: string;
  description: string;
  link: string | null;
  offerCode: string | null;
  expiresAt: string | null;
}

interface OfferCardsProps {
  offers: Offer[];
}

/** Returns true when an offer has extra details worth showing in a popup. */
function hasExtraDetails(o: Offer): boolean {
  return Boolean(o.offerCode || o.expiresAt || o.link);
}

const OfferCards = ({ offers }: OfferCardsProps) => {
  return (
    <Stack gap="8" w="100%">
      {offers.map((o, i) => (
        <Stack key={o.id} gap="6" w="100%">
          {i !== 0 && <Separator borderColor="border.default" />}

          <Stack gap="4">
            <Heading
              className="font-body"
              fontWeight="1000"
              fontSize="heading"
              color="#1F2937"
            >
              {o.title}
            </Heading>
            <Text color="text.primary">{o.description}</Text>
          </Stack>

          {hasExtraDetails(o) && <OfferDetailTrigger offer={o} />}
        </Stack>
      ))}
    </Stack>
  );
};

export default OfferCards;
