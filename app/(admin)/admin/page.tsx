/**
 * /admin — Admin dashboard landing page.
 *
 * Shows a card for each admin section with live counts and quick-action links.
 * Only accessible to ADMIN role (enforced by the (admin) layout).
 */

import { Box, Container, Grid, HStack, Heading, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import {
  LuArrowRight,
  LuBookOpen,
  LuBuilding2,
  LuPenLine,
  LuPlus,
  LuSettings,
  LuTag,
  LuUser,
} from 'react-icons/lu';

export const dynamic = 'force-dynamic';

// ─── Stat pill ────────────────────────────────────────────────────────────────

const Stat = ({ label, value }: { label: string; value: number }) => (
  <Stack gap="0">
    <Text fontSize="22px" fontWeight="700" color="text.heading" className="font-display">
      {value}
    </Text>
    <Text fontSize="12px" color="text.secondary" className="font-body">
      {label}
    </Text>
  </Stack>
);

// ─── Section card ─────────────────────────────────────────────────────────────

const SectionCard = ({
  icon,
  title,
  description,
  href,
  stats,
  actions,
  accentColor = 'brand.primary',
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  stats: { label: string; value: number }[];
  actions: { label: string; href: string; primary?: boolean }[];
  accentColor?: string;
}) => (
  <Stack
    bg="background.white"
    border="1px solid"
    borderColor="border.default"
    borderRadius="12px"
    overflow="hidden"
    gap="0"
    _hover={{ borderColor: 'brand.primary', boxShadow: '0 4px 20px rgba(47,43,119,0.08)' }}
    transition="all 0.2s ease"
  >
    {/* Accent bar */}
    <Box h="3px" bg={accentColor} />

    <Stack gap="5" p="6" flex="1">
      {/* Icon + title */}
      <HStack gap="3">
        <Box
          w="40px"
          h="40px"
          borderRadius="10px"
          bg="background.lightPurple"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
          color="brand.primary"
        >
          {icon}
        </Box>
        <Stack gap="0">
          <Text fontSize="16px" fontWeight="700" color="text.heading" className="font-body">
            {title}
          </Text>
          <Text fontSize="12px" color="text.secondary" className="font-body">
            {description}
          </Text>
        </Stack>
      </HStack>

      {/* Stats row */}
      {stats.length > 0 && (
        <HStack gap="6" pt="1" pb="1" borderTop="1px solid" borderColor="border.default" borderBottom="1px solid">
          {stats.map((s) => (
            <Stat key={s.label} {...s} />
          ))}
        </HStack>
      )}

      {/* Actions */}
      <HStack gap="3" flexWrap="wrap">
        {actions.map((action) =>
          action.primary ? (
            <Link key={action.href} href={action.href}>
              <HStack
                gap="1.5"
                px="4"
                py="2"
                bg="brand.primary"
                borderRadius="6px"
                cursor="pointer"
                _hover={{ opacity: 0.9 }}
              >
                <LuPlus size={14} color="white" />
                <Text fontSize="13px" fontWeight="600" color="white" className="font-body">
                  {action.label}
                </Text>
              </HStack>
            </Link>
          ) : (
            <Link key={action.href} href={action.href}>
              <HStack
                gap="1"
                px="4"
                py="2"
                border="1px solid"
                borderColor="border.default"
                borderRadius="6px"
                cursor="pointer"
                color="text.secondary"
                _hover={{ borderColor: 'brand.primary', color: 'brand.primary' }}
                transition="all 0.15s"
              >
                <Text fontSize="13px" fontWeight="500" className="font-body">
                  {action.label}
                </Text>
                <LuArrowRight size={13} />
              </HStack>
            </Link>
          )
        )}
      </HStack>
    </Stack>
  </Stack>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const AdminPage = async () => {
  // Fetch counts in parallel
  const [
    totalPosts,
    publishedPosts,
    draftPosts,
    totalAuthors,
    totalCategories,
    totalBusinesses,
    featuredBusinesses,
  ] = await Promise.all([
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { status: 'PUBLISHED' } }),
    prisma.blogPost.count({ where: { status: 'DRAFT' } }),
    prisma.blogAuthor.count(),
    prisma.blogCategory.count(),
    prisma.business.count(),
    prisma.business.count({ where: { featuredInDirectory: true } }),
  ]);

  return (
    <Container maxW="1200px">
      <Stack gap="10">
        {/* Page header */}
        <Stack gap="1">
          <Heading
            as="h1"
            className="font-display"
            fontWeight="700"
            fontSize={{ base: '26px', lg: '32px' }}
            color="text.heading"
          >
            Admin Dashboard
          </Heading>
          <Text fontSize="14px" color="text.secondary" className="font-body">
            Manage all MasterGiver content from one place.
          </Text>
        </Stack>

        {/* Section cards */}
        <Grid
          templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}
          gap="5"
          alignItems="start"
        >
          {/* Blog */}
          <SectionCard
            icon={<LuBookOpen size={20} />}
            title="Blog"
            description="Write and manage blog posts"
            href="/admin/blog"
            stats={[
              { label: 'Total posts', value: totalPosts },
              { label: 'Published', value: publishedPosts },
              { label: 'Drafts', value: draftPosts },
            ]}
            actions={[
              { label: 'New Post', href: '/admin/blog/new', primary: true },
              { label: 'All Posts', href: '/admin/blog' },
              { label: 'Authors', href: '/admin/blog/authors' },
              { label: 'Categories', href: '/admin/blog/categories' },
            ]}
          />

          {/* Directory */}
          <SectionCard
            icon={<LuBuilding2 size={20} />}
            title="Good Businesses Directory"
            description="Feature businesses in the public directory"
            href="/admin/directory"
            accentColor="#10B981"
            stats={[
              { label: 'Total businesses', value: totalBusinesses },
              { label: 'Featured', value: featuredBusinesses },
            ]}
            actions={[
              { label: 'Manage Directory', href: '/admin/directory' },
            ]}
          />

          {/* Site Settings */}
          <SectionCard
            icon={<LuSettings size={20} />}
            title="Site Settings"
            description="Toggle payment requirement and feature flags"
            href="/admin/settings"
            accentColor="#8B5CF6"
            stats={[]}
            actions={[
              { label: 'Manage Settings', href: '/admin/settings' },
            ]}
          />
        </Grid>

        {/* Quick stats strip */}
        <Box
          bg="background.white"
          border="1px solid"
          borderColor="border.default"
          borderRadius="12px"
          p="5"
        >
          <Stack gap="4">
            <Text
              fontSize="11px"
              fontWeight="700"
              color="text.secondary"
              textTransform="uppercase"
              letterSpacing="0.08em"
              className="font-body"
            >
              Blog content breakdown
            </Text>
            <HStack gap="8" flexWrap="wrap">
              <HStack gap="2">
                <Box w="8px" h="8px" borderRadius="full" bg="brand.primary" />
                <Text fontSize="13px" color="text.secondary" className="font-body">
                  <Text as="span" fontWeight="700" color="text.heading">{totalAuthors}</Text>
                  {' '}author{totalAuthors !== 1 ? 's' : ''}
                </Text>
              </HStack>
              <HStack gap="2">
                <Box w="8px" h="8px" borderRadius="full" bg="brand.primary" />
                <Text fontSize="13px" color="text.secondary" className="font-body">
                  <Text as="span" fontWeight="700" color="text.heading">{totalCategories}</Text>
                  {' '}categor{totalCategories !== 1 ? 'ies' : 'y'}
                </Text>
              </HStack>
              <HStack gap="2">
                <Box w="8px" h="8px" borderRadius="full" bg="#10B981" />
                <Text fontSize="13px" color="text.secondary" className="font-body">
                  <Text as="span" fontWeight="700" color="text.heading">{featuredBusinesses}</Text>
                  {' '}of{' '}
                  <Text as="span" fontWeight="700" color="text.heading">{totalBusinesses}</Text>
                  {' '}businesses featured
                </Text>
              </HStack>
            </HStack>
          </Stack>
        </Box>

        {/* Quick links row */}
        <Stack gap="3">
          <Text
            fontSize="11px"
            fontWeight="700"
            color="text.secondary"
            textTransform="uppercase"
            letterSpacing="0.08em"
            className="font-body"
          >
            Quick actions
          </Text>
          <HStack gap="3" flexWrap="wrap">
            {[
              { icon: <LuPenLine size={14} />, label: 'Write a post', href: '/admin/blog/new' },
              { icon: <LuUser size={14} />, label: 'Add author', href: '/admin/blog/authors' },
              { icon: <LuTag size={14} />, label: 'Add category', href: '/admin/blog/categories' },
              { icon: <LuBuilding2 size={14} />, label: 'Review directory', href: '/admin/directory' },
            ].map(({ icon, label, href }) => (
              <Link key={href} href={href}>
                <HStack
                  gap="2"
                  px="4"
                  py="2.5"
                  bg="background.white"
                  border="1px solid"
                  borderColor="border.default"
                  borderRadius="8px"
                  cursor="pointer"
                  color="text.secondary"
                  _hover={{ borderColor: 'brand.primary', color: 'brand.primary' }}
                  transition="all 0.15s"
                >
                  {icon}
                  <Text fontSize="13px" fontWeight="500" className="font-body">{label}</Text>
                </HStack>
              </Link>
            ))}
          </HStack>
        </Stack>
      </Stack>
    </Container>
  );
};

export default AdminPage;
