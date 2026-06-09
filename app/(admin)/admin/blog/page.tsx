/**
 * /admin/blog — Post management list.
 * Shows all posts grouped by status with quick links to edit.
 */

import {
  Box,
  Container,
  Grid,
  Heading,
  HStack,
  Stack,
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import PostStatusBadge from '@/components/admin/blog/PostStatusBadge';
import { formatPostDate } from '@/lib/blog/utils';
import { LuPenLine, LuPlus } from 'react-icons/lu';
import DuplicatePostButton from '@/components/admin/blog/DuplicatePostButton';

export const dynamic = 'force-dynamic';

const AdminBlogPage = async () => {
  const posts = await prisma.blogPost.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      author: { select: { name: true } },
      categories: { include: { category: { select: { name: true } } } },
    },
  });

  const published = posts.filter((p) => p.status === 'PUBLISHED');
  const drafts = posts.filter((p) => p.status === 'DRAFT');
  const archived = posts.filter((p) => p.status === 'ARCHIVED');

  return (
    <Container maxW="1200px">
      <Stack gap="8">
        {/* Header */}
        <HStack justify="space-between" align="start" flexWrap="wrap" gap="4">
          <Stack gap="1">
            <Heading
              as="h1"
              className="font-display"
              fontWeight="700"
              fontSize={{ base: '24px', lg: '30px' }}
              color="#1E1B4B"
            >
              Blog Posts
            </Heading>
            <Text className="font-body" fontSize="14px" color="#6B7280">
              {posts.length} total · {published.length} published · {drafts.length} draft
            </Text>
          </Stack>

          <HStack gap="3">
            <Link href="/admin/blog/authors">
              <Box
                px="4"
                py="2"
                border="1px solid"
                borderColor="border.default"
                borderRadius="6px"
                bg="background.white"
                cursor="pointer"
                _hover={{ borderColor: 'brand.primary' }}
              >
                <Text fontSize="14px" fontWeight="600" color="text.primary" className="font-body">
                  Authors
                </Text>
              </Box>
            </Link>
            <Link href="/admin/blog/categories">
              <Box
                px="4"
                py="2"
                border="1px solid"
                borderColor="border.default"
                borderRadius="6px"
                bg="background.white"
                cursor="pointer"
                _hover={{ borderColor: 'brand.primary' }}
              >
                <Text fontSize="14px" fontWeight="600" color="text.primary" className="font-body">
                  Categories
                </Text>
              </Box>
            </Link>
            <Link href="/admin/blog/new">
              <HStack
                gap="2"
                px="4"
                py="2"
                bg="brand.primary"
                borderRadius="6px"
                cursor="pointer"
                _hover={{ bg: 'brand.primaryHover' }}
              >
                <LuPlus size={16} color="white" />
                <Text fontSize="14px" fontWeight="600" color="white" className="font-body">
                  New Post
                </Text>
              </HStack>
            </Link>
          </HStack>
        </HStack>

        {/* Post sections */}
        {[
          { label: 'Published', items: published },
          { label: 'Drafts', items: drafts },
          { label: 'Archived', items: archived },
        ].map(({ label, items }) =>
          items.length === 0 ? null : (
            <Stack key={label} gap="3">
              <Text
                fontSize="12px"
                fontWeight="700"
                color="text.secondary"
                textTransform="uppercase"
                letterSpacing="0.06em"
                className="font-body"
              >
                {label} ({items.length})
              </Text>

              <Stack gap="2">
                {items.map((post) => (
                  <HStack
                    key={post.id}
                    justify="space-between"
                    bg="background.white"
                    border="1px solid"
                    borderColor="border.default"
                    borderRadius="8px"
                    px="5"
                    py="4"
                    flexWrap="wrap"
                    gap="3"
                    _hover={{ borderColor: 'brand.primary' }}
                    transition="border-color 0.15s"
                  >
                    <Stack gap="1" flex="1" minW="0">
                      <Text
                        fontSize="15px"
                        fontWeight="600"
                        color="text.heading"
                        className="font-body"
                        truncate
                      >
                        {post.title}
                      </Text>
                      <HStack gap="3" flexWrap="wrap">
                        <Text fontSize="12px" color="text.secondary" className="font-body">
                          {post.author.name}
                        </Text>
                        {post.categories.length > 0 && (
                          <Text fontSize="12px" color="text.secondary" className="font-body">
                            {post.categories.map((c) => c.category.name).join(', ')}
                          </Text>
                        )}
                        <Text fontSize="12px" color="text.secondary" className="font-body">
                          {formatPostDate(post.updatedAt)}
                        </Text>
                        {post.readingTime && (
                          <Text fontSize="12px" color="text.secondary" className="font-body">
                            {post.readingTime} min read
                          </Text>
                        )}
                      </HStack>
                    </Stack>

                    <HStack gap="3" flexWrap="wrap">
                      <PostStatusBadge status={post.status} />
                      <DuplicatePostButton postId={post.id} />
                      <Link href={`/admin/blog/${post.id}/edit`}>
                        <HStack
                          gap="1"
                          px="3"
                          py="1"
                          border="1px solid"
                          borderColor="border.default"
                          borderRadius="6px"
                          cursor="pointer"
                          _hover={{ borderColor: 'brand.primary', color: 'brand.primary' }}
                          color="text.secondary"
                          transition="all 0.15s"
                        >
                          <LuPenLine size={13} />
                          <Text fontSize="13px" fontWeight="500" className="font-body">Edit</Text>
                        </HStack>
                      </Link>
                    </HStack>
                  </HStack>
                ))}
              </Stack>
            </Stack>
          )
        )}

        {posts.length === 0 && (
          <Box
            textAlign="center"
            py="20"
            bg="background.white"
            border="1px dashed"
            borderColor="border.default"
            borderRadius="8px"
          >
            <Stack align="center" gap="3">
              <Text fontSize="16px" fontWeight="600" color="text.heading" className="font-body">
                No posts yet
              </Text>
              <Text fontSize="14px" color="text.secondary" className="font-body">
                Create your first blog post to get started.
              </Text>
              <Link href="/admin/blog/new">
                <HStack gap="2" px="4" py="2" bg="brand.primary" borderRadius="6px">
                  <LuPlus size={16} color="white" />
                  <Text fontSize="14px" fontWeight="600" color="white" className="font-body">
                    Write First Post
                  </Text>
                </HStack>
              </Link>
            </Stack>
          </Box>
        )}
      </Stack>
    </Container>
  );
};

export default AdminBlogPage;
