'use client';

/**
 * Image upload input for the business edit-profile sections.
 *
 * Uploads the selected file to /api/business/upload (which stores it in
 * Vercel Blob) and calls onChange(url) with the resulting public URL.
 * The URL is saved to the database only when the user clicks "Save Section".
 *
 * Shows a thumbnail preview of the current image (if any) and a Remove
 * button to clear it.
 */

import { useRef, useState } from 'react';

interface ImageUploadInputProps {
  /** Current image URL (from the database). null = no image. */
  value: string | null;
  /** Called with the new URL after a successful upload, or null when removed. */
  onChange: (url: string | null) => void;
  label?: string;
}

const ImageUploadInput = ({ value, onChange, label = 'Image' }: ImageUploadInputProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/business/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json() as { url?: string; error?: string };

      if (!res.ok || !data.url) {
        setUploadError(data.error ?? 'Upload failed. Please try again.');
        return;
      }

      onChange(data.url);
    } catch {
      setUploadError('Upload failed. Please check your connection and try again.');
    } finally {
      setIsUploading(false);
      // Reset the file input so the same file can be re-selected if needed
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      {/* Thumbnail preview */}
      {value && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
          <img
            src={value}
            alt={label}
            style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }}
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            style={{
              background: 'none',
              border: '1px solid #FEB2B2',
              borderRadius: '6px',
              padding: '4px 10px',
              color: '#C53030',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            Remove
          </button>
        </div>
      )}

      {/* Hidden native file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id={`upload-${label}`}
      />

      {/* Styled trigger button */}
      <label
        htmlFor={`upload-${label}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: '6px',
          border: '1px dashed #D1D5DB',
          background: '#F9FAFB',
          cursor: isUploading ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          color: isUploading ? '#9CA3AF' : '#575C62',
        }}
      >
        {isUploading ? 'Uploading…' : value ? 'Replace image' : `Upload ${label}`}
      </label>

      {uploadError && (
        <p style={{ color: '#C53030', fontSize: '12px', marginTop: '6px' }}>{uploadError}</p>
      )}
    </div>
  );
};

export default ImageUploadInput;
