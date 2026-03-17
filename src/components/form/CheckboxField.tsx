import type { Control, FieldValues, Path } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface CheckboxFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  error?: string;
  disabled?: boolean;
}

export function CheckboxField<T extends FieldValues>({
  name,
  control,
  label,
  error,
  disabled,
}: CheckboxFieldProps<T>) {
  const inputId = `checkbox-${name as string}`;

  return (
    <div className="grid gap-1.5">
      <div className="flex items-center gap-2">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Checkbox
              id={inputId}
              checked={!!field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          )}
        />
        {label && <Label htmlFor={inputId}>{label}</Label>}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
