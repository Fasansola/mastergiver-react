/**
 * Business image upload endpoint — POST /api/business/upload
 *
 * Accepts a multipart form with a single `file` field, validates it,
 * uploads it to Vercel Blob under the `business/` prefix, and returns
 * the public URL.
 *
 * The caller (a section save action) is responsible for persisting the
 * returned URL to the correct field on the Business record. This route
 * only handles the file transfer — it does not touch the database.
 *
 * Separate from Phase 1's /api/upload which is hard-coded to update
 * the user Profile record.
 */

import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: 'Invalid file type. Only JPG, PNG, WebP, and GIF are allowed.' },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: 'File too large. Maximum size is 5 MB.' },
      { status: 400 }
    );
  }

  const extension = file.type.split('/')[1];
  const filename = `business/${session.user.id}-${Date.now()}.${extension}`;

  const blob = await put(filename, file, { access: 'public' });

  return NextResponse.json({ url: blob.url }, { status: 200 });
}
