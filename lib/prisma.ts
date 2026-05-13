import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Single PrismaClient instance shared across the entire Node.js process.
 *
 * Stored on globalThis so that:
 * - In development: Hot Module Replacement doesn't create a new client on
 *   every file save (which would exhaust the connection pool quickly).
 * - In production: Next.js runs multiple server workers and can re-evaluate
 *   modules across them. Pinning the client to globalThis ensures all workers
 *   share one instance with one connection pool rather than each spawning their
 *   own, which is the root cause of EMAXCONNSESSION pool exhaustion on Neon.
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

// Always persist the singleton — previously this was guarded by !== 'production'
// which is wrong: production needs it too for the reason described above.
globalForPrisma.prisma = prisma;
