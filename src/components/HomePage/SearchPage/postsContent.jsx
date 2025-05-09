import React, { useState, useRef } from "react";

const PostsContent = ({ posts }) => {
    const [showComments, setShowComments] = useState({});
    const commentInputRefs = useRef({});

    const handleCommentClick = (postId) => {
        setShowComments((prev) => ({
            ...prev,
            [postId]: !prev[postId],
        }));

        if (commentInputRefs.current[postId]) {
            commentInputRefs.current[postId].focus();
        }
    };

    return (
        <div className="content p-3 rounded-lg shadow-sm">
            <h2 className="h5 font-weight-bold mb-4">Bài viết</h2>
            {posts.map((post) => (
                <div key={post.id} className="border-content bg-white p-3 mb-4">
                    {/* Header */}
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <img
                                alt="Avatar"
                                className="rounded-circle me-2"
                                src={post.user?.avatar || "https://placehold.co/40x40"}
                                style={{ width: "40px", height: "40px" }}
                            />
                            <div>
                                <h6 className="mb-0 fw-bold">{post.user?.username}</h6>
                                <small className="text-muted">{new Date(post.createdAt).toLocaleString()}</small>
                            </div>
                        </div>
                        <i className="fa fa-ellipsis-h text-muted"></i>
                    </div>

                    {/* Content */}
                    <p className="mt-3 mb-2">{post.content}</p>

                    {/* Image */}
                    {post.mediaUrl && (
                        <img
                            src={post.mediaUrl}
                            alt="Media"
                            className="rounded w-100"
                        />
                    )}

                    {/* Like & Comment Icons */}
                    <div className="d-flex align-items-center mt-2">
                        <i className="fa fa-heart me-2"></i> <span className="me-3">{post.likeCount}</span>
                        <i
                            className="fa fa-comment me-2"
                            onClick={() => handleCommentClick(post.id)}
                            style={{ cursor: "pointer" }}
                        ></i>
                        <span>{post.commentCount}</span>
                    </div>

                    {/* Comment Section */}
                    {showComments[post.id] && (
                        <div
                            className="mt-3 border-top pt-3"
                            style={{ maxHeight: "300px", overflowY: "auto" }}
                        >
                            {(post.comments || []).map((comment) => (
                                <div key={comment.id} className="d-flex align-items-center mb-2">
                                    <img
                                        alt="User"
                                        className="rounded-circle me-2"
                                        src={comment.user?.avatar || "https://placehold.co/30x30"}
                                        style={{ width: "30px", height: "30px" }}
                                    />
                                    <div>
                                        <span className="fw-bold">{comment.user?.username}</span>
                                        <span className="ms-2">{comment.text}</span>
                                    </div>
                                </div>
                            ))}
                            <div className="d-flex align-items-center mt-2">
                                <img
                                    alt="User"
                                    className="rounded-circle me-2"
                                    src="https://placehold.co/40x40"
                                />
                                <input
                                    type="text"
                                    className="form-control mx-2"
                                    placeholder="Add Comment..."
                                    ref={(el) => (commentInputRefs.current[post.id] = el)}
                                />
                                <button className="btn btn-comment btn-sm mx-2">Comment</button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default PostsContent;
