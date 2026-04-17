'use client';

/**
 * ImpactRecordPublic — public business profile section.
 *
 * Shows the last 8 impact entries grouped by year.
 * "View Full Impact Record" opens an overlay modal with the complete timeline.
 */

import { useState } from 'react';
import {
  Stack,
  Text,
  Separator,
  HStack,
  Box,
  Heading,
  Span,
} from '@chakra-ui/react';

interface ImpactEntry {
  id: string;
  title: string;
  causeName: string | null;
  organization: string | null;
  impactType: 'ONE_TIME' | 'ONGOING';
  startYear: number;
  endYear: number | null;
  isPresent: boolean;
  contributionType: string | null;
  amount: string | null;
  details: string | null;
}

interface ImpactRecordPublicProps {
  records: ImpactEntry[];
}

function formatTimeframe(r: ImpactEntry): string {
  if (r.impactType === 'ONE_TIME') return `${r.startYear}`;
  if (r.isPresent) return `${r.startYear}–Present`;
  if (r.endYear && r.endYear !== r.startYear)
    return `${r.startYear}–${r.endYear}`;
  return `${r.startYear}`;
}

function getDisplayYear(r: ImpactEntry): number {
  if (r.impactType === 'ONE_TIME') return r.startYear;
  if (r.isPresent) return new Date().getFullYear();
  return r.endYear ?? r.startYear;
}

function groupByYear(
  entries: ImpactEntry[]
): { year: number; entries: ImpactEntry[] }[] {
  const map = new Map<number, ImpactEntry[]>();
  for (const r of entries) {
    const y = getDisplayYear(r);
    if (!map.has(y)) map.set(y, []);
    map.get(y)!.push(r);
  }
  return Array.from(map.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([year, entries]) => ({ year, entries }));
}

