/**
 * CoverImageUpload — drag-and-drop / click-to-upload cover image picker.
 * Uploads to /api/blog/upload and returns the Vercel Blob URL.
 */

'use client';

import { Box, HStack, Spinner, Stack, Text } from '@chakra-ui/react';
import NextImage from 'next/image';
import { useRef, useState } from 'react';
import { LuImagePlus, LuX } from 'react-icons/lu';

interface CoverImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

const CoverImageUpload = ({ value, onChange }: CoverImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/blog/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Upload failed');
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <Stack gap="2">
      {value ? (
        /* Preview with remove button */
        <Box position="relative" borderRadius="8px" overflow="hidden" border="1px solid" borderColor="border.default">
          <NextImage
            src={value}
            alt="Cover image preview"
            width={800}
            height={400}
            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
          />
          <Box
            position="absolute"
            top="8px"
            right="8px"
            bg="white"
            borderRadius="full"
            p="1"
            cursor="pointer"
            onClick={() => onChange('')}
            boxShadow="sm"
          >
            <LuX size={16} color="#374151" />
          </Box>
        </Box>
      ) : (
        /* Upload zone */
        <Box
          border="2px dashed"
          borderColor={uploading ? 'brand.primary' : 'border.default'}
          borderRadius="8px"
          p="8"
          textAlign="center"
          cursor="pointer"
          bg="background.subtle"
          _hover={{ borderColor: 'brand.primary', bg: 'background.lightPurple' }}
          transition="all 0.15s"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {uploading ? (
            <Stack align="center" gap="2">
              <Spinner size="sm" color="brand.primary" />
              <Text fontSize="14px" color="text.secondary">Uploading…</Text>
            </Stack>
          ) : (
            <Stack align="center" gap="2">
              <LuImagePlus size={24} color="#9CA3AF" />
              <Text fontSize="14px" fontWeight="500" color="text.secondary">
                Click or drag to upload cover image
              </Text>
              <Text fontSize="12px" color="text.secondary">JPG, PNG, WebP — max 8 MB</Text>
            </Stack>
          )}
        </Box>
      )}

      {error && (
        <HStack gap="1">
          <Text fontSize="12px" color="text.error">{error}</Text>
        </HStack>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
    </Stack>
  );
};

export default CoverImageUpload;
