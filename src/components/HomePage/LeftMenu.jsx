import React, { useState } from 'react';
import icon from '../../assets/icon/avatar.png';
import friendIcon from '../../assets/icon/friends.png';
import groupIcon from '../../assets/icon/groups.png';
import settingIcon from '../../assets/icon/setting.png';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const LeftMenu = () => {
    const [showFriendsPopup, setShowFriendsPopup] = useState(false);

    const navigate = useNavigate();
    const userName = 'TieuLong Dang';
    const [showLogout, setShowLogout] = useState(false);

    const handleSettingsClick = () => {
        setShowLogout(!showLogout);
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        navigate('/login');
    }


    // Danh sách người dùng mẫu
    const users = [
        { id: 1, name: 'Tiểu Long', avatar: 'https://i.pravatar.cc/40?img=1' },
        { id: 2, name: 'Hoàng Long', avatar: 'https://i.pravatar.cc/40?img=2' },
        { id: 3, name: 'Nguyễn Thị Ngọc A', avatar: 'https://i.pravatar.cc/40?img=3' },
    ];

    return (
        <div className="col-lg-2 bg-light p-3 d-none d-lg-block">
            <ul className="list-unstyled">
                {/* Profile */}
                <li className="d-flex align-items-center mb-3">
    <Link to="/info-user" className="text-decoration-none text-dark cursor-pointer">
        <img
            src={icon}
            alt="profile"
            className="me-3"
            style={{ width: '40px', height: '40px' }}
        />
        <span>{userName}</span>
    </Link>
</li>

                {/* Friends */}
                <li className="d-flex align-items-center mb-3">
                    <a
                        href="#"
                        className="text-decoration-none text-dark cursor-pointer"
                        onClick={() => setShowFriendsPopup(true)} // Hiển thị pop-up
                    >
                        <img
                            src={friendIcon}
                            alt="friends"
                            className="me-3"
                            style={{ width: '40px', height: '40px' }}
                        />
                        <span>Friends</span>
                    </a>
                </li>

                {/* Groups */}
                <li className="d-flex align-items-center mb-3">
                    <a href="#" className="text-decoration-none text-dark cursor-pointer">
                        <img
                            src={groupIcon}
                            alt="groups"
                            className="me-3"
                            style={{ width: '40px', height: '40px' }}
                        />
                        <span>Groups</span>
                    </a>
                </li>

                <hr />

                {/* Setting */}
                <li className="d-flex align-items-center position-relative">
                    <a 
                        href="#" 
                        className="text-decoration-none text-dark cursor-pointer"
                        onClick={handleSettingsClick}
                    >
                        <img
                            src={settingIcon}
                            alt="setting"
                            className="me-3"
                            style={{ width: '40px', height: '40px' }}
                        />
                        <span>Setting</span>
                    </a>
                    {showLogout && (
                        <div
                            className="position-absolute bg-white shadow rounded p-2"
                            style={{ top: '50px', left: '0', zIndex: 1000 }}
                        >
                            <button
                                className="btn btn-danger w-100"
                                onClick={handleLogout} // Xử lý logout khi nhấn
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </li>
            </ul>

            {/* Pop-up hiển thị danh sách bạn bè */}
            {showFriendsPopup && (
    <div
        className="container-fluid d-flex flex-column modal show d-block shadow"
        tabIndex="-1"
        role="dialog"
        style={{
            position: 'fixed', // Cố định pop-up
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1050,
        }}
    >
        <div
            className="modal-dialog"
            role="document"
            style={{
                width: '600px', // Cố định chiều rộng
                height: '800px',
                maxWidth: '75%', 
            }}
        >
            <div className="modal-content" style={{ height: '100%' }}>
                <div className="modal-header">
                    <h5 className="modal-title">Friends List</h5>
                    <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={() => setShowFriendsPopup(false)}
                    ></button>
                </div>
                <div className="modal-body" style={{ overflowY: 'auto' }}>
                    <ul className="list-group">
                        {users.map((user) => (
                            <li key={user.id} className="list-group-item d-flex align-items-center">
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="me-3 rounded-circle"
                                    style={{ width: '40px', height: '40px' }}
                                />
                                {user.name}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    </div>
)}
        </div>
    );
};

export default LeftMenu;