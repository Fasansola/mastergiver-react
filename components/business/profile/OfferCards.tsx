/**
 * OfferCards — public business profile.
 *
 * Renders the "Community Offers" section as a list of offer rows.
 * Each row shows the offer title and description. If the offer has
 * additional details (code, expiry, or link) a "Learn more" button
 * appears that opens a Chakra Dialog with the full details.
 */

'use client';

import { useState } from 'react';
import {
  Box,
  CloseButton,
  Dialog,
  Heading,
  HStack,
  Portal,
  Separator,
  Stack,
  Text,
} from '@chakra-ui/react';
import Image from 'next/image';
import Arrow from '@/public/business-assets/chevron-right.svg';

interface Offer {
  id: string;
  title: string;
  description: string;
  link: string | null;
  offerCode: string | null;
  expiresAt: string | null; // ISO date string serialised by the page
}

interface OfferCardsProps {
  offers: Offer[];
}

/** Format an ISO date string as "Dec 31, 2025". */
function formatExpiry(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Returns true when an offer has extra details worth showing in a popup. */
function hasExtraDetails(o: Offer): boolean {
  return Boolean(o.offerCode || o.expiresAt || o.link);
}

const OfferCards = ({ offers }: OfferCardsProps) => {
  const [selected, setSelected] = useState<Offer | null>(null);

  return (
    <>
      <Stack gap="8" w="100%">
        {offers.map((o, i) => (
          <Stack key={o.id} gap="6" w="100%">
            {i !== 0 && <Separator borderColor="border.default" />}

            <Stack gap="4">
              {/* Title */}
              <Heading
                className="font-body"
                fontWeight="1000"
                fontSize="heading"
                color="#1F2937"
              >
                {o.title}
              </Heading>

              {/* Description */}
              <Text color="text.primary">{o.description}</Text>
            </Stack>

            {/* Only show button when there are extra details */}
            {hasExtraDetails(o) && (
              <HStack
                cursor="pointer"
                gap="0"
                onClick={() => setSelected(o)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelected(o)}
              >
                <Text
                  textTransform="uppercase"
                  color="brand.primary"
                  fontWeight="500"
                >
                  Learn more
                </Text>
                <Image src={Arrow} alt="Chevron right" />
              </HStack>
            )}
          </Stack>
        ))}
      </Stack>

      {/* Offer detail dialog */}
      <Dialog.Root
        open={selected !== null}
        onOpenChange={({ open }) => !open && setSelected(null)}
        motionPreset="slide-in-bottom"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content borderRadius="16px" maxW="480px" w="90%" p="0">
              {selected && (
                <>
                  {/* Header */}
                  <Dialog.Header
                    px="6"
                    pt="6"
                    pb="4"
                    borderBottom="1px solid"
                    borderColor="gray.100"
                  >
                    <Dialog.Title
                      fontFamily="'Libre Bodoni', serif"
                      fontWeight="700"
                      fontSize="22px"
                      color="#27262D"
                      lineHeight="1.3"
                      pr="8"
                    >
                      {selected.title}
                    </Dialog.Title>
                    <Dialog.CloseTrigger asChild>
                      <CloseButton
                        size="sm"
                        position="absolute"
                        top="4"
                        right="4"
                        color="gray.500"
                      />
                    </Dialog.CloseTrigger>
                  </Dialog.Header>

                  {/* Body */}
                  <Dialog.Body px="6" py="5">
                    <Stack gap="5">
                      {/* Description */}
                      <Text color="#212325" fontSize="15px" lineHeight="1.6">
                        {selected.description}
                      </Text>

                      {/* Promo code pill */}
                      {selected.offerCode && (
                        <Stack gap="1">
                          <Text
                            fontSize="11px"
                            fontWeight="700"
                            letterSpacing="1px"
                            textTransform="uppercase"
                            color="#575C62"
                          >
                            Promo Code
                          </Text>
                          <HStack gap="3" align="center">
                            <Box
                              fontFamily="monospace"
                              fontSize="15px"
                              fontWeight="700"
                              color="#2F2B77"
                              bg="#F5F4FF"
                              border="1.5px dashed #2F2B77"
                              px="4"
                              py="2"
                              borderRadius="8px"
                              letterSpacing="2px"
                            >
                              {selected.offerCode}
                            </Box>
                          </HStack>
                        </Stack>
                      )}

                      {/* Expiry */}
                      {selected.expiresAt && (
                        <HStack gap="2" align="center">
                          <Text fontSize="13px" color="#9CA3AF">
                            Offer expires on{' '}
                            <Box
                              as="span"
                              fontWeight="600"
                              color="#6B7280"
                            >
                              {formatExpiry(selected.expiresAt)}
                            </Box>
                          </Text>
                        </HStack>
                      )}
                    </Stack>
                  </Dialog.Body>

                  {/* Footer — CTA link */}
                  {selected.link && (
                    <Dialog.Footer px="6" pb="6" pt="2">
                      <a
                        href={selected.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="offer-claim-btn"
                      >
                        Claim Offer
                      </a>
                    </Dialog.Footer>
                  )}
                </>
              )}
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default OfferCards;
