import { createBrowserRouter } from "react-router";
import { MainLayout } from "@/layouts/MainLayout";
import { Dashboard } from "@/pages";
import { Login } from "@/pages/login";
import { CRM } from "@/pages/crm";
import { CustomerDetail } from "@/pages/crm/detail";
import { EventManagement } from "@/pages/events";
import { EventDetail } from "@/pages/events/detail";
import { CalendarPage } from "@/pages/calendar";
import { Reports } from "@/pages/reports";
import { EmployeeList } from "@/pages/employees";
import { Attendance } from "@/pages/attendance";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "crm", Component: CRM },
      { path: "crm/:id", Component: CustomerDetail },
      { path: "employees", Component: EmployeeList },
      { path: "events", Component: EventManagement },
      { path: "events/:id", Component: EventDetail },
      { path: "calendar", Component: CalendarPage },
      { path: "reports", Component: Reports },
      { path: "attendance", Component: Attendance },
    ],
  },
]);
