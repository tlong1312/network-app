import React, { useState, useEffect } from 'react';

const UserManagement = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [users, setUsers] = useState([]);
  const [postDetails, setPostDetails] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchUsersAndPosts = async () => {
      try {
        const userRes = await fetch('http://localhost:8081/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        if (!userRes.ok) throw new Error('Không có quyền truy cập users');
        const usersData = await userRes.json();

        const postRes = await fetch('http://localhost:8081/api/posts', {
          method : 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        if (!postRes.ok) throw new Error('Không có quyền truy cập posts');
        const postsArray = await postRes.json();

        // Gom các bài viết theo userId
        const postsByUser = {};
        postsArray.forEach(post => {
          postsByUser[post.userId] = postsByUser[post.userId] || [];
          postsByUser[post.userId].push(post);
        });

        const enrichedUsers = usersData.map(user => ({
          ...user,
          soBaiViet: (postsByUser[user.id] || []).length
        }));

        setUsers(enrichedUsers);
        setPostDetails(postsByUser);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu:', err);
      }
    };

    fetchUsersAndPosts();
  }, []);

  return (
    <div className="dashboard">
      <h1>Quản lý bài đăng người dùng</h1>
      <div className="container mt-3">
        <table className="table text-center">
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ và Tên</th>
              <th>Số Bài Viết</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.fullName}</td>
                <td>{user.soBaiViet}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => {
                      const detail = (postDetails[user.id] || [])[0];
                      if (detail) {
                        setSelectedPost(detail);
                      } else {
                        alert("Chưa có chi tiết bài viết!");
                      }
                    }}
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPost && (
        <div className="container mt-3 p-3 border border-primary rounded bg-light">
          <h4>Chi tiết bài viết</h4>
          <p><strong>ID Bài Viết:</strong> {selectedPost.id}</p>
          <p><strong>Số lượt thích:</strong> {selectedPost.likeCount}</p>
          <p><strong>Số bình luận:</strong> {selectedPost.commentCount}</p>
          <p><strong>Ngày tạo:</strong> {selectedPost.createdAt}</p>
          <button className="btn btn-danger" onClick={() => setSelectedPost(null)}>Đóng</button>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
