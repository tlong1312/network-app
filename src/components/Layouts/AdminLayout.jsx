import { Outlet } from 'react-router-dom';
import AdminHeader from '../Admin/Layout/Header';
import AdminSidebar from '../Admin/Layout/Sidebar';
const AdminLayout = () => {
    return (
        <div className="admin-layout d-flex flex-column" style={{ minHeight: '100vh' }}>
            <AdminHeader />
            <div className="d-flex flex-grow-1">
                <AdminSidebar />
                <main className="admin-content flex-grow-1 p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
