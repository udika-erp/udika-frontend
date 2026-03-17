import { RouterProvider } from 'react-router';
import { router } from '@/routes';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider, useGlobalQueryErrorHandler } from '@/providers/query-provider';

function AppInner() {
  useGlobalQueryErrorHandler();
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
