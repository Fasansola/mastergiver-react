/**
 * /admin/blog/[id]/edit — Edit an existing blog post.
 * Fetches the post, authors, and categories server-side, then renders the editor.
 */

import { prisma } from '@/lib/prisma';
import BlogPostForm from '@/components/admin/blog/BlogPostForm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface EditBlogPostPageProps {
  params: Promise<{ id: string }>;
}

const EditBlogPostPage = async ({ params }: EditBlogPostPageProps) => {
  const { id } = await params;

  const [post, authors, categories] = await Promise.all([
    prisma.blogPost.findUnique({
      where: { id },
      include: {
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
      },
    }),
    prisma.blogAuthor.findMany({ orderBy: { name: 'asc' } }),
    prisma.blogCategory.findMany({ orderBy: { name: 'asc' } }),
  ]);

  if (!post) notFound();

  return (
    <BlogPostForm
      post={{
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage,
        status: post.status,
        authorId: post.authorId,
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
        categories: post.categories,
        tags: post.tags,
      }}
      authors={authors.map((a) => ({ id: a.id, name: a.name }))}
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
    />
  );
};

export default EditBlogPostPage;
