import React, { useState } from 'react';
import avatar from '../../../assets/icon/avatar.png';

const PostModal = ({ onClose, onPost }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) {
      alert('Nội dung bài viết không được để trống!');
      return;
    }
    onPost(content, image);
    onClose();
  };

  return (
    <div className="modal d-flex justify-content-center align-items-center" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="card p-4" style={{ width: '400px' }}>
        <h5>Tạo bài viết</h5>
        <textarea
          className="form-control mb-2"
          placeholder="Bạn đang nghĩ gì?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          type="file"
          className="form-control mb-2"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <div className="d-flex justify-content-end">
          <button className="btn btn-secondary me-2" onClick={onClose}>
            Hủy
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Đăng
          </button>
        </div>
      </div>
    </div>
  );
};

const Post = ({ posts }) => (
  <div style={{ width: '100%', overflowY: 'auto' }}>
    {posts.map((post) => (
      <div key={post.id} className="card mb-3 p-3">
        <div className="d-flex align-items-center mb-2">
          <img
            src={post.avatar}
            alt="avatar"
            style={{ width: '40px', height: '40px' }}
            className="me-2 rounded-circle"
          />
          <div>
            <h6 className="mb-0">{post.author}</h6>
            <small className="text-muted">{post.timestamp}</small>
          </div>
        </div>
        <p>{post.content}</p>
        {post.image && <img src={post.image} alt="Post" className="img-fluid rounded" />}
        <div className="d-flex justify-content-between mt-2">
          <span>❤️ {post.likes}</span>
          <span>💬 {post.commentsCount}</span>
        </div>
      </div>
    ))}
  </div>
);

const InfoUser = () => {
  const [currentUser] = useState({
    id: 1,
    name: 'TieuLong Dang',
    avatar: avatar,
  });
  const [posts, setPosts] = useState([]);
  const [showModalPost, setShowModalPost] = useState(false);

  const handlePost = (content, image) => {
    const newPost = {
      id: Date.now(),
      author: currentUser.name,
      avatar: currentUser.avatar,
      timestamp: 'Vừa xong',
      content,
      image: image ? URL.createObjectURL(image) : null,
      likes: 0,
      commentsCount: 0,
      comments: [],
    };
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-center align-items-center mb-3">
        <img
          src={avatar}
          alt="avatar"
          style={{ width: '70px', height: '70px' }}
          className="me-3"
        />
        <h3>{currentUser.name}</h3>
      </div>

      <div className="d-flex gap-4">
        <div className="p-4 shadow" style={{ width: '20%' }}>
          <h2 className="text-center">Giới thiệu</h2>
          <h6>Học tại trường Đại học Sài Gòn</h6>
          <h6>Mối quan hệ: Hẹn hò</h6>
          <h6>Đang sống tại Thành phố Hồ Chí Minh</h6>
          <button className="btn btn-secondary w-100 rounded-pill mt-2">
            Cập nhật tiểu sử
          </button>
        </div>

        <div className="p-3 shadow d-flex flex-column" style={{ width: '80%', height: '80vh' }}>
          <div className="d-flex align-items-center mb-3">
            <img
              src={avatar}
              alt="avatar"
              style={{ width: '50px', height: '50px' }}
              className="me-3 rounded-circle"
            />
            <button
              className="btn btn-outline-primary w-100"
              onClick={() => setShowModalPost(true)}
            >
              Bạn đang nghĩ gì?
            </button>
          </div>

          {showModalPost && (
            <PostModal onClose={() => setShowModalPost(false)} onPost={handlePost} />
          )}

          <div style={{ overflowY: 'auto' }}>
            <Post posts={posts} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoUser;