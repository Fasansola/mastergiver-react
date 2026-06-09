/**
 * PostCard — single post preview card used on the blog listing page.
 */

import { Box, Stack, Text, HStack } from '@chakra-ui/react';
import NextImage from 'next/image';
import Link from 'next/link';
import { formatPostDate, excerptFromContent } from '@/lib/blog/utils';

interface PostCardProps {
  post: {
    slug: string;
    title: string;
    excerpt: string | null;
    content: string;
    coverImage: string | null;
    publishedAt: Date | string | null;
    readingTime: number | null;
    author: { name: string; avatar: string | null };
    categories: { category: { name: string; slug: string } }[];
  };
  featured?: boolean;
}

const PostCard = ({ post, featured = false }: PostCardProps) => {
  const displayExcerpt = post.excerpt || excerptFromContent(post.content, 140);
  const category = post.categories[0]?.category;

  return (
    <Link href={`/blog/${post.slug}`} style={{ display: 'block', height: '100%' }}>
      <Stack
        gap="0"
        bg="background.white"
        border="1px solid"
        borderColor="border.default"
        borderRadius="12px"
        overflow="hidden"
        h="100%"
        _hover={{ borderColor: 'brand.primary', transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(47,43,119,0.08)' }}
        transition="all 0.2s"
        cursor="pointer"
      >
        {/* Cover image */}
        {post.coverImage ? (
          <Box
            overflow="hidden"
            flexShrink={0}
            h={featured ? { base: '220px', md: '300px' } : '200px'}
          >
            <NextImage
              src={post.coverImage}
              alt={post.title}
              width={featured ? 900 : 600}
              height={featured ? 300 : 200}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
        ) : (
          /* Fallback gradient placeholder */
          <Box
            h={featured ? { base: '160px', md: '220px' } : '160px'}
            bg="linear-gradient(135deg, #F1F0FF 0%, #E8F0FF 100%)"
            flexShrink={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize="40px">✍️</Text>
          </Box>
        )}

        {/* Content */}
        <Stack gap="3" p={{ base: '5', md: featured ? '6' : '5' }} flex="1">
          {/* Category chip */}
          {category && (
            <Box
              display="inline-flex"
              w="fit-content"
              px="10px"
              py="3px"
              bg="background.lightPurple"
              border="1px solid"
              borderColor="brand.lightPrimary"
              borderRadius="999px"
            >
              <Text fontSize="12px" fontWeight="600" color="brand.primary" className="font-body">
                {category.name}
              </Text>
            </Box>
          )}

          {/* Title */}
          <Text
            className="font-display"
            fontWeight="700"
            fontSize={featured ? { base: '20px', md: '24px' } : '18px'}
            lineHeight="130%"
            color="text.heading"
          >
            {post.title}
          </Text>

          {/* Excerpt */}
          <Text
            className="font-body"
            fontSize="14px"
            lineHeight="170%"
            color="text.secondary"
            flex="1"
          >
            {displayExcerpt}
          </Text>

          {/* Author + meta */}
          <HStack gap="3" pt="1" flexWrap="wrap">
            {post.author.avatar && (
              <Box w="24px" h="24px" borderRadius="full" overflow="hidden" flexShrink={0}>
                <NextImage
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={24}
                  height={24}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              </Box>
            )}
            <Text fontSize="13px" fontWeight="600" color="text.primary" className="font-body">
              {post.author.name}
            </Text>
            <Text fontSize="13px" color="text.secondary" className="font-body">·</Text>
            {post.publishedAt && (
              <Text fontSize="13px" color="text.secondary" className="font-body">
                {formatPostDate(post.publishedAt)}
              </Text>
            )}
            {post.readingTime && (
              <>
                <Text fontSize="13px" color="text.secondary" className="font-body">·</Text>
                <Text fontSize="13px" color="text.secondary" className="font-body">
                  {post.readingTime} min read
                </Text>
              </>
            )}
          </HStack>
        </Stack>
      </Stack>
    </Link>
  );
};

export default PostCard;
