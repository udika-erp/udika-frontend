import { useState, useMemo } from 'react';
import { MOCK_CUSTOMERS, type Customer } from '../types';

export function useCustomerFilters() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  const filteredCustomers = useMemo(
    () =>
      MOCK_CUSTOMERS.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.phone.includes(searchQuery) ||
          c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.company?.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [searchQuery],
  );

  const toggleSelectAll = (displayedCustomers: Customer[]) => {
    if (selectedCustomers.length === displayedCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(displayedCustomers.map((c) => c.id));
    }
  };

  const toggleSelectCustomer = (id: string) => {
    setSelectedCustomers((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id],
    );
  };

  return {
    searchQuery,
    setSearchQuery,
    filteredCustomers,
    selectedCustomers,
    toggleSelectAll,
    toggleSelectCustomer,
  };
}
