import React, { useState, useEffect } from 'react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchUsers = async () => {
      try {
        const userRes = await fetch('http://localhost:8081/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        if (!userRes.ok) throw new Error('Không có quyền truy cập users');
        const usersData = await userRes.json();
        setUsers(usersData);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu:', err);
      }
    };

    fetchUsers();
  }, []);

  const deleteUser = async (userId) => {
    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xoá user có ID ${userId}?`);
    if (!confirmDelete) return;

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:8081/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Xoá user thất bại');
      }

      alert('Xoá user thành công!');
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Lỗi khi xoá user:', error);
      alert('Có lỗi xảy ra khi xoá user!');
    }
  };

  return (
    <div className="dashboard">
      <h1>Quản lý người dùng</h1>
      <div className="container mt-3">
        <table className="table text-center">
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ và Tên</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.fullName}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteUser(user.id)}
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
