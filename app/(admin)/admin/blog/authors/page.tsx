/**
 * /admin/blog/authors — Manage blog authors.
 * Create authors with name, bio, and avatar upload.
 */

'use client';

import {
  Box,
  Container,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { LuArrowLeft, LuPlus, LuTrash2 } from 'react-icons/lu';
import Link from 'next/link';
import NextImage from 'next/image';

interface Author {
  id: string;
  name: string;
  bio: string | null;
  avatar: string | null;
  slug: string;
  _count: { posts: number };
}

const AdminAuthorsPage = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAuthors = async () => {
    const res = await fetch('/api/blog/authors');
    const data = await res.json();
    setAuthors(data.authors ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchAuthors(); }, []);

  const handleAvatarUpload = async (file: File) => {
    setAvatarUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/blog/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (res.ok) setAvatarUrl(data.url);
    setAvatarUploading(false);
  };

  const add = async () => {
    if (!name.trim()) { setError('Name is required'); return; }
    setAdding(true);
    setError('');
    const res = await fetch('/api/blog/authors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), bio: bio.trim() || undefined, avatar: avatarUrl || undefined }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? 'Failed to add author'); }
    else { setName(''); setBio(''); setAvatarUrl(''); fetchAuthors(); }
    setAdding(false);
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this author? Their posts will remain but become authorless.')) return;
    await fetch(`/api/blog/authors/${id}`, { method: 'DELETE' });
    fetchAuthors();
  };

  return (
    <Container maxW="700px">
      <Stack gap="8">
        {/* Header */}
        <Stack gap="2">
          <Link href="/admin/blog">
            <HStack gap="1" color="text.secondary" _hover={{ color: 'brand.primary' }} w="fit-content">
              <LuArrowLeft size={14} />
              <Text fontSize="13px" className="font-body">Back to posts</Text>
            </HStack>
          </Link>
          <Heading className="font-display" fontWeight="700" fontSize="26px" color="#1E1B4B">
            Authors
          </Heading>
          <Text fontSize="14px" color="text.secondary" className="font-body">
            Manage who can be credited on blog posts.
          </Text>
        </Stack>

        {/* Add form */}
        <Stack
          gap="4"
          bg="background.white"
          border="1px solid"
          borderColor="border.default"
          borderRadius="8px"
          p="5"
        >
          <Text fontSize="14px" fontWeight="700" color="text.heading" className="font-body">
            Add New Author
          </Text>

          {/* Avatar upload */}
          <HStack gap="4" align="center">
            <Box
              w="56px"
              h="56px"
              borderRadius="full"
              bg="background.subtle"
              border="2px solid"
              borderColor="border.default"
              overflow="hidden"
              flexShrink={0}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {avatarUrl ? (
                <NextImage src={avatarUrl} alt="Avatar" width={56} height={56} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
              ) : (
                <Text fontSize="20px">👤</Text>
              )}
            </Box>
            <Stack gap="1" flex="1">
              <Text fontSize="13px" fontWeight="500" color="text.primary" className="font-body">
                Profile photo
              </Text>
              {/* Box as="label" keeps native label semantics while using Chakra styling */}
              <Box as="label" display="inline-block">
                <Box
                  as="span"
                  display="inline-block"
                  px="3"
                  py="1"
                  border="1px solid"
                  borderColor="border.default"
                  borderRadius="6px"
                  fontSize="13px"
                  color="text.secondary"
                  cursor="pointer"
                  _hover={{ borderColor: 'brand.primary', color: 'brand.primary' }}
                  className="font-body"
                >
                  {avatarUploading ? 'Uploading…' : 'Choose photo'}
                </Box>
                {/* Hidden file input — stays as native <input>; browser file picker requires it */}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleAvatarUpload(f); }}
                />
              </Box>
            </Stack>
          </HStack>

          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name *"
            fontSize="14px"
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
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Short bio (shown on posts)"
            fontSize="14px"
            border="1px solid"
            borderColor="border.default"
            borderRadius="6px"
            px="3"
            py="2"
            rows={2}
            resize="vertical"
            _focus={{ borderColor: 'brand.primary', boxShadow: 'none', outline: 'none' }}
            className="font-body"
          />

          {error && <Text fontSize="13px" color="text.error">{error}</Text>}

          <Box>
            <HStack
              gap="2"
              px="4"
              py="2"
              bg={adding ? 'brand.accent' : 'brand.primary'}
              borderRadius="6px"
              cursor="pointer"
              w="fit-content"
              onClick={add}
              _hover={{ bg: 'brand.primaryHover' }}
            >
              <LuPlus size={15} color="white" />
              <Text fontSize="14px" fontWeight="600" color="white" className="font-body">
                {adding ? 'Adding…' : 'Add Author'}
              </Text>
            </HStack>
          </Box>
        </Stack>

        {/* Author list */}
        {loading ? (
          <Text fontSize="14px" color="text.secondary" className="font-body">Loading…</Text>
        ) : authors.length === 0 ? (
          <Box textAlign="center" py="10" border="1px dashed" borderColor="border.default" borderRadius="8px">
            <Text fontSize="14px" color="text.secondary" className="font-body">No authors yet.</Text>
          </Box>
        ) : (
          <Stack gap="2">
            {authors.map((author) => (
              <HStack
                key={author.id}
                justify="space-between"
                bg="background.white"
                border="1px solid"
                borderColor="border.default"
                borderRadius="8px"
                px="4"
                py="3"
                gap="3"
              >
                <HStack gap="3">
                  <Box
                    w="40px"
                    h="40px"
                    borderRadius="full"
                    bg="background.subtle"
                    overflow="hidden"
                    flexShrink={0}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {author.avatar ? (
                      <NextImage src={author.avatar} alt={author.name} width={40} height={40} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                    ) : (
                      <Text fontSize="16px">👤</Text>
                    )}
                  </Box>
                  <Stack gap="0">
                    <Text fontSize="15px" fontWeight="600" color="text.heading" className="font-body">
                      {author.name}
                    </Text>
                    <Text fontSize="12px" color="text.secondary" className="font-body">
                      {author._count.posts} post{author._count.posts !== 1 ? 's' : ''}
                    </Text>
                  </Stack>
                </HStack>
                <Box
                  cursor="pointer"
                  color="text.secondary"
                  _hover={{ color: '#DC2626' }}
                  onClick={() => remove(author.id)}
                  p="1"
                >
                  <LuTrash2 size={15} />
                </Box>
              </HStack>
            ))}
          </Stack>
        )}
      </Stack>
    </Container>
  );
};

export default AdminAuthorsPage;
