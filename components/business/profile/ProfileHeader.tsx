/**
 * ProfileHeader — public business profile.
 *
 * Renders the top section of the profile:
 *   - Full-width cover photo (or a solid-colour banner when none is set)
 *   - Logo overlaid at the bottom-left of the cover (or initials avatar)
 *   - Company name + tagline below the cover
 *
 * This is a purely presentational Server Component — all data is passed
 * as props from the page.
 */

import { Box, Button, Heading, Image, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';

interface ProfileHeaderProps {
  companyName: string;
  tagline: string | null;
  logo: string | null;
  companyAddress?: string | null;
  aboutUs?: string;
  website?: string;
}

/** Returns the first letter of each word (up to 2) for an initials avatar. */
function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

/** Escape HTML special characters then convert newlines to <br /> tags. */
function toBrHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\r\n/g, '\n')
    .replace(/\n/g, '<br />');
}

const ProfileHeader = ({
  companyName,
  tagline,
  logo,
  companyAddress,
  aboutUs,
  website,
}: ProfileHeaderProps) => {
  return (
    <Stack
      w={{ base: 'full', lg: '440px' }}
      minW={{ base: 'auto', lg: '440px' }}
      bgColor="white"
      py={{ base: '6', lg: '10' }}
      px={{ base: '5', lg: '8' }}
      gap="8"
      border="0.5px solid #DCDFE3"
      borderRadius="20px"
      boxShadow="0px 1px 2px 0px #4646490F, 0px 1px 3px 0px #4646490A"
      mt={{ base: '0', lg: '-32' }}
      pos={{ base: 'static', lg: 'sticky' }}
      top="140px"
    >
      {/* Cover photo / banner */}
      <Stack align="center" gap={{ base: '6', lg: '10' }}>
        <Box
          boxShadow="0px 1.52px 3.03px 0px #46464914, 0px 1.52px 4.55px 0px #46464914"
          border="solid 12px white"
          borderRadius="full"
          w={{ base: '200px', md: '260px', lg: '324px' }}
          h={{ base: '200px', md: '260px', lg: '324px' }}
        >
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <Image
              src={logo}
              alt={companyName}
              objectFit="contain"
              borderRadius="full"
              width={{ base: '176px', md: '236px', lg: '300px' }}
              height={{ base: '176px', md: '236px', lg: '300px' }}
              border=""
              boxShadow="0px -1.52px 3.03px 0px #46464914, 0px -1.52px 4.55px 0px #46464914"
            />
          ) : (
            <span style={{ color: '#000', fontWeight: 700, fontSize: '22px' }}>
              {getInitials(companyName)}
            </span>
          )}
        </Box>

        <Stack>
          <Heading
            className="font-display"
            fontWeight="700"
            fontSize={{ base: '28px', md: '34px', lg: '40px' }}
            color="text.businessH"
            textAlign="center"
            lineHeight="120%"
          >
            {companyName}
          </Heading>
          {companyAddress && (
            <Text className="font-body" color="text.primary" textAlign="center">
              {companyAddress}
            </Text>
          )}
        </Stack>
      </Stack>

      {/* About Us + tagline */}
      <Stack gap="10">
        {aboutUs && (
          <p
            dangerouslySetInnerHTML={{ __html: toBrHtml(aboutUs) }}
            style={{
              fontSize: '16px',
              lineHeight: '160%',
              color: '#212325',
              marginBottom: tagline ? '12px' : 0,
            }}
          />
        )}

        <Link href={website || '/'} className="fullWidth" target="_blank">
          <Button
            width="100%"
            bgColor="#1F2937"
            borderRadius="8px"
            className="font-body"
            fontWeight="700"
          >
            Visit Website
          </Button>
        </Link>
      </Stack>
    </Stack>
  );
};

export default ProfileHeader;
