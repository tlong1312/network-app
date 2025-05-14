import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../public/css/login-admin.css';

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Kiểm tra session khi component mount
    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            navigate('/admin/dashboard');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Demo credentials
            if (formData.username === 'admin' && formData.password === '12345') {
                // Giả lập API call với timeout
                await new Promise(resolve => setTimeout(resolve, 500));

                localStorage.setItem('adminToken', 'demo-token-' + Date.now());
                localStorage.setItem('adminUser', JSON.stringify({
                    username: formData.username,
                    role: 'admin'
                }));

                navigate('/admin/dashboard');
            } else {
                throw new Error('Thông tin đăng nhập không chính xác');
            }
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    return (
        <div className="login-container">
            <div className="login-form-container">
                <form onSubmit={handleSubmit} className="login-form">
                    <h2 className="text-center mb-4">Đăng nhập Admin</h2>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Tên đăng nhập</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="admin"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Mật khẩu</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="12345"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Đang đăng nhập...
                            </>
                        ) : 'Đăng nhập'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;