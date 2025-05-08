import React, { useState } from 'react'

const Post = (props) => {

    const { posts, setPosts} = props;

    const [comment, setComment] = useState('');

    const handleLike = async (postId) => {
        const postIndex = posts.findIndex((post) => post.id === postId);
        if (postIndex === -1) return;
    
        const currentLiked = posts[postIndex].isLiked;
    
        const updatedPosts = [...posts];
        updatedPosts[postIndex] = {
            ...updatedPosts[postIndex],
            isLiked: !currentLiked, 
            likes: currentLiked
                ? updatedPosts[postIndex].likes - 1 
                : updatedPosts[postIndex].likes + 1, 
        };
        setPosts(updatedPosts);
    
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8081/api/posts/${postId}/like`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (!response.ok) {
                console.error('Failed to like/unlike post:', response.statusText);
    
                updatedPosts[postIndex] = {
                    ...updatedPosts[postIndex],
                    isLiked: currentLiked,
                    likes: currentLiked
                        ? updatedPosts[postIndex].likes + 1
                        : updatedPosts[postIndex].likes - 1,
                };
                setPosts(updatedPosts);
            }
        } catch (error) {
            console.error('Error liking/unliking post:', error);
    
            updatedPosts[postIndex] = {
                ...updatedPosts[postIndex],
                isLiked: currentLiked,
                likes: currentLiked
                    ? updatedPosts[postIndex].likes + 1
                    : updatedPosts[postIndex].likes - 1,
            };
            setPosts(updatedPosts);
        }
    };
    
    const handleAddComment = async (postId) => {
        if (comment.trim() !== '') {

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:8081/api/comments/${postId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        content: comment,
                    }),    
                });

                if (response.ok) {
                    const newComment = await response.json();
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
                } else {
                    console.error('Failed to add comment:', response.statusText);
                }
            } catch (error) {
                console.error('Error adding comment:', error);
            }
        }
    };

  return (
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
                                <small className='text-muted'>{post.createdAt}</small>
                            </div>
                        </div>
                        <p>{post.content}</p>
                        {post.mediaUrl && (
                            <>
                                {post.mediaUrl.endsWith('.mp4') ? (
                                    <video
                                        controls
                                        className="img-fluid rounded mb-2"
                                        style={{ width: '100%', maxWidth: '1000px', height: '550px' }}
                                    >
                                        <source src={post.mediaUrl} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <img
                                        src={post.mediaUrl}
                                        alt="Post"
                                        className="img-fluid rounded mb-2"
                                        style={{ width: '100%', maxWidth: '1000px', height: '100vh' }}
                                    />
                                )}
                            </>
                        )}
                        <div className="d-flex mb-3">
                            <div>
                                <i
                                    className={post.isLiked ? "fas fa-heart me-2 text-danger" : "far fa-heart me-2"}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleLike(post.id)}
                                ></i>
                                {post.likes}
                            </div>
                            <div>
                                <i className="far fa-comment me-2 ms-2"></i>
                                {post.commentsCount}  
                            </div>
                        </div>
                        <div className='card shadow bg-light p-3'>
                            {post.comments.length > 0 ? (
                                post.comments.map((cmt) => (
                                    <div key={cmt.id} className="d-flex align-items-center mb-2">
                                        <img
                                            src={cmt.user.avatar}
                                            alt={cmt.user.username}
                                            className="me-3 rounded-circle"
                                            style={{ width: '50px', height: '50px' }}
                                        />
                                        <div className="card p-2 rounded shadow w-100">
                                            <div className="fw-bold">{cmt.user.username}</div>
                                            <p className="mb-0">{cmt.content}</p>
                                            <small className="text-muted">{cmt.createdAt}</small>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted">No comments yet. Be the first to comment!</p>
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
  )
}

export default Post