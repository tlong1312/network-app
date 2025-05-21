import React from "react";
import Post from "./../Post";

const PostsContent = ({ posts, setPosts }) => {
    // Chuyển đổi dữ liệu posts nếu cần
    const formattedPosts = posts.map(post => ({
        id: post.id,
        author: post.user?.fullName || post.author || "Unknown",
        avatar: post.user?.avatar || post.avatar || "",
        content: post.content,
        mediaUrl: post.mediaUrl,
        createdAt: post.createdAt,
        comments: post.comments || [],
        commentsCount: post.commentCount ?? post.commentsCount ?? 0,
        likes: post.likeCount ?? post.likes ?? 0,
        isLiked: post.liked ?? post.isLiked ?? false,
    }));

    return (
        <div className="content p-3 rounded-lg shadow-sm mb-4">
            <h2 className="h5 font-weight-bold mb-4">Bài viết</h2>

            {formattedPosts.length > 0 ? (
                <Post posts={formattedPosts} setPosts={setPosts} />
            ) : (
                <p className="text-muted">Không tìm thấy bài viết phù hợp.</p>
            )}
        </div>
    );
};

export default PostsContent;