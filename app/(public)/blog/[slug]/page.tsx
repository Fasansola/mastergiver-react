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
import { LuArrowLeft, LuClock, LuCalendar } from 'react-icons/lu';
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

export const dynamic = 'force-dynamic';

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
    ? await prisma.blogCategory
        .findUnique({ where: { slug: post.categories[0].category.slug } })
        .then((c) => c?.id)
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
      {/* ── Cover image ───────────────────────────────────────────────────── */}
      {post.coverImage && (
        <Box
          position="relative"
          h={{ base: '260px', md: '420px', lg: '500px' }}
          overflow="hidden"
          bg="background.subtle"
        >
          <NextImage
            src={post.coverImage}
            alt={post.title}
            fill
            style={{ objectFit: 'cover' }}
            priority
            sizes="100vw"
          />
          {/* Gradient overlay at bottom for smooth transition */}
          <Box
            position="absolute"
            bottom="0"
            left="0"
            right="0"
            h="160px"
            bgGradient="to-b"
            gradientFrom="transparent"
            gradientTo="white"
          />
        </Box>
      )}

      {/* ── Post header ───────────────────────────────────────────────────── */}
      <Box
        bg="background.white"
        pt={post.coverImage ? { base: '0', md: '0' } : { base: '48px', lg: '64px' }}
        pb="0"
      >
        <Container maxW="780px">
          {/* Back to blog + breadcrumb */}
          <Box pt={{ base: post.coverImage ? '6' : '0', md: post.coverImage ? '0' : '0' }} pb="8">
            <Link href="/blog">
              <HStack
                gap="2"
                color="text.secondary"
                _hover={{ color: 'brand.primary' }}
                display="inline-flex"
                transition="color 0.15s ease"
              >
                <LuArrowLeft size={14} />
                <Text fontSize="13px" fontWeight="500" className="font-body">
                  Back to Blog
                </Text>
              </HStack>
            </Link>
          </Box>

          {/* Categories */}
          {post.categories.length > 0 && (
            <HStack gap="2" flexWrap="wrap" mb="5">
              {post.categories.map(({ category }) => (
                <Link key={category.slug} href={`/blog/category/${category.slug}`}>
                  <Box
                    px="12px"
                    py="4px"
                    bg="background.lightPurple"
                    border="1px solid"
                    borderColor="brand.lightPrimary"
                    borderRadius="999px"
                    cursor="pointer"
                    _hover={{ bg: 'brand.primary', borderColor: 'brand.primary' }}
                    transition="all 0.15s ease"
                  >
                    <Text
                      fontSize="11px"
                      fontWeight="700"
                      color="brand.primary"
                      className="font-body"
                      textTransform="uppercase"
                      letterSpacing="0.06em"
                    >
                      {category.name}
                    </Text>
                  </Box>
                </Link>
              ))}
            </HStack>
          )}

          {/* Title */}
          <Heading
            className="font-display"
            fontWeight="700"
            fontSize={{ base: '28px', md: '40px', lg: '48px' }}
            lineHeight="118%"
            color="text.heading"
            wordSpacing="0.03em"
            mb="6"
          >
            {post.title}
          </Heading>

          {/* Author + meta row */}
          <HStack gap="4" flexWrap="wrap" pb="8" borderBottom="1px solid" borderColor="border.default">
            <HStack gap="3">
              {post.author.avatar ? (
                <Box w="40px" h="40px" borderRadius="full" overflow="hidden" flexShrink={0} border="2px solid" borderColor="border.default">
                  <NextImage
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                </Box>
              ) : (
                /* Avatar initials fallback */
                <Box
                  w="40px"
                  h="40px"
                  borderRadius="full"
                  bg="brand.primary"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                >
                  <Text fontSize="15px" fontWeight="700" color="white" className="font-body">
                    {post.author.name.charAt(0)}
                  </Text>
                </Box>
              )}
              <Stack gap="0">
                <Text fontSize="14px" fontWeight="600" color="text.primary" className="font-body">
                  {post.author.name}
                </Text>
                <Text fontSize="12px" color="text.secondary" className="font-body">Author</Text>
              </Stack>
            </HStack>

            {/* Divider dot */}
            <Box w="4px" h="4px" borderRadius="full" bg="border.subtle" flexShrink={0} />

            {/* Date */}
            {post.publishedAt && (
              <HStack gap="1.5">
                <LuCalendar size={13} color="#9CA3AF" />
                <Text fontSize="13px" color="text.secondary" className="font-body">
                  {formatPostDate(post.publishedAt)}
                </Text>
              </HStack>
            )}

            {/* Reading time */}
            {post.readingTime && (
              <>
                <Box w="3px" h="3px" borderRadius="full" bg="border.subtle" flexShrink={0} />
                <HStack gap="1.5">
                  <LuClock size={13} color="#9CA3AF" />
                  <Text fontSize="13px" color="text.secondary" className="font-body">
                    {post.readingTime} min read
                  </Text>
                </HStack>
              </>
            )}
          </HStack>
        </Container>
      </Box>

      {/* ── Post content ──────────────────────────────────────────────────── */}
      <Box bg="background.white">
        <Container maxW="780px">
          <Box
            className="blog-content"
            fontSize={{ base: '16px', md: '17px' }}
            lineHeight="185%"
            color="text.primary"
            py={{ base: '10', lg: '12' }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </Container>
      </Box>

      {/* ── Tags + share section ──────────────────────────────────────────── */}
      <Box bg="background.white" pb={{ base: '10', lg: '12' }}>
        <Container maxW="780px">
          <Box pt="6" borderTop="1px solid" borderColor="border.default">
            {post.tags.length > 0 && (
              <HStack gap="2" flexWrap="wrap" mb="0">
                <Text
                  fontSize="12px"
                  color="text.secondary"
                  fontWeight="600"
                  textTransform="uppercase"
                  letterSpacing="0.08em"
                  className="font-body"
                >
                  Tagged:
                </Text>
                {post.tags.map(({ tag }) => (
                  <Box
                    key={tag.slug}
                    px="10px"
                    py="3px"
                    bg="background.section"
                    borderRadius="999px"
                    border="1px solid"
                    borderColor="border.default"
                    _hover={{ borderColor: 'brand.lightPrimary' }}
                    transition="border-color 0.15s ease"
                  >
                    <Text fontSize="12px" color="text.secondary" className="font-body">
                      {tag.name}
                    </Text>
                  </Box>
                ))}
              </HStack>
            )}
          </Box>
        </Container>
      </Box>

      {/* ── Author card ───────────────────────────────────────────────────── */}
      <Box bg="background.section" py={{ base: '10', lg: '12' }}>
        <Container maxW="780px">
          <Box
            bg="background.white"
            borderRadius="16px"
            border="1px solid"
            borderColor="border.default"
            overflow="hidden"
          >
            {/* Purple accent bar */}
            <Box h="4px" bg="brand.primary" />
            <HStack gap="5" p={{ base: '5', md: '7' }} align="start">
              {post.author.avatar ? (
                <Box
                  w={{ base: '56px', md: '72px' }}
                  h={{ base: '56px', md: '72px' }}
                  borderRadius="full"
                  overflow="hidden"
                  flexShrink={0}
                  border="3px solid"
                  borderColor="border.default"
                >
                  <NextImage
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={72}
                    height={72}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                </Box>
              ) : (
                <Box
                  w={{ base: '56px', md: '72px' }}
                  h={{ base: '56px', md: '72px' }}
                  borderRadius="full"
                  bg="brand.primary"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                >
                  <Text fontSize="24px" fontWeight="700" color="white" className="font-body">
                    {post.author.name.charAt(0)}
                  </Text>
                </Box>
              )}
              <Stack gap="1" flex="1">
                <Text
                  fontSize="11px"
                  fontWeight="700"
                  color="brand.primary"
                  textTransform="uppercase"
                  letterSpacing="0.1em"
                  className="font-body"
                >
                  Written by
                </Text>
                <Text fontSize={{ base: '16px', md: '18px' }} fontWeight="700" color="text.heading" className="font-display">
                  {post.author.name}
                </Text>
                {post.author.bio && (
                  <Text
                    fontSize="14px"
                    color="text.secondary"
                    lineHeight="165%"
                    className="font-body"
                    mt="1"
                  >
                    {post.author.bio}
                  </Text>
                )}
              </Stack>
            </HStack>
          </Box>
        </Container>
      </Box>

      {/* ── Back to blog CTA strip ────────────────────────────────────────── */}
      <Box
        bg="background.white"
        borderTop="1px solid"
        borderColor="border.default"
        py="6"
      >
        <Container maxW="780px">
          <HStack justify="space-between" flexWrap="wrap" gap="4">
            <Link href="/blog">
              <HStack
                gap="2"
                color="text.secondary"
                _hover={{ color: 'brand.primary' }}
                transition="color 0.15s ease"
              >
                <LuArrowLeft size={14} />
                <Text fontSize="14px" fontWeight="500" className="font-body">
                  Back to all articles
                </Text>
              </HStack>
            </Link>
            {post.categories[0] && (
              <Link href={`/blog/category/${post.categories[0].category.slug}`}>
                <Text
                  fontSize="13px"
                  fontWeight="600"
                  color="brand.primary"
                  className="font-body"
                  _hover={{ textDecoration: 'underline' }}
                >
                  More in {post.categories[0].category.name} →
                </Text>
              </Link>
            )}
          </HStack>
        </Container>
      </Box>

      {/* ── Related posts ─────────────────────────────────────────────────── */}
      {relatedPosts.length > 0 && (
        <Box
          bg="background.section"
          py={{ base: '60px', lg: '80px' }}
          borderTop="1px solid"
          borderColor="border.default"
        >
          <Container>
            <Stack gap="8">
              <HStack justify="space-between" align="center" flexWrap="wrap" gap="4">
                <Stack gap="1">
                  <Text
                    fontSize="11px"
                    fontWeight="700"
                    color="brand.primary"
                    textTransform="uppercase"
                    letterSpacing="0.1em"
                    className="font-body"
                  >
                    Keep reading
                  </Text>
                  <Heading
                    className="font-display"
                    fontWeight="700"
                    fontSize={{ base: '24px', md: '30px' }}
                    color="text.heading"
                  >
                    Related Articles
                  </Heading>
                </Stack>
                <Link href="/blog">
                  <Text
                    fontSize="14px"
                    fontWeight="600"
                    color="brand.primary"
                    className="font-body"
                    _hover={{ textDecoration: 'underline' }}
                  >
                    View all posts →
                  </Text>
                </Link>
              </HStack>

              <Grid
                templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
                gap="6"
                alignItems="start"
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
