import { RouterProvider } from 'react-router';
import { router } from '@/routes';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider, useGlobalQueryErrorHandler } from '@/providers/query-provider';
import { useAuthInit } from '@/hooks/use-auth-init';

function AppInner() {
  useGlobalQueryErrorHandler();
  useAuthInit();

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default function App() {
  return (
    <QueryProvider>
      <AppInner />
    </QueryProvider>
  );
}
