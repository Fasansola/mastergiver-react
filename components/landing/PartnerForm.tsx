'use client';

/**
 * Partner sign-up form — shown in the CTA section of the /partner page.
 *
 * Fields: Contact Name, Organization Name, Email Address, Website or Network.
 * Uses the business-panel input/label/button token styles so it matches
 * the edit-profile form aesthetic.
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Stack, Text } from '@chakra-ui/react';
import {
  inputStyle,
  labelStyle,
  errorTextStyle,
  primaryButtonStyle,
} from '@/components/business/shared/styles';

const partnerSchema = z.object({
  contactName: z.string().min(1, 'Contact name is required'),
  organizationName: z.string().min(1, 'Organization name is required'),
  email: z.string().email('Please enter a valid email address'),
  website: z.string().optional(),
});

type PartnerFormInput = z.infer<typeof partnerSchema>;

const PartnerForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PartnerFormInput>({
    resolver: zodResolver(partnerSchema),
  });

  const onSubmit = async (data: PartnerFormInput) => {
    setServerError(null);
    try {
      const res = await fetch('/api/partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = (await res.json()) as { error?: string };
        setServerError(json.error ?? 'Something went wrong. Please try again.');
        return;
      }
      setSubmitted(true);
    } catch {
      setServerError('Something went wrong. Please try again.');
    }
  };

  if (submitted) {
    return (
      <Stack gap="4" align="center" textAlign="center" py="8">
        <Text
          className="font-display"
          fontSize="28px"
          fontWeight="700"
          color="brand.primary"
        >
          You're in!
        </Text>
        <Text className="font-body" color="text.primary" lineHeight="170%">
          Check your inbox — your partner toolkit is on its way.
        </Text>
      </Stack>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack gap="5" textAlign="start">
        {serverError && (
          <Text style={{ ...errorTextStyle, fontSize: '14px' }}>
            {serverError}
          </Text>
        )}

        {/* Contact Name */}
        <Stack gap="1">
          <label style={labelStyle} htmlFor="contactName">
            Contact Name *
          </label>
          <input
            id="contactName"
            {...register('contactName')}
            style={inputStyle}
            placeholder="Jane Smith"
          />
          {errors.contactName && (
            <Text style={errorTextStyle}>{errors.contactName.message}</Text>
          )}
        </Stack>

        {/* Organization Name */}
        <Stack gap="1">
          <label style={labelStyle} htmlFor="organizationName">
            Organization Name *
          </label>
          <input
            id="organizationName"
            {...register('organizationName')}
            style={inputStyle}
            placeholder="Atlanta Chamber of Commerce"
          />
          {errors.organizationName && (
            <Text style={errorTextStyle}>
              {errors.organizationName.message}
            </Text>
          )}
        </Stack>

        {/* Email Address */}
        <Stack gap="1">
          <label style={labelStyle} htmlFor="email">
            Email Address *
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            style={inputStyle}
            placeholder="jane@yourorg.org"
          />
          {errors.email && (
            <Text style={errorTextStyle}>{errors.email.message}</Text>
          )}
        </Stack>

        {/* Website or Network */}
        <Stack gap="1">
          <label style={labelStyle} htmlFor="website">
            Website or Network
            <span
              style={{
                fontWeight: 400,
                textTransform: 'none',
                letterSpacing: 0,
                fontSize: '12px',
                color: '#9CA3AF',
                marginLeft: '6px',
              }}
            >
              (optional but recommended)
            </span>
          </label>
          <input
            id="website"
            {...register('website')}
            style={inputStyle}
            placeholder="yourorg.org"
          />
        </Stack>

        <button
          type="submit"
          disabled={isSubmitting}
          style={primaryButtonStyle(isSubmitting)}
        >
          {isSubmitting ? 'Sending…' : 'Get My Partner Toolkit'}
        </button>
      </Stack>
    </form>
  );
};

export default PartnerForm;
