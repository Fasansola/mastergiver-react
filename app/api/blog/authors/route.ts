/**
 * GET  /api/blog/authors  — list all authors
 * POST /api/blog/authors  — create an author (ADMIN only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { slugify } from '@/lib/blog/utils';

const CreateAuthorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  bio: z.string().optional(),
  avatar: z.string().url().optional().or(z.literal('')),
});

export async function GET() {
  try {
    const authors = await prisma.blogAuthor.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { posts: true } } },
    });
    return NextResponse.json({ authors });
  } catch (error) {
    console.error('[blog/authors GET]', error);
    return NextResponse.json({ error: 'Failed to fetch authors' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = CreateAuthorSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const slug = slugify(parsed.data.name);

    const author = await prisma.blogAuthor.create({
      data: {
        name: parsed.data.name.trim(),
        slug,
        bio: parsed.data.bio,
        avatar: parsed.data.avatar || null,
      },
    });

    return NextResponse.json({ author }, { status: 201 });
  } catch (error) {
    console.error('[blog/authors POST]', error);
    return NextResponse.json({ error: 'Failed to create author' }, { status: 500 });
  }
}
