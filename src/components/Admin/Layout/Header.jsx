import { useNavigate } from 'react-router-dom';

const AdminHeader = () => {
    const navigate = useNavigate();
    const adminData = JSON.parse(localStorage.getItem('adminUser'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <header className="admin-header bg-dark text-white p-3 d-flex justify-content-between align-items-center">
            <div className="header-left">
                <h4 className="m-0">Trang Quản Trị</h4>
            </div>
            <div className="header-right d-flex align-items-center">
                <span className="me-3">
                    <i className="fas fa-user-circle me-2"></i>
                    {adminData?.username || 'Admin'}
                </span>
                <button
                    onClick={handleLogout}
                    className="btn btn-sm btn-outline-light"
                >
                    <i className="fas fa-sign-out-alt me-1"></i> Đăng xuất
                </button>
            </div>
        </header>
    );
};

export default AdminHeader;