import { useState, useMemo } from 'react';
import { MOCK_EVENTS } from '../types';

export function useEventFilters() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredEvents = useMemo(
    () =>
      MOCK_EVENTS.filter((event) => {
        const matchesSearch =
          event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.venue.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [searchQuery, statusFilter],
  );

  const statusCounts = useMemo(
    () => ({
      all: MOCK_EVENTS.length,
      planning: MOCK_EVENTS.filter((e) => e.status === 'planning').length,
      confirmed: MOCK_EVENTS.filter((e) => e.status === 'confirmed').length,
      'in-progress': MOCK_EVENTS.filter((e) => e.status === 'in-progress').length,
      completed: MOCK_EVENTS.filter((e) => e.status === 'completed').length,
    }),
    [],
  );

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    filteredEvents,
    statusCounts,
  };
}
