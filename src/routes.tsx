import { createBrowserRouter, Navigate } from 'react-router';
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
import { Attendance } from '@/pages/attendance';
import ProfilePage from '@/pages/profile';
import ChangePasswordPage from '@/pages/change-password';
import ForceChangePasswordPage from '@/pages/force-change-password';
import { getAccessToken } from '@/services/tokens';

function protectedElement(element: React.ReactNode) {
  return getAccessToken() ? element : <Navigate to="/login" replace />;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: getAccessToken() ? <Navigate to="/" replace /> : <Login />,
  },
  {
    path: '/force-change-password',
    element: <ForceChangePasswordPage />,
  },
  {
    path: '/',
    Component: MainLayout,
    children: [
      { index: true, element: protectedElement(<Dashboard />) },
      { path: 'crm', element: protectedElement(<CRM />) },
      { path: 'crm/:id', element: protectedElement(<CustomerDetail />) },
      { path: 'employees', element: protectedElement(<EmployeeList />) },
      { path: 'events', element: protectedElement(<EventManagement />) },
      { path: 'events/:id', element: protectedElement(<EventDetail />) },
      { path: 'calendar', element: protectedElement(<CalendarPage />) },
      { path: 'reports', element: protectedElement(<Reports />) },
      { path: 'attendance', element: protectedElement(<Attendance />) },
      { path: 'profile', element: protectedElement(<ProfilePage />) },
      { path: 'change-password', element: protectedElement(<ChangePasswordPage />) },
    ],
  },
]);
