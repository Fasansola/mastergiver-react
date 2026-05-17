/**
 * lib/actions/admin.actions.ts
 *
 * Server actions for the admin panel.
 * All actions require an ADMIN role session — any other caller gets rejected.
 */

'use server';

import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import type { ActionResult } from '@/lib/types/actions';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
  return session;
}

/**
 * Toggle whether a business appears in the public directory.
 */
export async function toggleDirectoryFeature(
  businessId: string,
  featured: boolean
): Promise<ActionResult> {
  try {
    await requireAdmin();

    await prisma.business.update({
      where: { id: businessId },
      data: { featuredInDirectory: featured },
    });

    revalidatePath('/admin/directory');
    revalidatePath('/good-businesses');

    return { success: true };
  } catch (err) {
    console.error('[admin] toggleDirectoryFeature failed:', err);
    return { success: false, error: 'Failed to update directory status.' };
  }
}
