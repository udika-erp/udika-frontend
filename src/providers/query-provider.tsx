import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useAppToast } from '@/hooks/use-app-toast';
import type { NormalizedError } from '@/lib/error-messages';
import { getDefaultErrorMessage } from '@/lib/error-messages';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 1000 * 60, // 1 minute
      },
      mutations: {},
    },
  });
}

// Singleton outside component so it isn't recreated on re-render
const queryClient = makeQueryClient();

// Wire global error handler after queryClient is created
queryClient.setDefaultOptions({
  queries: {
    ...queryClient.getDefaultOptions().queries,
  },
  mutations: {
    ...queryClient.getDefaultOptions().mutations,
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

// Exported so Axios interceptors and external callers can trigger toasts
export { queryClient };

// Global error handler hook — call once at app root
export function useGlobalQueryErrorHandler() {
  const toast = useAppToast();

  queryClient.setDefaultOptions({
    queries: {
      ...queryClient.getDefaultOptions().queries,
      // @ts-expect-error onError is deprecated in RQ v5 but still works
      onError: (error: unknown) => {
        const msg =
          (error as NormalizedError)?.message ?? getDefaultErrorMessage();
        toast.error(msg);
      },
    },
    mutations: {
      ...queryClient.getDefaultOptions().mutations,
      onError: (error: unknown) => {
        const msg =
          (error as NormalizedError)?.message ?? getDefaultErrorMessage();
        toast.error(msg);
      },
    },
  });
}
