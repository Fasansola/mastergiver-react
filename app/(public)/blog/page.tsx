/**
 * /blog — Public blog listing page.
 *
 * Shows all published posts in a responsive grid.
 * First post gets a full-width featured treatment.
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

export const revalidate = 60; // ISR — revalidate every 60 seconds

const BlogListingPage = async () => {
  const [posts, categories] = await Promise.all([
    prisma.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      include: {
        author: { select: { name: true, avatar: true } },
        categories: { include: { category: { select: { name: true, slug: true } } } },
      },
    }),
    prisma.blogCategory.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { posts: { where: { post: { status: 'PUBLISHED' } } } } } },
    }),
  ]);

  const [featured, ...rest] = posts;

  return (
    <Stack gap="0">
      {/* Hero header */}
      <Box bg={HERO_GRADIENT} py={{ base: '60px', lg: '80px' }} px={{ base: '4', md: '6' }}>
        <Container>
          <Stack gap="4" maxW="640px">
            <Heading
              className="font-display"
              fontWeight="700"
              fontSize={{ base: '38px', md: '52px', lg: '64px' }}
              lineHeight="115%"
              color="brand.primary"
              wordSpacing="0.1em"
            >
              The MasterGiver Blog
            </Heading>
            <Text
              className="font-body"
              fontSize={{ base: '16px', lg: '18px' }}
              lineHeight="170%"
              color="text.secondary"
            >
              Insights on community impact, business reputation, and what it means to give back.
            </Text>
          </Stack>
        </Container>
      </Box>

      <Container py={{ base: '60px', lg: '80px' }} px={{ base: '4', md: '6' }}>
        <Stack gap="12">
          {/* Category filter tabs */}
          {categories.length > 0 && (
            <HStack gap="3" flexWrap="wrap">
              <Link href="/blog">
                <Box
                  px="4"
                  py="2"
                  borderRadius="999px"
                  bg="brand.primary"
                  cursor="pointer"
                >
                  <Text fontSize="13px" fontWeight="600" color="white" className="font-body">
                    All
                  </Text>
                </Box>
              </Link>
              {categories
                .filter((c) => c._count.posts > 0)
                .map((cat) => (
                  <Link key={cat.id} href={`/blog/category/${cat.slug}`}>
                    <Box
                      px="4"
                      py="2"
                      borderRadius="999px"
                      border="1px solid"
                      borderColor="border.default"
                      bg="background.white"
                      cursor="pointer"
                      _hover={{ borderColor: 'brand.primary' }}
                    >
                      <Text fontSize="13px" fontWeight="500" color="text.primary" className="font-body">
                        {cat.name}
                      </Text>
                    </Box>
                  </Link>
                ))}
            </HStack>
          )}

          {posts.length === 0 ? (
            <Box textAlign="center" py="20">
              <Text fontSize="16px" color="text.secondary" className="font-body">
                No posts published yet — check back soon.
              </Text>
            </Box>
          ) : (
            <Stack gap="8">
              {/* Featured first post */}
              {featured && (
                <Box>
                  <PostCard post={featured} featured />
                </Box>
              )}

              {/* Remaining posts grid */}
              {rest.length > 0 && (
                <Grid
                  templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
                  gap="6"
                >
                  {rest.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </Grid>
              )}
            </Stack>
          )}
        </Stack>
      </Container>
    </Stack>
  );
};

export default BlogListingPage;
