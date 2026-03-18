import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import defaultAvatar from '../../assets/icon/avatar.png';
import notificationIcon from '../../assets/notification.png';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const Navbar = () => {
    const [query, setQuery] = useState('');
    const [avatarUrl, setAvatarUrl] = useState(defaultAvatar);
    const navigate = useNavigate();
    const currentUserString = sessionStorage.getItem('user');
    const currentUser = currentUserString ? JSON.parse(currentUserString) : null;

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropDown] = useState(false);

    useEffect(() => {
        const handleStorageChange = () => {
            const user = sessionStorage.getItem('user');
            if (user) {
                const parsedUser = JSON.parse(user);
                setAvatarUrl(parsedUser.avatar || defaultAvatar);
            }
        };

        window.addEventListener('user-updated', handleStorageChange);
        
        handleStorageChange();

        return () => {
            window.removeEventListener('user-updated', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const user = sessionStorage.getItem('user');
                const userId = user ? JSON.parse(user).id : null;

                if (userId) {
                    const response = await fetch(`http://localhost:8081/api/users/${userId}`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setAvatarUrl(data.avatar || defaultAvatar);
                    } else {
                        console.error('Tải user thất bại:', response.statusText);
                    }
                }
            } catch (error) {
                console.error('Lỗi trong quá trình tải:', error);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if(!token || !currentUser) return;

        const stompClient = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8081/ws'),
            connectHeaders: {
                Authorization: `Bearer ${token}`
            },
            debug: (str) => {
                console.log(str);
            },
            onConnect: () => {
                console.log("Đã kết nối websocket thành công!");

                stompClient.subscribe('/user/queue/notifications', (message) => {
                    const newNotification = JSON.parse(message.body);
                    console.log("Bắt được thông báo: ", newNotification);

                    setNotifications(prev => [newNotification, ...prev]);
                    setUnreadCount(prev => prev + 1);
                });
            },
            onStompError: (frame) => {
                console.error('Lỗi Broker: ' + frame.headers['message']);
            }
        });

        stompClient.activate();

        return () => {
            if (stompClient) {
                stompClient.deactivate();
            }
        };
    }, [currentUser?.id]);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${query}`);
        }
    };

    const handleNotificationClick = (e) => {
        e.preventDefault();
        setShowDropDown(!showDropdown);
        setUnreadCount(0);  
    }

    return (
        <div className='navbar navbar-expand-lg navbar-light main-color py-3' style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
            <div className='container-fluid'>
                <a href="#" className='cursor-pointer' onClick={() => navigate('/')}>
                    <img src={logo} alt='logo' className='rounded-circle' style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                </a>
                <span className='navbar-brand' onClick={() => navigate('/')}>Network App</span>
                
                <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarNavDropdown'>
                    <span className='navbar-toggler-icon'></span>
                </button>
                
                <div className='collapse navbar-collapse' id='navbarNavDropdown'>
                    <ul className='navbar-nav mx-auto w-100 d-flex justify-content-center'>
                        <li className='nav-item w-100 mb-3 mb-lg-0 mt-3 mt-lg-0' style={{ maxWidth: '600px' }}>
                            <form className="search-form d-flex" onSubmit={handleSubmit}>
                                <i className="fa fa-search search-icon position-absolute"></i>
                                <input type="search" className="form-control search-input ps-5" placeholder="Tìm kiếm bài viết, bạn bè, ..." value={query} onChange={(e) => setQuery(e.target.value)} />
                            </form>
                        </li>
                    </ul>
                    
                    <ul className='navbar-nav ms-auto'>
                        {/* --- KHU VỰC CÁI CHUÔNG THÔNG BÁO --- */}
                        <li className='nav-item mb-3 mb-lg-0 position-relative'>
                            <a href="#" className='cursor-pointer' onClick={handleNotificationClick}>
                                <div className='bg-dark rounded-circle d-flex align-items-center justify-content-center position-relative' style={{ width: '40px', height: '40px', marginRight: '10px' }}>
                                    <img src={notificationIcon} alt='notification' style={{ width: '30px', height: '30px' }} />
                                    
                                    {/* Chấm đỏ báo số lượng */}
                                    {unreadCount > 0 && (
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                            {unreadCount}
                                        </span>
                                    )}
                                </div>
                            </a>
                            
                            {/* Dropdown danh sách thông báo */}
                            {showDropdown && (
                                <div className="dropdown-menu dropdown-menu-end show shadow" style={{ position: 'absolute', right: 0, top: '50px', width: '300px', maxHeight: '400px', overflowY: 'auto' }}>
                                    <h6 className="dropdown-header fw-bold">Thông báo mới</h6>
                                    {notifications.length === 0 ? (
                                        <div className="dropdown-item text-muted text-center py-3">Chưa có thông báo nào</div>
                                    ) : (
                                        notifications.map((notif, index) => (
                                            <div key={index} className="dropdown-item border-bottom py-2 text-wrap" style={{ whiteSpace: "normal" }}>
                                                <strong>{notif.senderName}</strong> {notif.type === 'LIKE' ? 'đã thích bài viết của bạn' : notif.type === 'COMMENT' ? 'đã bình luận bài viết của bạn' : 'đã gửi lời mời kết bạn'}
                                                <br/>
                                                <small className="text-muted text-truncate d-block">{notif.message}</small>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </li>

                        <li className='nav-item mb-3 mb-lg-0'>
                            <Link to={`/info-user/${currentUser?.id}`} className='cursor-pointer'>
                                <img src={avatarUrl} alt='profile' className='rounded-circle' style={{ width: '40px', height: '40px', marginRight: '10px', objectFit: 'cover' }} />
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Navbar;