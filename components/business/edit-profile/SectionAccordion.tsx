'use client';

/**
 * Accordion wrapper for a single edit-profile section.
 *
 * Renders a clickable header (number + title + completion dot + chevron)
 * and the collapsible body. The parent (EditProfileClient) controls which
 * section is open via the isOpen / onOpen props.
 */

import type { PropsWithChildren } from 'react';
import open from '@/public/business-assets/Add.svg';
import close from '@/public/business-assets/Close.svg';
import { Heading, HStack, Stack, Text } from '@chakra-ui/react';
import isCompleted from '@/public/business-assets/isCompleted.svg';
import notCompleted from '@/public/business-assets/notCompleted.svg';

import Image from 'next/image';

interface SectionAccordionProps extends PropsWithChildren {
  /** 1-based section number displayed as "01", "02", etc. */
  number: number;
  title: string;
  isComplete: boolean;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const SectionAccordion = ({
  number,
  title,
  isComplete,
  isOpen,
  onOpen,
  onClose,
  children,
}: SectionAccordionProps) => {
  const handleHeaderClick = () => (isOpen ? onClose() : onOpen());
  const label = String(number).padStart(2, '0');

  return (
    <Stack
      bgColor="white"
      borderRadius="8px"
      border="1px solid #E5E7EB"
      gap="0"
    >
      {/* HEADER — always visible */}
      <HStack
        onClick={handleHeaderClick}
        p={{ base: '4', md: '5' }}
        width="100%"
        cursor="pointer"
        justify="space-between"
      >
        <HStack>
          {/* Section number */}
          <Text
            display={{ base: 'none', md: 'block' }}
            style={{
              fontWeight: 700,
              paddingTop: '2px',
              fontSize: '12px',
              letterSpacing: '1.16px',
              color: '#9CA3AF',
              minWidth: '24px',
            }}
          >
            {label}
          </Text>

          {/* Section title */}
          <Heading
            className="font-display"
            fontWeight="700"
            fontSize={{ base: '18px', md: '20px' }}
            color={isOpen ? 'brand.primary' : 'text.primary'}
          >
            {title}
          </Heading>
        </HStack>

        <HStack>
          {isOpen ? (
            <Image src={close} alt="Close section" width="24" height="24" />
          ) : isComplete ? (
            <HStack>
              <Image src={open} alt="Open section" width="24" height="24" />
              <Image
                src={isCompleted}
                alt="Section completed"
                width="24"
                height="24"
              />
            </HStack>
          ) : (
            <HStack>
              <Image src={open} alt="Open section" width="24" height="24" />
              <Image
                src={notCompleted}
                alt="Section not completed"
                width="24"
                height="24"
              />
            </HStack>
          )}
        </HStack>
      </HStack>

      {/* BODY — only rendered when open */}
      {isOpen && (
        <Stack
          borderTop="1px solid #F3F4F6"
          p={{ base: '6', md: '10' }}
          gap={{ base: '6', md: '10' }}
        >
          {children}
        </Stack>
      )}
    </Stack>
  );
};

export default SectionAccordion;
