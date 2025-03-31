import React, { useState } from 'react'
import Post from './Post';
import PostModal from './PostModal';
import storyIcon from '../../assets/icon/story-icon.png';
import StoryModal from './StoryModal';
import avatar from '../../assets/icon/avatar.png';

const MainContent = () => {

    const [currentUser] = useState({
        id: 1,
        name: 'TieuLong Dang',
        avatar: avatar,
    });

    const [stories, setStories] = useState([
        {
            id: 1,
            image: 'https://placehold.co/80x80',
            avatar: currentUser.avatar,
            authorName: currentUser.name,
        },
    ]);

    const [selectedStory, setSelectedStory] = useState(null);

    const handStory = (image) => {
        const newStory = {
            id: Date.now(),
            image: image ? URL.createObjectURL(image) : null,
            avatar: currentUser.avatar,
            authorName: currentUser.name,
        };
        setStories([newStory, ...stories]);
    }

    const [showModalStory, setShowModalStory] = useState(false);

    const [posts, setPosts] = useState([
        {
            id: 1,
            author: 'TieuLong Dang',
            avatar: 'https://placehold.co/40x40',
            timestamp: 'Just now',
            content: 'This is a nice picture from this #weekend.',
            image: 'https://placehold.co/800x300',
            likes: 0,
            commentsCount: 0,
            comments: []
        },
    ]);
    const [showModalPost, setShowModalPost] = useState(false);

    const handlePost = (content, image) => {
            const newPost = {
                id: Date.now(),
                author: 'TieuLong Dang',
                avatar: 'https://placehold.co/40x40',
                timestamp: 'Just now',
                content,
                image: image ? URL.createObjectURL(image) : null,
                likes: 0,
                commentsCount: 0,
                comments: [],
            };
            setPosts([newPost, ...posts]);
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
                        <h5>{selectedStory.authorName}</h5>
                        <img
                            src={selectedStory.image}
                            alt={selectedStory.authorName}
                            style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                        />
                        <button
                            className="btn btn-secondary mt-3"
                            onClick={() => setSelectedStory(null)} 
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

            <Post posts={posts} setPosts={setPosts} />

        </div>
    )
}

export default MainContent