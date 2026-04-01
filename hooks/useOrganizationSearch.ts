'use client';

import { useDebounce } from './useDebounce';
import { instance } from '@/lib/api/axios';
import { useListCollection } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import type { OrgSearchResult } from '@/app/api/organizations/search/route';

export interface OrgComboboxItem {
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

interface UseOrganizationSearchProps {
  selectedOrgs: Array<{ pledgeOrgId: string }>;
}

export function useOrganizationSearch({ selectedOrgs }: UseOrganizationSearchProps) {
  const [inputValue, setInputValue] = useState('');
  const debounceQuery = useDebounce(inputValue, 400);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['org-search', debounceQuery],
    queryFn: () => searchOrganization(debounceQuery),
    enabled: debounceQuery.trim().length >= 2,
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  });

  const { collection, set } = useListCollection<OrgComboboxItem>({
    initialItems: [],
    itemToString: (item) => item.label,
    itemToValue: (item) => item.value,
  });

  useEffect(() => {
    const items: OrgComboboxItem[] = (data ?? [])
      .filter((org) => !selectedOrgs.some((o) => o.pledgeOrgId === org.pledgeOrgId))
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
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  return { inputValue, setInputValue, isLoading, isError, data, collection };
}
