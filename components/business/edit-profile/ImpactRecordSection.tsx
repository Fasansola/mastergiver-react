'use client';

/**
 * Section 8 — Impact Record (multi-entry)
 *
 * A repeatable log of individual community impact actions over time.
 * Entries are grouped by year (descending) in the display list.
 * Each entry saves immediately on "Save Entry" — no "Save Section" button.
 */

import { useState } from 'react';
import type { CSSProperties } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  impactRecordSchema,
  type ImpactRecordInput,
} from '@/lib/validations/business-profile.schema';
import {
  createImpactRecordAction,
  updateImpactRecordAction,
  deleteImpactRecordAction,
} from '@/lib/actions/business-profile.actions';
import {
  inputStyle,
  labelStyle,
  errorTextStyle,
  editProfileBTNStyle,
} from '@/components/business/shared/styles';
import {
  Box,
  Heading,
  HStack,
  Separator,
  Span,
  Stack,
  Text,
} from '@chakra-ui/react';

interface Cause {
  id: string;
  name: string;
  color: string;
}

interface ImpactRecord {
  id: string;
  title: string;
  causeId: string | null;
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

interface ImpactRecordSectionProps {
  allCauses: Cause[];
  initialRecords: ImpactRecord[];
}

const CONTRIBUTION_TYPES = [
  { value: 'DONATION', label: 'Donation' },
  { value: 'SPONSORSHIP', label: 'Sponsorship' },
  { value: 'VOLUNTEER_WORK', label: 'Volunteer Work' },
  { value: 'EVENT_PROGRAM', label: 'Event / Program' },
  { value: 'IN_KIND_SUPPORT', label: 'In-Kind Support' },
];

function formatTimeframe(r: ImpactRecord): string {
  if (r.impactType === 'ONE_TIME') return `${r.startYear}`;
  if (r.isPresent) return `${r.startYear}–Present`;
  if (r.endYear && r.endYear !== r.startYear)
    return `${r.startYear}–${r.endYear}`;
  return `${r.startYear}`;
}

function getDisplayYear(r: ImpactRecord): number {
  if (r.impactType === 'ONE_TIME') return r.startYear;
  if (r.isPresent) return new Date().getFullYear();
  return r.endYear ?? r.startYear;
}

function groupByYear(
  records: ImpactRecord[]
): { year: number; entries: ImpactRecord[] }[] {
  const map = new Map<number, ImpactRecord[]>();
  for (const r of records) {
    const y = getDisplayYear(r);
    if (!map.has(y)) map.set(y, []);
    map.get(y)!.push(r);
  }
  return Array.from(map.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([year, entries]) => ({ year, entries }));
}

// Local input style override for this form — white bg + more visible border
const fieldStyle: CSSProperties = {
  ...inputStyle,
  background: '#FFFFFF',
  border: '1.5px solid #D1D5DB',
};

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from(
  { length: currentYear - 1990 + 1 },
  (_, i) => currentYear - i
);

const defaultValues: ImpactRecordInput = {
  title: '',
  causeId: '',
  organization: null,
  impactType: 'ONE_TIME',
  startYear: currentYear,
  endYear: null,
  isPresent: false,
  contributionType: null,
  amount: null,
  details: null,
};

const ImpactRecordSection = ({
  allCauses,
  initialRecords,
}: ImpactRecordSectionProps) => {
  const router = useRouter();
  const [records, setRecords] = useState<ImpactRecord[]>(initialRecords);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<ImpactRecordInput>({
    resolver: zodResolver(impactRecordSchema),
    defaultValues,
  });

  const impactType = form.watch('impactType');
  const isPresent = form.watch('isPresent');

  const createMutation = useMutation({
    mutationFn: (data: ImpactRecordInput) => createImpactRecordAction(data),
    onSuccess: (result, data) => {
      if (!result.success) {
        setServerError(result.error);
        return;
      }
      // Update local state immediately so the new entry appears without needing
      // to close/reopen the accordion
      const causeName =
        allCauses.find((c) => c.id === data.causeId)?.name ?? null;
      setRecords((prev) => [
        {
          id: result.id,
          title: data.title,
          causeId: data.causeId || null,
          causeName,
          organization: data.organization ?? null,
          impactType: data.impactType,
          startYear: data.startYear,
          endYear: data.endYear ?? null,
          isPresent: data.isPresent,
          contributionType: data.contributionType ?? null,
          amount: data.amount?.toString() ?? null,
          details: data.details ?? null,
        },
        ...prev,
      ]);
      router.refresh();
      form.reset(defaultValues);
      setShowForm(false);
      setServerError(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ImpactRecordInput }) =>
      updateImpactRecordAction(id, data),
    onSuccess: (result, { id, data }) => {
      if (!result.success) {
        setServerError(result.error);
        return;
      }
      // Update local state immediately so edits reflect without accordion toggle
      const causeName =
        allCauses.find((c) => c.id === data.causeId)?.name ?? null;
      setRecords((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                title: data.title,
                causeId: data.causeId || null,
                causeName,
                organization: data.organization ?? null,
                impactType: data.impactType,
                startYear: data.startYear,
                endYear: data.endYear ?? null,
                isPresent: data.isPresent,
                contributionType: data.contributionType ?? null,
                amount: data.amount?.toString() ?? null,
                details: data.details ?? null,
              }
            : r
        )
      );
      router.refresh();
      form.reset(defaultValues);
      setEditingId(null);
      setShowForm(false);
      setServerError(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteImpactRecordAction(id),
    onSuccess: (result, id) => {
      if (!result.success) return;
      setRecords((prev) => prev.filter((r) => r.id !== id));
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    setServerError(null);
    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
  });

  const startEdit = (record: ImpactRecord) => {
    setEditingId(record.id);
    setShowForm(true);
    form.reset({
      title: record.title,
      causeId: record.causeId ?? '',
      organization: record.organization,
      impactType: record.impactType,
      startYear: record.startYear,
      endYear: record.endYear,
      isPresent: record.isPresent,
      contributionType:
        (record.contributionType as ImpactRecordInput['contributionType']) ??
        null,
      amount: record.amount ? parseFloat(record.amount) : null,
      details: record.details,
    });
  };

  const cancelForm = () => {
    setEditingId(null);
    setShowForm(false);
    setServerError(null);
    form.reset(defaultValues);
  };

  const grouped = groupByYear(records);
  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Stack gap="6">
      {/* Builder tip */}
      <Box
        bg="#F0EFF9"
        border="1px solid"
        borderColor="#D4D1FF"
        borderRadius="6px"
        px="4"
        py="3"
      >
        <Text fontSize="small" color="brand.primary" fontWeight="500">
          A longer history of community impact builds a stronger, more credible
          profile.
        </Text>
      </Box>

      {/* Entry list grouped by year */}
      {records.length === 0 ? (
        <Box
          bg="background.page"
          border="1px dashed"
          borderColor="border.default"
          borderRadius="8px"
          px="5"
          py="6"
          textAlign="center"
        >
          <Text fontSize="small" color="text.secondary">
            No entries yet. Tip: You can add impact from past years at any time.
          </Text>
        </Box>
      ) : (
        <Stack gap="8">
          {grouped.map(({ year, entries }) => (
            <Stack key={year} gap="3">
              <HStack gap="3" align="center">
                <Heading
                  className="font-display"
                  fontSize="subheading"
                  fontWeight="700"
                  color="brand.primary"
                >
                  {year}
                </Heading>
                <Separator flex="1" />
              </HStack>
              <Stack gap="3">
                {entries.map((record) => (
                  <Box
                    key={record.id}
                    bg="white"
                    border="0.5px solid"
                    borderColor="border.accentBorder"
                    borderLeft="4px solid"
                    borderLeftColor="brand.primary"
                    borderRadius="6px"
                    px="4"
                    py="3"
                  >
                    <Stack gap="2">
                      <Text
                        fontWeight="600"
                        fontSize="body"
                        color="text.primary"
                      >
                        {record.title}
                      </Text>
                      <HStack gap="2" flexWrap="wrap">
                        {record.causeName && (
                          <Box
                            px="2"
                            py="0.5"
                            bg="#EDE9FA"
                            borderRadius="999px"
                            display="inline-flex"
                          >
                            <Text
                              fontSize="12px"
                              color="brand.primary"
                              fontWeight="600"
                            >
                              {record.causeName}
                            </Text>
                          </Box>
                        )}
                        {record.organization && (
                          <Text fontSize="small" color="text.secondary">
                            {record.organization}
                          </Text>
                        )}
                        <Text fontSize="12px" color="text.secondary">
                          <Span color="text.secondary">
                            ({formatTimeframe(record)})
                          </Span>
                        </Text>
                      </HStack>
                      <HStack gap="4" mt="1">
                        <Box
                          as="button"
                          type="button"
                          v
                          onClick={() => startEdit(record)}
                          style={{ ...editProfileBTNStyle, fontSize: '13px' }}
                        >
                          Edit
                        </Box>
                        <Separator orientation="vertical" height="4" />
                        <Box
                          as="button"
                          type="button"
                          onClick={() => {
                            if (window.confirm('Delete this entry?'))
                              deleteMutation.mutate(record.id);
                          }}
                          style={{
                            ...editProfileBTNStyle,
                            fontSize: '13px',
                            color: '#C53030',
                          }}
                        >
                          {deleteMutation.isPending ? '…' : 'Delete'}
                        </Box>
                      </HStack>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Stack>
          ))}
        </Stack>
      )}

      {/* Add / Edit form */}
      {!showForm ? (
        <Stack gap="2">
          <Box
            as="button"
            type="button"
            onClick={() => setShowForm(true)}
            style={editProfileBTNStyle}
          >
            + Add Impact Entry
          </Box>
          <Text fontSize="12px" color="text.secondary">
            Start with recent impact and also go back and add past years to
            strengthen your record.
          </Text>
        </Stack>
      ) : (
        <Box
          as="form"
          onSubmit={onSubmit}
          border="1px solid"
          borderColor="border.accentBorder"
          borderRadius="10px"
          bg="background.page"
          overflow="hidden"
        >
          {/* Form header */}
          <Box bg="brand.primary" px="5" py="3">
            <Heading
              className="font-body"
              fontSize="small"
              fontWeight="700"
              color="text.white"
            >
              {editingId ? 'Edit Impact Entry' : 'New Impact Entry'}
            </Heading>
          </Box>

          <Stack gap="5" p={{ base: '4', md: '6' }}>
            {/* Title */}
            <Stack gap="1">
              <label style={labelStyle}>What did you do? *</label>
              <input
                {...form.register('title')}
                placeholder="e.g. Sponsored Youth Soccer Team"
                style={fieldStyle}
              />
              {form.formState.errors.title && (
                <Text style={errorTextStyle}>
                  {form.formState.errors.title.message}
                </Text>
              )}
            </Stack>

            {/* Area of Impact */}
            <Stack gap="2">
              <label style={labelStyle}>Area of Impact *</label>
              <Controller
                control={form.control}
                name="causeId"
                render={({ field }) => (
                  <HStack flexWrap="wrap" gap="2">
                    {allCauses.map((cause) => {
                      const selected = field.value === cause.id;
                      return (
                        <Box
                          as="button"
                          key={cause.id}
                          type="button"
                          onClick={() => field.onChange(cause.id)}
                          px="3"
                          py="1.5"
                          borderRadius="999px"
                          border="2px solid"
                          borderColor={
                            selected ? 'brand.primary' : 'border.default'
                          }
                          bg={selected ? 'brand.primary' : 'white'}
                          color={selected ? 'text.white' : 'text.primary'}
                          fontSize="13px"
                          fontWeight={selected ? '700' : '400'}
                          cursor="pointer"
                          transition="all 0.15s"
                        >
                          {cause.name}
                        </Box>
                      );
                    })}
                  </HStack>
                )}
              />
              {form.formState.errors.causeId && (
                <Text style={errorTextStyle}>
                  {form.formState.errors.causeId.message}
                </Text>
              )}
            </Stack>

            {/* Organization */}
            <Stack gap="1">
              <label style={labelStyle}>Organization (optional)</label>
              <input
                {...form.register('organization')}
                placeholder="Who did you support or partner with?"
                style={fieldStyle}
              />
            </Stack>

            {/* Impact Type */}
            <Stack gap="2">
              <label style={labelStyle}>Type of Impact *</label>
              <HStack gap="6">
                {(['ONE_TIME', 'ONGOING'] as const).map((type) => (
                  <Box
                    as="label"
                    key={type}
                    display="flex"
                    alignItems="center"
                    gap="2"
                    cursor="pointer"
                    fontSize="small"
                    color="text.primary"
                  >
                    <input
                      type="radio"
                      value={type}
                      {...form.register('impactType')}
                    />
                    {type === 'ONE_TIME' ? 'One-time' : 'Ongoing'}
                  </Box>
                ))}
              </HStack>
            </Stack>

            {/* Timeframe */}
            <HStack gap="4" align="flex-start" flexWrap="wrap">
              <Stack gap="1" flex="1" minW="140px">
                <label style={labelStyle}>
                  {impactType === 'ONE_TIME' ? 'Year *' : 'Start Year *'}
                </label>
                <Controller
                  control={form.control}
                  name="startYear"
                  render={({ field }) => (
                    <select
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      style={fieldStyle}
                    >
                      {YEAR_OPTIONS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {form.formState.errors.startYear && (
                  <Text style={errorTextStyle}>
                    {form.formState.errors.startYear.message}
                  </Text>
                )}
              </Stack>

              {impactType === 'ONGOING' && !isPresent && (
                <Stack gap="1" flex="1" minW="140px">
                  <label style={labelStyle}>End Year</label>
                  <Controller
                    control={form.control}
                    name="endYear"
                    render={({ field }) => (
                      <select
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : null
                          )
                        }
                        style={fieldStyle}
                      >
                        <option value="">Select year</option>
                        {YEAR_OPTIONS.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                </Stack>
              )}
            </HStack>

            {impactType === 'ONGOING' && (
              <Box
                as="label"
                display="flex"
                alignItems="center"
                gap="2"
                cursor="pointer"
                fontSize="small"
                color="text.primary"
                mt="-2"
              >
                <Controller
                  control={form.control}
                  name="isPresent"
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.checked);
                        if (e.target.checked) form.setValue('endYear', null);
                      }}
                    />
                  )}
                />
                Present (still ongoing)
              </Box>
            )}

            {/* Contribution Type + Amount side by side */}
            <HStack gap="4" align="flex-start" flexWrap="wrap">
              <Stack gap="1" flex="1" minW="180px">
                <label style={labelStyle}>
                  Type of Contribution (optional)
                </label>
                <Controller
                  control={form.control}
                  name="contributionType"
                  render={({ field }) => (
                    <select
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      style={fieldStyle}
                    >
                      <option value="">Select type</option>
                      {CONTRIBUTION_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </Stack>

              <Stack gap="1" flex="1" minW="140px">
                <label style={labelStyle}>Amount (optional)</label>
                <Controller
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="$0.00"
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseFloat(e.target.value) : null
                        )
                      }
                      style={fieldStyle}
                    />
                  )}
                />
              </Stack>
            </HStack>

            {/* Details */}
            <Stack gap="1">
              <label style={labelStyle}>Details (optional)</label>
              <textarea
                {...form.register('details')}
                placeholder="Context, scope, or outcome..."
                rows={3}
                style={{
                  ...fieldStyle,
                  height: 'auto',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                }}
              />
              {form.formState.errors.details && (
                <Text style={errorTextStyle}>
                  {form.formState.errors.details.message}
                </Text>
              )}
            </Stack>

            {serverError && (
              <Box
                bg="#FFF5F5"
                border="1px solid"
                borderColor="border.error"
                borderRadius="6px"
                px="4"
                py="3"
              >
                <Text fontSize="small" color="text.error">
                  {serverError}
                </Text>
              </Box>
            )}

            <HStack gap="5" pt="1">
              <Box
                as="button"
                type="submit"
                disabled={isPending}
                style={editProfileBTNStyle}
              >
                {isPending ? 'Saving…' : 'Save Entry'}
              </Box>
              <Box
                as="button"
                type="button"
                onClick={cancelForm}
                style={{ ...editProfileBTNStyle, color: '#9CA3AF' }}
              >
                Cancel
              </Box>
            </HStack>
          </Stack>
        </Box>
      )}
    </Stack>
  );
};

export default ImpactRecordSection;
