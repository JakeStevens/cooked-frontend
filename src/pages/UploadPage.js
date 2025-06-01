import React, { useState } from 'react';
import ApiService from '../services/api'; // Import ApiService
import './UploadPage.css'; // We'll create this basic CSS file as well

function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(''); // To display messages like "Uploading...", "Success!", "Error"
  const [previewUrl, setPreviewUrl] = useState(''); // To display a preview of the selected image

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus(`File selected: ${file.name}`);
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewUrl('');
      setUploadStatus('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file first.');
      return;
    }

    setUploadStatus(`Uploading ${selectedFile.name}...`);

    try {
      // Use the ApiService to upload the image
      // The backend endpoint is assumed to be /api/upload-image
      const response = await ApiService.uploadImage('/api/upload-image', selectedFile);

      setUploadStatus(`Successfully uploaded ${selectedFile.name}: ${response.message || 'Success!'}`); // Assuming backend sends a message
      setSelectedFile(null); // Clear the selected file
      setPreviewUrl('');     // Clear the preview
      // Optionally, reset file input visually if possible (tricky, often involves re-rendering the input with a key)
      // For simplicity, we'll rely on selectedFile being null to disable the button and clear preview.

    } catch (error) {
      console.error('Upload failed:', error);
      // Display a more user-friendly error message if possible
      // error.message might contain the detailed error from ApiService
      setUploadStatus(`Upload failed: ${error.message || 'Could not connect to server or server returned an error.'}`);
    }
  };

  return (
    <div className="upload-page-container">
      <h2>Upload Image</h2>
      <div className="upload-form">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          // To help reset the input field visually after successful upload or if the user re-selects
          // we can control it by making it a "controlled" component if needed, or simply by key.
          // For now, we'll keep it simple. The browser usually handles clearing it if the same file is chosen again.
          // If we clear `selectedFile` and `previewUrl`, the visual feedback should be sufficient.
          className="file-input"
          // Add a key that changes when the file is cleared to force re-render of the input
          key={selectedFile ? 'file-selected' : 'file-not-selected'}
        />
        {previewUrl && (
          <div className="image-preview-container">
            <p>Selected image preview:</p>
            <img src={previewUrl} alt="Selected preview" className="image-preview" />
          </div>
        )}
        <button onClick={handleUpload} disabled={!selectedFile || uploadStatus.startsWith('Uploading')} className="upload-button">
          {uploadStatus.startsWith('Uploading') ? 'Uploading...' : 'Upload Image'}
        </button>
        {uploadStatus && <p className="upload-status">{uploadStatus}</p>}
      </div>
    </div>
  );
}

export default UploadPage;
