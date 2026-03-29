'use client';

import {
  Button,
  FieldErrorText,
  FileUpload,
  Flex,
  Heading,
  Spinner,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import Avatar from '@/public/components-assets/Avatar.svg';
import { useState } from 'react';

// ── Types ─────────────────────────────────────────────────

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

// ── Controlled Props (ProfilePreview + Settings) ──────────

interface ControlledProfilePictureUploadProps {
  mode: 'controlled';
  currentImageURL: string | null;
  onUploadComplete: (url: string) => void;
  onDelete: () => void;
}

// ── Form Props (CreateProfileForm with RHF) ───────────────

interface FormProfilePictureUploadProps {
  mode: 'form';
  currentImageURL: string | null;
  onUploadComplete: (url: string) => void;
  onDelete: () => void;
}

type ProfilePictureUploadProps =
  | ControlledProfilePictureUploadProps
  | FormProfilePictureUploadProps;

// ── Component ─────────────────────────────────────────────

const ProfilePictureUpload = ({
  mode,
  currentImageURL,
  onUploadComplete,
  onDelete,
}: ProfilePictureUploadProps) => {
  const [displayUrl, setDisplayUrl] = useState(currentImageURL ?? null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleDeleteExisting() {
    setIsDeleting(true);
    try {
      await axios.delete('/api/upload', { data: { url: displayUrl } });
      setDisplayUrl(null);
      onDelete();
    } catch {
      setErrorMessage('Failed to delete image. Try again');
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleUpload(file: File) {
    setStatus('uploading');
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('currentImageURL', displayUrl ?? '');

    try {
      const { data } = await axios.post<{ url: string }>(
        '/api/upload',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setDisplayUrl(data.url);
      onUploadComplete(data.url);
      setStatus('success');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.error ?? 'Upload failed');
      } else {
        setErrorMessage('Something went wrong');
      }
      setStatus('error');
    }
  }

  return (
    <FileUpload.Root
      accept={ALLOWED_TYPES}
      maxFileSize={MAX_SIZE_BYTES}
      maxFiles={1}
      disabled={status === 'uploading'}
      onFileChange={(details) => {
        const file = details.acceptedFiles[0];
        if (file) handleUpload(file);
      }}
      suppressHydrationWarning
    >
      <FileUpload.HiddenInput />
      <Flex direction="column" gap="6">
        <Heading color="text.heading" fontSize="subheading">
          {mode === 'controlled' ? 'Profile Picture' : 'Add Profile Picture'}
        </Heading>
        <Flex gap="6" alignItems={{ base: 'flex-start', md: 'center' }} direction={{ base: 'column', md: 'row' }}>
          <div style={{ position: 'relative' }}>
            {displayUrl ? (
              <img
                src={displayUrl}
                alt="Profile picture"
                width="136"
                height="136"
                style={{
                  borderRadius: '50%',
                  objectFit: 'cover',
                  height: '136px',
                  width: '136px',
                }}
              />
            ) : (
              <FileUpload.Trigger asChild>
                <img
                  src={Avatar.src}
                  alt="Profile picture"
                  width="136"
                  height="136"
                  style={{
                    borderRadius: '50%',
                    objectFit: 'cover',
                    height: '136px',
                    width: '136px',
                  }}
                />
              </FileUpload.Trigger>
            )}
            {status === 'uploading' && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '100%',
                  background: 'rgba(255,255,255,0.4)',
                }}
              >
                <Spinner size="lg" color="brand.primary" />
              </div>
            )}
          </div>
          <Flex direction="column" gap="4">
            <Flex gap="3" alignItems="center">
              {displayUrl ? (
                <>
                  <FileUpload.Trigger asChild>
                    <Button
                      size="sm"
                      variant="solid"
                      fontWeight="600"
                      disabled={status === 'uploading'}
                    >
                      Upload New Picture
                    </Button>
                  </FileUpload.Trigger>
                  <Button
                    type="button"
                    size="sm"
                    variant="subtle"
                    fontWeight="600"
                    onClick={handleDeleteExisting}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting' : 'Delete'}
                  </Button>
                </>
              ) : (
                <>
                  <FileUpload.Trigger asChild>
                    <Button
                      size="sm"
                      variant="subtle"
                      fontWeight="600"
                      disabled={status === 'uploading'}
                    >
                      Choose File
                    </Button>
                  </FileUpload.Trigger>
                  <Text fontSize="small" color="text.primary" fontWeight={500}>
                    No file selected
                  </Text>
                </>
              )}
            </Flex>
            {errorMessage ? (
              <FieldErrorText>{errorMessage}</FieldErrorText>
            ) : (
              <Text fontSize="small" color="text.primary">
                The profile picture must be in GIF, JPG, and PNG formats, with a
                maximum file size of 5MB.
              </Text>
            )}
          </Flex>
        </Flex>
      </Flex>
    </FileUpload.Root>
  );
};

export default ProfilePictureUpload;
