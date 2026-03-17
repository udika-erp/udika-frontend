import { useState } from 'react';

export function useAttendanceFilters() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); // March 2026
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getDaysInMonthInfo = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    return { daysInMonth, startingDayOfWeek };
  };

  const formatDateStr = (day: number) =>
    `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const isDateSelected = (day: number) => selectedDates.has(formatDateStr(day));

  const isPastDate = (day: number) => {
    const date = new Date(formatDateStr(day));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const toggleDate = (day: number): boolean => {
    const dateStr = formatDateStr(day);
    const clickedDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (clickedDate < today) return false; // past date, cannot toggle

    const newSelected = new Set(selectedDates);
    if (newSelected.has(dateStr)) {
      newSelected.delete(dateStr);
    } else {
      newSelected.add(dateStr);
    }
    setSelectedDates(newSelected);
    return !selectedDates.has(dateStr); // returns true if newly selected
  };

  return {
    currentDate,
    selectedDates,
    handlePreviousMonth,
    handleNextMonth,
    getDaysInMonthInfo,
    isDateSelected,
    isPastDate,
    toggleDate,
  };
}
