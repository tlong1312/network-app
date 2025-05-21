import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import defaultAvatar from '../../assets/icon/avatar.png';
import notification from '../../assets/notification.png';

const Navbar = () => {
    const [query, setQuery] = useState('');
    const [avatarUrl, setAvatarUrl] = useState(defaultAvatar);
    const navigate = useNavigate();

    useEffect(() => {
        const handleStorageChange = () => {
            const user = localStorage.getItem('user');
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
                const token = localStorage.getItem('token');
                const user = localStorage.getItem('user');
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

    const handleSubmit = (event) => {
        event.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${query}`);
        }
    };

    return (
        <div className='navbar navbar-expand-lg navbar-light main-color py-3'>
            <div className='container-fluid'>
                <a href="#" className='cursor-pointer' onClick={() => navigate('/')}>
                    <img 
                        src={logo} 
                        alt='logo' 
                        className='rounded-circle' 
                        style={{ width: '50px', height: '50px', marginRight: '10px' }} 
                    />
                </a>
                <span className='navbar-brand' onClick={() => navigate('/')}>Network App</span>
                <button className='navbar-toggler' type='button'
                    data-bs-toggle='collapse' data-bs-target='#navbarNavDropdown'
                    aria-controls='navbarNavDropdown' aria-expanded='false'
                    aria-label='Toggle Navigation'
                >
                    <span className='navbar-toggler-icon'></span>
                </button>
                <div className='collapse navbar-collapse' id='navbarNavDropdown'>
                    <ul className='navbar-nav mx-auto w-100 d-flex justify-content-center'>
                        <li className='nav-item w-100 mb-3 mb-lg-0 mt-3 mt-lg-0' style={{ maxWidth: '600px' }}>
                            <form className="search-form d-flex" onSubmit={handleSubmit}>
                                <i className="fa fa-search search-icon position-absolute"></i>
                                <input
                                    type="search"
                                    className="form-control search-input ps-5"
                                    placeholder="Tìm kiếm bài viết, bạn bè, ..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </form>
                        </li>
                    </ul>
                    <ul className='navbar-nav ms-auto'>
                        <li className='nav-item mb-3 mb-lg-0'>
                            <a href="#" target='_blank' className='cursor-pointer'>
                                <div className='bg-dark rounded-circle d-flex align-items-center justify-content-center' style={{ width: '40px', height: '40px', marginRight: '10px' }}>
                                    <img
                                        src={notification}
                                        alt='notification'
                                        style={{ width: '30px', height: '30px' }}
                                    />
                                </div>
                            </a>
                        </li>
                        <li className='nav-item mb-3 mb-lg-0'>
                            <a href="#" target='_blank' className='cursor-pointer'>
                                <img
                                    src={avatarUrl}
                                    alt='profile'
                                    className='rounded-circle'
                                    style={{ width: '40px', height: '40px', marginRight: '10px' }}
                                />
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Navbar;