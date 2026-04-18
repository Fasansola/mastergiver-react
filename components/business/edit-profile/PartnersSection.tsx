'use client';

/**
 * Section 3 — Community Partners & Programs (multi-entry)
 *
 * Shows saved entries as cards, then a form for the current entry.
 * - "Add Another" saves the entry and resets the form for the next one.
 * - "Save Section" saves the entry and closes the accordion.
 * - "Edit" on a card loads that entry into the form.
 * - "Delete" on a card removes it immediately.
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  partnerSchema,
  type PartnerInput,
} from '@/lib/validations/business-profile.schema';
import {
  createPartnerAction,
  updatePartnerAction,
  deletePartnerAction,
} from '@/lib/actions/business-profile.actions';
import MultiEntryCard from './MultiEntryCard';
import ImageUploadInput from './ImageUploadInput';
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

interface Partner {
  id: string;
  image: string | null;
  name: string;
  description: string;
}

interface PartnersSectionProps {
  onSave: () => void;
  initialPartners: Partner[];
}

const blank: PartnerInput = { image: null, name: '', description: '' };

const PartnersSection = ({ onSave, initialPartners }: PartnersSectionProps) => {
  const router = useRouter();
  const [partners, setPartners] = useState<Partner[]>(initialPartners);
  const [editingId, setEditingId] = useState<string | null>(null); // null = creating new
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PartnerInput>({
    resolver: zodResolver(partnerSchema),
    defaultValues: blank,
  });

  const imageValue = watch('image');

  // Save (create or update) one entry
  const saveMutation = useMutation({
    mutationFn: async (data: PartnerInput) => {
      if (editingId) return updatePartnerAction(editingId, data);
      return createPartnerAction(data);
    },
    onSuccess: (result, data) => {
      if (!result.success) {
        setServerError(result.error);
        return;
      }
      // Update local list immediately
      if (editingId) {
        setPartners((prev) =>
          prev.map((p) => (p.id === editingId ? { ...p, ...data } : p))
        );
        setEditingId(null);
      } else if ('id' in result) {
        setPartners((prev) => [
          ...prev,
          { id: result.id as string, ...data, image: data.image ?? null },
        ]);
      }
      reset(blank);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePartnerAction(id),
    onSuccess: (result, id) => {
      if (!result.success) return;
      setPartners((prev) => prev.filter((p) => p.id !== id));
      setDeletingId(null);
    },
  });

  const handleAddAnother = handleSubmit((data) => {
    setServerError(null);
    saveMutation.mutate(data);
    // form resets in onSuccess
  });

  const handleSaveSection = handleSubmit((data) => {
    setServerError(null);
    saveMutation.mutate(data, {
      onSuccess: (result) => {
        if (!result.success) return;
        router.refresh();
        onSave();
      },
    });
  });

  const handleEdit = (p: Partner) => {
    setEditingId(p.id);
    reset({ image: p.image, name: p.name, description: p.description });
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    deleteMutation.mutate(id);
  };

  return (
    <Stack gap="4">
      {/* Saved cards */}
      {partners.map((p) => (
        <MultiEntryCard
          key={p.id}
          image={p.image}
          title={p.name}
          description={p.description}
          onEdit={() => handleEdit(p)}
          onDelete={() => handleDelete(p.id)}
          isDeleting={deletingId === p.id}
        />
      ))}

      {serverError && (
        <Text style={{ color: '#C53030', fontSize: '14px' }}>
          {serverError}
        </Text>
      )}

      {/* Entry form */}
      <Stack gap="4" pt={partners.length ? '2' : '0'}>
        <Stack gap="1">
          <label style={labelStyle}>Image (optional)</label>
          <ImageUploadInput
            value={imageValue ?? null}
            onChange={(url) => setValue('image', url)}
            label="partner image"
          />
        </Stack>

        <Stack gap="1">
          <label style={labelStyle} htmlFor="partnerName">
            Organization / Program Name *
          </label>
          <input
            id="partnerName"
            {...register('name')}
            style={inputStyle}
            placeholder="Green Future Foundation"
          />
          {errors.name && (
            <Text style={errorTextStyle}>{errors.name.message}</Text>
          )}
        </Stack>

        <Stack gap="1">
          <label style={labelStyle} htmlFor="partnerDesc">
            Description *
          </label>
          <textarea
            id="partnerDesc"
            {...register('description')}
            rows={3}
            placeholder="What do you do together?"
            style={{
              ...inputStyle,
              height: 'auto',
              resize: 'vertical',
              paddingTop: '10px',
            }}
          />
          {errors.description && (
            <Text style={errorTextStyle}>{errors.description.message}</Text>
          )}
        </Stack>

        <HStack
          align="center"
          justify={{ base: '', md: 'end' }}
          gap="6"
          flexWrap="wrap"
        >
          <button
            type="button"
            onClick={handleAddAnother}
            disabled={saveMutation.isPending}
            style={{ ...editProfileBTNStyle, color: '#575C62' }}
          >
            {saveMutation.isPending && !editingId ? (
              'Saving…'
            ) : (
              <HStack textAlign="start" lineHeight="130%">
                <Image src={Add} alt="Add" />
                Add another Partner or Program
              </HStack>
            )}
          </button>
          <button
            type="button"
            onClick={handleSaveSection}
            disabled={saveMutation.isPending}
            style={primaryButtonStyle(saveMutation.isPending, false)}
          >
            {saveMutation.isPending ? 'Saving…' : 'Save Section'}
          </button>
        </HStack>
      </Stack>
    </Stack>
  );
};

export default PartnersSection;
