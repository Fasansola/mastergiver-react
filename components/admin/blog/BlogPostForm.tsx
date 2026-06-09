/**
 * BlogPostForm — full post editor for create and edit flows.
 *
 * Layout:
 *   Top bar   — back link, Save Draft, Publish buttons
 *   Left col  — title, slug, BlockNote rich-text editor
 *   Right sidebar — cover image, status, author, categories, tags,
 *                   excerpt, SEO fields
 *
 * Uses BlockNote for the writing area (Notion-style block editor).
 * Images inside the editor are uploaded via /api/blog/upload.
 */

'use client';

import '@blocknote/mantine/style.css';

import {
  Box,
  Button,
  Container,
  Grid,
  HStack,
  Input,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { LuArrowLeft, LuCheck, LuLoader } from 'react-icons/lu';
import Link from 'next/link';
import CoverImageUpload from './CoverImageUpload';
import PostStatusBadge from './PostStatusBadge';
import { slugify } from '@/lib/blog/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Author {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface BlogPostFormProps {
  /** Undefined = creating new post. Defined = editing. */
  post?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    coverImage: string | null;
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    authorId: string;
    metaTitle: string | null;
    metaDescription: string | null;
    categories: { category: Category }[];
    tags: { tag: { name: string } }[];
  };
  authors: Author[];
  categories: Category[];
}

// ─── Sidebar section wrapper ──────────────────────────────────────────────────

const SidebarSection = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <Stack gap="2">
    <Text fontSize="12px" fontWeight="700" color="text.secondary" textTransform="uppercase" letterSpacing="0.05em">
      {label}
    </Text>
    {children}
  </Stack>
);

// ─── Main component ───────────────────────────────────────────────────────────

