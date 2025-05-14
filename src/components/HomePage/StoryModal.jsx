import React, { useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';


const ASPECT_RATIO = 9 / 16;
const MIN_WIDTH = 250;
const DEFAULT_CROP_WIDTH = 220;
const DEFAULT_CROP_HEIGHT = DEFAULT_CROP_WIDTH / ASPECT_RATIO;

const StoryModal = (props) => {
  const { onClose, onStory, currentUser } = props;
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!image) return;

    setUploading(true);

    try {

      const formData = new FormData();
      formData.append('file', image);
      formData.append('upload_preset', 'upload-y8ouewvx');

      const timestamp = new Date().getTime();
      const fileName = `story_${currentUser.id}_${timestamp}`;
      formData.append('public_id', fileName);

      const response = await fetch('https://api.cloudinary.com/v1_1/drbjicnlm/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const imageUrl = data.secure_url;

        const storyData = {
          url: imageUrl
        };

        const backendResponse = await fetch('http://localhost:8081/api/stories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(storyData),
        });

        if (backendResponse.ok) {
          onStory(imageUrl);
          onClose();
        } else {
          console.error('Error saving story URL to backend:', await backendResponse.text());
        }
      } else {
        console.error('Error uploading to Cloudinary:', await response.text());
      }
    } catch (error) {
      console.error('Error saving story:', error);
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="modal-overlay">
      <div className="modal-content d-flex story-content">
        <div className="modal-header">
          <button className='btn btn-close btn-close-up-story' onClick={onClose} aria-label='Close'></button>
        </div>

        {!imagePreview ? (
          <div className='content-up-story m-auto' onClick={handleImageClick}>
            <div className="upload-icon h-100 d-flex flex-column my-5">
              <svg className='mx-auto my-1' viewBox="0 0 24 24" width="48" height="48">
                <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
              <h5 className='mx-auto my-1'>Create a Story</h5>
            </div>
          </div>
        ) : (
          <div className="image-editor-container m-auto">
            <div className="image-preview-container d-flex">
              <img
                src={imagePreview}
                alt="Preview"
                className="preview-image m-auto"
                style={{
                  maxHeight: '500px',
                  objectFit: 'contain'
                }}
              />
            </div>
          </div>
        )}

        <div className="modal-footer">
          {imagePreview && (
            <div className='d-flex justify-content-end gap-2 p-2'>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                }}
              >
                Change Photo
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Save Story'}
              </button>
            </div>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="file-input hide"
          onChange={handleFileChange}
          accept="image/*"
        />
      </div>
    </div>
  );
};

export default StoryModal;