import React, { useEffect, useState } from 'react';
import Post from './Post';
import PostModal from './PostModal';
import storyIcon from '../../assets/icon/story-icon.png';
import StoryModal from './StoryModal';
import avatar from '../../assets/icon/avatar.png';

const MainContent = () => {
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [selectedStory, setSelectedStory] = useState(null);
    const [showModalStory, setShowModalStory] = useState(false);
    const [showModalPost, setShowModalPost] = useState(false);
    const [posts, setPosts] = useState([]);
    const [stories, setStories] = useState([]);

    const [currentUser, setCurrentUser] = useState(() => {
    const userFromStorage = localStorage.getItem('user');
    if (userFromStorage) {
        const parsedUser = JSON.parse(userFromStorage);
        return {
            id: parsedUser.id,
            name: parsedUser.username, // Điều chỉnh tên trường theo dữ liệu thực tế của bạn
            avatar: parsedUser.avatar || avatar, // Sử dụng avatar mặc định nếu không có
        };
    } else {
        return {
            id: 1,
            name: 'Guest User',
            avatar: avatar,
        };
    }
});

// Thêm useEffect để lắng nghe thay đổi trong localStorage
useEffect(() => {
    const handleUserUpdate = () => {
        const userFromStorage = localStorage.getItem('user');
        if (userFromStorage) {
            const parsedUser = JSON.parse(userFromStorage);
            setCurrentUser({
                id: parsedUser.id,
                name: parsedUser.username, // Điều chỉnh tên trường theo dữ liệu thực tế 
                avatar: parsedUser.avatar || avatar,
            });
        }
    };

    // Lắng nghe sự kiện user-updated
    window.addEventListener('user-updated', handleUserUpdate);
    
    // Cleanup
    return () => {
        window.removeEventListener('user-updated', handleUserUpdate);
    };
}, []);


const fetchStories = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            
            const response = await fetch('http://localhost:8081/api/stories', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            if (response.ok) {
                const data = await response.json();
                
                // Chỉ lấy những người dùng có ít nhất 1 story
                const formattedStories = data
                    .filter(user => user.images && user.images.length > 0)
                    .map(user => ({
                        id: user.id,
                        authorName: user.username,
                        avatar: user.avatar || avatar,
                        stories: user.images.map((image, index) => ({
                            id: index,
                            image: image.url,
                            duration: image.duration || 5000
                        }))
                    }));
                
                setStories(formattedStories);
            } else {
                console.error('Failed to fetch stories:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching stories:', error);
        }
    };

    useEffect(() => {
        fetchStories();
    }, []);


    

    // Auto-play stories with progress bar
    useEffect(() => {
        if (!selectedStory || isPaused) return;

        if (!selectedStory.stories || 
            selectedStory.stories.length === 0 || 
            !selectedStory.stories[currentStoryIndex]) {
            setSelectedStory(null);
            return;
        }

        const storyDuration = selectedStory.stories[currentStoryIndex].duration || 5000;
        const interval = 100;
        const totalSteps = storyDuration / interval;
        let step = 0;

        const progressInterval = setInterval(() => {
            step += 1;
            setProgress((step / totalSteps) * 100);

            if (step >= totalSteps) {
                clearInterval(progressInterval);
                nextStory();
            }
        }, interval);

        return () => clearInterval(progressInterval);
    }, [selectedStory, currentStoryIndex, isPaused]);

    const nextStory = () => {
        if (selectedStory) {
            if (currentStoryIndex < selectedStory.stories.length - 1) {
                setCurrentStoryIndex(currentStoryIndex + 1);
            } else {
                // If it's the last story, close the modal
                setSelectedStory(null);
                setCurrentStoryIndex(0);
            }
            setProgress(0);
        }
    };

    const prevStory = () => {
        if (currentStoryIndex > 0) {
            setCurrentStoryIndex(currentStoryIndex - 1);
            setProgress(0);
        }
    };

    // Sửa hàm handStory trong MainContent.jsx

const handStory = (imageInput) => {
    // Kiểm tra xem đầu vào có phải URL string hay không
    const imageUrl = typeof imageInput === 'string' 
        ? imageInput  // Nếu là string (URL), sử dụng trực tiếp
        : URL.createObjectURL(imageInput);  // Nếu là file, tạo URL

    const newStory = {
        id: Date.now(),
        image: imageUrl,
        duration: 5000
    };
    
    setStories((prevStories) => {
        // Kiểm tra xem user đã có trong stories chưa
        const userStoryIndex = prevStories.findIndex(story => story.id === currentUser.id);
        
        if (userStoryIndex !== -1) {
            // Nếu user đã có story, thêm vào mảng stories của user đó
            const updatedStories = [...prevStories];
            updatedStories[userStoryIndex] = {
                ...updatedStories[userStoryIndex],
                stories: [...updatedStories[userStoryIndex].stories, newStory]
            };
            return updatedStories;
        } else {
            // Nếu user chưa có story, tạo mới
            return [
                ...prevStories,
                {
                    id: currentUser.id,
                    authorName: currentUser.name,
                    avatar: currentUser.avatar,
                    stories: [newStory]
                }
            ];
        }
    });
    fetchStories(); // Gọi lại hàm fetchStories để cập nhật danh sách stories
};

    // Fetch posts from API
    useEffect(() => {
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
                        author: post.user.fullName,
                        avatar: post.user.avatar,
                        content: post.content,
                        mediaUrl: post.mediaUrl,
                        timestamp: post.createdAt,
                        comments: post.comments,
                        commentsCount: post.commentCount,
                        likes: post.likeCount,
                        isLiked: post.liked,
                    })));
                    console.log('Posts fetched successfully:', data);
                } else {
                    console.error('Failed to fetch posts:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);


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
                        timestamp: newPost.createdAt,
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
        <div className="col-lg-7 bg-white p-3">
            {/* Stories Section */}
            <div className='mb-4'>
                <div className='d-flex align-items-center overflow-auto pb-2'>
                    {/* Your Story */}
                    <div className='me-3 text-center'>
                        <div
                            className="rounded-circle d-flex align-items-center justify-content-center border border-primary border-2"
                            style={{
                                width: '80px',
                                height: '80px',
                                cursor: 'pointer',
                                backgroundColor: '#dddddd'
                            }}
                            onClick={() => setShowModalStory(true)}
                        >
                            <img
                                src={storyIcon}
                                alt="story"
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    objectFit: 'cover',
                                }}
                            />
                        </div>
                        <div className="small mt-1">Your Story</div>
                    </div>

                    {/* Friends' Stories */}
                    {stories.map((story) => (
                        <div className='me-3 text-center' key={story.id}>
                            <div
                                className="rounded-circle border border-primary border-2 p-1"
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    setSelectedStory(story);
                                    setCurrentStoryIndex(0);
                                    setProgress(0);
                                }}
                            >
                                <img
                                    src={story.avatar}
                                    alt={story.authorName}
                                    className='rounded-circle'
                                    style={{
                                        width: '72px',
                                        height: '72px',
                                        objectFit: 'cover'
                                    }}
                                />
                            </div>
                            <div className="small mt-1 text-truncate" style={{ maxWidth: '80px' }}>
                                {story.authorName}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Story Viewer Modal */}
            {selectedStory && (
                <div className="modal-overlay" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div className="modal-content" style={{
                        width: '100%',
                        maxWidth: '500px',
                        position: 'relative'
                    }}
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        {/* Progress bars */}
                        <div className="d-flex mb-2 px-2" style={{ gap: '4px' }}>
                            {selectedStory.stories.map((_, index) => (
                                <div key={index} style={{
                                    height: '3px',
                                    flex: 1,
                                    backgroundColor: 'rgba(255,255,255,0.3)',
                                    borderRadius: '3px',
                                    overflow: 'hidden'
                                }}>
                                    {index === currentStoryIndex && (
                                        <div style={{
                                            height: '100%',
                                            width: `${progress}%`,
                                            backgroundColor: 'white',
                                            transition: 'width 0.1s linear'
                                        }}></div>
                                    )}
                                    {index < currentStoryIndex && (
                                        <div style={{
                                            height: '100%',
                                            width: '100%',
                                            backgroundColor: 'white'
                                        }}></div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Header with user info and close button */}
                        <div className="d-flex align-items-center px-3 mb-3" style={{ color: 'white' }}>
                            <img
                                src={selectedStory.avatar}
                                alt={selectedStory.authorName}
                                className='rounded-circle me-2'
                                style={{ width: '32px', height: '32px' }}
                            />
                            <div className="fw-bold">{selectedStory.authorName}</div>
                            <div className="ms-auto" style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    setSelectedStory(null);
                                    setCurrentStoryIndex(0);
                                }}
                            >
                                <i className="fas fa-times"></i>
                            </div>
                        </div>

                        {/* Story content with navigation controls */}
                        <div className="position-relative">
    {selectedStory.stories && selectedStory.stories[currentStoryIndex] ? (
        <img
            src={selectedStory.stories[currentStoryIndex].image}
            alt={`Story ${currentStoryIndex + 1}`}
            style={{
                width: '100%',
                height: 'auto',
                maxHeight: '90vh',
                objectFit: 'contain',
                borderRadius: '8px'
            }}
        />
    ) : (
        <div className="text-center p-5 text-white">
            <p>No story content available</p>
        </div>
    )}

                            {/* Invisible navigation areas */}
                            <div
                                style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    bottom: 0,
                                    width: '50%',
                                    cursor: 'pointer'
                                }}
                                onClick={prevStory}
                            ></div>
                            <div
                                style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: 0,
                                    bottom: 0,
                                    width: '50%',
                                    cursor: 'pointer'
                                }}
                                onClick={nextStory}
                            ></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Story Creation Modal */}
            {showModalStory && (
                <StoryModal
                    onClose={() => setShowModalStory(false)}
                    onStory={handStory}
                    currentUser={currentUser}
                />
            )}

            {/* Create Post Input */}
            <div className="mb-4">
                <div className="d-flex align-items-center justify-content-between">
                    <input
                        type="text"
                        readOnly
                        className="form-control me-3"
                        rows="1"
                        placeholder="What do you have in mind?"
                        onFocus={() => setShowModalPost(true)}
                    ></input>
                </div>
            </div>

            {/* Post Creation Modal */}
            {showModalPost && (
                <PostModal
                    onClose={() => setShowModalPost(false)}
                    onPost={handlePost}
                />
            )}

            {/* Posts List */}
            <Post posts={posts} setPosts={setPosts} currentUser={currentUser} />
        </div>
    );
};

export default MainContent;