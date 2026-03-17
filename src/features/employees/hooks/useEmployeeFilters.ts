import { useState, useMemo } from 'react';
import { MOCK_EMPLOYEES } from '../types';

export function useEmployeeFilters() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredEmployees = useMemo(
    () =>
      MOCK_EMPLOYEES.filter(
        (employee) =>
          employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          employee.phone.includes(searchQuery) ||
          employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          employee.code.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [searchQuery],
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

  const toggleSelectAll = () => {
    if (selectedEmployees.length === displayedEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(displayedEmployees.map((e) => e.id));
    }
  };

  const toggleSelectEmployee = (id: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id],
    );
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedEmployees,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    filteredEmployees,
    totalPages,
    startIndex,
    displayedEmployees,
    toggleSelectAll,
    toggleSelectEmployee,
  };
}
