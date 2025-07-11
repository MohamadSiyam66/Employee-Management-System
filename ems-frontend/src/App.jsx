import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import DashboardLayout from "./Layout/DashboardLayout.jsx";
import Home from "./pages/admin/Home.jsx";
import Employee from "./pages/admin/Employee.jsx";
import Attendance from "./pages/admin/Attendance.jsx";
import Leave from "./pages/admin/Leave.jsx";
import Timesheet from "./pages/admin/Timesheet.jsx";
import AdminReportPage from "./pages/admin/AdminReportPage.jsx";
import Login from "./pages/auth/Login.jsx";
import Onboarding from "./pages/admin/onboarding/Onboarding.jsx";
import AdminSettings from "./pages/admin/Settings.jsx";
import Files from "./pages/admin/onboarding/Files.jsx";
import TaskPage from "./pages/admin/tasks/TaskPage.jsx";
import EmpTask from "./pages/employee/tasks/EmpTask.jsx";
import EmpHome from "./pages/employee/EmpHome.jsx";
import EmpAttendance from "./pages/employee/EmpAttendance.jsx";
import EmpLeave from "./pages/employee/EmpLeave.jsx";
import EmpTimesheet from "./pages/employee/EmpTimesheet.jsx";
import EmpReport from "./pages/employee/EmpReport.jsx";
import Settings from "./pages/employee/Settings.jsx";
import SignUp from './pages/auth/SignUp.jsx';
import Email from './pages/admin/Email.jsx';

function App() {
    const router = createBrowserRouter([
        // Login route
        {
            path: "/",
            element: <Login />,
        },
        // Sign Up route
        {
            path: "/signup",
            element: <SignUp />,
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
                { path: "email", element: <Email /> },
                { path: "reports", element: <AdminReportPage /> },
                { path: "onboarding", element: <Onboarding /> },
                { path: "onboarding-files", element: <Files /> },
                { path: "tasks", element: <TaskPage /> },
                { path: "settings", element: <AdminSettings /> },
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
                { path: "tasks", element: <EmpTask /> },
                { path: "report", element: <EmpReport /> },
                { path: "settings", element: <Settings /> },
            ],
        },
    ]);

    return (
        <>
            <RouterProvider router={router} />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    );
}

export default App;