'use client';

import { HStack, Span, IconButton, Image, Box } from '@chakra-ui/react';
import { X } from 'lucide-react';
import { useOnboardingStore, type OrgItem } from '@/lib/store/onboarding.store';

interface OrgCardProps {
  org: OrgItem;
}

export function OrgCard({ org }: OrgCardProps) {
  const { removeOrg } = useOnboardingStore();

  return (
    <HStack
      gap="3"
      px="3"
      py="2"
      borderRadius="md"
      borderWidth="1px"
      justify="space-between"
    >
      <HStack gap="3">
        {org.logo ? (
          <Image
            src={org.logo}
            alt={org.name}
            boxSize="6"
            objectFit="contain"
            borderRadius="sm"
            flexShrink={0}
            width="48px"
            height="48px"
          />
        ) : (
          <Box
            boxSize="6"
            borderRadius="sm"
            backgroundColor="bg.subtle"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
          >
            <Span textStyle="xs" color="fg.muted">
              {org.name.charAt(0).toUpperCase()}
            </Span>
          </Box>
        )}
        <Span textStyle="sm" fontWeight="medium">
          {org.name}
        </Span>
      </HStack>

      <IconButton
        aria-label={`Remove ${org.name}`}
        variant="ghost"
        size="xs"
        onClick={() => removeOrg(org.pledgeOrgId)}
      >
        <X size={12} />
      </IconButton>
    </HStack>
  );
}
