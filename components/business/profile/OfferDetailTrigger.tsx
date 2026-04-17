/**
 * OfferDetailTrigger — client component.
 *
 * Renders the "Learn more" button for a single offer and manages the Dialog
 * that shows its full details (promo code, expiry, claim link).
 *
 * Kept deliberately small so the parent OfferCards list can stay a Server
 * Component — only this interactive slice is hydrated on the client.
 */

'use client';

import { useState } from 'react';
import {
  Box,
  CloseButton,
  Dialog,
  HStack,
  Portal,
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
  expiresAt: string | null;
}

interface OfferDetailTriggerProps {
  offer: Offer;
}

/** Format an ISO date string as "Dec 31, 2025". */
function formatExpiry(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const OfferDetailTrigger = ({ offer }: OfferDetailTriggerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Accessible button — replaces the previous role="button" HStack */}
      <button
        onClick={() => setOpen(true)}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
        }}
      >
        <HStack gap="0">
          <Text
            textTransform="uppercase"
            color="brand.primary"
            fontWeight="500"
          >
            Learn more
          </Text>
          <Image src={Arrow} alt="" aria-hidden="true" />
        </HStack>
      </button>

      <Dialog.Root
        open={open}
        onOpenChange={({ open }) => setOpen(open)}
        motionPreset="slide-in-bottom"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content borderRadius="16px" maxW="480px" w="90%" p="0">
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
                  {offer.title}
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
                  <Text color="#000000" fontSize="15px" lineHeight="1.6">
                    {offer.description}
                  </Text>

                  {offer.offerCode && (
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
                          {offer.offerCode}
                        </Box>
                      </HStack>
                    </Stack>
                  )}

                  {offer.expiresAt && (
                    <HStack gap="2" align="center">
                      <Text fontSize="13px" color="#9CA3AF">
                        Offer expires on{' '}
                        <Box as="span" fontWeight="600" color="#6B7280">
                          {formatExpiry(offer.expiresAt)}
                        </Box>
                      </Text>
                    </HStack>
                  )}
                </Stack>
              </Dialog.Body>

              {offer.link && (
                <Dialog.Footer px="6" pb="6" pt="2">
                  <a
                    href={offer.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="offer-claim-btn"
                  >
                    Claim Offer
                  </a>
                </Dialog.Footer>
              )}
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default OfferDetailTrigger;
