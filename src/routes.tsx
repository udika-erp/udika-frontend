import { createBrowserRouter, Navigate, Outlet } from 'react-router';
import { MainLayout } from '@/layouts/MainLayout';
import { Dashboard } from '@/pages';
import { Login } from '@/pages/login';
import { CRM } from '@/pages/crm';
import { CustomerDetail } from '@/pages/crm/detail';
import { EventManagement } from '@/pages/events';
import { EventDetail } from '@/pages/events/detail';
import { CalendarPage } from '@/pages/calendar';
import { Reports } from '@/pages/reports';
import { EmployeeList } from '@/pages/employees';
import { EmployeeDetail } from '@/pages/employees/detail';
import { Attendance } from '@/pages/attendance';
import ProfilePage from '@/pages/profile';
import ChangePasswordPage from '@/pages/change-password';
import ForceChangePasswordPage from '@/pages/force-change-password';
import { getAccessToken } from '@/services/tokens';

function ProtectedRoute() {
  return getAccessToken() ? <Outlet /> : <Navigate to="/login" replace />;
}

function GuestRoute() {
  return getAccessToken() ? <Navigate to="/" replace /> : <Outlet />;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: GuestRoute,
    children: [{ index: true, Component: Login }],
  },
  {
    path: '/force-change-password',
    element: <ForceChangePasswordPage />,
  },
  {
    path: '/',
    Component: ProtectedRoute,
    children: [
      {
        Component: MainLayout,
        children: [
          { index: true, Component: Dashboard },
          { path: 'crm', Component: CRM },
          { path: 'crm/:id', Component: CustomerDetail },
          { path: 'employees', Component: EmployeeList },
          { path: 'employees/:id', Component: EmployeeDetail },
          { path: 'events', Component: EventManagement },
          { path: 'events/:id', Component: EventDetail },
          { path: 'calendar', Component: CalendarPage },
          { path: 'reports', Component: Reports },
          { path: 'attendance', Component: Attendance },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'change-password', element: <ChangePasswordPage /> },
        ],
      },
    ],
  },
]);
