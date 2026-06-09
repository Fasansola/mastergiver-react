/**
 * /admin/blog/categories — Manage blog categories.
 * Simple list with add and delete. Server-rendered, client actions via fetch.
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
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { LuArrowLeft, LuPlus, LuTrash2 } from 'react-icons/lu';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: { posts: number };
}

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    const res = await fetch('/api/blog/categories');
    const data = await res.json();
    setCategories(data.categories ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const add = async () => {
    if (!newName.trim()) return;
    setAdding(true);
    setError('');
    const res = await fetch('/api/blog/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim() }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? 'Failed to add category'); }
    else { setNewName(''); fetchCategories(); }
    setAdding(false);
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this category? Posts will not be deleted.')) return;
    await fetch(`/api/blog/categories/${id}`, { method: 'DELETE' });
    fetchCategories();
  };

  return (
    <Container maxW="600px">
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
            Categories
          </Heading>
          <Text fontSize="14px" color="text.secondary" className="font-body">
            Organise your posts into topics.
          </Text>
        </Stack>

        {/* Add new */}
        <HStack gap="3">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New category name…"
            fontSize="14px"
            border="1px solid"
            borderColor="border.default"
            borderRadius="6px"
            px="3"
            py="2"
            h="auto"
            _focus={{ borderColor: 'brand.primary', boxShadow: 'none', outline: 'none' }}
            className="font-body"
            onKeyDown={(e) => e.key === 'Enter' && add()}
          />
          <HStack
            gap="1"
            px="4"
            py="2"
            bg={adding ? 'brand.accent' : 'brand.primary'}
            borderRadius="6px"
            cursor="pointer"
            flexShrink={0}
            onClick={add}
            _hover={{ bg: 'brand.primaryHover' }}
          >
            <LuPlus size={15} color="white" />
            <Text fontSize="14px" fontWeight="600" color="white" className="font-body">
              Add
            </Text>
          </HStack>
        </HStack>

        {error && <Text fontSize="13px" color="text.error">{error}</Text>}

        {/* List */}
        {loading ? (
          <Text fontSize="14px" color="text.secondary" className="font-body">Loading…</Text>
        ) : categories.length === 0 ? (
          <Box
            textAlign="center"
            py="12"
            border="1px dashed"
            borderColor="border.default"
            borderRadius="8px"
          >
            <Text fontSize="14px" color="text.secondary" className="font-body">
              No categories yet — add your first one above.
            </Text>
          </Box>
        ) : (
          <Stack gap="2">
            {categories.map((cat) => (
              <HStack
                key={cat.id}
                justify="space-between"
                bg="background.white"
                border="1px solid"
                borderColor="border.default"
                borderRadius="8px"
                px="4"
                py="3"
              >
                <Stack gap="0">
                  <Text fontSize="15px" fontWeight="600" color="text.heading" className="font-body">
                    {cat.name}
                  </Text>
                  <Text fontSize="12px" color="text.secondary" className="font-body">
                    /{cat.slug} · {cat._count.posts} post{cat._count.posts !== 1 ? 's' : ''}
                  </Text>
                </Stack>
                <Box
                  cursor="pointer"
                  color="text.secondary"
                  _hover={{ color: '#DC2626' }}
                  onClick={() => remove(cat.id)}
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

export default AdminCategoriesPage;
