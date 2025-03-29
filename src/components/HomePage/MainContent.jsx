import React, { useState } from 'react'
import Post from './Post';
import PostModal from './PostModal';

const MainContent = () => {

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
    const [showModal, setShowModal] = useState(false);

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
                    <div className="me-3">
                        <img
                            src="https://placehold.co/80x80"
                            alt="Story 1"
                            className="rounded-circle"
                            style={{ width: '80px', height: '80px' }}
                        />
                    </div>
                    <div className="me-3">
                        <img
                            src="https://placehold.co/80x80"
                            alt="Story 2"
                            className="rounded-circle"
                            style={{ width: '80px', height: '80px' }}
                        />
                    </div>
                    <div className="me-3">
                        <img
                            src="https://placehold.co/80x80"
                            alt="Story 3"
                            className="rounded-circle"
                            style={{ width: '80px', height: '80px' }}
                        />
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <div className="d-flex align-items-center justify-content-between">
                    <input
                        type="text"
                        readOnly
                        className="form-control me-3"
                        rows="1"
                        placeholder="What do you have in mind?"
                        onFocus={() => setShowModal(true)}
                    ></input>
                </div>
            </div>

            {showModal && (
                <PostModal 
                    onClose={() => setShowModal(false)}
                    onPost={handlePost}
                />
            )}

            <Post posts={posts} setPosts={setPosts} />

        </div>
    )
}

export default MainContent