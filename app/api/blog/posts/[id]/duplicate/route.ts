/**
 * POST /api/blog/posts/[id]/duplicate
 *
 * Creates a DRAFT copy of an existing post. Copies all content fields and
 * re-links the same categories and tags. The new post gets:
 *   - title: "Copy of [original title]"
 *   - slug: "[original-slug]-copy" (incremented to "-copy-2", "-copy-3" if taken)
 *   - status: DRAFT
 *   - publishedAt: null
 *   - All other fields cloned from the original
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(_req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    const { id } = await params;

    // Fetch original post with all relations
    const original = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        categories: { select: { categoryId: true } },
        tags: { select: { tagId: true } },
      },
    });

    if (!original) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Generate a unique slug — try "[slug]-copy", then "-copy-2", "-copy-3", …
    let candidateSlug = `${original.slug}-copy`;
    let suffix = 2;
    while (await prisma.blogPost.findUnique({ where: { slug: candidateSlug } })) {
      candidateSlug = `${original.slug}-copy-${suffix}`;
      suffix++;
    }

    // Create the duplicated post
    const duplicate = await prisma.blogPost.create({
      data: {
        title: `Copy of ${original.title}`,
        slug: candidateSlug,
        content: original.content,
        excerpt: original.excerpt,
        coverImage: original.coverImage,
        status: 'DRAFT',
        publishedAt: null,
        readingTime: original.readingTime,
        authorId: original.authorId,
        metaTitle: original.metaTitle,
        metaDescription: original.metaDescription,
        // Re-link the same categories
        categories: {
          create: original.categories.map((c) => ({ categoryId: c.categoryId })),
        },
        // Re-link the same tags
        tags: {
          create: original.tags.map((t) => ({ tagId: t.tagId })),
        },
      },
    });

    return NextResponse.json({ id: duplicate.id }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/blog/posts/[id]/duplicate]', err);
    return NextResponse.json({ error: 'Failed to duplicate post' }, { status: 500 });
  }
}
