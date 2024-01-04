import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";


const Logout = () => {
  const [logoutStatus, setLogoutStatus] = useState(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      Cookies.remove('user')
        navigate('/auth/sign-in');
        console.log('logged out')
 
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="absolute top-4 right-4">
        <button
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
        onClick={handleLogout}
      >

        Logout
        </button>
      {logoutStatus && (
        <p className='text-red-500'>
            {logoutStatus.success ? 'Logout successful' : 'Logout failed'}
            </p>
      )}
    </div>
  );
};



export default Logout;
