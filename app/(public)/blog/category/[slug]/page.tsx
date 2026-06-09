/**
 * /blog/category/[slug] — Posts filtered by category.
 */

import type { Metadata } from 'next';
import { Box, Container, Grid, Heading, HStack, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LuArrowLeft } from 'react-icons/lu';
import { prisma } from '@/lib/prisma';
import PostCard from '@/components/blog/PostCard';
import { HERO_GRADIENT } from '@/lib/theme/gradients';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.blogCategory.findUnique({ where: { slug } });
  if (!category) return {};
  return {
    title: `${category.name} | MasterGiver Blog`,
    alternates: { canonical: `https://mastergiver.com/blog/category/${slug}` },
  };
}

export const dynamic = 'force-dynamic';

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { slug } = await params;

  const [category, rawCategories] = await Promise.all([
    prisma.blogCategory.findUnique({
      where: { slug },
      include: {
        posts: {
          where: { post: { status: 'PUBLISHED' } },
          include: {
            post: {
              include: {
                author: { select: { name: true, avatar: true } },
                categories: { include: { category: { select: { name: true, slug: true } } } },
              },
            },
          },
          orderBy: { post: { publishedAt: 'desc' } },
        },
      },
    }),
    prisma.blogCategory.findMany({ orderBy: { name: 'asc' } }),
  ]);

  if (!category) notFound();

  const posts = category.posts.map((p) => p.post);

  // Only show categories that have at least one published post (always include current)
  const publishedSlugs = new Set(posts.flatMap((p) => p.categories.map((c) => c.category.slug)));
  const filteredCategories = rawCategories.filter(
    (c) => c.slug === slug || publishedSlugs.has(c.slug)
  );

  return (
    <Stack gap="0">
      {/* ── Hero header ─────────────────────────────────────────────────────── */}
      <Box bg={HERO_GRADIENT} py={{ base: '64px', lg: '96px' }} px={{ base: '4', md: '6' }}>
        <Container>
          <Stack gap="6" maxW="700px">
            {/* Eyebrow */}
            <HStack gap="2" display="inline-flex">
              <Box w="20px" h="2px" bg="brand.primary" borderRadius="full" />
              <Text
                className="font-body"
                fontSize="12px"
                fontWeight="700"
                color="brand.primary"
                textTransform="uppercase"
                letterSpacing="0.12em"
              >
                MasterGiver Blog
              </Text>
            </HStack>

            <Heading
              className="font-display"
              fontWeight="700"
              fontSize={{ base: '36px', md: '52px', lg: '60px' }}
              lineHeight="115%"
              color="text.heading"
            >
              {category.name}
            </Heading>

            <Text
              className="font-body"
              fontSize={{ base: '14px', md: '15px' }}
              color="text.secondary"
            >
              {posts.length} published {posts.length === 1 ? 'article' : 'articles'}
            </Text>
          </Stack>
        </Container>
      </Box>

      {/* ── Underline filter bar ─────────────────────────────────────────────── */}
      <Box
        borderBottom="1px solid"
        borderColor="border.default"
        bg="background.white"
        px={{ base: '4', md: '6' }}
        position="sticky"
        top="0"
        zIndex="10"
      >
        <Container>
          <HStack gap="0" overflowX="auto" py="1" css={{ scrollbarWidth: 'none' }}>
            {/* "All" tab */}
            <Link href="/blog" style={{ flexShrink: 0 }}>
              <Box
                px="5"
                py="4"
                borderBottom="2px solid"
                borderColor="transparent"
                cursor="pointer"
                _hover={{ borderColor: 'border.subtle' }}
              >
                <Text
                  fontSize="13px"
                  fontWeight="500"
                  color="text.secondary"
                  className="font-body"
                  whiteSpace="nowrap"
                >
                  All Posts
                </Text>
              </Box>
            </Link>

            {filteredCategories.map((cat) => (
              <Link key={cat.id} href={`/blog/category/${cat.slug}`} style={{ flexShrink: 0 }}>
                <Box
                  px="5"
                  py="4"
                  borderBottom="2px solid"
                  borderColor={cat.slug === slug ? 'brand.primary' : 'transparent'}
                  cursor="pointer"
                  _hover={{ borderColor: cat.slug === slug ? 'brand.primary' : 'border.subtle' }}
                >
                  <Text
                    fontSize="13px"
                    fontWeight={cat.slug === slug ? '700' : '500'}
                    color={cat.slug === slug ? 'brand.primary' : 'text.secondary'}
                    className="font-body"
                    whiteSpace="nowrap"
                  >
                    {cat.name}
                  </Text>
                </Box>
              </Link>
            ))}
          </HStack>
        </Container>
      </Box>

      {/* ── Posts grid ──────────────────────────────────────────────────────── */}
      <Box bg="background.section" px={{ base: '4', md: '6' }} py={{ base: '60px', lg: '80px' }}>
        <Container>
          {posts.length === 0 ? (
            <Box textAlign="center" py="24">
              <Text fontSize="40px" mb="4">✍️</Text>
              <Text fontSize="18px" fontWeight="600" color="text.heading" className="font-display" mb="2">
                No posts yet
              </Text>
              <Text fontSize="15px" color="text.secondary" className="font-body">
                No articles in this category yet — check back soon.
              </Text>
              <Box mt="6">
                <Link href="/blog">
                  <HStack
                    gap="2"
                    color="brand.primary"
                    justify="center"
                    _hover={{ textDecoration: 'underline' }}
                  >
                    <LuArrowLeft size={14} />
                    <Text fontSize="14px" fontWeight="600" className="font-body">
                      Browse all posts
                    </Text>
                  </HStack>
                </Link>
              </Box>
            </Box>
          ) : (
            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
              gap="6"
              alignItems="start"
            >
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </Stack>
  );
};

export default CategoryPage;
