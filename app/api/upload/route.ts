import { put, del } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  // Auth check
  const session = await auth();

  if (!session?.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parse formdata
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const currentImageURL = formData.get('currentImageURL') as string | null;

  // Validate file exists
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  //   Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: 'Invalid file type. Only JPG, PNG, and GIF are allowed.' },
      { status: 400 }
    );
  }

  //   Validate file size
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: 'File too large. Maximum size is 5MB.' },
      { status: 400 }
    );
  }

  //   Delete old image if exists
  if (currentImageURL) {
    try {
      await del(currentImageURL);
    } catch {
      console.log('Could not delete old profile picture');
    }
  }

  //   Upload new image

  const extension = file.type.split('/')[1];
  const filename = `avatars/${session.user.id}-${Date.now()}.${extension}`;

  const blob = await put(filename, file, {
    access: 'public',
  });

  await prisma.profile.update({
    where: { userId: session.user.id },
    data: {
      profilePicture: blob.url,
    },
  });

  return NextResponse.json({ url: blob.url }, { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const session = await auth();

  if (!session?.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { url } = await request.json();
  if (!url) {
    return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
  }

  await del(url);

  await prisma.profile.update({
    where: { userId: session.user.id },
    data: { profilePicture: null },
  });

  return NextResponse.json({ success: true }, { status: 200 });
}
