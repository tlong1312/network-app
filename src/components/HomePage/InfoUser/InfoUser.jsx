import React, { useEffect, useState } from 'react';
import avatar from '../../../assets/icon/avatar.png';
import Post from '../Post';
import PostModal from '../PostModal';
import { useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import settingIcon from '../../../assets/icon/setting.png';
import friendIcon from '../../../assets/icon/friends.png';

const InfoUser = () => {
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [showModalPost, setShowModalPost] = useState(false);
  const handleSettingsClick = () => { setShowLogout(!showLogout); }
  const [showFriendsPopup, setShowFriendsPopup] = useState(false);
  const [showInfoUser, setShowInfoUser] = useState(false);
  const currentUser = localStorage.getItem('user');
  const currentUserId = currentUser ? JSON.parse(currentUser).id : null;
  const [friendStatus, setFriendStatus] = useState("none");
  const [isReceiver, setIsReceiver] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    Navigate('/login');
  }
  const users = [
    { id: 1, name: 'Tiểu Long', avatar: 'https://i.pravatar.cc/40?img=1' },
    { id: 2, name: 'Hoàng Long', avatar: 'https://i.pravatar.cc/40?img=2' },
    { id: 3, name: 'Nguyễn Thị Ngọc A', avatar: 'https://i.pravatar.cc/40?img=3' },
  ];
  const [showLogout, setShowLogout] = useState(false);
  useEffect(() => {

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8081/api/users/${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUser({
            id: data.id,
            name: data.fullName,
            email: data.email,
            avatar: data.avatar,
          });
        } else {
          console.error('Failed to fetch user:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    const checkFriendStatus = async () => {
      if (friendStatus === "pending") return; 
    if (parseInt(userId) === parseInt(currentUserId)) {
        setFriendStatus("none");
        return;
    }
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8081/api/friends/friendship-status?userId=${currentUserId}&friendId=${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setFriendStatus(data.status);
          setIsReceiver(data.isReceiver);
          console.log('Friend status:', data.status);
        } else {
          console.error('Failed to check friend status:', response.statusText);
        }
      } catch (error) {
        console.error('Error checking friend status:', error);
      }
    };

    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8081/api/posts', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setPosts(data.map(post => ({
            id: post.id,
            author: post.user.username,
            avatar: post.user.avatar,
            content: post.content,
            mediaUrl: post.mediaUrl,
            timestamp: post.createdAt,
            comments: post.comments,
            commentsCount: post.commentCount,
            likes: post.likeCount,
            isLiked: post.liked,
          })));
          console.log(data);
        } else {
          console.error('Failed to fetch posts:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchUser();
    fetchPosts();
    checkFriendStatus();
  }, [userId, currentUserId, friendStatus]);


  const handleAddFriend = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8081/api/friends/send-request?userId=${currentUserId}&friendId=${userId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setFriendStatus("pending");
      } else {
        console.error('Failed to send friend request:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const handleUnfriend = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8081/api/friends/unfriend?userId=${currentUserId}&friendId=${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setFriendStatus("none");
      } else {
        console.error('Failed to unfriend:', response.statusText);
      }
    } catch (error) {
      console.error('Error unfriending:', error);
    }
  };

  const handleAcceptFriend = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8081/api/friends/accept-request?userId=${currentUserId}&friendId=${userId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setFriendStatus("accepted");
      } else {
        console.error('Failed to accept friend request:', response.statusText);
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };


  const handlePost = async (content, mediaFile) => {
    try {

      const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      };

      let mediaUrl = null;
      if (mediaFile) {
        mediaUrl = await convertToBase64(mediaFile);
      }

      const payload = {
        content,
        mediaUrl,
      };

      console.log('Payload gửi lên server:', payload);

      const response = await fetch('http://localhost:8081/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const newPost = await response.json();
        console.log('Bài viết mới:', newPost);

        setPosts([
          {
            id: newPost.id,
            author: newPost.user.username,
            avatar: newPost.user.avatar,
            content: newPost.content,
            mediaUrl: newPost.mediaUrl,
            timestamp: newPost.createdAt,
            comments: newPost.comments,
            commentsCount: newPost.commentCount,
            likes: newPost.likeCount,
          },
          ...posts,
        ]);
      } else {
        console.error('Lỗi khi đăng bài viết:', response.statusText);
      }
    } catch (error) {
      console.error('Đã xảy ra lỗi:', error);
    }
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
        <h3>{user.name}</h3>
      </div>


      <div className="text-center">
        {parseInt(userId) === parseInt(currentUserId) ? null : (
          friendStatus === "accepted" ? (
            <button className="btn btn-outline-danger" onClick={handleUnfriend}>
              Unfriend
            </button>
          ) : friendStatus === "pending" ? (
            isReceiver ? ( // Nếu là người nhận yêu cầu
              <div>
                <button className="btn btn-outline-success me-2" onClick={handleAcceptFriend}>
                  Accept Friend
                </button>
                <button className="btn btn-outline-danger" onClick={handleUnfriend}>
                  Decline
                </button>
              </div>
            ) : ( // Nếu là người gửi yêu cầu
              <button className="btn btn-outline-secondary" disabled>
                Pending
              </button>
            )
          ) : (
            <button className="btn btn-outline-primary" onClick={handleAddFriend}>
              Add Friend
            </button>
          )
        )}
      </div>

      <div className="d-flex gap-4">
        <div className="p-4 shadow" style={{ width: '20%', height: 'fit-content' }}>
          <h5 className="mb-4">Menu</h5>

          {/* Information */}
          <li className="d-flex align-items-center mb-3">
            <a
              href="#"
              className="text-decoration-none text-dark cursor-pointer"
              onClick={() => setShowInfoUser(true)}
            >
              <img
                src={friendIcon}
                alt="friends"
                className="me-3"
                style={{ width: '40px', height: '40px' }}
              />
              <span>Update Information</span>
            </a>
          </li>

          {showInfoUser && (
            <div className="position-fixed top-50 start-50 translate-middle bg-white shadow rounded p-4" style={{ width: '400px', zIndex: 1050 }}>
              <h5 className="mb-3">Update Information</h5>
              <form>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={user.name}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={user.email}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Avatar URL</label>
                  <input
                    type="text"
                    className="form-control"
                    id="avatar"
                    defaultValue={user.avatar}

                  />
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={() => setShowInfoUser(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">Save</button>
                </div>
              </form>
            </div>
          )}

          {/* Friends */}
          <li className="d-flex align-items-center mb-3">
            <a
              href="#"
              className="text-decoration-none text-dark cursor-pointer"
              onClick={() => setShowFriendsPopup(true)}
            >
              <img
                src={friendIcon}
                alt="friends"
                className="me-3"
                style={{ width: '40px', height: '40px' }}
              />
              <span>Friends</span>
            </a>
          </li>


          {/* Setting */}
          <li className="d-flex align-items-center position-relative">
            <a
              href="#"
              className="text-decoration-none text-dark cursor-pointer"
              onClick={handleSettingsClick}
            >
              <img
                src={settingIcon}
                alt="setting"
                className="me-3"
                style={{ width: '40px', height: '40px' }}
              />
              <span>Setting</span>
            </a>
            {showLogout && (
              <div className="position-absolute bg-white shadow rounded p-2" style={{ top: '50px', left: '0', zIndex: 1000 }}>
                <button className="btn btn-danger w-100" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </li>

          {showFriendsPopup && (
            <div className="container-fluid d-flex flex-column modal show d-block shadow"
              tabIndex="-1"
              role="dialog"
              style={{
                position: 'fixed', // Cố định pop-up
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1050,
              }}>
              <div className="modal-dialog"
                role="document"
                style={{
                  width: '600px', // Cố định chiều rộng
                  height: '800px',
                  maxWidth: '75%',
                }}>
                <div className="modal-content" style={{ height: '100%' }}>
                  <div className="modal-header">
                    <h5 className="modal-title">Friends List</h5>
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Close"
                      onClick={() => setShowFriendsPopup(false)}
                    ></button>
                  </div>
                  <div className="modal-body" style={{ overflowY: 'auto' }}>
                    <ul className="list-group">
                      {users.map((user) => (
                        <li key={user.id} className="list-group-item d-flex align-items-center">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="me-3 rounded-circle"
                            style={{ width: '40px', height: '40px' }}
                          />
                          {user.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-3 shadow d-flex flex-column" style={{ width: '80%' }}>
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
            <PostModal
              onClose={() => setShowModalPost(false)}
              onPost={handlePost}
            />
          )}

          <Post posts={posts} setPosts={setPosts} currentUser={user} />
        </div>
      </div>
    </div>
  );
};

export default InfoUser;