import { createBrowserRouter } from "react-router";
import { MainLayout } from "@/layouts/MainLayout";
import { Dashboard } from "@/pages/Dashboard";
import { Login } from "@/pages/Login";
import { CRM } from "@/pages/CRM";
import { CustomerDetail } from "@/pages/CustomerDetail";
import { EventManagement } from "@/pages/EventManagement";
import { EventDetail } from "@/pages/EventDetail";
import { CalendarPage } from "@/pages/CalendarPage";
import { Reports } from "@/pages/Reports";
import { EmployeeList } from "@/pages/EmployeeList";
import { Attendance } from "@/pages/Attendance";

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
