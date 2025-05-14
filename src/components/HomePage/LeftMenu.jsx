import React, { useEffect, useState } from 'react';
import icon from '../../assets/icon/avatar.png';
import friendIcon from '../../assets/icon/friends.png';
import groupIcon from '../../assets/icon/groups.png';
import settingIcon from '../../assets/icon/setting.png';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const LeftMenu = () => {
    const user = localStorage.getItem('user');
    const [showFriendsPopup, setShowFriendsPopup] = useState(false);
    const navigate = useNavigate();
    const fullName = user ? JSON.parse(user).fullName : 'User';
    const currentUserId = user ? JSON.parse(user).id : null;
    const avatar = user ? JSON.parse(user).avatar || icon : icon; // Lấy avatar từ localStorage hoặc dùng hình mặc định
    const [showLogout, setShowLogout] = useState(false);
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:8081/api/friends?userId=${currentUserId}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setFriends(data);
                } else {
                    console.error('Failed to fetch friends:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
        };

        if (currentUserId) {
            fetchFriends();
        }
    }, [currentUserId]);

    const handleSettingsClick = () => {
        setShowLogout(!showLogout);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="col-lg-2 bg-light p-3 d-none d-lg-block">
            <ul className="list-unstyled">
                {/* Profile */}
                <li className="d-flex align-items-center mb-3">
                    <Link to={`/info-user/${currentUserId}`} className="text-decoration-none text-dark cursor-pointer">
                        <img
                            src={avatar}
                            alt="profile"
                            className="me-3 rounded-circle"
                            style={{ width: '40px', height: '40px' }}
                        />
                        <span>{fullName}</span>
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
                                onClick={handleLogout}
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
                    className="modal-overlay"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 1040,
                    }}
                    onClick={() => setShowFriendsPopup(false)}
                >
                    <div
                        className="container-fluid d-flex flex-column modal show d-block shadow"
                        tabIndex="-1"
                        role="dialog"
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 1050,
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            className="modal-dialog"
                            role="document"
                            style={{
                                width: '600px',
                                height: '800px',
                                maxWidth: '75%',
                            }}
                        >
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Friends List</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        aria-label="Close"
                                        onClick={() => setShowFriendsPopup(false)}
                                    ></button>
                                </div>
                                <div
                                    className="modal-body"
                                    style={{
                                        maxHeight: '700px',
                                        overflowY: 'auto',
                                    }}
                                >
                                    <ul className="list-group">
                                        {friends.map((friend) => (
                                            <li
                                                key={friend.id}
                                                className="list-group-item d-flex align-items-center"
                                                onClick={() => navigate(`/info-user/${friend.id}`)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <img
                                                    src={friend.avatar}
                                                    alt={friend.fullName}
                                                    className="me-3 rounded-circle"
                                                    style={{ width: '40px', height: '40px' }}
                                                />
                                                {friend.fullName}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeftMenu;