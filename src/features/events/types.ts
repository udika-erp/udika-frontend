export interface Event {
  id: number;
  name: string;
  client: string;
  date: string;
  type: string;
  venue: string;
  status: 'planning' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  budget: number;
  attendees: number;
}

export const MOCK_EVENTS: Event[] = [
  {
    id: 1,
    name: 'Johnson Wedding',
    client: 'Sarah Johnson',
    date: '2026-02-28',
    type: 'Wedding',
    venue: 'Grand Ballroom Hotel',
    status: 'confirmed',
    budget: 15000,
    attendees: 150,
  },
  {
    id: 2,
    name: 'Tech Corp Annual Gala',
    client: 'Tech Corp Inc',
    date: '2026-03-05',
    type: 'Corporate',
    venue: 'Convention Center',
    status: 'planning',
    budget: 25000,
    attendees: 300,
  },
  {
    id: 3,
    name: 'Smith 50th Birthday',
    client: 'Michael Smith',
    date: '2026-03-10',
    type: 'Birthday',
    venue: 'Riverside Restaurant',
    status: 'confirmed',
    budget: 8000,
    attendees: 80,
  },
  {
    id: 4,
    name: 'Product Launch Event',
    client: 'StartupXYZ',
    date: '2026-03-15',
    type: 'Corporate',
    venue: 'Tech Hub Space',
    status: 'planning',
    budget: 18000,
    attendees: 200,
  },
  {
    id: 5,
    name: 'Annual Charity Fundraiser',
    client: 'Local Foundation',
    date: '2026-03-20',
    type: 'Charity',
    venue: 'City Hall',
    status: 'in-progress',
    budget: 30000,
    attendees: 400,
  },
  {
    id: 6,
    name: 'Martinez Wedding',
    client: 'Isabella Martinez',
    date: '2026-02-15',
    type: 'Wedding',
    venue: 'Beach Resort',
    status: 'completed',
    budget: 20000,
    attendees: 120,
  },
];

export const EVENT_STATUS_COLORS: Record<string, string> = {
  confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  planning: 'bg-sky-100 text-sky-700 border-sky-300',
  'in-progress': 'bg-amber-100 text-amber-700 border-amber-300',
  completed: 'bg-slate-100 text-slate-700 border-slate-300',
  cancelled: 'bg-rose-100 text-rose-700 border-rose-300',
};

export const EVENT_STATUS_LABELS: Record<string, string> = {
  planning: 'Đang lên kế hoạch',
  confirmed: 'Đã xác nhận',
  'in-progress': 'Đang diễn ra',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
};
