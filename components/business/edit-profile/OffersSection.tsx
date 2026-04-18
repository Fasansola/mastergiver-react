'use client';

/**
 * Section 7 — Community Offers (multi-entry)
 *
 * Fields per entry: Title, Description, Link (optional), Offer Code (optional),
 * Expiration Date (optional date picker).
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  offerSchema,
  type OfferInput,
} from '@/lib/validations/business-profile.schema';
import {
  createOfferAction,
  updateOfferAction,
  deleteOfferAction,
} from '@/lib/actions/business-profile.actions';
import MultiEntryCard from './MultiEntryCard';
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

interface Offer {
  id: string;
  title: string;
  description: string;
  link: string | null;
  offerCode: string | null;
  expiresAt: string | null;
}

interface OffersSectionProps {
  onSave: () => void;
  initialOffers: Offer[];
}

const blank: OfferInput = {
  title: '',
  description: '',
  link: '',
  offerCode: '',
  expiresAt: '',
};

const OffersSection = ({ onSave, initialOffers }: OffersSectionProps) => {
  const router = useRouter();
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OfferInput>({
    resolver: zodResolver(offerSchema),
    defaultValues: blank,
  });

  const saveMutation = useMutation({
    mutationFn: async (data: OfferInput) =>
      editingId ? updateOfferAction(editingId, data) : createOfferAction(data),
    onSuccess: (result, data) => {
      if (!result.success) {
        setServerError(result.error);
        return;
      }
      if (editingId) {
        setOffers((prev) =>
          prev.map((o) =>
            o.id === editingId
              ? {
                  ...o,
                  ...data,
                  link: data.link || null,
                  offerCode: data.offerCode || null,
                  expiresAt: data.expiresAt || null,
                }
              : o
          )
        );
        setEditingId(null);
      } else if ('id' in result) {
        setOffers((prev) => [
          ...prev,
          {
            id: result.id as string,
            title: data.title,
            description: data.description,
            link: data.link || null,
            offerCode: data.offerCode || null,
            expiresAt: data.expiresAt || null,
          },
        ]);
      }
      reset(blank);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteOfferAction(id),
    onSuccess: (result, id) => {
      if (result.success) {
        setOffers((prev) => prev.filter((o) => o.id !== id));
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
      {offers.map((o) => (
        <MultiEntryCard
          key={o.id}
          title={o.title}
          description={o.description}
          onEdit={() => {
            setEditingId(o.id);
            reset({
              title: o.title,
              description: o.description,
              link: (o.link ?? '').replace(/^https?:\/\//, ''),
              offerCode: o.offerCode ?? '',
              expiresAt: o.expiresAt ?? '',
            });
          }}
          onDelete={() => {
            setDeletingId(o.id);
            deleteMutation.mutate(o.id);
          }}
          isDeleting={deletingId === o.id}
        />
      ))}

      {serverError && (
        <Text style={{ color: '#C53030', fontSize: '14px' }}>
          {serverError}
        </Text>
      )}

      <Stack gap="4">
        <Stack gap="1">
          <label style={labelStyle} htmlFor="offerTitle">
            Offer Title *
          </label>
          <input
            id="offerTitle"
            {...register('title')}
            style={inputStyle}
            placeholder="e.g., 10% off your first service with us..."
          />
          {errors.title && (
            <Text style={errorTextStyle}>{errors.title.message}</Text>
          )}
        </Stack>

        <Stack>
          <label style={labelStyle} htmlFor="offerDesc">
            Offer Description *
          </label>
          <textarea
            id="offerDesc"
            {...register('description')}
            rows={3}
            placeholder="Briefly describe the offer and who it’s for. Keep it clear and straightforward so visitors know exactly what to expect...."
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

        <Stack>
          <label style={labelStyle} htmlFor="offerLink">
            LINK TO OFFER (IF APPLICABLE)
          </label>
          <InputGroup startAddon="https://">
            <Input
              id="offerLink"
              {...register('link', {
                setValueAs: (v: string) => {
                  if (!v) return v;
                  return v.startsWith('http://') || v.startsWith('https://')
                    ? v
                    : `https://${v}`;
                },
              })}
              style={inputStyle}
              placeholder="Optional — enter a URL where users can find more information or redeem this offer..."
            />
          </InputGroup>
          {errors.link && (
            <Text style={errorTextStyle}>{errors.link.message}</Text>
          )}
        </Stack>

        <Stack>
          <label style={labelStyle} htmlFor="offerCode">
            Offer Code (if applicable)
          </label>
          <input
            id="offerCode"
            {...register('offerCode')}
            style={inputStyle}
            placeholder="Optional — enter a code visitors can use to redeem this offer ..."
          />
        </Stack>

        <Stack>
          <label style={labelStyle} htmlFor="expiresAt">
            Expiration Date (optional)
          </label>
          <input
            id="expiresAt"
            type="date"
            {...register('expiresAt')}
            placeholder="Optional, but recommended to create urgency or reflect availability."
            style={inputStyle}
          />
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
                Add More Offers
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

export default OffersSection;
