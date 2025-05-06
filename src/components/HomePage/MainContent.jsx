import React, { useEffect, useState } from 'react'
import Post from './Post';
import PostModal from './PostModal';
import storyIcon from '../../assets/icon/story-icon.png';
import StoryModal from './StoryModal';
import avatar from '../../assets/icon/avatar.png';

const MainContent = () => {

    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

    const [currentUser] = useState({
        id: 1,
        name: 'TieuLong Dang',
        avatar: avatar,
    });

    const [stories, setStories] = useState([
        {
            id: 1,
            avatar: currentUser.avatar,
            authorName: currentUser.name,
            stories: [
                { id: 1, image: 'https://placehold.co/800x300' },
                { id: 2, image: 'https://placehold.co/300x300' },
            ],
        },
        {
            id: 2,
            avatar: 'https://placehold.co/80x80',
            authorName: 'John Doe',
            stories: [
                { id: 1, image: 'https://placehold.co/500x500' },
                { id: 2, image: 'https://placehold.co/600x600' },
            ],
        },
    ]);

    const [selectedStory, setSelectedStory] = useState(null);

    const handStory = (image) => {
        const newStory = {
            id: Date.now(),
            image: image ? URL.createObjectURL(image) : null,
        };
        setStories((prevStories) =>
            prevStories.map((story) =>
                story.id === currentUser.id
                    ? { ...story, stories: [...story.stories, newStory] }
                    : story
            )
        );
    }

    const [showModalStory, setShowModalStory] = useState(false);

    const [posts, setPosts] = useState([]);
    const [showModalPost, setShowModalPost] = useState(false);


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
                        author: post.user.username,
                        avatar: post.user.avatar,
                        content: post.content,
                        mediaUrl: post.mediaUrl,
                        timestamp: post.createdAt,
                        comments: post.comments,
                        commentsCount: post.commentsCount,
                        likes: post.likeCount,
                    })));
                    console.log(data);
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
        <div className="col-lg-7 bg-white p-3">
            <div className='mb-4'>
                <div className='d-flex align-items-center'>
                    <div className='me-3'>
                        <div
                            className="rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: '80px', height: '80px', backgroundColor: '#dddddd', cursor: 'pointer', }}
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
                    </div>
                    {stories.map((story) => (
                        <div
                            className='me-3'
                            key={story.id}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setSelectedStory(story)}
                        >
                            <img
                                src={story.avatar}
                                alt={story.authorName}
                                className='rounded-circle'
                                style={{ width: '80px', height: '80px' }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {selectedStory && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h5>{selectedStory.authorName}'s Stories</h5>
                        <div className="position-relative">
                            <img
                                src={selectedStory.stories[currentStoryIndex].image}
                                alt={`Story ${currentStoryIndex + 1}`}
                                style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                            />

                            <button
                                className="btn btn-secondary position-absolute start-0 top-50 translate-middle-y rounded-circle custom-btn"
                                style={{ zIndex: 1 }}
                                onClick={() =>
                                    setCurrentStoryIndex((prevIndex) =>
                                        prevIndex > 0 ? prevIndex - 1 : selectedStory.stories.length - 1
                                    )
                                }
                            >
                                <i className="fas fa-chevron-left"></i> 
                            </button>

                            <button
                                className="btn btn-secondary position-absolute end-0 top-50 translate-middle-y rounded-circle custom-btn"
                                style={{ zIndex: 1 }}
                                onClick={() =>
                                    setCurrentStoryIndex((prevIndex) =>
                                        prevIndex < selectedStory.stories.length - 1 ? prevIndex + 1 : 0
                                    )
                                }
                            >
                                <i className="fas fa-chevron-right"></i> 
                            </button>
                        </div>
                        <button
                            className="btn btn-secondary mt-3"
                            onClick={() => {
                                setSelectedStory(null);
                                setCurrentStoryIndex(0);
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {showModalStory && (
                <StoryModal
                    onClose={() => setShowModalStory(false)}
                    onStory={handStory}
                />
            )}

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

            {showModalPost && (
                <PostModal
                    onClose={() => setShowModalPost(false)}
                    onPost={handlePost}
                />
            )}

            <Post posts={posts} setPosts={setPosts} currentUser={currentUser}/>

        </div>
    )
}

export default MainContent