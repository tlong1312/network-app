import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = () => {
    const location = useLocation();
    const token = localStorage.getItem('adminToken');
    const adminData = JSON.parse(localStorage.getItem('adminUser'));

    // Nếu không có token hoặc không phải admin
    if (!token || !adminData || adminData.role !== 'admin') {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;