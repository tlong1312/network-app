import React, { useEffect, useState } from 'react';
import Post from '../Post';
import PostModal from '../PostModal';
import { useNavigate, useParams } from 'react-router-dom';
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
  const [friends, setFriends] = useState([]);
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8081/api/friends?userId=${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFriends(data);
        } else {
          console.error('Failed to fetch friends:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    if (userId) {
      fetchFriends();
    }
  }, [userId]);

  
  const [editedUser, setEditedUser] = useState({
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  });
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    navigate('/login');
  }
  const [showLogout, setShowLogout] = useState(false);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8081/api/posts/my-posts', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPosts(data.map(post => ({
          id: post.id,
          author: post.user.fullName,
          avatar: post.user.avatar,
          content: post.content,
          mediaUrl: post.mediaUrl,
          createdAt: post.createdAt,
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


    fetchUser();
    fetchPosts();
    checkFriendStatus();
  }, [userId, currentUserId, friendStatus]);

  useEffect(() => {
    if (user && user.id) {
      setEditedUser({
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'upload_jh0b9yxu');

    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dm8pwfst2/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        const uploadedUrl = data.secure_url;

        setEditedUser({ ...editedUser, avatar: uploadedUrl });
      } else {
        console.error('Failed to upload avatar:', response.statusText);
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  }

  const handleUpdateUserInfo = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const updateResponse = await fetch(`http://localhost:8081/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: editedUser.name,
          email: editedUser.email,
          avatar: editedUser.avatar,
        }),
      });

      if (updateResponse.ok) {
        setUser({
          ...user,
          name: editedUser.name,
          email: editedUser.email,
          avatar: editedUser.avatar,
        });

        if (parseInt(userId) === parseInt(currentUserId)) {
          const currentUserData = JSON.parse(localStorage.getItem('user'));
          if (currentUserData) {
            currentUserData.fullName = editedUser.name;
            currentUserData.avatar = editedUser.avatar;
            localStorage.setItem('user', JSON.stringify(currentUserData));
            window.dispatchEvent(new Event('user-updated'));
          }
        }
        fetchPosts()
        console.log('User information updated successfully!');
        setShowInfoUser(false);
      } else {
        console.error('Failed to update user information:', await updateResponse.text());
      }
    } catch (error) {
      console.error('Error updating user information:', error);
    }
  };

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

      let mediaUrl = null;
      if (mediaFile) {
        const formData = new FormData();
        formData.append('file', mediaFile);
        formData.append('upload_preset', 'upload-y8ouewvx');

        const response = await fetch('https://api.cloudinary.com/v1_1/drbjicnlm/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          mediaUrl = data.secure_url;
        } else {
          console.error('Upload file lên cloud thất bại: ', response.statusText);
          return;
        }

      }

      const payload = {
        content,
        mediaUrl,
      };

      const apiResponse = await fetch('http://localhost:8081/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      if (apiResponse.ok) {
        const newPost = await apiResponse.json();
        setPosts([
          {
            id: newPost.id,
            author: newPost.user.fullName,
            avatar: newPost.user.avatar,
            content: newPost.content,
            mediaUrl: newPost.mediaUrl,
            createdAt: newPost.createdAt,
            comments: newPost.comments,
            commentsCount: newPost.commentCount,
            likes: newPost.likeCount,
          },
          ...posts,
        ]);
      } else {
        console.error('Lỗi khi đăng bài viết:', apiResponse.statusText);
      }
    } catch (error) {
      console.error('Đã xảy ra lỗi:', error);
    }
  };
  return (
    <div className="container-fluid" style={{ minHeight: '100vh', height: '100%' }}>
      <div className="d-flex justify-content-center align-items-center mb-3">
        <img
          src={user.avatar}
          alt="avatar"
          style={{ width: '70px', height: '70px' }}
          className="me-3 mt-3 rounded-circle"
        />
        <h3 className='mt-4 ms-2'>{user.name}</h3>
      </div>


      <div className="text-center">
        {parseInt(userId) === parseInt(currentUserId) ? null : (
          friendStatus === "accepted" ? (
            <button className="btn btn-outline-danger" onClick={handleUnfriend}>
              Unfriend
            </button>
          ) : friendStatus === "pending" ? (
            isReceiver ? (
              <div>
                <button className="btn btn-outline-success me-2" onClick={handleAcceptFriend}>
                  Accept Friend
                </button>
                <button className="btn btn-outline-danger" onClick={handleUnfriend}>
                  Decline
                </button>
              </div>
            ) : (
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
        <div className="p-4 shadow" 
            style={{ 
              width: '25%', 
              height: 'fit-content', 
              position: 'sticky',
              top:100,
              }}>
          <h4 classname= "mb-2 ms-2">Introduce</h4>
          <span className="text-muted">Name: {user.name}</span>
          <p className="text-muted" onClick={() => setShowInfoUser(true)}>Email: {user.email ? user.email : 'Chưa cập nhật email'}</p>
          <h4 className="mb-4">Menu</h4>
          {/* Information */}
          {parseInt(userId) === parseInt(currentUserId) && (
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
        </div>

        {showFriendsPopup && (
            <div
              className="modal-overlay"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1040,
              }}
              onClick={() => setShowFriendsPopup(false)}
            >
              <div
                className="container-fluid d-flex flex-column modal show d-block shadow"
                tabIndex="-1"
                role="dialog"
                style={{
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 1050,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="modal-dialog"
                  role="document"
                  style={{
                    width: '600px',
                    height: '800px',
                    maxWidth: '75%',
                  }}
                >
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Friends List</h5>
                      <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={() => setShowFriendsPopup(false)}
                      ></button>
                    </div>
                    <div
                      className="modal-body"
                      style={{
                        maxHeight: '700px',
                        overflowY: 'auto',
                      }}
                    >
                      <ul className="list-group">
                        {friends.map((friend) => (
                          <li
                            key={friend.id}
                            className="list-group-item d-flex align-items-center"
                            onClick={() => navigate(`/info-user/${friend.id}`)}
                            style={{ cursor: 'pointer' }}
                          >
                            <img
                              src={friend.avatar}
                              alt={friend.fullName}
                              className="me-3 rounded-circle"
                              style={{ width: '40px', height: '40px' }}
                            />
                            {friend.fullName}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        {parseInt(userId) === parseInt(currentUserId) && showInfoUser && (
            <div className="position-fixed top-50 start-50 translate-middle bg-white shadow rounded p-4" style={{ width: '400px', zIndex: 1050, top:100 }}>
              <h5 className="mb-3">Update Information</h5>
              <form onSubmit={handleUpdateUserInfo}>
                <div className="mb-3">
                  <label className="form-label">Họ Tên</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editedUser.name || ''}
                    onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editedUser.email || ''}
                    onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Avatar</label>
                  {editedUser.avatar && (
                    <div className="mb-2">
                      <img
                        src={editedUser.avatar}
                        alt="Preview Avatar"
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        className="rounded-circle"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleAvatarChange}
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

        <div className="p-3 shadow d-flex flex-column" style={{ width: '80%' }}>
          <div className="d-flex align-items-center mb-3">
            <img
              src={user.avatar}
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