import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import InputField from 'components/fields/InputField'; 

const ResetPassword = () => {
  const [npassword, setnPassword] = useState('');
  const [confirmnPassword, setConfirmnPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
  console.log('Query string:', location.search);


  const handlePasswChange = (e) => {
    setnPassword(e.target.value);
  }; 

  const handleConfirmPasswChange = (e) => {
    setConfirmnPassword(e.target.value);
  };  


  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      // Check if passwords match
      if (npassword !== confirmnPassword) {
        setError("Password and confirm password do not match");
        console.log("Error");
        return; 
      }
      console.log('New Password:', npassword);
      console.log('Confirm Password:', confirmnPassword);
  
  
      const response = await axios.post(`http://localhost:8000/reset-password?token=${token}`, {
        password: npassword,
        confirmPassword: confirmnPassword,
        token: token,
      });
  
      console.log(token);

      
  
  
      if (response.data.success) {
        setSuccess("Password reset complete"); 
        // console.log("success");
        navigate("/auth/sign-in")
       
      } else {
        setError(response.data.msg);
        console.log("Error:", response.data.msg);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error(error);
    }
  };
  

  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      {/* Reset password section */}
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h2 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">Reset Password</h2>


        <form >

        <div className='mb-4'>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
             Password
           </label>
            <input
                className="w-full border rounded py-2 px-3 focus:outline-none focus:border-blue-500"
                type="password"
                id="password"
                name="password"
                placeholder="password"
                value={npassword}
                onChange={handlePasswChange}
              />

        </div>
          

        <div>
             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
             Confirm Password* 
             </label>
              <input
              className="w-full border rounded py-2 px-3 focus:outline-none focus:border-blue-500"
              type="password"
              id="confirmPassword"
            
              name="confirmPassword"
              placeholder="confirm password"
              value={confirmnPassword}
              onChange={handleConfirmPasswChange}
            />

        </div>

        

          <button
              className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
              type="button" 
            onClick={handleResetPassword}
          >
              Reset Password
          </button>

          {error && <div className="text-red-500 mt-2">{error}</div>}
          {success && <div className="text-green-500 mt-2">{success}</div>}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