const BlogPostForm = ({ post, authors, categories }: BlogPostFormProps) => {
  const router = useRouter();
  const isEditing = !!post;

  // ── Form state ──
  const [title, setTitle] = useState(post?.title ?? '');
  const [slug, setSlug] = useState(post?.slug ?? '');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEditing);
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '');
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? '');
  const [authorId, setAuthorId] = useState(post?.authorId ?? (authors[0]?.id ?? ''));
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    post?.categories.map((c) => c.category.id) ?? []
  );
  const [tagInput, setTagInput] = useState(post?.tags.map((t) => t.tag.name).join(', ') ?? '');
  const [metaTitle, setMetaTitle] = useState(post?.metaTitle ?? '');
  const [metaDescription, setMetaDescription] = useState(post?.metaDescription ?? '');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>(post?.status ?? 'DRAFT');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [savedAt, setSavedAt] = useState('');

  // ── BlockNote editor ──
  const editor = useCreateBlockNote({
    initialContent: post?.content
      ? undefined // loaded via HTML below
      : undefined,
    uploadFile: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/blog/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Upload failed');
      return data.url;
    },
  });

  // Load existing HTML content into the editor (edit mode)
  const contentLoaded = useRef(false);
  useEffect(() => {
    if (post?.content && !contentLoaded.current) {
      contentLoaded.current = true;
      const blocks = editor.tryParseHTMLToBlocks(post.content);
      editor.replaceBlocks(editor.document, blocks);
    }
  }, [editor, post?.content]);

  // Auto-generate slug from title (only when user hasn't manually edited it)
  useEffect(() => {
    if (!slugManuallyEdited && title) {
      setSlug(slugify(title));
    }
  }, [title, slugManuallyEdited]);

  // ── Toggle category selection ──
  const toggleCategory = (id: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  // ── Save post ──
  const save = async (targetStatus: 'DRAFT' | 'PUBLISHED') => {
    if (!title.trim()) { setSaveError('Please add a title before saving.'); return; }
    if (!authorId) { setSaveError('Please select an author.'); return; }

    setSaving(true);
    setSaveError('');

    const html = editor.blocksToHTMLLossy(editor.document);
    const tagNames = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title,
      slug,
      excerpt: excerpt || undefined,
      content: html,
      coverImage: coverImage || undefined,
      status: targetStatus,
      authorId,
      categoryIds: selectedCategoryIds,
      tagNames,
      metaTitle: metaTitle || undefined,
      metaDescription: metaDescription || undefined,
    };

    try {
      const res = await fetch(
        isEditing ? `/api/blog/posts/${post.id}` : '/api/blog/posts',
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message ?? data.error ?? 'Save failed');

      setStatus(targetStatus);
      setSavedAt(new Date().toLocaleTimeString());

      if (!isEditing) {
        // After creating, redirect to edit page so refreshes don't re-create
        router.replace(`/admin/blog/${data.post.id}/edit`);
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <Box minH="100vh" bg="background.subtle">
      {/* ── Top bar ── */}
      <Box
        bg="background.white"
        borderBottom="1px solid"
        borderColor="border.default"
        position="sticky"
        top="0"
        zIndex="10"
        py="3"
        px={{ base: '4', lg: '8' }}
      >
        <HStack justify="space-between" maxW="1400px" mx="auto">
          <Link href="/admin/blog">
            <HStack gap="1" color="text.secondary" _hover={{ color: 'brand.primary' }} transition="color 0.15s">
              <LuArrowLeft size={16} />
              <Text fontSize="14px" fontWeight="500" className="font-body">All posts</Text>
            </HStack>
          </Link>

          <HStack gap="3">
            {savedAt && !saving && (
              <HStack gap="1" color="text.secondary">
                <LuCheck size={14} />
                <Text fontSize="12px" className="font-body">Saved {savedAt}</Text>
              </HStack>
            )}
            {saveError && (
              <Text fontSize="12px" color="text.error" className="font-body">{saveError}</Text>
            )}

            <PostStatusBadge status={status} />

            <Button
              variant="outline"
              size="sm"
              fontWeight="600"
              borderColor="border.default"
              color="text.primary"
              px="4"
              className="font-body"
              disabled={saving}
              onClick={() => save('DRAFT')}
            >
              {saving ? <LuLoader size={14} /> : 'Save Draft'}
            </Button>

            <Button
              size="sm"
              bg="brand.primary"
              color="white"
              fontWeight="600"
              px="4"
              className="font-body"
              _hover={{ bg: 'brand.primaryHover' }}
              disabled={saving}
              onClick={() => save('PUBLISHED')}
            >
              {saving ? <LuLoader size={14} /> : status === 'PUBLISHED' ? 'Update' : 'Publish'}
            </Button>
          </HStack>
        </HStack>
      </Box>

      {/* ── Body ── */}
      <Container maxW="1400px" py="8" px={{ base: '4', lg: '8' }}>
        <Grid templateColumns={{ base: '1fr', lg: '1fr 320px' }} gap="8" alignItems="start">

          {/* ── Left: title + slug + editor ── */}
          <Stack gap="6">
            {/* Title */}
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title…"
              fontSize={{ base: '24px', lg: '32px' }}
              fontWeight="700"
              border="none"
              borderBottom="2px solid"
              borderColor="border.default"
              borderRadius="0"
              px="0"
              py="2"
              _focus={{ borderColor: 'brand.primary', boxShadow: 'none', outline: 'none' }}
              _placeholder={{ color: 'border.default' }}
              className="font-display"
              color="text.heading"
            />

            {/* Slug */}
            <HStack gap="2">
              <Text fontSize="13px" color="text.secondary" className="font-body" whiteSpace="nowrap">
                /blog/
              </Text>
              <Input
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugManuallyEdited(true);
                }}
                placeholder="post-slug"
                fontSize="13px"
                fontFamily="monospace"
                color="text.secondary"
                border="1px solid"
                borderColor="border.default"
                borderRadius="4px"
                px="2"
                py="1"
                h="auto"
                _focus={{ borderColor: 'brand.primary', boxShadow: 'none', outline: 'none' }}
              />
            </HStack>

            {/* BlockNote editor */}
            <Box
              border="1px solid"
              borderColor="border.default"
              borderRadius="8px"
              bg="background.white"
              overflow="hidden"
              minH="500px"
              className="blocknote-wrapper"
            >
              <BlockNoteView
                editor={editor}
                theme="light"
              />
            </Box>
          </Stack>

          {/* ── Right: sidebar ── */}
          <Stack
            gap="6"
            bg="background.white"
            border="1px solid"
            borderColor="border.default"
            borderRadius="8px"
            p="5"
            position={{ lg: 'sticky' }}
            top={{ lg: '80px' }}
          >
            {/* Cover image */}
            <SidebarSection label="Cover Image">
              <CoverImageUpload value={coverImage} onChange={setCoverImage} />
            </SidebarSection>

            <Box h="1px" bg="border.default" />

            {/* Author */}
            <SidebarSection label="Author">
              <select
                value={authorId}
                onChange={(e) => setAuthorId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  border: '1px solid #DCDFE3',
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: '#212325',
                  background: 'white',
                  outline: 'none',
                }}
              >
                {authors.length === 0 && (
                  <option value="">No authors yet — add one first</option>
                )}
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </SidebarSection>

            <Box h="1px" bg="border.default" />

            {/* Categories */}
            <SidebarSection label="Categories">
              {categories.length === 0 ? (
                <Text fontSize="13px" color="text.secondary">
                  No categories yet —{' '}
                  <Link href="/admin/blog/categories" style={{ color: '#5851BF' }}>add one</Link>
                </Text>
              ) : (
                <Stack gap="2">
                  {categories.map((cat) => (
                    <HStack
                      key={cat.id}
                      gap="2"
                      cursor="pointer"
                      onClick={() => toggleCategory(cat.id)}
                    >
                      <Box
                        w="16px"
                        h="16px"
                        borderRadius="4px"
                        border="2px solid"
                        borderColor={selectedCategoryIds.includes(cat.id) ? 'brand.primary' : 'border.default'}
                        bg={selectedCategoryIds.includes(cat.id) ? 'brand.primary' : 'transparent'}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexShrink={0}
                      >
                        {selectedCategoryIds.includes(cat.id) && (
                          <LuCheck size={10} color="white" />
                        )}
                      </Box>
                      <Text fontSize="14px" color="text.primary" className="font-body">{cat.name}</Text>
                    </HStack>
                  ))}
                </Stack>
              )}
            </SidebarSection>

            <Box h="1px" bg="border.default" />

            {/* Tags */}
            <SidebarSection label="Tags">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="tips, strategy, growth"
                fontSize="13px"
                border="1px solid"
                borderColor="border.default"
                borderRadius="6px"
                px="3"
                py="2"
                h="auto"
                _focus={{ borderColor: 'brand.primary', boxShadow: 'none', outline: 'none' }}
                className="font-body"
              />
              <Text fontSize="11px" color="text.secondary">Separate tags with commas</Text>
            </SidebarSection>

            <Box h="1px" bg="border.default" />

            {/* Excerpt */}
            <SidebarSection label="Excerpt">
              <Textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Short summary shown on listing pages…"
                fontSize="13px"
                border="1px solid"
                borderColor="border.default"
                borderRadius="6px"
                px="3"
                py="2"
                rows={3}
                resize="vertical"
                _focus={{ borderColor: 'brand.primary', boxShadow: 'none', outline: 'none' }}
                className="font-body"
              />
            </SidebarSection>

            <Box h="1px" bg="border.default" />

            {/* SEO */}
            <SidebarSection label="SEO">
              <Stack gap="2">
                <Input
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Meta title (defaults to post title)"
                  fontSize="13px"
                  border="1px solid"
                  borderColor="border.default"
                  borderRadius="6px"
                  px="3"
                  py="2"
                  h="auto"
                  _focus={{ borderColor: 'brand.primary', boxShadow: 'none', outline: 'none' }}
                  className="font-body"
                />
                <Textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Meta description (defaults to excerpt)"
                  fontSize="13px"
                  border="1px solid"
                  borderColor="border.default"
                  borderRadius="6px"
                  px="3"
                  py="2"
                  rows={3}
                  resize="vertical"
                  _focus={{ borderColor: 'brand.primary', boxShadow: 'none', outline: 'none' }}
                  className="font-body"
                />
              </Stack>
            </SidebarSection>
          </Stack>
        </Grid>
      </Container>
    </Box>
  );
};

export default BlogPostForm;
