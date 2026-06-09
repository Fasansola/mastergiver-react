/**
 * PostCard — post preview card for the blog listing page.
 *
 * featured=true  → horizontal split layout on desktop (image left, content right)
 * featured=false → standard vertical card with image on top
 */

import { Box, Stack, Text, HStack } from '@chakra-ui/react';
import NextImage from 'next/image';
import Link from 'next/link';
import { LuArrowRight, LuClock } from 'react-icons/lu';
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

// ─── Fallback cover placeholder ───────────────────────────────────────────────

const CoverPlaceholder = ({ height }: { height: string }) => (
  <Box
    h={height}
    w="100%"
    bg="linear-gradient(135deg, #F1F0FF 0%, #E0EAFF 50%, #EEF6FF 100%)"
    display="flex"
    alignItems="center"
    justifyContent="center"
    flexShrink={0}
  >
    <Text fontSize="48px" opacity={0.5}>✍️</Text>
  </Box>
);

// ─── Main component ───────────────────────────────────────────────────────────

const PostCard = ({ post, featured = false }: PostCardProps) => {
  const displayExcerpt = post.excerpt || excerptFromContent(post.content, featured ? 200 : 130);
  const category = post.categories[0]?.category;

  if (featured) {
    return (
      <Link href={`/blog/${post.slug}`} style={{ display: 'block' }}>
        <Stack
          direction={{ base: 'column', lg: 'row' }}
          bg="background.white"
          borderRadius="16px"
          overflow="hidden"
          boxShadow="0 2px 12px rgba(47,43,119,0.07), 0 1px 3px rgba(0,0,0,0.04)"
          _hover={{
            boxShadow: '0 12px 40px rgba(47,43,119,0.13)',
            transform: 'translateY(-3px)',
          }}
          transition="all 0.25s ease"
          cursor="pointer"
          minH={{ lg: '380px' }}
        >
          {/* Image — 50% on desktop, full width on mobile */}
          <Box
            w={{ base: '100%', lg: '50%' }}
            h={{ base: '240px', lg: 'auto' }}
            position="relative"
            overflow="hidden"
            flexShrink={0}
          >
            {post.coverImage ? (
              <NextImage
                src={post.coverImage}
                alt={post.title}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <CoverPlaceholder height="100%" />
            )}
            {/* Category chip overlaid on image */}
            {category && (
              <Box
                position="absolute"
                top="4"
                left="4"
                px="12px"
                py="5px"
                bg="white"
                borderRadius="999px"
                boxShadow="0 2px 8px rgba(0,0,0,0.12)"
              >
                <Text fontSize="11px" fontWeight="700" color="brand.primary" textTransform="uppercase" letterSpacing="0.06em" className="font-body">
                  {category.name}
                </Text>
              </Box>
            )}
          </Box>

          {/* Content */}
          <Stack
            gap="5"
            p={{ base: '6', lg: '10' }}
            justify="center"
            flex="1"
          >
            {/* Featured label */}
            <HStack gap="2">
              <Box w="24px" h="2px" bg="brand.primary" borderRadius="full" />
              <Text fontSize="11px" fontWeight="700" color="brand.primary" textTransform="uppercase" letterSpacing="0.1em" className="font-body">
                Featured
              </Text>
            </HStack>

            <Text
              className="font-display"
              fontWeight="700"
              fontSize={{ base: '22px', md: '28px', lg: '32px' }}
              lineHeight="125%"
              color="text.heading"
            >
              {post.title}
            </Text>

            <Text
              className="font-body"
              fontSize={{ base: '14px', md: '15px' }}
              lineHeight="175%"
              color="text.secondary"
            >
              {displayExcerpt}
            </Text>

            {/* Author + meta */}
            <Stack gap="3">
              <HStack gap="3" flexWrap="wrap">
                {post.author.avatar && (
                  <Box w="28px" h="28px" borderRadius="full" overflow="hidden" flexShrink={0}>
                    <NextImage src={post.author.avatar} alt={post.author.name} width={28} height={28} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                  </Box>
                )}
                <Text fontSize="13px" fontWeight="600" color="text.primary" className="font-body">{post.author.name}</Text>
                {post.publishedAt && (
                  <>
                    <Text fontSize="13px" color="border.subtle">·</Text>
                    <Text fontSize="13px" color="text.secondary" className="font-body">{formatPostDate(post.publishedAt)}</Text>
                  </>
                )}
                {post.readingTime && (
                  <HStack gap="1">
                    <LuClock size={12} color="#9CA3AF" />
                    <Text fontSize="13px" color="text.secondary" className="font-body">{post.readingTime} min read</Text>
                  </HStack>
                )}
              </HStack>

              {/* Read CTA */}
              <HStack gap="1" color="brand.primary" _groupHover={{ gap: '2' }}>
                <Text fontSize="14px" fontWeight="600" className="font-body">Read article</Text>
                <LuArrowRight size={15} />
              </HStack>
            </Stack>
          </Stack>
        </Stack>
      </Link>
    );
  }

  // ── Regular card ────────────────────────────────────────────────────────────
  return (
    <Link href={`/blog/${post.slug}`} style={{ display: 'block', height: '100%' }}>
      <Stack
        gap="0"
        bg="background.white"
        borderRadius="14px"
        overflow="hidden"
        h="100%"
        boxShadow="0 1px 4px rgba(0,0,0,0.06), 0 2px 12px rgba(47,43,119,0.05)"
        _hover={{
          boxShadow: '0 8px 32px rgba(47,43,119,0.12)',
          transform: 'translateY(-3px)',
        }}
        transition="all 0.22s ease"
        cursor="pointer"
      >
        {/* Image with overlaid category */}
        <Box position="relative" h="200px" overflow="hidden" flexShrink={0}>
          {post.coverImage ? (
            <NextImage
              src={post.coverImage}
              alt={post.title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <CoverPlaceholder height="200px" />
          )}
          {/* Category chip over image */}
          {category && (
            <Box
              position="absolute"
              top="3"
              left="3"
              px="10px"
              py="4px"
              bg="white"
              borderRadius="999px"
              boxShadow="0 2px 8px rgba(0,0,0,0.1)"
            >
              <Text fontSize="11px" fontWeight="700" color="brand.primary" textTransform="uppercase" letterSpacing="0.06em" className="font-body">
                {category.name}
              </Text>
            </Box>
          )}
        </Box>

        {/* Content */}
        <Stack gap="3" p="5" flex="1" justify="space-between">
          <Stack gap="2">
            <Text
              className="font-display"
              fontWeight="700"
              fontSize="17px"
              lineHeight="135%"
              color="text.heading"
            >
              {post.title}
            </Text>
            <Text
              className="font-body"
              fontSize="13px"
              lineHeight="170%"
              color="text.secondary"
            >
              {displayExcerpt}
            </Text>
          </Stack>

          {/* Footer */}
          <Stack gap="2" pt="1">
            <Box h="1px" bg="border.default" opacity={0.6} />
            <HStack justify="space-between" flexWrap="wrap" gap="2">
              <HStack gap="2">
                {post.author.avatar && (
                  <Box w="20px" h="20px" borderRadius="full" overflow="hidden" flexShrink={0}>
                    <NextImage src={post.author.avatar} alt={post.author.name} width={20} height={20} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                  </Box>
                )}
                <Text fontSize="12px" fontWeight="600" color="text.secondary" className="font-body">{post.author.name}</Text>
                {post.readingTime && (
                  <>
                    <Text fontSize="12px" color="border.subtle">·</Text>
                    <HStack gap="1">
                      <LuClock size={11} color="#9CA3AF" />
                      <Text fontSize="12px" color="text.secondary" className="font-body">{post.readingTime} min</Text>
                    </HStack>
                  </>
                )}
              </HStack>
              <HStack gap="1" color="brand.primary">
                <Text fontSize="12px" fontWeight="600" className="font-body">Read</Text>
                <LuArrowRight size={12} />
              </HStack>
            </HStack>
          </Stack>
        </Stack>
      </Stack>
    </Link>
  );
};

export default PostCard;
