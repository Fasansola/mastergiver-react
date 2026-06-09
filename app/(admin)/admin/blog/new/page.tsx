/**
 * /admin/blog/new — Create a new blog post.
 * Server component that fetches authors + categories, then renders the client editor.
 */

import { prisma } from '@/lib/prisma';
import BlogPostForm from '@/components/admin/blog/BlogPostForm';
import { Box, Container, Heading, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const NewBlogPostPage = async () => {
  const [authors, categories] = await Promise.all([
    prisma.blogAuthor.findMany({ orderBy: { name: 'asc' } }),
    prisma.blogCategory.findMany({ orderBy: { name: 'asc' } }),
  ]);

  // Guard: nudge admin to create an author first
  if (authors.length === 0) {
    return (
      <Container maxW="600px" py="20" textAlign="center">
        <Stack align="center" gap="4">
          <Heading fontSize="22px" fontWeight="700" color="text.heading" className="font-display">
            Create an author first
          </Heading>
          <Text fontSize="15px" color="text.secondary" className="font-body">
            Every post needs an author. Set one up before writing your first post.
          </Text>
          <Link href="/admin/blog/authors">
            <Box px="5" py="2" bg="brand.primary" borderRadius="6px" cursor="pointer">
              <Text fontSize="14px" fontWeight="600" color="white" className="font-body">
                Go to Authors
              </Text>
            </Box>
          </Link>
        </Stack>
      </Container>
    );
  }

  return (
    <BlogPostForm
      authors={authors.map((a) => ({ id: a.id, name: a.name }))}
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
    />
  );
};

export default NewBlogPostPage;
