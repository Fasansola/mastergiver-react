'use client';

import { useState } from 'react';
import axios from 'axios';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface UseProfilePictureUploadProps {
  initialUrl: string | null;
  onUploadComplete: (url: string) => void;
  onDelete: () => void;
}

export interface UseProfilePictureUploadReturn {
  displayUrl: string | null;
  status: UploadStatus;
  errorMessage: string | null;
  isDeleting: boolean;
  handleUpload: (file: File) => Promise<void>;
  handleDeleteExisting: () => Promise<void>;
}

export function useProfilePictureUpload({
  initialUrl,
  onUploadComplete,
  onDelete,
}: UseProfilePictureUploadProps): UseProfilePictureUploadReturn {
  const [displayUrl, setDisplayUrl] = useState<string | null>(initialUrl);
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

  return { displayUrl, status, errorMessage, isDeleting, handleUpload, handleDeleteExisting };
}
