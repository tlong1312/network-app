import React from "react";
import Post from "./../Post";

const PostsContent = ({ posts, setPosts }) => {
    return (
        <div className="content p-3 rounded-lg shadow-sm mb-4">
            <h2 className="h5 font-weight-bold mb-4">Bài viết</h2>

            {posts && posts.length > 0 ? (
                <Post posts={posts} setPosts={setPosts} />
            ) : (
                <p className="text-muted">Không tìm thấy bài viết phù hợp.</p>
            )}
        </div>
    );
};

export default PostsContent;
