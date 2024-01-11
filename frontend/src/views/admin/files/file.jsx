import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const File = () => {
  const [fileList, setFileList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get('http://localhost:8000/files'); 
      setFileList(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const handleDownload = async (fileName) => {
    try {
      const response = await axios.get(`http://localhost:8000/files/${fileName}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("File downloaded successfully");
      console.log(fileName);

    } catch (error) {
      toast.error("Could not download file!")
      console.error('Error downloading file:', error);
    }
  };
 
  const handleAddFile = ()=>  {
      navigate('/admin/upload-file')
  }
  return (
    <div>

    <button
        className="bg-green-500 text-white py-1 px-2 rounded mb-2"
        style={{ marginTop: '10px' }}
        onClick={handleAddFile}
      >
        Add files
      </button>
  
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', borderRadius: '16px',backgroundColor: 'white' }}>
      <thead>
        <tr>
          <th style={{   padding: '10px', fontSize: 'small', fontWeight: 'bold' }}>File</th>
          <th style={{  padding: '10px', fontSize: 'small', fontWeight: 'bold' }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {fileList.map((file) => (
          <tr key={file.name}>
            <td style={{ padding: '10px', fontSize: 'small' }}>{file.name}</td>
            <td style={{ padding: '10px', fontSize: 'small' }}>
              <button 
              className="bg-red-500 text-white py-1 px-2 rounded mr-2"
              onClick={() => handleDownload(file.name)} 
              style={{ fontSize: 'small', fontWeight: 'bold' }}>
                Download
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
};

export default File;
