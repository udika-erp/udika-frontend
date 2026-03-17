import { useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface DateFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export function DateField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder = 'Chọn ngày',
  error,
  disabled,
}: DateFieldProps<T>) {
  const [open, setOpen] = useState(false);
  const inputId = `date-${name as string}`;

  return (
    <div className="grid gap-1.5">
      {label && (
        <Label htmlFor={inputId} className={cn(error && 'text-destructive')}>
          {label}
        </Label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const dateValue = field.value ? new Date(field.value as string) : undefined;
          return (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  id={inputId}
                  variant="outline"
                  disabled={disabled}
                  className={cn(
                    'justify-start text-left font-normal',
                    !dateValue && 'text-muted-foreground',
                    error && 'border-destructive',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateValue
                    ? format(dateValue, 'dd/MM/yyyy', { locale: vi })
                    : placeholder}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateValue}
                  onSelect={(date) => {
                    field.onChange(date ? date.toISOString() : null);
                    setOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          );
        }}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
