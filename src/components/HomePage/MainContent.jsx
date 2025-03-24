import React, { useState } from 'react'
import Post from './Post';

const MainContent = () => {

    const [comment, setComment] = useState('');
    const [postContent, setPostContent] = useState('');
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

    // const handlePost = () => {
    //     if (postContent.trim() !== '') {
    //         const newPost = {
    //             id: Date.now(),
    //             author: 'TieuLong Dang',
    //             avatar: 'https://placehold.co/40x40',
    //             timestamp: 'Just now',
    //             content: postContent,
    //             image: null,
    //             likes: 0,
    //             comments: 0,
    //         };
    //         setPosts([newPost, ...posts]);
    //         setPostContent(''); // Reset nội dung sau khi đăng
    //     }
    // };

    const handleAddComment = (postId) => {
        if (comment.trim() !== '') {
            const newComment = {
                id: Date.now(),
                author: 'Anonymous',
                avatar: 'https://placehold.co/40x40',
                content: comment,
                timestamp: 'Just now',
            };
            setPosts(
                posts.map((post) => 
                    post.id === postId
                    ? {
                        ...post,
                        comments: [...post.comments, newComment],
                        commentsCount: post.commentsCount + 1,
                    }
                    : post
                )
            );
            setComment('');
        }
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
                <div className="d-flex align-items-center">
                    <textarea
                        className="form-control me-3"
                        rows="1"
                        placeholder="What do you have in mind?"
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                    ></textarea>
                    {/* <button className="btn btn-primary" onClick={handlePost}> */}
                    <button className="btn btn-primary">
                        <i className="fas fa-image"></i>
                    </button>
                </div>
            </div>

            <Post posts={posts} handleAddComment={handleAddComment} comment={comment} setComment={setComment}/>

        </div>
    )
}

export default MainContent