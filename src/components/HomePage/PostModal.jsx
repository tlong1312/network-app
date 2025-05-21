import React, { useState } from 'react'
const PostModal = (props) => {

    const { onClose, onPost } = props;
    const [postContent, setPostContent] = useState('');
    const [mediaFile, setMediaFile] = useState(null);

    const handlePost = () => {
        if (postContent.trim() !== '' || mediaFile) {
            onPost(postContent, mediaFile);
            setPostContent('');
            setMediaFile(null);
            onClose();
        }
    }


    return (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Create a Post</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <textarea
                            className="form-control mb-3"
                            rows="3"
                            placeholder="What's on your mind?"
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                        ></textarea>
                        <input
                            type="file"
                            className="form-control mb-3"
                            onChange={(e) => setMediaFile(e.target.files[0])}
                        />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handlePost}>
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostModal