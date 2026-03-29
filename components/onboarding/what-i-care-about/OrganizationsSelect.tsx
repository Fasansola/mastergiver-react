import { OrgSearchResult } from '@/app/api/organizations/search/route';
import { useDebounce } from '@/hooks/useDebounce';
import { instance } from '@/lib/axios/axios';
import { useOnboardingStore } from '@/lib/store/onboarding.store';
import { Combobox, Portal } from '@ark-ui/react';
import {
  HStack,
  Span,
  Spinner,
  useListCollection,
  Image,
  VStack,
  Heading,
  Stack,
  Box,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

interface OrgComboboxItem {
  label: string;
  value: string;
  logo: string | null;
  location: string | null;
  ein: string | null;
  pledgeOrgId: string;
  website: string | null;
  mission: string | null;
}

async function searchOrganization(q: string): Promise<OrgSearchResult[]> {
  const { data } = await instance.get<{ results: OrgSearchResult[] }>(
    '/api/organizations/search',
    { params: { q } }
  );

  return data.results ?? [];
}

const OrganizationsSelect = () => {
  const { selectedOrgs, addOrg } = useOnboardingStore();
  const [inputValue, setInputValue] = useState('');
  const debounceQuery = useDebounce(inputValue, 400);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['org-search', debounceQuery],
    queryFn: () => searchOrganization(debounceQuery),

    // Don't fetch until user has typed at least 2 characters
    enabled: debounceQuery.trim().length >= 2,

    // Keep previous results visible while new one loads
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5, // Cache results for 5 minutes
  });

  const { collection, set } = useListCollection<OrgComboboxItem>({
    initialItems: [],
    itemToString: (item) => item.label,
    itemToValue: (item) => item.value,
  });

  // Mirror the docs pattern — sync data into collection when query returns
  useEffect(() => {
    const items: OrgComboboxItem[] = (data ?? [])
      .filter(
        (org) => !selectedOrgs.some((o) => o.pledgeOrgId === org.pledgeOrgId)
      )
      .map((org) => ({
        label: org.name,
        value: org.pledgeOrgId,
        logo: org.logo,
        location: org.location,
        ein: org.ein,
        pledgeOrgId: org.pledgeOrgId,
        website: org.website,
        mission: org.mission,
      }));

    set(items);
  }, [data]); // ← depend on data only, not filteredResults

  const handleSelect = (details: Combobox.ValueChangeDetails) => {
    const selectedId = details.value[0];
    if (!selectedId) return;

    const org = data?.find((o) => o.pledgeOrgId === selectedId);
    if (!org) return;

    addOrg(org);
  };

  return (
    <Combobox.Root
      collection={collection}
      onValueChange={handleSelect}
      onInputValueChange={(e) => setInputValue(e.inputValue)}
      value={[]}
      closeOnSelect
      multiple
      className="fullWidth"
    >
      <Combobox.Control className="fullWidth">
        <Combobox.Input
          placeholder="Find Your Charity or Cause"
          className="fullWidth inputForm"
        />
        {isLoading && <Spinner size="xs" borderWidth="1px" />}
        <Combobox.ClearTrigger />
        <Combobox.Trigger />
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content className="fullWidth max-h-100 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg z-10">
            <Stack px="8" pt="8" pb="4" gap="3">
              <Heading fontSize="20" fontWeight="600">
                Charities
              </Heading>

              {isLoading && inputValue.length >= 2 ? (
                <HStack p="3">
                  <Spinner size="xs" borderWidth="1px" />
                  <Span textStyle="sm">Searching organizations...</Span>
                </HStack>
              ) : isError ? (
                <Span p="3" color="fg.error" textStyle="sm">
                  Failed to search organizations. Try again.
                </Span>
              ) : inputValue.trim().length < 2 ? (
                <Span p="3" color="fg.error" textStyle="sm">
                  Type at least 2 characters to search
                </Span>
              ) : collection.items.length === 0 ? (
                <Combobox.Empty>No organizations found</Combobox.Empty>
              ) : (
                <Stack gap="0">
                  {collection.items.map((item) => (
                    <Combobox.Item item={item} key={item.value}>
                      <HStack
                        gap="3"
                        width="100%"
                        borderTop="1px solid"
                        borderColor="#D2D2D8"
                        p="4"
                        _hover={{ backgroundColor: '#ECEBF8' }}
                      >
                        {item.logo ? (
                          <Box backgroundColor="white" borderRadius="sm" p="2">
                            <Image
                              src={item.logo}
                              alt={item.label}
                              boxSize="16"
                              objectFit="contain"
                              borderRadius="sm"
                              flexShrink={0}
                            />
                          </Box>
                        ) : (
                          <HStack
                            boxSize="16"
                            borderRadius="sm"
                            backgroundColor="bg.subtle"
                            align="center"
                            justify="center"
                            flexShrink={0}
                          >
                            <Span textStyle="xs" color="fg.muted">
                              {item.label.charAt(0).toUpperCase()}
                            </Span>
                          </HStack>
                        )}
                        <VStack
                          align="start"
                          gap="3"
                          flex="1"
                          overflow="hidden"
                        >
                          <Span fontWeight="600" textStyle="md" truncate>
                            {item.label}
                          </Span>
                          <HStack gap="2">
                            {item.location && (
                              <Span textStyle="sm" color="fg.muted" truncate>
                                {item.location}
                              </Span>
                            )}
                            {item.ein && (
                              <Span textStyle="sm" color="fg.muted">
                                EIN: {item.ein}
                              </Span>
                            )}
                          </HStack>
                        </VStack>
                      </HStack>
                      <Combobox.ItemIndicator />
                    </Combobox.Item>
                  ))}
                </Stack>
              )}
            </Stack>
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  );
};

export default OrganizationsSelect;
