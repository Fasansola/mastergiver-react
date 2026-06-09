/**
 * DELETE /api/blog/authors/[id]  — delete an author (ADMIN only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.blogAuthor.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }

    await prisma.blogAuthor.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[blog/authors/[id] DELETE]', error);
    return NextResponse.json({ error: 'Failed to delete author' }, { status: 500 });
  }
}
