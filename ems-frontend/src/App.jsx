import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import DashboardLayout from "./Layout/DashboardLayout.jsx";
import Home from "./pages/admin/Home.jsx";
import Employee from "./pages/admin/Employee.jsx";
import Attendance from "./pages/admin/Attendance.jsx";
import Leave from "./pages/admin/Leave.jsx";
import Timesheet from "./pages/admin/Timesheet.jsx";
import Login from "./pages/login/Login.jsx";

import EmpHome from "./pages/employee/EmpHome.jsx";
import EmpAttendance from "./pages/employee/EmpAttendance.jsx";
import EmpLeave from "./pages/employee/EmpLeave.jsx";
import EmpTimesheet from "./pages/employee/EmpTimesheet.jsx";

function App() {
    const router = createBrowserRouter([
        // Login route
        {
            path: "/",
            element: <Login />,
        },
        // Admin routes
        {
            path: "/admin",
            element: <DashboardLayout />,
            children: [
                { index: true, element: <Home /> },
                { path: "home", element: <Home /> },
                { path: "employee", element: <Employee /> },
                { path: "attendance", element: <Attendance /> },
                { path: "leave", element: <Leave /> },
                { path: "timesheet", element: <Timesheet /> },
            ],
        },
        // Employee routes
        {
            path: "/employee",
            element: <DashboardLayout />,
            children: [
                { index: true, element: <EmpHome /> },
                { path: "home", element: <EmpHome /> },
                { path: "attendance", element: <EmpAttendance /> },
                { path: "leave", element: <EmpLeave /> },
                { path: "timesheet", element: <EmpTimesheet /> },
            ],
        },
    ]);

    return <RouterProvider router={router} />;
}

export default App;
