import { NavLink, useNavigate } from 'react-router-dom';

const AdminSidebar = () => {
    const navigate = useNavigate();

    const menuItems = [
        {
            title: 'Tổng quan',
            icon: 'fas fa-chart-pie',
            path: '/admin/dashboard'
        },
        {
            title: 'Thống kê người dùng',
            icon: 'fas fa-users',
            path: '/admin/statistical-management'
        },
        {
            title: 'Quản lý người dùng',
            icon: 'fas fa-user-cog',
            path: '/admin/user-management'
        },
        {
            title: 'Quản lý bài đăng',
            icon: 'fas fa-newspaper',
            path: '/admin/post-management'
        }
    ];

    return (
        <aside className="admin-sidebar bg-light" style={{ width: '250px', minHeight: '100vh' }}>
            <div className="sidebar-menu p-3">
                <ul className="nav flex-column">
                    {menuItems.map((item, index) => (
                        <li className="nav-item mb-2" key={index}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `nav-link d-flex align-items-center ${isActive ? 'active text-primary' : 'text-dark'}`
                                }
                            >
                                <i className={`${item.icon} me-3`}></i>
                                {item.title}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};

export default AdminSidebar;