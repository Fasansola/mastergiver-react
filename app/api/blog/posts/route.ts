/**
 * GET  /api/blog/posts  — list posts (admin: all statuses; public: PUBLISHED only)
 * POST /api/blog/posts  — create a new post (ADMIN only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { slugify, calculateReadingTime } from '@/lib/blog/utils';

const CreatePostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1).optional(), // auto-generated if omitted
  excerpt: z.string().optional(),
  content: z.string().default(''),
  coverImage: z.string().url().optional().or(z.literal('')),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  authorId: z.string().min(1, 'Author is required'),
  categoryIds: z.array(z.string()).default([]),
  tagNames: z.array(z.string()).default([]),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const isAdmin = session?.user?.role === 'ADMIN';

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const categorySlug = searchParams.get('category');
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
    const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '9'));
    const skip = (page - 1) * limit;

    // Non-admins can only see published posts
    const statusFilter = isAdmin && status
      ? { status: status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' }
      : !isAdmin
        ? { status: 'PUBLISHED' as const }
        : {};

    const categoryFilter = categorySlug
      ? { categories: { some: { category: { slug: categorySlug } } } }
      : {};

    const where = { ...statusFilter, ...categoryFilter };

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
        include: {
          author: { select: { id: true, name: true, avatar: true, slug: true } },
          categories: { include: { category: { select: { id: true, name: true, slug: true } } } },
          tags: { include: { tag: { select: { id: true, name: true, slug: true } } } },
        },
      }),
      prisma.blogPost.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('[blog/posts GET]', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = CreatePostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;
    const slug = data.slug || slugify(data.title);

    // Ensure slug is unique
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'A post with this slug already exists.' }, { status: 409 });
    }

    const readingTime = calculateReadingTime(data.content);
    const publishedAt = data.status === 'PUBLISHED' ? new Date() : null;

    // Upsert tags by name — create if they don't exist yet
    const tagConnections = await Promise.all(
      data.tagNames.map(async (name) => {
        const tagSlug = slugify(name);
        const tag = await prisma.blogTag.upsert({
          where: { slug: tagSlug },
          update: {},
          create: { name: name.trim(), slug: tagSlug },
        });
        return { tagId: tag.id };
      })
    );

    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage || null,
        status: data.status,
        publishedAt,
        readingTime,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        authorId: data.authorId,
        categories: {
          create: data.categoryIds.map((categoryId) => ({ categoryId })),
        },
        tags: {
          create: tagConnections,
        },
      },
      include: {
        author: true,
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('[blog/posts POST]', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
