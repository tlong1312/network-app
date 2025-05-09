import React, { useEffect, useState } from 'react';
import avatar from '../../../assets/icon/avatar.png';
import Post from '../Post';
import PostModal from '../PostModal';
import { useParams } from 'react-router-dom';

const InfoUser = () => {
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [showModalPost, setShowModalPost] = useState(false);
  
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
            name: data.username,
            avatar: data.avatar,
          });
        } else {
          console.error('Failed to fetch user:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
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
  }, [userId]);

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
                <PostModal
                    onClose={() => setShowModalPost(false)}
                    onPost={handlePost}
                />
            )}

            <Post posts={posts} setPosts={setPosts} currentUser={user}/>
        </div>
      </div>
    </div>
  );
};

export default InfoUser;