function formatAmount(amount: string): string {
  const n = parseFloat(amount);
  if (isNaN(n)) return amount;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)
    return `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  return `$${n}`;
}

const CONTRIBUTION_LABELS: Record<string, string> = {
  DONATION: 'Donation',
  SPONSORSHIP: 'Sponsorship',
  VOLUNTEER_WORK: 'Volunteer Work',
  EVENT_PROGRAM: 'Event / Program',
  IN_KIND_SUPPORT: 'In-Kind Support',
};

const EntryItem = ({ record }: { record: ImpactEntry }) => {
  const meta = [record.causeName, record.organization]
    .filter(Boolean)
    .join(' • ');
  const contributionLabel = record.contributionType
    ? CONTRIBUTION_LABELS[record.contributionType]
    : null;
  const amountLabel = record.amount ? formatAmount(record.amount) : null;

  return (
    <Box borderLeft="3px solid #2F2B77" pl="4" py="2">
      <Stack gap="1">
        <HStack gap="2" align="center" flexWrap="wrap">
          <Text
            className="font-body"
            fontWeight="600"
            fontSize="body"
            color="text.primary"
          >
            {record.title}
          </Text>
          <Span
            className="font-body"
            fontSize="12px"
            color="#9CA3AF"
            fontWeight="400"
          >
            ({formatTimeframe(record)})
          </Span>
        </HStack>

        {meta && (
          <Text className="font-body" fontSize="small" color="text.secondary">
            {meta}
          </Text>
        )}

        {(contributionLabel || amountLabel) && (
          <HStack gap="2" flexWrap="wrap">
            {contributionLabel && (
              <Box
                px="2"
                py="0.5"
                borderRadius="4px"
                bg="white"
                border="1px solid #E0DFFF"
              >
                <Text
                  className="font-body"
                  fontSize="12px"
                  color="#2F2B77"
                  fontWeight="500"
                >
                  {contributionLabel}
                </Text>
              </Box>
            )}
            {amountLabel && (
              <Box
                px="2"
                py="0.5"
                borderRadius="4px"
                bg="white"
                border="1px solid #C6F6D5"
              >
                <Text
                  className="font-body"
                  fontSize="12px"
                  color="#276749"
                  fontWeight="600"
                >
                  {amountLabel}
                </Text>
              </Box>
            )}
          </HStack>
        )}

        {record.details && (
          <Text
            className="font-body"
            fontSize="small"
            color="text.secondary"
            fontStyle="italic"
          >
            {record.details}
          </Text>
        )}
      </Stack>
    </Box>
  );
};

const GroupedYear = ({
  year,
  entries,
}: {
  year: number;
  entries: ImpactEntry[];
}) => (
  <Stack gap="3">
    <HStack gap="3" align="center">
      <Heading
        as="h3"
        className="font-body"
        fontWeight="700"
        fontSize="subheading"
        color="#2F2B77"
      >
        {year}
      </Heading>
      <Box flex="1">
        <Separator />
      </Box>
    </HStack>
    <Stack gap="3">
      {entries.map((record) => (
        <EntryItem key={record.id} record={record} />
      ))}
    </Stack>
  </Stack>
);

const PREVIEW_LIMIT = 5;

const ImpactRecordPublic = ({ records }: ImpactRecordPublicProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  // Sort records most-recent-first for preview slicing
  const sorted = [...records].sort(
    (a, b) => getDisplayYear(b) - getDisplayYear(a)
  );
  const preview = sorted.slice(0, PREVIEW_LIMIT);
  const hasMore = records.length > PREVIEW_LIMIT;
  const previewGrouped = groupByYear(preview);
  const fullGrouped = groupByYear(records);

  return (
    <>
      <Stack gap="8" w="100%">
        {/* Preview entries */}
        <Stack gap="8">
          {previewGrouped.map(({ year, entries }) => (
            <GroupedYear key={year} year={year} entries={entries} />
          ))}
        </Stack>

        {/* View full button */}
        {hasMore && (
          <HStack justify="center">
            <Box
              as="button"
              type="button"
              onClick={() => setModalOpen(true)}
              px="7"
              py="3"
              borderRadius="8px"
              border="2px solid #2F2B77"
              bg="white"
              color="#2F2B77"
              fontWeight="700"
              fontSize="15px"
              cursor="pointer"
              className="font-body"
              _hover={{ bg: '#F0EFFF' }}
              transition="background 0.15s"
            >
              View Full Impact Record
            </Box>
          </HStack>
        )}
      </Stack>

      {/* Full timeline modal */}
      {modalOpen && (
        <Box
          position="fixed"
          inset="0"
          zIndex="1000"
          bg="rgba(0,0,0,0.5)"
          display="flex"
          alignItems="flex-start"
          justifyContent="center"
          p={{ base: '4', md: '10' }}
          overflowY="auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <Box
            bg="white"
            borderRadius="16px"
            w="100%"
            maxW="640px"
            overflow="hidden"
            boxShadow="0px 20px 60px rgba(0,0,0,0.2)"
          >
            {/* Modal header bar */}
            <Box bg="#2F2B77" px="6" py="4">
              <HStack justify="space-between" align="center">
                <Heading
                  as="h2"
                  className="font-body"
                  fontWeight="700"
                  fontSize="20px"
                  color="white"
                >
                  Full Impact Record
                </Heading>
                <Box
                  as="button"
                  type="button"
                  onClick={() => setModalOpen(false)}
                  bg="transparent"
                  border="none"
                  fontSize="24px"
                  cursor="pointer"
                  color="whiteAlpha.800"
                  lineHeight="1"
                  aria-label="Close"
                  _hover={{ color: 'white' }}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  w="8"
                  h="8"
                  borderRadius="4px"
                >
                  ×
                </Box>
              </HStack>
            </Box>

            {/* Modal body */}
            <Stack gap="8" p={{ base: '5', md: '8' }}>
              <Text
                className="font-body"
                fontSize="small"
                color="text.secondary"
              >
                A continuously updated record of this business&apos;s community
                impact.
              </Text>

              {/* All entries */}
              <Stack gap="8">
                {fullGrouped.map(({ year, entries }) => (
                  <GroupedYear key={year} year={year} entries={entries} />
                ))}
              </Stack>
            </Stack>
          </Box>
        </Box>
      )}
    </>
  );
};

export default ImpactRecordPublic;
