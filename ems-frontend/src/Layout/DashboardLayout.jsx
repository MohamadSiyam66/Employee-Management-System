import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const DashboardLayout = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '90vh' }}>
        <Header />
        <div style={{ display: 'flex', flex: 1 }}>
            <Sidebar />
            <main style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                <Outlet />
            </main>
        </div>
    </div>
);

export default DashboardLayout;
