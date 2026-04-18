'use client';

/**
 * Section 5 — In the Community (multi-entry)
 *
 * Fields per entry: Photo (upload), Description, External URL (optional).
 * Same Add Another / Save Section / Edit / Delete pattern as PartnersSection.
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  communityEventSchema,
  type CommunityEventInput,
} from '@/lib/validations/business-profile.schema';
import {
  createCommunityEventAction,
  updateCommunityEventAction,
  deleteCommunityEventAction,
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
import { HStack, Stack, Text, Input, InputGroup } from '@chakra-ui/react';
import Add from '@/public/business-assets/GreyAdd.svg';
import Image from 'next/image';

interface CommunityEvent {
  id: string;
  photo: string | null;
  description: string;
  externalUrl: string | null;
}

interface CommunityEventsSectionProps {
  onSave: () => void;
  initialEvents: CommunityEvent[];
}

const blank: CommunityEventInput = {
  photo: '',
  description: '',
  externalUrl: '',
};

const CommunityEventsSection = ({
  onSave,
  initialEvents,
}: CommunityEventsSectionProps) => {
  const router = useRouter();
  const [events, setEvents] = useState<CommunityEvent[]>(initialEvents);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CommunityEventInput>({
    resolver: zodResolver(communityEventSchema),
    defaultValues: blank,
  });

  const photoValue = watch('photo');

  const saveMutation = useMutation({
    mutationFn: async (data: CommunityEventInput) =>
      editingId
        ? updateCommunityEventAction(editingId, data)
        : createCommunityEventAction(data),
    onSuccess: (result, data) => {
      if (!result.success) {
        setServerError(result.error);
        return;
      }
      if (editingId) {
        setEvents((prev) =>
          prev.map((e) =>
            e.id === editingId
              ? {
                  ...e,
                  ...data,
                  photo: data.photo ?? null,
                  externalUrl: data.externalUrl || null,
                }
              : e
          )
        );
        setEditingId(null);
      } else if ('id' in result) {
        setEvents((prev) => [
          ...prev,
          {
            id: result.id as string,
            photo: data.photo ?? null,
            description: data.description,
            externalUrl: data.externalUrl || null,
          },
        ]);
      }
      reset(blank);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCommunityEventAction(id),
    onSuccess: (result, id) => {
      if (result.success) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
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
      {events.map((e) => (
        <MultiEntryCard
          key={e.id}
          image={e.photo}
          title={e.description.slice(0, 60)}
          description={e.externalUrl ?? 'No link provided'}
          onEdit={() => {
            setEditingId(e.id);
            reset({
              photo: e.photo ?? '',
              description: e.description,
              externalUrl: (e.externalUrl ?? '').replace(/^https?:\/\//, ''),
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
          <label style={labelStyle}>Photo *</label>
          <ImageUploadInput
            value={photoValue ?? null}
            onChange={(url: string | null) => setValue('photo', url ?? '', { shouldValidate: true })}
            label="photo"
          />
          {errors.photo && (
            <Text style={errorTextStyle}>{errors.photo.message}</Text>
          )}
        </Stack>

        <Stack gap="1">
          <label style={labelStyle} htmlFor="eventDesc">
            Photo Description *
          </label>
          <textarea
            id="eventDesc"
            {...register('description')}
            rows={3}
            placeholder="Briefly describe what’s shown, who’s involved, and when it took place. Example: Employees volunteering at the local food bank — December 2025. ..."
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

        <Stack gap="1">
          <label style={labelStyle} htmlFor="eventUrl">
            External Reference URL (optional)
          </label>
          <InputGroup startAddon="https://">
            <Input
              id="eventUrl"
              {...register('externalUrl', {
                setValueAs: (v: string) => {
                  if (!v) return v;
                  return v.startsWith('http://') || v.startsWith('https://')
                    ? v
                    : `https://${v}`;
                },
              })}
              style={inputStyle}
              placeholder="example.com/event"
            />
          </InputGroup>
          {errors.externalUrl && (
            <Text style={errorTextStyle}>{errors.externalUrl.message}</Text>
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
                Add More Events
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

export default CommunityEventsSection;
