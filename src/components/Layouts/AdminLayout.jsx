import { Outlet, useNavigate } from 'react-router-dom';
import AdminHeader from '../Admin/Layout/Header';
import AdminSidebar from '../Admin/Layout/Sidebar';
import { useEffect } from 'react';
const AdminLayout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
        }
    }, [navigate]);

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