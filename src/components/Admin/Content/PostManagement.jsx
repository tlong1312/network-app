// components/Admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Table, InputGroup, FormControl, Button, Modal } from "react-bootstrap";
import { FaSearch, FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../App.css"; // Import your CSS file for styling
// Phải có export default
// components/Admin/Dashboard.jsx
const PostManagement = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingPost, setEditingPost] = useState(null);

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
      console.log("✅ users:", userData); // ⬅ log kết quả để biết có phải mảng không
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

  const handleEdit = (post) => {
    setEditingPost({ ...post });
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:8081/api/posts/${editingPost.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content: editingPost.content,
        mediaUrl: editingPost.mediaUrl,
      }),
    });

    if (res.ok) {
      alert("Cập nhật thành công");
      const updated = await res.json();
      setPosts((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      setEditingPost(null);
    } else {
      alert("Cập nhật thất bại");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setEditingPost((prev) => ({ ...prev, mediaUrl: reader.result }));
    };
    reader.readAsDataURL(file);
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
                    variant="outline-secondary"
                    className="me-2"
                    size="sm"
                    onClick={() => handleEdit(post)}
                  >
                    <FaEdit /> Sửa
                  </Button>
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

      {/* Modal sửa bài viết */}
      <Modal show={!!editingPost} onHide={() => setEditingPost(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Sửa bài viết</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingPost && (
            <>
              <textarea
                className="form-control mb-2"
                value={editingPost.content}
                onChange={(e) =>
                  setEditingPost((prev) => ({ ...prev, content: e.target.value }))
                }
              />
              <input type="file" className="form-control mb-2" onChange={handleFileChange} />
              {editingPost.mediaUrl && (
                <img
                  src={editingPost.mediaUrl}
                  alt="preview"
                  className="img-fluid rounded"
                />
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditingPost(null)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PostManagement;