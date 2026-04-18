'use client';

/**
 * Section 1 — About Us
 *
 * Fields: Logo (upload), Cover Photo (upload), Company Name, Address,
 * City, Zip Code, About Us, Tagline, Website URL.
 *
 * Uses React Hook Form + Zod. On save, calls saveAboutUsAction via
 * TanStack Query mutation. A successful save closes the accordion and
 * triggers a router.refresh() so the sidebar progress bar updates.
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import {
  aboutUsSchema,
  type AboutUsInput,
} from '@/lib/validations/business-profile.schema';
import { saveAboutUsAction } from '@/lib/actions/business-profile.actions';
import {
  inputStyle,
  labelStyle,
  errorTextStyle,
  primaryButtonStyle,
} from '@/components/business/shared/styles';
import {
  HStack,
  Stack,
  Text,
  Input,
  InputGroup,
  Image,
} from '@chakra-ui/react';
import UploadIcon from '@/public/business-assets/Upload.svg';
import NextImage from 'next/image';

interface AboutUsSectionProps {
  onSave: () => void;
  defaultValues: AboutUsInput;
}

const AboutUsSection = ({ onSave, defaultValues }: AboutUsSectionProps) => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AboutUsInput>({
    resolver: zodResolver(aboutUsSchema),
    defaultValues: {
      ...defaultValues,
      // Strip the protocol so the input shows only the domain alongside the addon
      website: defaultValues.website?.replace(/^https?:\/\//, '') ?? '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: AboutUsInput) => saveAboutUsAction(data),
    onSuccess: (result) => {
      if (!result.success) {
        setServerError(result.error);
        return;
      }
      router.refresh();
      onSave();
    },
  });

  const logo = watch('logo');
  const coverPhoto = watch('coverPhoto');
  const aboutUsValue = watch('aboutUs') ?? '';

  // Upload state for logo and cover photo
  const [logoUploading, setLogoUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [coverError, setCoverError] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (
    file: File,
    setUploading: (v: boolean) => void,
    setError: (v: string | null) => void,
    field: 'logo' | 'coverPhoto',
    inputRef: React.RefObject<HTMLInputElement | null>
  ) => {
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/business/upload', {
        method: 'POST',
        body: formData,
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? 'Upload failed. Please try again.');
        return;
      }
      setValue(field, data.url);
    } catch {
      setError('Upload failed. Please check your connection and try again.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))} noValidate>
      <Stack gap="10">
        {serverError && (
          <Text style={{ color: '#C53030', fontSize: '14px' }}>
            {serverError}
          </Text>
        )}

        <Stack
          direction={{ base: 'column', md: 'row' }}
          gap="6"
          alignItems="stretch"
        >
          {/* Logo upload */}
          <Stack
            gap="5"
            w={{ base: '100%', md: '33%' }}
            border="1px solid"
            borderColor="border.accentBorder"
            p="6"
            borderRadius="8px"
            align="center"
            flexGrow="1"
          >
            <Text
              className="font-body"
              textTransform="uppercase"
              fontWeight="700"
              fontSize="11px"
              color="text.secondary"
            >
              Upload Logo
            </Text>

            {/* Circle — shows uploaded image or the upload icon placeholder */}
            <Stack
              w="220px"
              h="220px"
              bgColor={logo ? 'transparent' : '#E9EAED'}
              border="1px solid #D2D2D8"
              borderRadius="full"
              alignItems="center"
              justifyContent="center"
              flexShrink="1"
              maxW="100%"
              overflow="hidden"
            >
              {logo ? (
                <Image
                  src={logo}
                  alt="Logo preview"
                  maxW="220px"
                  maxH="220px"
                  objectFit="contain"
                  h="100%"
                  w="100%"
                  borderRadius="full"
                />
              ) : (
                <NextImage
                  alt="Upload image icon"
                  src={UploadIcon}
                  width="64"
                  height="64"
                />
              )}
            </Stack>

            {/* Hidden file input */}
            <input
              ref={logoInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              aria-label="Upload logo image"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file)
                  handleUpload(
                    file,
                    setLogoUploading,
                    setLogoError,
                    'logo',
                    logoInputRef
                  );
              }}
            />

            {/* Buttons */}
            <HStack gap="4">
              <button
                type="button"
                disabled={logoUploading}
                onClick={() => logoInputRef.current?.click()}
                style={{
                  color: '#fff',
                  padding: '8px 20px',
                  backgroundColor: logoUploading ? '#8B88BB' : '#2F2B77',
                  borderRadius: '8px',
                  fontWeight: '500',
                  fontSize: '14px',
                  cursor: logoUploading ? 'not-allowed' : 'pointer',
                }}
              >
                {logoUploading ? 'Uploading…' : logo ? 'Replace' : 'Upload'}
              </button>
              {logo && (
                <button
                  type="button"
                  onClick={() => setValue('logo', null)}
                  style={{
                    color: '#C53030',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  Remove
                </button>
              )}
            </HStack>

            {logoError && (
              <Text style={{ fontSize: '12px', color: '#C53030' }}>
                {logoError}
              </Text>
            )}
          </Stack>

          {/* Cover photo upload */}
          <Stack
            gap="6"
            flexShrink="1"
            w={{ base: '100%', md: '66%' }}
            border="1px solid"
            borderColor="border.accentBorder"
            borderRadius="8px"
            align="stretch"
            justify="center"
            overflow="hidden"
            position="relative"
            minH="220px"
            bgColor={coverPhoto ? undefined : '#E9EAED'}
            style={
              coverPhoto
                ? {
                    backgroundImage: `url(${coverPhoto})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }
                : undefined
            }
          >
            {/* Overlay so text stays readable over any photo */}
            <Stack
              align="center"
              gap="4"
              p="6"
              borderRadius="8px"
              bgColor={coverPhoto ? 'rgba(0,0,0,0.45)' : 'transparent'}
              w="100%"
              h="100%"
              justify="center"
              pos="absolute"
              top="0"
              left="0"
            >
              <Stack textAlign="center" align="center">
                <Text
                  fontWeight="600"
                  fontSize="subheading"
                  className="font-body"
                  color={coverPhoto ? 'white' : 'text.primary'}
                >
                  {coverPhoto ? 'Cover Photo' : 'Upload Banner Image'}
                </Text>
                <Text
                  className="font-body"
                  color={coverPhoto ? 'whiteAlpha.800' : 'text.primary'}
                  fontSize="13px"
                >
                  Optimal dimensions 1200 x 410px
                </Text>
              </Stack>

              {/* Hidden file input */}
              <input
                ref={coverInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                aria-label="Upload cover photo"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file)
                    handleUpload(
                      file,
                      setCoverUploading,
                      setCoverError,
                      'coverPhoto',
                      coverInputRef
                    );
                }}
              />

              <HStack gap="4">
                <button
                  type="button"
                  disabled={coverUploading}
                  onClick={() => coverInputRef.current?.click()}
                  style={{
                    color: '#fff',
                    padding: '8px 20px',
                    backgroundColor: coverUploading ? '#8B88BB' : '#2F2B77',
                    borderRadius: '8px',
                    fontWeight: '500',
                    fontSize: '16px',
                    cursor: coverUploading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {coverUploading
                    ? 'Uploading…'
                    : coverPhoto
                      ? 'Replace Image'
                      : 'Upload Image'}
                </button>
                {coverPhoto && (
                  <button
                    type="button"
                    onClick={() => setValue('coverPhoto', null)}
                    style={{
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '16px',
                      cursor: 'pointer',
                    }}
                  >
                    Remove
                  </button>
                )}
              </HStack>

              {coverError && (
                <Text style={{ fontSize: '12px', color: '#FEB2B2' }}>
                  {coverError}
                </Text>
              )}
            </Stack>
          </Stack>
        </Stack>

        <Stack gap="6">
          {/* Company Name */}
          <Stack>
            <label style={labelStyle} htmlFor="companyName">
              Company Name *
            </label>
            <input
              id="companyName"
              {...register('companyName')}
              style={inputStyle}
              placeholder="Acme Corp"
            />
            {errors.companyName && (
              <Text style={errorTextStyle}>{errors.companyName.message}</Text>
            )}
          </Stack>

          {/* Address */}
          <Stack>
            <label style={labelStyle} htmlFor="address">
              Address
            </label>
            <input
              id="address"
              {...register('address')}
              style={inputStyle}
              placeholder="123 Main St"
            />
          </Stack>

          {/* City + Zip in a row — stacks to column on mobile */}
          <Stack direction={{ base: 'column', md: 'row' }} gap="3">
            <Stack width="100%">
              <label style={labelStyle} htmlFor="city">
                City
              </label>
              <input
                id="city"
                {...register('city')}
                style={inputStyle}
                placeholder="Chicago"
              />
            </Stack>
            <Stack width="100%">
              <label style={labelStyle} htmlFor="zipCode">
                Zip Code
              </label>
              <input
                id="zipCode"
                {...register('zipCode')}
                style={inputStyle}
                placeholder="60601"
              />
            </Stack>
          </Stack>

          {/* About Us */}
          <Stack gap="1">
            <HStack justify="space-between" align="baseline">
              <label
                style={{ ...labelStyle, marginBottom: 0 }}
                htmlFor="aboutUs"
              >
                About Us
              </label>
              <Text
                style={{
                  fontSize: '12px',
                  color: aboutUsValue.length > 500 ? '#C53030' : '#9CA3AF',
                }}
              >
                {aboutUsValue.length}/500
              </Text>
            </HStack>
            <textarea
              id="aboutUs"
              {...register('aboutUs')}
              maxLength={500}
              placeholder="Tell the community about your company…"
              rows={5}
              style={{
                ...inputStyle,
                height: 'auto',
                resize: 'vertical',
                paddingTop: '10px',
              }}
            />
            {errors.aboutUs && (
              <Text style={errorTextStyle}>{errors.aboutUs.message}</Text>
            )}
          </Stack>

          {/* Tagline */}
          <Stack gap="1">
            <label style={labelStyle} htmlFor="tagline">
              Tagline
            </label>
            <input
              id="tagline"
              {...register('tagline')}
              style={inputStyle}
              placeholder="Our mission in one line"
            />
          </Stack>

          {/* Website */}
          <Stack gap="1">
            <label style={labelStyle} htmlFor="website">
              Website URL
            </label>
            <InputGroup startAddon="https://">
              <Input
                id="website"
                {...register('website', {
                  setValueAs: (v: string) => {
                    if (!v) return v;
                    return v.startsWith('http://') || v.startsWith('https://')
                      ? v
                      : `https://${v}`;
                  },
                })}
                style={inputStyle}
                placeholder="yourcompany.com"
              />
            </InputGroup>
            {errors.website && (
              <Text style={errorTextStyle}>{errors.website.message}</Text>
            )}
          </Stack>

          <HStack
            align="center"
            justify={{ base: '', md: 'end' }}
            gap="6"
            flexWrap="wrap"
          >
            <button
              type="submit"
              disabled={mutation.isPending}
              style={primaryButtonStyle(mutation.isPending, false)}
            >
              {mutation.isPending ? 'Saving…' : 'Save Section'}
            </button>
          </HStack>
        </Stack>
      </Stack>
    </form>
  );
};

export default AboutUsSection;
