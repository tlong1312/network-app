// components/Admin/Dashboard.jsx
import React, { useState } from "react";
import { Table, InputGroup, FormControl, Button, Modal } from "react-bootstrap";
import { FaSearch, FaArrowLeft } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
// Phải có export default
// components/Admin/Dashboard.jsx
const PostManagement = () => {
    const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const users = [
    { id: 1, name: "Nguyễn Văn B", posts: 45, interactions: 56 },
    { id: 2, name: "Nguyễn Văn C", posts: 30, interactions: 42 },
    { id: 3, name: "Nguyễn Văn D", posts: 60, interactions: 70 },
  ];

  const userPosts = {
    1: [
      { id: 101, content: "Bài viết 1 của Nguyễn Văn B" },
      { id: 102, content: "Bài viết 2 của Nguyễn Văn B" },
    ],
    2: [
      { id: 201, content: "Bài viết 1 của Nguyễn Văn C" },
      { id: 202, content: "Bài viết 2 của Nguyễn Văn C" },
    ],
    3: [
      { id: 301, content: "Bài viết 1 của Nguyễn Văn D" },
      { id: 302, content: "Bài viết 2 của Nguyễn Văn D" },
    ],
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleShowModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <Button variant="link" className="back-button" onClick={() => window.history.back()}>
          <FaArrowLeft />
        </Button>
        <h2>QUẢN LÝ BÀI ĐĂNG</h2>
      </div>
      <div className="admin-search">
        <InputGroup>
          <FormControl
            placeholder="Tìm kiếm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="outline-secondary">
            <FaSearch />
          </Button>
        </InputGroup>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Họ và tên</th>
            <th>Số bài viết</th>
            <th>Số lượt tương tác</th>
            <th>Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.posts}</td>
              <td>{user.interactions}</td>
              <td>
                <Button variant="primary" onClick={() => handleShowModal(user)}>Chi tiết</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Popup Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Bài viết của {selectedUser?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && userPosts[selectedUser.id] ? (
            userPosts[selectedUser.id].map((post) => (
              <div key={post.id} className="post-item">
                <p>{post.content}</p>
                <hr />
              </div>
            ))
          ) : (
            <p>Không có bài viết nào.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
    </div>
  );
};



export default PostManagement;