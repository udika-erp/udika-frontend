import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Trash2, Edit2 } from 'lucide-react';
import type { Activity } from '../types';

function EmployeeNoteCard({
  note,
  onEdit,
  onDelete,
}: {
  note: Activity;
  onEdit?: (note: Activity) => void;
  onDelete?: (noteId: string) => void;
}) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-sm text-gray-600">{formatDate(note.createdAt)}</p>
          <p className="mt-2 text-gray-800">{note.description}</p>
          {note.createdByName && (
            <p className="mt-3 text-xs text-gray-600">
              <span className="font-medium">Tác giả:</span> {note.createdByName}
              {note.createdByTitle && ` (${note.createdByTitle})`}
            </p>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(note)}>
                <Edit2 className="mr-2 h-4 w-4" />
                Sửa
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                onClick={() => onDelete(note.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}

interface EmployeeNoteListProps {
  notes: Activity[];
  isLoading?: boolean;
  onEdit?: (note: Activity) => void;
  onDelete?: (noteId: string) => void;
}

export function EmployeeNoteList({
  notes,
  isLoading,
  onEdit,
  onDelete,
}: EmployeeNoteListProps) {
  const [showForm, setShowForm] = React.useState(false);
  const [editingNote, setEditingNote] = React.useState<Activity | null>(null);

  const handleEdit = (note: Activity) => {
    setEditingNote(note);
    setShowForm(true);
    onEdit?.(note);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingNote(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Ghi chú nội bộ</h3>
        <Button
          size="sm"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Hủy' : 'Thêm ghi chú'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-4 bg-green-50">
          <div className="space-y-3">
            <textarea
              placeholder="Nhập nội dung ghi chú..."
              className="w-full border rounded px-3 py-2 text-sm"
              rows={3}
              defaultValue={editingNote?.description || ''}
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCloseForm}
              >
                Hủy
              </Button>
              <Button
                size="sm"
                onClick={handleCloseForm}
              >
                {editingNote ? 'Cập nhật' : 'Lưu ghi chú'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-gray-600">Chưa có ghi chú nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <EmployeeNoteCard
              key={note.id}
              note={note}
              onEdit={handleEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
