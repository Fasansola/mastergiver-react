/**
 * /blog/[slug] — Individual blog post detail page.
 *
 * Renders the HTML content produced by the BlockNote editor.
 * Author card, categories, reading time, and related posts included.
 */

import type { Metadata } from 'next';
import {
  Box,
  Container,
  Grid,
  Heading,
  HStack,
  Stack,
  Text,
} from '@chakra-ui/react';
import NextImage from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PostCard from '@/components/blog/PostCard';
import { formatPostDate, excerptFromContent } from '@/lib/blog/utils';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { author: { select: { name: true } } },
  });
  if (!post || post.status !== 'PUBLISHED') return {};

  const title = post.metaTitle ?? post.title;
  const description = post.metaDescription ?? post.excerpt ?? excerptFromContent(post.content, 160);

  return {
    title: `${title} | MasterGiver Blog`,
    description,
    alternates: { canonical: `https://mastergiver.com/blog/${slug}` },
    openGraph: { title, description, images: post.coverImage ? [post.coverImage] : [] },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export const revalidate = 60;

const BlogPostPage = async ({ params }: PostPageProps) => {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: {
      author: { select: { name: true, avatar: true, bio: true } },
      categories: { include: { category: { select: { name: true, slug: true } } } },
      tags: { include: { tag: { select: { name: true, slug: true } } } },
    },
  });

  if (!post || post.status !== 'PUBLISHED') notFound();

  // Related posts — same first category, exclude this post
  const firstCategoryId = post.categories[0]?.category
    ? await prisma.blogCategory.findUnique({ where: { slug: post.categories[0].category.slug } }).then((c) => c?.id)
    : null;

  const relatedPosts = firstCategoryId
    ? await prisma.blogPost.findMany({
        where: {
          status: 'PUBLISHED',
          slug: { not: slug },
          categories: { some: { categoryId: firstCategoryId } },
        },
        take: 3,
        orderBy: { publishedAt: 'desc' },
        include: {
          author: { select: { name: true, avatar: true } },
          categories: { include: { category: { select: { name: true, slug: true } } } },
        },
      })
    : [];

  return (
    <Stack gap="0">
      {/* Cover image */}
      {post.coverImage && (
        <Box h={{ base: '240px', md: '400px' }} overflow="hidden">
          <NextImage
            src={post.coverImage}
            alt={post.title}
            width={1200}
            height={400}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            priority
          />
        </Box>
      )}

      <Container maxW="780px" py={{ base: '48px', lg: '72px' }} px={{ base: '4', md: '6' }}>
        <Stack gap="10">
          {/* Post header */}
          <Stack gap="5">
            {/* Categories */}
            {post.categories.length > 0 && (
              <HStack gap="2" flexWrap="wrap">
                {post.categories.map(({ category }) => (
                  <Link key={category.slug} href={`/blog/category/${category.slug}`}>
                    <Box
                      px="10px"
                      py="3px"
                      bg="background.lightPurple"
                      border="1px solid"
                      borderColor="brand.lightPrimary"
                      borderRadius="999px"
                      cursor="pointer"
                    >
                      <Text fontSize="12px" fontWeight="600" color="brand.primary" className="font-body">
                        {category.name}
                      </Text>
                    </Box>
                  </Link>
                ))}
              </HStack>
            )}

            <Heading
              className="font-display"
              fontWeight="700"
              fontSize={{ base: '28px', md: '40px', lg: '48px' }}
              lineHeight="120%"
              color="text.heading"
              wordSpacing="0.05em"
            >
              {post.title}
            </Heading>

            {/* Author + meta row */}
            <HStack gap="3" flexWrap="wrap">
              {post.author.avatar && (
                <Box w="36px" h="36px" borderRadius="full" overflow="hidden" flexShrink={0}>
                  <NextImage
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={36}
                    height={36}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                </Box>
              )}
              <Stack gap="0">
                <Text fontSize="14px" fontWeight="600" color="text.primary" className="font-body">
                  {post.author.name}
                </Text>
                <HStack gap="2">
                  {post.publishedAt && (
                    <Text fontSize="13px" color="text.secondary" className="font-body">
                      {formatPostDate(post.publishedAt)}
                    </Text>
                  )}
                  {post.readingTime && (
                    <>
                      <Text fontSize="13px" color="text.secondary">·</Text>
                      <Text fontSize="13px" color="text.secondary" className="font-body">
                        {post.readingTime} min read
                      </Text>
                    </>
                  )}
                </HStack>
              </Stack>
            </HStack>
          </Stack>

          {/* ── Post content ── */}
          {/* The `blog-content` class applies global prose styles defined in globals.css */}
          <Box
            className="blog-content"
            fontSize={{ base: '16px', md: '17px' }}
            lineHeight="180%"
            color="text.primary"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags.length > 0 && (
            <HStack gap="2" flexWrap="wrap" pt="4" borderTop="1px solid" borderColor="border.default">
              <Text fontSize="13px" color="text.secondary" fontWeight="500" className="font-body">Tags:</Text>
              {post.tags.map(({ tag }) => (
                <Box
                  key={tag.slug}
                  px="10px"
                  py="3px"
                  bg="background.section"
                  borderRadius="999px"
                  border="1px solid"
                  borderColor="border.default"
                >
                  <Text fontSize="12px" color="text.secondary" className="font-body">{tag.name}</Text>
                </Box>
              ))}
            </HStack>
          )}

          {/* Author card */}
          <Box
            bg="background.subtle"
            border="1px solid"
            borderColor="border.default"
            borderRadius="12px"
            p="6"
          >
            <HStack gap="4" align="start">
              {post.author.avatar && (
                <Box w="56px" h="56px" borderRadius="full" overflow="hidden" flexShrink={0}>
                  <NextImage
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={56}
                    height={56}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                </Box>
              )}
              <Stack gap="1">
                <Text fontSize="15px" fontWeight="700" color="text.heading" className="font-body">
                  {post.author.name}
                </Text>
                {post.author.bio && (
                  <Text fontSize="14px" color="text.secondary" lineHeight="160%" className="font-body">
                    {post.author.bio}
                  </Text>
                )}
              </Stack>
            </HStack>
          </Box>
        </Stack>
      </Container>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <Box bg="background.section" py={{ base: '60px', lg: '80px' }} px={{ base: '4', md: '6' }}>
          <Container>
            <Stack gap="8">
              <Heading
                className="font-display"
                fontWeight="700"
                fontSize={{ base: '24px', md: '30px' }}
                color="text.heading"
              >
                Related Posts
              </Heading>
              <Grid
                templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
                gap="6"
              >
                {relatedPosts.map((p) => (
                  <PostCard key={p.id} post={p} />
                ))}
              </Grid>
            </Stack>
          </Container>
        </Box>
      )}
    </Stack>
  );
};

export default BlogPostPage;
