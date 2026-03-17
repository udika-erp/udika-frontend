import { useState } from 'react';
import { Plus, Pencil, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Todo {
  id: number;
  task: string;
  event: string;
  dueDate: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

const todoList: Todo[] = [
  { id: 1, task: 'Xác nhận địa điểm cho sự kiện Johnson Wedding', event: 'Johnson Wedding', dueDate: '23/03/2026', completed: false, priority: 'high' },
  { id: 2, task: 'Duyệt thực đơn catering cho Tech Corp Gala', event: 'Tech Corp Annual Gala', dueDate: '24/03/2026', completed: false, priority: 'medium' },
  { id: 3, task: 'Nhắc nhở thanh toán cuối cho Smith Birthday', event: 'Smith 50th Birthday', dueDate: '25/03/2026', completed: true, priority: 'high' },
  { id: 4, task: 'Đặt thiết bị cho Product Launch Event', event: 'Product Launch Event', dueDate: '26/03/2026', completed: false, priority: 'low' },
  { id: 5, task: 'Gửi báo cáo chi phí tháng 2', event: 'Quản lý nội bộ', dueDate: '20/03/2026', completed: true, priority: 'medium' },
  { id: 6, task: 'Họp với đội ngũ setup sự kiện', event: 'Cuộc họp tuần', dueDate: '18/03/2026', completed: false, priority: 'medium' },
];

export function RecentNotesWidget() {
  const [todos, setTodos] = useState(todoList);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [newTodo, setNewTodo] = useState({ task: '', event: '', dueDate: '', priority: 'medium' as 'low' | 'medium' | 'high' });

  const handleToggleTodo = (id: number) => {
    setTodos((prev) => prev.map((todo) => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  const handleAddTodo = () => {
    if (newTodo.task.trim() === '') return;
    const newId = Math.max(...todos.map((t) => t.id), 0) + 1;
    setTodos([...todos, { id: newId, ...newTodo, completed: false }]);
    setNewTodo({ task: '', event: '', dueDate: '', priority: 'medium' });
    setDialogOpen(false);
  };

  const handleEditTodo = () => {
    if (!editingTodo || editingTodo.task.trim() === '') return;
    setTodos(todos.map((todo) => todo.id === editingTodo.id ? editingTodo : todo));
    setEditingTodo(null);
    setDialogOpen(false);
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const openEditDialog = (todo: Todo, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTodo({ ...todo });
    setDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              Việc cần làm
            </CardTitle>
            <Button
              size="sm"
              onClick={() => { setNewTodo({ task: '', event: '', dueDate: '', priority: 'medium' }); setEditingTodo(null); setDialogOpen(true); }}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Thêm việc
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className={`flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${todo.completed ? 'bg-gray-50' : ''}`}
                onClick={() => handleToggleTodo(todo.id)}
              >
                <button className="mt-0.5 flex-shrink-0" onClick={(e) => { e.stopPropagation(); handleToggleTodo(todo.id); }}>
                  {todo.completed ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <Circle className="w-5 h-5 text-gray-400" />}
                </button>
                <div className="flex-1">
                  <p className={`font-medium ${todo.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                    {todo.task}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{todo.event}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{todo.dueDate}</span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        todo.priority === 'high' ? 'bg-red-50 text-red-700 border-red-200'
                        : todo.priority === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {todo.priority === 'high' ? 'Cao' : todo.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                    </Badge>
                  </div>
                </div>
                <button className="ml-2 text-gray-500 hover:text-gray-700" onClick={(e) => openEditDialog(todo, e)}>
                  <Pencil className="w-4 h-4" />
                </button>
                <button className="ml-2 text-gray-500 hover:text-gray-700" onClick={(e) => { e.stopPropagation(); handleDeleteTodo(todo.id); }}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
            <span>{todos.filter((t) => !t.completed).length} việc cần làm</span>
            <span>{todos.filter((t) => t.completed).length} đã hoàn thành</span>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Todo Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingTodo ? 'Chỉnh sửa việc cần làm' : 'Thêm việc cần làm'}</DialogTitle>
            <DialogDescription>{editingTodo ? 'Cập nhật thông tin cho việc cần làm này.' : 'Thêm một việc cần làm mới.'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="task">Nội dung</Label>
              <Input
                id="task"
                value={editingTodo ? editingTodo.task : newTodo.task}
                onChange={(e) => editingTodo ? setEditingTodo({ ...editingTodo, task: e.target.value }) : setNewTodo({ ...newTodo, task: e.target.value })}
                placeholder="Nhập nội dung việc cần làm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event">Sự kiện liên quan</Label>
              <Input
                id="event"
                value={editingTodo ? editingTodo.event : newTodo.event}
                onChange={(e) => editingTodo ? setEditingTodo({ ...editingTodo, event: e.target.value }) : setNewTodo({ ...newTodo, event: e.target.value })}
                placeholder="Nhập tên sự kiện"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Ngày hết hạn</Label>
              <Input
                id="dueDate"
                type="date"
                value={editingTodo ? editingTodo.dueDate : newTodo.dueDate}
                onChange={(e) => editingTodo ? setEditingTodo({ ...editingTodo, dueDate: e.target.value }) : setNewTodo({ ...newTodo, dueDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Mức độ ưu tiên</Label>
              <Select
                value={editingTodo ? editingTodo.priority : newTodo.priority}
                onValueChange={(value: 'low' | 'medium' | 'high') => editingTodo ? setEditingTodo({ ...editingTodo, priority: value }) : setNewTodo({ ...newTodo, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue>{editingTodo ? editingTodo.priority : newTodo.priority}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Thấp</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="high">Cao</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Hủy bỏ</Button>
            <Button type="button" className="ml-2" onClick={editingTodo ? handleEditTodo : handleAddTodo}>
              {editingTodo ? 'Cập nhật' : 'Thêm'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
