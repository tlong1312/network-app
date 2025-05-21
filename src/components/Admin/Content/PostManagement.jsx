import React, { useEffect, useState } from "react";
import { Table, InputGroup, FormControl, Button, Modal } from "react-bootstrap";
import { FaSearch, FaArrowLeft, FaTrash } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../App.css";

const PostManagement = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      const [userRes, postRes] = await Promise.all([
        fetch("http://localhost:8081/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:8081/api/posts", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const userData = await userRes.json();
      const postData = await postRes.json();

      setUsers(userData);
      setPosts(postData);
    };

    fetchData();
  }, []);

  const groupedPosts = posts.reduce((acc, post) => {
    const username = post.user.username;
    if (!acc[username]) acc[username] = [];
    acc[username].push(post);
    return acc;
  }, {});

  const getUserPostStats = (user) => {
    const userPosts = groupedPosts[user.username] || [];
    const interactions = userPosts.reduce(
      (sum, post) => sum + post.likeCount + post.commentCount,
      0
    );
    return { count: userPosts.length, interactions };
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleShowModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDelete = async (postId) => {
  const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?");
  if (!confirmDelete) return;

  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:8081/api/posts/${postId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.ok) {
    alert("Xóa bài viết thành công");
    setPosts(posts.filter((p) => p.id !== postId));
  } else {
    alert("Xóa thất bại");
  }
};


  return (
    <div className="p-4">
      <div className="d-flex align-items-center mb-3">
        <Button variant="link" onClick={() => window.history.back()}>
          <FaArrowLeft />
        </Button>
        <h3 className="ms-3">Quản lý bài viết</h3>
      </div>

      <InputGroup className="mb-3" style={{ maxWidth: "400px" }}>
        <FormControl
          placeholder="Tìm người dùng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="secondary">
          <FaSearch />
        </Button>
      </InputGroup>

      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên người dùng</th>
            <th>Số bài viết</th>
            <th>Lượt tương tác</th>
            <th>Xem bài viết</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => {
            const stats = getUserPostStats(user);
            return (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{stats.count}</td>
                <td>{stats.interactions}</td>
                <td>
                  <Button variant="primary" size="sm" onClick={() => handleShowModal(user)}>
                    Chi tiết
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* Modal bài viết */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Bài viết của {selectedUser?.username}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {(groupedPosts[selectedUser?.username] || []).length > 0 ? (
            groupedPosts[selectedUser.username].map((post) => (
              <div key={post.id} className="border rounded p-3 mb-3">
                <p><strong>Nội dung:</strong> {post.content}</p>
                {post.mediaUrl && (
                  <img
                    src={post.mediaUrl}
                    alt="media"
                    style={{ maxWidth: "100%", borderRadius: "6px" }}
                  />
                )}
                <div className="mt-2 d-flex justify-content-end">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                  >
                    <FaTrash /> Xóa
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p>Người dùng chưa có bài viết nào.</p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PostManagement;
