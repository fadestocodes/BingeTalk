import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Cache for 5 minutes
      cacheTime: 1000 * 60 * 10, // Remove unused cache after 10 minutes
      refetchOnWindowFocus: true, // Auto refetch when app is in focus
    },
  },
});
