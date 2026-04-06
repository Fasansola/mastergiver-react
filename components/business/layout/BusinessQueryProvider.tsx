'use client';

/**
 * TanStack Query provider for the business dashboard.
 *
 * Wraps the dashboard layout children with a QueryClientProvider so that
 * useMutation (and any future useQuery calls) work inside business components.
 *
 * This is a Client Component but it can wrap Server Component children
 * because Next.js passes them through as opaque React nodes.
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type PropsWithChildren } from 'react';

const BusinessQueryProvider = ({ children }: PropsWithChildren) => {
  // Create the client inside useState so each browser session gets its own instance
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default BusinessQueryProvider;
