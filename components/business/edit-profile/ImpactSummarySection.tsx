'use client';

/**
 * Section 2 — Impact Summary
 *
 * Fields: Years of Community Involvement, Total Contributions ($), Volunteer Hours.
 * Any one field being populated marks this section as complete.
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  impactSummarySchema,
  type ImpactSummaryInput,
} from '@/lib/validations/business-profile.schema';
import { saveImpactSummaryAction } from '@/lib/actions/business-profile.actions';
import {
  inputStyle,
  labelStyle,
  errorTextStyle,
  primaryButtonStyle,
} from '@/components/business/shared/styles';
import { HStack, Stack, Text, Input, InputGroup } from '@chakra-ui/react';

interface ImpactSummarySectionProps {
  onSave: () => void;
  defaultValues: ImpactSummaryInput;
}

const ImpactSummarySection = ({
  onSave,
  defaultValues,
}: ImpactSummarySectionProps) => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ImpactSummaryInput>({
    resolver: zodResolver(impactSummarySchema),
    defaultValues,
  });

  const mutation = useMutation({
    mutationFn: (data: ImpactSummaryInput) => saveImpactSummaryAction(data),
    onSuccess: (result) => {
      if (!result.success) {
        setServerError(result.error);
        return;
      }
      router.refresh();
      onSave();
    },
  });

  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))} noValidate>
      <Stack gap="5">
        {serverError && (
          <Text style={{ color: '#C53030', fontSize: '14px' }}>
            {serverError}
          </Text>
        )}

        <Stack gap="1">
          <label style={labelStyle} htmlFor="yearsOfInvolvement">
            Years of Community Involvement
          </label>
          <input
            id="yearsOfInvolvement"
            type="number"
            min={0}
            {...register('yearsOfInvolvement', { valueAsNumber: true })}
            style={inputStyle}
            placeholder="e.g. 10"
          />
          {errors.yearsOfInvolvement && (
            <Text style={errorTextStyle}>
              {errors.yearsOfInvolvement.message}
            </Text>
          )}
        </Stack>

        <Stack gap="1">
          <label style={labelStyle} htmlFor="totalContributions">
            Community Contributions ($)
          </label>
          <InputGroup startElement="$" endElement="USD">
            <Input
              id="totalContributions"
              type="number"
              min={0}
              step="0.01"
              {...register('totalContributions', { valueAsNumber: true })}
              style={inputStyle}
              placeholder="e.g. 50000"
              pr="12!"
              pl="8!"
            />
          </InputGroup>
          {errors.totalContributions && (
            <Text style={errorTextStyle}>
              {errors.totalContributions.message}
            </Text>
          )}
        </Stack>

        <Stack gap="1">
          <label style={labelStyle} htmlFor="activePartners">
            Volunteer Hours
          </label>
          <input
            id="activePartners"
            type="number"
            min={0}
            {...register('activePartners', { valueAsNumber: true })}
            style={inputStyle}
            placeholder="e.g. 500"
          />
          {errors.activePartners && (
            <Text style={errorTextStyle}>{errors.activePartners.message}</Text>
          )}
        </Stack>

        <HStack align="center" justify={{ base: '', md: 'end' }} gap="6" flexWrap="wrap">
          <button
            type="submit"
            disabled={mutation.isPending}
            style={primaryButtonStyle(mutation.isPending, false)}
          >
            {mutation.isPending ? 'Saving…' : 'Save Section'}
          </button>
        </HStack>
      </Stack>
    </form>
  );
};

export default ImpactSummarySection;
