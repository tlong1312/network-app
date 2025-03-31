import React, { useState } from 'react'

const StoryModal = (props) => {

  const {onClose, onStory} = props;
  const [image, setImage] = useState(null);

  const handleStory = () => {
    if (image) {
      onStory(image);
      setImage(null);
      onClose();
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h5 className="mb-3">Create a Story</h5>
        <input
          type="file"
          className="form-control mb-3"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <div className="d-flex justify-content-end">
          <button className="btn btn-secondary me-2" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleStory}>
            Post
          </button>
        </div>
      </div>
    </div>
  )
}

export default StoryModal