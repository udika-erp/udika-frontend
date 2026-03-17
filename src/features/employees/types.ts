export interface Employee {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  position: string;
  department: 'Sales' | 'Operations' | 'Marketing' | 'Finance' | 'HR';
  status: 'Active' | 'Inactive' | 'OnLeave';
  joinDate: string;
  updatedAt: string;
}

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: '1',
    code: 'NV-2024-001',
    name: 'Nguyễn Văn An',
    phone: '0912 345 678',
    email: 'an.nguyen@company.vn',
    position: 'Trưởng phòng Kinh doanh',
    department: 'Sales',
    status: 'Active',
    joinDate: '01/01/2024',
    updatedAt: '15/02/2026',
  },
  {
    id: '2',
    code: 'NV-2024-002',
    name: 'Trần Thị Bình',
    phone: '0987 654 321',
    email: 'binh.tran@company.vn',
    position: 'Nhân viên Kinh doanh',
    department: 'Sales',
    status: 'Active',
    joinDate: '15/02/2024',
    updatedAt: '18/02/2026',
  },
  {
    id: '3',
    code: 'NV-2024-003',
    name: 'Lê Minh Cường',
    phone: '0901 234 567',
    email: 'cuong.le@company.vn',
    position: 'Giám đốc Vận hành',
    department: 'Operations',
    status: 'Active',
    joinDate: '10/01/2024',
    updatedAt: '20/02/2026',
  },
  {
    id: '4',
    code: 'NV-2024-004',
    name: 'Phạm Thu Hà',
    phone: '0938 765 432',
    email: 'ha.pham@company.vn',
    position: 'Nhân viên Marketing',
    department: 'Marketing',
    status: 'Active',
    joinDate: '20/01/2024',
    updatedAt: '22/02/2026',
  },
  {
    id: '5',
    code: 'NV-2024-005',
    name: 'Hoàng Đức Khải',
    phone: '0945 123 456',
    email: 'khai.hoang@company.vn',
    position: 'Trưởng phòng Vận hành',
    department: 'Operations',
    status: 'Active',
    joinDate: '05/02/2024',
    updatedAt: '23/02/2026',
  },
  {
    id: '6',
    code: 'NV-2024-006',
    name: 'Võ Thị Mai',
    phone: '0919 876 543',
    email: 'mai.vo@company.vn',
    position: 'Nhân viên Kinh doanh',
    department: 'Sales',
    status: 'OnLeave',
    joinDate: '25/01/2024',
    updatedAt: '24/02/2026',
  },
  {
    id: '7',
    code: 'NV-2023-015',
    name: 'Đỗ Văn Tuấn',
    phone: '0932 456 789',
    email: 'tuan.do@company.vn',
    position: 'Kế toán trưởng',
    department: 'Finance',
    status: 'Active',
    joinDate: '15/08/2023',
    updatedAt: '25/02/2026',
  },
  {
    id: '8',
    code: 'NV-2023-020',
    name: 'Nguyễn Lan Anh',
    phone: '0976 543 210',
    email: 'lananh@company.vn',
    position: 'Giám đốc Nhân sự',
    department: 'HR',
    status: 'Active',
    joinDate: '01/10/2023',
    updatedAt: '26/02/2026',
  },
];

export const DEPARTMENT_COLORS: Record<string, string> = {
  Sales: 'bg-blue-100 text-blue-700 border-blue-200',
  Operations: 'bg-purple-100 text-purple-700 border-purple-200',
  Marketing: 'bg-pink-100 text-pink-700 border-pink-200',
  Finance: 'bg-green-100 text-green-700 border-green-200',
  HR: 'bg-orange-100 text-orange-700 border-orange-200',
};

export const DEPARTMENT_LABELS: Record<string, string> = {
  Sales: 'Kinh doanh',
  Operations: 'Vận hành',
  Marketing: 'Marketing',
  Finance: 'Tài chính',
  HR: 'Nhân sự',
};

export const STATUS_COLORS: Record<string, string> = {
  Active: 'bg-green-100 text-green-700 border-green-200',
  Inactive: 'bg-red-100 text-red-700 border-red-200',
  OnLeave: 'bg-yellow-100 text-yellow-700 border-yellow-200',
};

export const STATUS_LABELS: Record<string, string> = {
  Active: 'Đang làm việc',
  Inactive: 'Nghỉ việc',
  OnLeave: 'Tạm nghỉ',
};
