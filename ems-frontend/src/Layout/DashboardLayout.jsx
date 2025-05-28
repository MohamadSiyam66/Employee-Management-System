import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const DashboardLayout = () => (
    <div>
        <Header />
        <div>
            <Sidebar />
            <main className='p-2'>
                <Outlet />
            </main>
        </div>
    </div>
);

export default DashboardLayout;
