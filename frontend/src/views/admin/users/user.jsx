import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditUser from './editUser';

const User = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editModalShow, setEditModalShow] = useState(false);
  const navigate = useNavigate();
  const [isRefrechData, setRefechData] = useState(true);

  useEffect(() => {
    if(isRefrechData != false){
      const apiUrl = 'http://localhost:8000/get-user';

      axios.get(apiUrl)
        .then(response => {
          setUsers(response.data);
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
        setRefechData(false)
    }
   
  }, [isRefrechData]);

  const handleDeleteUser = async (userId) => {
    try {
      const apiUrl = `http://localhost:8000/delete-user/${userId}`;
      const response = await axios.delete(apiUrl);
  
      if (response.data.success) {
        setUsers((users) => users.filter((user) => user._id !== userId));
        toast.success('User deleted successfully');
      } else {
        console.error('Error deleting user:', response.data.msg);
        toast.error(`Error deleting user: ${response.data.msg}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user');
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditModalShow(true);
  };
  const handleCloseEditUser = () => {
    setSelectedUser(null);
    setEditModalShow(false);
  };


  const handleAddUser = () => {
    navigate('/admin/add-user');
    setRefechData(true);
  };

 
  const handleDownload = async (userId) => {
    try {
      const response = await axios.post(`http://localhost:8000/generate-pdf/${userId}`, {},{
        responseType: 'blob', // Indicate that the response is JSON
      });
  
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

      const reader = new FileReader();
      reader.onloadend = () => {
        const link = document.createElement('a');
        link.href = reader.result;
        link.download = 'document.docx';
        link.click();
      };
      reader.readAsDataURL(blob);
     
  
      console.log("Downloaded");
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };
  

  

  return (
    <div>
      <ToastContainer position="top-right" autoClose={5000}/>
      <button
        className="bg-green-500 text-white py-1 px-2 rounded mb-2"
        style={{ marginTop: '10px' }}
        onClick={handleAddUser}
      >
        Create User
      </button>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', borderRadius: '8px',backgroundColor: 'white' }}>
        <thead>
          <tr>
            <th style={{ padding: '10px' }} className="text-left">S.No.</th>
            <th style={{ padding: '10px' }} className="text-left">Email</th>
            <th style={{ padding: '10px' }} className="text-left">Mobile No</th>
            <th style={{ padding: '10px' }} className="text-left">Address</th>
            <th style={{ padding: '10px' }} className="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td style={{ padding: '10px', }} className="text-sm font-bold text-navy-700 dark:text-white">{index + 1}.</td>
              <td style={{ padding: '10px', }} className="text-sm font-bold text-navy-700 dark:text-white">{user.email}</td>
              <td style={{ padding: '10px', }} className="text-sm font-bold text-navy-700 dark:text-white">{user.mobileNo}</td>
              <td style={{ padding: '10px', }} className="text-sm font-bold text-navy-700 dark:text-white">{user.address}</td>
              <td style={{ padding: '10px', }}>
                <button
                  className="bg-red-500 text-white py-1 px-2 rounded mr-2"
                  onClick={() => handleDeleteUser(user._id)}
                >
                  Delete
                </button>
                <button
                  className="bg-amber-500 text-white py-1 px-2 rounded mr-2"
                  onClick={() => handleEditUser(user)}
                >
                  Edit
                </button>
               
  
                <button
                  className="bg-blue-500 text-white py-1 px-2 rounded"
                  onClick={() => handleDownload(user._id)}
                >
                  Download
                </button>

                
              </td>
            </tr>
          ))}
        </tbody>
      </table>

     

      {selectedUser && (
        <EditUser
          setRefechData = {setRefechData}
          user={selectedUser}
          onClose={handleCloseEditUser}
       
        />
      )}
    </div>
  );
};

export default User;