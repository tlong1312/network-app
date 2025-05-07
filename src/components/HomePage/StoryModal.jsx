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
  const [crop, setCrop,] = useState({ aspect: ASPECT_RATIO });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [imageTooSmall, setImageTooSmall] = useState(false);
  const fileInputRef = useRef(null);
  const imgRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          // Check if image meets minimum size requirements
          const isTooSmall = img.width < MIN_WIDTH || img.height < DEFAULT_CROP_HEIGHT;
          setImageTooSmall(isTooSmall);

          if (isTooSmall) {
            alert(`Image is too small. Please use an image with width at least ${MIN_WIDTH}px and height at least ${DEFAULT_CROP_HEIGHT}px.`);
            return
          }

          setImage(file);
          setImagePreview(event.target.result);

          // Set initial crop to 220px width and 9/16 aspect ratio height

          setCrop({
            aspect: ASPECT_RATIO,
            width: DEFAULT_CROP_WIDTH,
            height: DEFAULT_CROP_HEIGHT,
            x: (img.width - DEFAULT_CROP_WIDTH) / 2, // Center horizontally
            y: (img.height - DEFAULT_CROP_HEIGHT) / 2, // Center vertically
            unit: 'px'
          });
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!imagePreview || imageTooSmall) return;

    try {
      // 1. Crop ảnh
      const croppedImage = await getCroppedImg(imgRef.current, completedCrop || {
        x: 0,
        y: 0,
        width: DEFAULT_CROP_WIDTH,
        height: DEFAULT_CROP_HEIGHT,
        aspect: ASPECT_RATIO,
        unit: 'px'
      });

      const timestamp = new Date().getTime();
      const fileName = `${currentUser.id}_${currentUser.name.replace(/\s+/g, '_')}_${timestamp}.png`;

      // Tạo FormData để gửi lên server
      const formData = new FormData();
      const blob = await fetch(croppedImage).then(res => res.blob());
      formData.append('image', blob, fileName);
      formData.append('userId', currentUser.id);

      // Gọi API upload
      const response = await fetch('http://localhost:8081/api/story/upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      onStory(result.imageUrl);
      onClose();

    } catch (error) {
      console.error('Error saving story:', error);
    }
  };

  const getCroppedImg = (image, crop) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.9);
    });
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

            {imageTooSmall && (
              <div className="image-warning">
                <p>Image is too small. For best results, use an image with width at least {MIN_WIDTH}px and height at least {DEFAULT_CROP_HEIGHT}px.</p>
              </div>
            )}

            <div className="image-preview-container d-flex" >
              <ReactCrop
                src={imagePreview}
                crop={crop}
                onChange={(c) => {
                  if (!imgRef.current) return;

                  const image = imgRef.current;
                  const imageWidth = image.naturalWidth;
                  const imageHeight = image.naturalHeight;

                  const minWidth = DEFAULT_CROP_WIDTH;
                  const minHeight = DEFAULT_CROP_HEIGHT;

                  let newWidth = Math.max(c.width, minWidth);
                  let newHeight = Math.max(c.height, minHeight);

                  // Không cho crop vượt quá chiều rộng/chiều cao của ảnh
                  if (c.x + newWidth > imageWidth) {
                    newWidth = imageWidth - c.x;
                  }
                  if (c.y + newHeight > imageHeight) {
                    newHeight = imageHeight - c.y;
                  }

                  const newCrop = {
                    ...c,
                    width: newWidth,
                    height: newHeight,
                  };

                  setCrop(newCrop);
                }}

                onComplete={(c) => setCompletedCrop(c)}
                aspect={ASPECT_RATIO}
                ruleOfThirds
                className="react-crop"
              >

                <img
                  ref={imgRef}
                  src={imagePreview}
                  alt="Preview"
                  className="crop-image m-auto"
                  style={{
                    maxWidth: 'none',
                    maxHeight: 'none',
                    transform: 'translate(0, 0)'
                  }}
                />
              </ReactCrop>
            </div>


          </div>

        )}

        <div className="modal-footer ">
          {imagePreview && (
            <>
              <div className='d-flex justify-content-end gap-2 p-2'>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                    setImageTooSmall(false);
                  }}
                >
                  Change Photo
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={imageTooSmall}
                >
                  Save Story
                </button>
              </div>

            </>
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