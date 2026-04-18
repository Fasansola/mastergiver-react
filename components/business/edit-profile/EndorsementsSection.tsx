'use client';

/**
 * Section 6 — Community Endorsements (multi-entry)
 *
 * Fields per entry: Endorsing Org, Endorser Name (optional), Statement.
 * No image upload in this section.
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  endorsementSchema,
  type EndorsementInput,
} from '@/lib/validations/business-profile.schema';
import {
  createEndorsementAction,
  updateEndorsementAction,
  deleteEndorsementAction,
} from '@/lib/actions/business-profile.actions';
import MultiEntryCard from './MultiEntryCard';
import {
  inputStyle,
  labelStyle,
  errorTextStyle,
  editProfileBTNStyle,
  primaryButtonStyle,
} from '@/components/business/shared/styles';
import { HStack, Stack, Text } from '@chakra-ui/react';
import Add from '@/public/business-assets/GreyAdd.svg';
import Image from 'next/image';

interface Endorsement {
  id: string;
  endorsingOrg: string;
  endorserName: string | null;
  endorsementStatement: string;
}

interface EndorsementsSectionProps {
  onSave: () => void;
  initialEndorsements: Endorsement[];
}

const blank: EndorsementInput = {
  endorsingOrg: '',
  endorserName: '',
  endorsementStatement: '',
};

const EndorsementsSection = ({
  onSave,
  initialEndorsements,
}: EndorsementsSectionProps) => {
  const router = useRouter();
  const [endorsements, setEndorsements] =
    useState<Endorsement[]>(initialEndorsements);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EndorsementInput>({
    resolver: zodResolver(endorsementSchema),
    defaultValues: blank,
  });

  const saveMutation = useMutation({
    mutationFn: async (data: EndorsementInput) =>
      editingId
        ? updateEndorsementAction(editingId, data)
        : createEndorsementAction(data),
    onSuccess: (result, data) => {
      if (!result.success) {
        setServerError(result.error);
        return;
      }
      if (editingId) {
        setEndorsements((prev) =>
          prev.map((e) =>
            e.id === editingId
              ? { ...e, ...data, endorserName: data.endorserName || null }
              : e
          )
        );
        setEditingId(null);
      } else if ('id' in result) {
        setEndorsements((prev) => [
          ...prev,
          {
            id: result.id as string,
            endorsingOrg: data.endorsingOrg,
            endorserName: data.endorserName || null,
            endorsementStatement: data.endorsementStatement,
          },
        ]);
      }
      reset(blank);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteEndorsementAction(id),
    onSuccess: (result, id) => {
      if (result.success) {
        setEndorsements((prev) => prev.filter((e) => e.id !== id));
        setDeletingId(null);
      }
    },
  });

  const handleAddAnother = handleSubmit((data) => {
    setServerError(null);
    saveMutation.mutate(data);
  });

  const handleSaveSection = handleSubmit((data) => {
    setServerError(null);
    saveMutation.mutate(data, {
      onSuccess: (result) => {
        if (result.success) {
          router.refresh();
          onSave();
        }
      },
    });
  });

  return (
    <Stack gap="4">
      {endorsements.map((e) => (
        <MultiEntryCard
          key={e.id}
          title={e.endorsingOrg}
          description={e.endorsementStatement}
          onEdit={() => {
            setEditingId(e.id);
            reset({
              endorsingOrg: e.endorsingOrg,
              endorserName: e.endorserName ?? '',
              endorsementStatement: e.endorsementStatement,
            });
          }}
          onDelete={() => {
            setDeletingId(e.id);
            deleteMutation.mutate(e.id);
          }}
          isDeleting={deletingId === e.id}
        />
      ))}

      {serverError && (
        <Text style={{ color: '#C53030', fontSize: '14px' }}>
          {serverError}
        </Text>
      )}

      <Stack gap="4">
        <Stack gap="1">
          <label style={labelStyle} htmlFor="endorsingOrg">
            Endorsing Organization or Program *
          </label>
          <input
            id="endorsingOrg"
            {...register('endorsingOrg')}
            style={inputStyle}
            placeholder="e.g., Cape Fear Food Bank, Boys & Girls Club of XYZ ..."
          />
          {errors.endorsingOrg && (
            <Text style={errorTextStyle}>{errors.endorsingOrg.message}</Text>
          )}
        </Stack>

        <Stack gap="1">
          <label style={labelStyle} htmlFor="endorserName">
            Endorser Name (optional)
          </label>
          <input
            id="endorserName"
            {...register('endorserName')}
            style={inputStyle}
            placeholder="Jane Smith, Director"
          />
        </Stack>

        <Stack gap="1">
          <label style={labelStyle} htmlFor="endorsementStatement">
            Endorsement Statement *
          </label>
          <textarea
            id="endorsementStatement"
            {...register('endorsementStatement')}
            rows={4}
            placeholder="A brief statement describing the impact of your support or involvement, in their words...."
            style={{
              ...inputStyle,
              height: 'auto',
              resize: 'vertical',
              paddingTop: '10px',
            }}
          />
          {errors.endorsementStatement && (
            <Text style={errorTextStyle}>
              {errors.endorsementStatement.message}
            </Text>
          )}
        </Stack>

        <HStack align="center" justify={{ base: '', md: 'end' }} gap="6" flexWrap="wrap">
          <button
            type="button"
            onClick={handleAddAnother}
            disabled={saveMutation.isPending}
            style={{ ...editProfileBTNStyle, color: '#575C62' }}
          >
            {saveMutation.isPending && !editingId ? (
              'Adding…'
            ) : (
              <HStack textAlign="start" lineHeight="130%">
                <Image src={Add} alt="Add" />
                Add More Endorsements
              </HStack>
            )}
          </button>
          <button
            type="button"
            onClick={handleSaveSection}
            disabled={saveMutation.isPending}
            style={primaryButtonStyle(saveMutation.isPending)}
          >
            {saveMutation.isPending ? 'Saving…' : 'Save Section'}
          </button>
        </HStack>
      </Stack>
    </Stack>
  );
};

export default EndorsementsSection;
