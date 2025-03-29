import React, { useState } from 'react'

const PostModal = (props) => {

    const { onClose, onPost } = props;
    const [postContent, setPostContent] = useState('');
    const [image, setImage] = useState(null);

    const handlePost = () => {
        if (postContent.trim() !== '' || image) {
            onPost(postContent, image);
            setPostContent('');
            setImage(null);
            onClose();
        }
    }


  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h5 className="mb-3">Create a Post</h5>
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
          onChange={(e) => setImage(e.target.files[0])}
        />
        <div className="d-flex justify-content-end">
          <button className="btn btn-secondary me-2" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handlePost}>
            Post
          </button>
        </div>
      </div>
    </div>
  )
}

export default PostModal