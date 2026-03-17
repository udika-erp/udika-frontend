export interface Customer {
  id: string;
  code: string;
  name: string;
  company?: string;
  phone: string;
  email: string;
  source: 'Referral' | 'Facebook' | 'Google' | 'Zalo' | 'Website';
  leadStatus:
    | 'New'
    | 'Contacted'
    | 'Qualified'
    | 'Proposal'
    | 'Negotiation'
    | 'Won'
    | 'Lost';
  assignee: {
    name: string;
    avatar: string;
  };
  updatedAt: string;
}

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: '1',
    code: 'KH-2024-001',
    name: 'Nguyễn Văn An',
    company: 'Công ty TNHH Đại Phát',
    phone: '0912 345 678',
    email: 'an.nguyen@daiphat.vn',
    source: 'Referral',
    leadStatus: 'Qualified',
    assignee: { name: 'Trần Minh', avatar: 'TM' },
    updatedAt: '15/02/2026',
  },
  {
    id: '2',
    code: 'KH-2024-002',
    name: 'Lê Thị Bích',
    company: 'Tập đoàn Hòa Bình',
    phone: '0987 654 321',
    email: 'bich.le@hoabinh.com.vn',
    source: 'Facebook',
    leadStatus: 'Proposal',
    assignee: { name: 'Phạm Hà', avatar: 'PH' },
    updatedAt: '18/02/2026',
  },
  {
    id: '3',
    code: 'KH-2024-003',
    name: 'Trần Quốc Dũng',
    phone: '0901 234 567',
    email: 'dung.tran@gmail.com',
    source: 'Google',
    leadStatus: 'Contacted',
    assignee: { name: 'Ngô Lan', avatar: 'NL' },
    updatedAt: '20/02/2026',
  },
  {
    id: '4',
    code: 'KH-2024-004',
    name: 'Phạm Thị Mai',
    company: 'Vingroup JSC',
    phone: '0938 765 432',
    email: 'mai.pham@vingroup.vn',
    source: 'Zalo',
    leadStatus: 'Negotiation',
    assignee: { name: 'Trần Minh', avatar: 'TM' },
    updatedAt: '22/02/2026',
  },
  {
    id: '5',
    code: 'KH-2024-005',
    name: 'Hoàng Văn Long',
    company: 'FPT Software',
    phone: '0945 123 456',
    email: 'long.hoang@fpt.com.vn',
    source: 'Website',
    leadStatus: 'Won',
    assignee: { name: 'Phạm Hà', avatar: 'PH' },
    updatedAt: '23/02/2026',
  },
  {
    id: '6',
    code: 'KH-2024-006',
    name: 'Đỗ Thị Hương',
    phone: '0919 876 543',
    email: 'huong.do@email.com',
    source: 'Facebook',
    leadStatus: 'New',
    assignee: { name: 'Ngô Lan', avatar: 'NL' },
    updatedAt: '24/02/2026',
  },
  {
    id: '7',
    code: 'KH-2024-007',
    name: 'Vũ Minh Tuấn',
    company: 'Masan Group',
    phone: '0932 456 789',
    email: 'tuan.vu@masan.com.vn',
    source: 'Referral',
    leadStatus: 'Qualified',
    assignee: { name: 'Trần Minh', avatar: 'TM' },
    updatedAt: '25/02/2026',
  },
  {
    id: '8',
    code: 'KH-2024-008',
    name: 'Nguyễn Thị Lan Anh',
    company: 'Viettel Group',
    phone: '0976 543 210',
    email: 'lananh@viettel.vn',
    source: 'Google',
    leadStatus: 'Proposal',
    assignee: { name: 'Phạm Hà', avatar: 'PH' },
    updatedAt: '26/02/2026',
  },
];

export const SOURCE_COLORS: Record<string, string> = {
  Referral: 'bg-purple-100 text-purple-700 border-purple-200',
  Facebook: 'bg-blue-100 text-blue-700 border-blue-200',
  Google: 'bg-red-100 text-red-700 border-red-200',
  Zalo: 'bg-green-100 text-green-700 border-green-200',
  Website: 'bg-orange-100 text-orange-700 border-orange-200',
};

export const LEAD_STATUS_COLORS: Record<string, string> = {
  New: 'bg-gray-100 text-gray-700 border-gray-200',
  Contacted: 'bg-blue-100 text-blue-700 border-blue-200',
  Qualified: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  Proposal: 'bg-purple-100 text-purple-700 border-purple-200',
  Negotiation: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Won: 'bg-green-100 text-green-700 border-green-200',
  Lost: 'bg-red-100 text-red-700 border-red-200',
};

export const LEAD_STATUS_LABELS: Record<string, string> = {
  New: 'Mới',
  Contacted: 'Đã liên hệ',
  Qualified: 'Đủ điều kiện',
  Proposal: 'Báo giá',
  Negotiation: 'Đàm phán',
  Won: 'Thành công',
  Lost: 'Thất bại',
};
