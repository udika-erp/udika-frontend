// src/lib/query-keys.ts
export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
  },
  customers: {
    all: ['customers'] as const,
    lists: () => [...queryKeys.customers.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.customers.all, 'detail', id] as const,
  },
  employees: {
    all: ['employees'] as const,
    lists: () => [...queryKeys.employees.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.employees.all, 'detail', id] as const,
  },
  events: {
    all: ['events'] as const,
    lists: () => [...queryKeys.events.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.events.all, 'detail', id] as const,
  },
} as const;
