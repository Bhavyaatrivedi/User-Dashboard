import React, { useState } from 'react';
import axios from 'axios';

const UploadFiles = () => {
  const [file, setFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadSuccess(false); 
  };

  const handleUpload = async () => {
    try {
      if (file) {
        const formData = new FormData();
        formData.append('file', file);


        const response = await axios.post('http://localhost:8000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('File uploaded successfully:', response.data);
        setUploadSuccess(true);
      } else {
        console.error('No file selected');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <input type="file" onChange={handleFileChange} />
      <button className="bg-blue-500 text-white py-1 px-2 rounded mt-4" onClick={handleUpload}>
        Upload File
      </button>

      {uploadSuccess && <p style={{ color: 'green', marginTop: '70px' }}>File uploaded successfully!</p>}
    </div>
  );
};

export default UploadFiles;
