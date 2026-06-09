/**
 * GET    /api/blog/posts/[id]  — fetch a single post by id or slug
 * PUT    /api/blog/posts/[id]  — update a post (ADMIN only)
 * DELETE /api/blog/posts/[id]  — delete a post (ADMIN only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { slugify, calculateReadingTime } from '@/lib/blog/utils';

const UpdatePostSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  excerpt: z.string().optional().nullable(),
  content: z.string().optional(),
  coverImage: z.string().optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  authorId: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
  tagNames: z.array(z.string()).optional(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
});

const postInclude = {
  author: { select: { id: true, name: true, avatar: true, slug: true, bio: true } },
  categories: { include: { category: { select: { id: true, name: true, slug: true } } } },
  tags: { include: { tag: { select: { id: true, name: true, slug: true } } } },
} as const;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Support lookup by either cuid (id) or slug
    const post = await prisma.blogPost.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: postInclude,
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Non-admins can only view published posts
    const session = await auth();
    if (post.status !== 'PUBLISHED' && session?.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('[blog/posts/[id] GET]', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = UpdatePostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const data = parsed.data;

    // If slug is changing, ensure it's still unique
    if (data.slug && data.slug !== existing.slug) {
      const conflict = await prisma.blogPost.findUnique({ where: { slug: data.slug } });
      if (conflict) {
        return NextResponse.json({ error: 'A post with this slug already exists.' }, { status: 409 });
      }
    }

    // Auto-update slug when title changes (only if slug was not explicitly provided)
    const slug = data.slug ?? (data.title ? slugify(data.title) : existing.slug);

    // Set publishedAt when first publishing
    let publishedAt = existing.publishedAt;
    if (data.status === 'PUBLISHED' && !publishedAt) {
      publishedAt = new Date();
    }

    const readingTime = data.content !== undefined
      ? calculateReadingTime(data.content)
      : existing.readingTime;

    // Replace categories if provided
    if (data.categoryIds !== undefined) {
      await prisma.blogPostCategory.deleteMany({ where: { postId: id } });
    }

    // Replace tags if provided
    if (data.tagNames !== undefined) {
      await prisma.blogPostTag.deleteMany({ where: { postId: id } });
    }

    const tagConnections = data.tagNames
      ? await Promise.all(
          data.tagNames.map(async (name) => {
            const tagSlug = slugify(name);
            const tag = await prisma.blogTag.upsert({
              where: { slug: tagSlug },
              update: {},
              create: { name: name.trim(), slug: tagSlug },
            });
            return { tagId: tag.id };
          })
        )
      : undefined;

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage,
        ...(data.status && { status: data.status }),
        publishedAt,
        readingTime,
        ...(data.authorId && { authorId: data.authorId }),
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        ...(data.categoryIds !== undefined && {
          categories: { create: data.categoryIds.map((categoryId) => ({ categoryId })) },
        }),
        ...(tagConnections !== undefined && {
          tags: { create: tagConnections },
        }),
      },
      include: postInclude,
    });

    return NextResponse.json({ post });
  } catch (error) {
    console.error('[blog/posts/[id] PUT]', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[blog/posts/[id] DELETE]', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
