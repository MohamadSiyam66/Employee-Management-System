import { Link, Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const DashboardLayout = () => (
    <div style={{ display: 'flex' }}>
        <Sidebar />
        <section>
            <Outlet />
        </section>
    </div>
);

export default DashboardLayout;
