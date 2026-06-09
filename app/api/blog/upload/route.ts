/**
 * POST /api/blog/upload
 *
 * Uploads a blog image (cover photo or inline editor image) to Vercel Blob.
 * Scoped to ADMIN users only. Returns the public Blob URL.
 *
 * Accepts multipart/form-data with a single "file" field.
 * Used by:
 *   - Cover image upload in the admin post editor
 *   - BlockNote image block uploads (via uploadFile callback)
 */

import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8 MB — larger than avatars to allow cover photos

export async function POST(request: NextRequest) {
  // Only admins can upload blog images
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: 'Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.' },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: 'File too large. Maximum size is 8 MB.' },
      { status: 400 }
    );
  }

  const extension = file.type.split('/')[1];
  const filename = `blog/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;

  const blob = await put(filename, file, { access: 'public' });

  return NextResponse.json({ url: blob.url }, { status: 200 });
}
