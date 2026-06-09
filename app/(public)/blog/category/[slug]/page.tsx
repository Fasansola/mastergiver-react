/**
 * /blog/category/[slug] — Posts filtered by category.
 */

import type { Metadata } from 'next';
import { Box, Container, Grid, Heading, HStack, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
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
      {/* Header */}
      <Box bg={HERO_GRADIENT} py={{ base: '60px', lg: '80px' }} px={{ base: '4', md: '6' }}>
        <Container>
          <Stack gap="3">
            <Link href="/blog">
              <Text fontSize="14px" color="brand.lightPrimary" fontWeight="500" className="font-body"
                _hover={{ textDecoration: 'underline' }}>
                ← All posts
              </Text>
            </Link>
            <Heading
              className="font-display"
              fontWeight="700"
              fontSize={{ base: '32px', md: '48px' }}
              color="brand.primary"
              wordSpacing="0.1em"
            >
              {category.name}
            </Heading>
            <Text fontSize="15px" color="text.secondary" className="font-body">
              {posts.length} post{posts.length !== 1 ? 's' : ''}
            </Text>
          </Stack>
        </Container>
      </Box>

      <Container py={{ base: '60px', lg: '80px' }} px={{ base: '4', md: '6' }}>
        <Stack gap="10">
          {/* Category tabs */}
          <HStack gap="3" flexWrap="wrap">
            <Link href="/blog">
              <Box px="4" py="2" borderRadius="999px" border="1px solid" borderColor="border.default" bg="background.white" cursor="pointer" _hover={{ borderColor: 'brand.primary' }}>
                <Text fontSize="13px" fontWeight="500" color="text.primary" className="font-body">All</Text>
              </Box>
            </Link>
            {filteredCategories
              .map((cat) => (
                <Link key={cat.id} href={`/blog/category/${cat.slug}`}>
                  <Box
                    px="4"
                    py="2"
                    borderRadius="999px"
                    bg={cat.slug === slug ? 'brand.primary' : 'background.white'}
                    border="1px solid"
                    borderColor={cat.slug === slug ? 'brand.primary' : 'border.default'}
                    cursor="pointer"
                    _hover={{ borderColor: 'brand.primary' }}
                  >
                    <Text fontSize="13px" fontWeight={cat.slug === slug ? '600' : '500'} color={cat.slug === slug ? 'white' : 'text.primary'} className="font-body">
                      {cat.name}
                    </Text>
                  </Box>
                </Link>
              ))}
          </HStack>

          {posts.length === 0 ? (
            <Box textAlign="center" py="20">
              <Text fontSize="16px" color="text.secondary" className="font-body">
                No posts in this category yet.
              </Text>
            </Box>
          ) : (
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap="6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </Grid>
          )}
        </Stack>
      </Container>
    </Stack>
  );
};

export default CategoryPage;
