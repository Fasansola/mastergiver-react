/**
 * /blog — Public blog listing page.
 *
 * Shows all published posts in a responsive grid.
 * First post gets a full-width featured horizontal treatment.
 */

import type { Metadata } from 'next';
import { Box, Container, Grid, Heading, HStack, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import PostCard from '@/components/blog/PostCard';
import { HERO_GRADIENT } from '@/lib/theme/gradients';

export const metadata: Metadata = {
  title: 'Blog | MasterGiver',
  description: 'Insights on community impact, business reputation, and giving back.',
  alternates: { canonical: 'https://mastergiver.com/blog' },
};

export const dynamic = 'force-dynamic';

const BlogListingPage = async () => {
  const [posts, allCategories] = await Promise.all([
    prisma.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      include: {
        author: { select: { name: true, avatar: true } },
        categories: { include: { category: { select: { name: true, slug: true } } } },
      },
    }),
    prisma.blogCategory.findMany({ orderBy: { name: 'asc' } }),
  ]);

  // Filter to only categories that have at least one published post
  const publishedCategorySlugs = new Set(
    posts.flatMap((p) => p.categories.map((c) => c.category.slug))
  );
  const categories = allCategories.filter((c) => publishedCategorySlugs.has(c.slug));

  const [featured, ...rest] = posts;

  return (
    <Stack gap="0">
      {/* ── Hero header ─────────────────────────────────────────────────────── */}
      <Box bg={HERO_GRADIENT} py={{ base: '64px', lg: '96px' }}>
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
              lineHeight="140%"
              color="text.heading"
              wordSpacing="0.05em"
            >
              Insights on Impact &amp;{' '}
              <Box as="span" color="brand.primary">
                Reputation
              </Box>
            </Heading>

            <Text
              className="font-body"
              fontSize={{ base: '15px', lg: '17px' }}
              lineHeight="175%"
              color="text.secondary"
              maxW="540px"
            >
              How businesses build lasting trust through community involvement, authentic giving,
              and verified social impact.
            </Text>
          </Stack>
        </Container>
      </Box>

      {/* ── Category filter bar ──────────────────────────────────────────────── */}
      {categories.length > 0 && (
        <Box
          borderBottom="1px solid"
          borderColor="border.default"
          bg="background.white"
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
                  borderColor="brand.primary"
                  cursor="pointer"
                >
                  <Text
                    fontSize="13px"
                    fontWeight="700"
                    color="brand.primary"
                    className="font-body"
                    whiteSpace="nowrap"
                  >
                    All Posts
                  </Text>
                </Box>
              </Link>

              {categories.map((cat) => (
                <Link key={cat.id} href={`/blog/category/${cat.slug}`} style={{ flexShrink: 0 }}>
                  <Box
                    px="5"
                    py="4"
                    borderBottom="2px solid"
                    borderColor="transparent"
                    cursor="pointer"
                    _hover={{ borderColor: 'border.subtle', color: 'text.primary' }}
                  >
                    <Text
                      fontSize="13px"
                      fontWeight="500"
                      color="text.secondary"
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
      )}

      {/* ── Posts ───────────────────────────────────────────────────────────── */}
      <Box bg="background.section" py={{ base: '60px', lg: '80px' }}>
        <Container>
          {posts.length === 0 ? (
            <Box textAlign="center" py="24">
              <Text fontSize="40px" mb="4">✍️</Text>
              <Text fontSize="18px" fontWeight="600" color="text.heading" className="font-display" mb="2">
                No posts yet
              </Text>
              <Text fontSize="15px" color="text.secondary" className="font-body">
                Check back soon — content is on the way.
              </Text>
            </Box>
          ) : (
            <Stack gap="10">
              {/* Featured first post — horizontal card */}
              {featured && <PostCard post={featured} featured />}

              {/* Divider + "More articles" label */}
              {rest.length > 0 && (
                <HStack gap="4" pt="2">
                  <Box flex="1" h="1px" bg="border.default" />
                  <Text
                    fontSize="11px"
                    fontWeight="700"
                    color="text.secondary"
                    textTransform="uppercase"
                    letterSpacing="0.1em"
                    className="font-body"
                    flexShrink={0}
                  >
                    More articles
                  </Text>
                  <Box flex="1" h="1px" bg="border.default" />
                </HStack>
              )}

              {/* Remaining posts in 3-col grid */}
              {rest.length > 0 && (
                <Grid
                  templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
                  gap="6"
                  alignItems="start"
                >
                  {rest.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </Grid>
              )}
            </Stack>
          )}
        </Container>
      </Box>
    </Stack>
  );
};

export default BlogListingPage;
