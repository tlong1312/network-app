// components/Admin/Dashboard.jsx
import React from 'react';
import { useState } from 'react';
// Phải có export default
// components/Admin/Dashboard.jsx
const StatisticalManagement = () => {
    const [showTable, setShowTable] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);
    const users = [
        { id: 1, hoTen: "Trần Hoàng Long", soBaiViet: 12, soLuotTuongTac: 150 },
        { id: 2, hoTen: "Đặng Tiểu Long", soBaiViet: 14, soLuotTuongTac: 80 },
        { id: 3, hoTen: "Phan Duy Nhân", soBaiViet: 6, soLuotTuongTac: 120 },
        { id: 4, hoTen: "Du Dại Khờ", soBaiViet: 15, soLuotTuongTac: 201 },
        { id: 5, hoTen: "Long Đặng", soBaiViet: 18, soLuotTuongTac: 20 }
      ];
    const postDetails = {
        1: { id: 101, likes: 50, comments: 20, shares: 10 },
        2: { id: 102, likes: 30, comments: 15, shares: 5 },
        3: { id: 103, likes: 70, comments: 25, shares: 8 },
        4: { id: 104, likes: 90, comments: 30, shares: 12 },
        5: { id: 105, likes: 20, comments: 10, shares: 3 }
    };
    return (
        <div className="dashboard">
            <h1>Quản lý bài đăng người dùng</h1>
                <button className="btn btn-primary" onClick={() => setShowTable(true)}>
                    Hiển thị bảng
                </button>
            {showTable && (
                <div className="container mt-3">
                    <table className="table text-center">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Họ và Tên</th>
                                <th>Số Bài Viết</th>
                                <th>Số Lượt Tương Tác</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.hoTen}</td>
                                <td>{user.soBaiViet}</td>
                                <td>{user.soLuotTuongTac}</td>
                                <td>
                                    <button className="btn btn-info btn-sm" onClick={() => setSelectedPost(postDetails[user.id])}>
                                        Xem chi tiết
                                    </button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedPost && (
            <div className="container mt-3 p-3 border border-primary rounded bg-light">
                <h4>Chi tiết bài viết</h4>
                <p><strong>ID Bài Viết:</strong> {selectedPost.id}</p>
                <p><strong>Số lượt thích:</strong> {selectedPost.likes}</p>
                <p><strong>Số bình luận:</strong> {selectedPost.comments}</p>
                <p><strong>Số lượt chia sẻ:</strong> {selectedPost.shares}</p>
                <button className="btn btn-danger" onClick={() => setSelectedPost(null)}>Đóng</button>
            </div>
            )}
        </div>
    );
};

export default StatisticalManagement;