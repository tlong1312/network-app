import React, { useState } from 'react'

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
            setPosts(
                posts.map((post) => (
                    post.id === postId
                    ? {
                        ...post,
                        comments: [...post.comments, comment],
                        commentsCount: post.commentsCount + 1,
                    }
                    : post

                ))
            )
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

            <div className='card shadow p-3 mb-4'>
                {posts.map((post) => (
                    <div key={post.id} className='p-3 mb-3 bg-light rounded shadow-sm'>
                        <div className='d-flex align-items-center mb-2'>
                            <img 
                                src={post.avatar} 
                                alt={post.author} 
                                className='me-3 rounded-circle'
                                style={{ width: '40px', height: '40px' }}    
                            />
                            <div>
                                <span className='fw-bold'>{post.author}</span>
                                <br />
                                <small className='text-muted'>{post.timestamp}</small>
                            </div>
                        </div>
                        <p>{post.content}</p>
                        {post.image && (
                            <img
                                src={post.image}
                                alt="Post"
                                className='img-fluid rounded mb-2'
                            />
                        )}
                        <div className="d-flex mb-3">
                            <div>
                                <i className="far fa-heart me-2"></i>
                                {post.likes}
                            </div>
                            <div>
                                <i className="far fa-comment me-2 ms-2"></i>
                                {post.commentsCount}  
                            </div>
                        </div>
                        <div className='card shadow bg-light p-3'>
                            {post.comments.length > 0 && (
                                <div className='mt-3'>
                                    {post.comments.map((cmt, index) => (
                                        <div key={index} className="d-flex align-items-center mb-2">
                                            <img
                                                src="https://placehold.co/30x30"
                                                alt="User"
                                                className="me-3 rounded-circle"
                                                style={{ width: '30px', height: '30px' }}
                                            />
                                            <div className="card p-2 rounded shadow w-100">
                                                <div className="fw-bold">{post.author}</div>
                                                <p className="mb-0">{cmt}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className='d-flex align-items-center mb-2'>
                                <img
                                    src="https://placehold.co/30x30"
                                    alt="User 1"
                                    className='me-3 rounded-circle'
                                    style={{ width: '30px', height: '30px' }}
                                />
                                <input
                                    type="text"
                                    className="form-control me-2"
                                    placeholder="Add Comment..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => handleAddComment(post.id)}
                                >
                                    Comment
                                </button>
                            </div>                            
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default MainContent