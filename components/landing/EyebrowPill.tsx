'use client';

/**
 * EyebrowPill — small labelled badge used above section headings.
 *
 * Consists of a 24×24 icon + uppercase label text inside a pill-shaped
 * container. Two visual variants:
 *
 *   "light"  — light-purple fill, brand.lightPrimary border, used on
 *              light/gradient backgrounds (default)
 *   "dark"   — transparent fill, white border, used on brand.primary
 *              dark backgrounds
 *
 * Usage:
 *   <EyebrowPill icon={badgeIcon} label="INTRODUCING VERIFIED COMMUNITY IMPACT" />
 *   <EyebrowPill icon={footerIcon} label="YOUR COMPETITORS ARE COLLECTING REVIEWS" variant="dark" />
 */

import { HStack, Text } from '@chakra-ui/react';
import Image, { type StaticImageData } from 'next/image';

interface EyebrowPillProps {
  icon: StaticImageData;
  label: string;
  variant?: 'light' | 'dark';
}

const variantStyles = {
  light: {
    bgColor: 'background.lightPurple',
    border: '1px solid',
    borderColor: 'brand.lightPrimary',
    textColor: 'brand.primary',
  },
  dark: {
    bgColor: undefined,
    border: '0.5px solid',
    borderColor: 'background.white',
    textColor: 'text.white',
  },
} as const;

const EyebrowPill = ({ icon, label, variant = 'light' }: EyebrowPillProps) => {
  const styles = variantStyles[variant];

  return (
    <HStack
      gap="2"
      align="center"
      width="fit-content"
      py="10px"
      px="4"
      border={styles.border}
      borderColor={styles.borderColor}
      borderRadius="12px"
      bgColor={styles.bgColor}
    >
      <Image alt="" src={icon} width={24} height={24} />
      <Text
        className="font-body"
        color={styles.textColor}
        fontSize={{ base: '12px', md: 'subheading' }}
        fontWeight="bold"
        lineHeight="170%"
      >
        {label}
      </Text>
    </HStack>
  );
};

export default EyebrowPill;
