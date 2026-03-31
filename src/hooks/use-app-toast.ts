import { toast, type ExternalToast } from 'sonner';

export function useAppToast() {
  return {
    // Simple string methods (legacy)
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    info: (message: string) => toast.info(message),
    
    // Advanced toast with title and description
    toast: (options: {
      title?: string;
      description?: string;
      variant?: 'default' | 'destructive';
    } & ExternalToast) => {
      const { title, description, variant = 'default', ...rest } = options;
      const message = title
        ? description
          ? `${title}: ${description}`
          : title
        : description;

      if (variant === 'destructive') {
        toast.error(message, rest);
      } else {
        toast.success(message, rest);
      }
    },
  };
}
