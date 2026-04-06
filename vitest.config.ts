/**
 * Vitest configuration.
 *
 * Uses vite-tsconfig-paths so that the @/ path aliases defined in
 * tsconfig.json resolve correctly in tests (e.g. @/lib/business/progress).
 *
 * Only pure utility modules are tested here — functions that have no
 * dependency on the database, NextAuth, or browser APIs. Those
 * dependencies would require complex mocking and are better validated
 * by integration/E2E tests.
 */

import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    // Run in Node environment (not jsdom) since we are testing pure logic,
    // not React components
    environment: 'node',
    // Show each test name in the output for easier reading
    reporters: 'verbose',
  },
});
