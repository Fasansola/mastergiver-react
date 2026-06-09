/**
 * GET  /api/blog/categories  — list all categories
 * POST /api/blog/categories  — create a category (ADMIN only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { slugify } from '@/lib/blog/utils';

const CreateCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

export async function GET() {
  try {
    const categories = await prisma.blogCategory.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { posts: true } } },
    });
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('[blog/categories GET]', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = CreateCategorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const slug = slugify(parsed.data.name);
    const existing = await prisma.blogCategory.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'Category already exists.' }, { status: 409 });
    }

    const category = await prisma.blogCategory.create({
      data: { name: parsed.data.name.trim(), slug },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error('[blog/categories POST]', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
