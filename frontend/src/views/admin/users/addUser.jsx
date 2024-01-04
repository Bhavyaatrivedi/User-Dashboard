import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';


const AddUser = ({  }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    mobileNo: '',
    address: '',
  });
  const navigate = useNavigate();



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const apiUrl = 'http://localhost:8000/add-user';
      const response = await axios.post(apiUrl, formData);

      if (response.data.created) {
        toast.success('User added!');
        setFormData({
          email: '',
          password: '',
          mobileNo: '',
          address: '',
        });

 
       
      } else {
        console.error('Error creating user:', response.data.errors);
        toast.error(`Error creating user: ${response.data.errors}`);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Error creating user');
    }
  };

  return (
    <div style={{ marginTop: '60px' , marginLeft: '30px', marginRight: '30px', backgroundColor: 'white', padding: '20px', borderRadius: '8px'}}>
     
     
  <ToastContainer position="top-right" autoClose={5000}/>
      <form onSubmit={handleSubmit}>

        <div className="mb-4">
           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
             Email
           </label>
           <input
             className="w-full border rounded py-2 px-3 focus:outline-none focus:border-blue-500"
             type="text"     
             name="email"
             placeholder="Enter your email"
             value={formData.email} onChange={handleChange} required 
           />
         </div>



        <div className="mb-4">
           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
             Password
           </label>
           <input
             className="w-full border rounded py-2 px-3 focus:outline-none focus:border-blue-500"
             type="password"      
             name="password"
             placeholder="Enter your password"
             value={formData.password} onChange={handleChange} required
           />
         </div>


        <div className="mb-4">
           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mobileNo">
             MobileNo.
           </label>
           <input
             className="w-full border rounded py-2 px-3 focus:outline-none focus:border-blue-500"
             type="text"
             name="mobileNo"
             placeholder="Enter your mobileNo"
             value={formData.mobileNo} onChange={handleChange} required
           />
         </div>

      
        <div className="mb-4">
           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
             Address
           </label>
           <input
             className="w-full border rounded py-2 px-3 focus:outline-none focus:border-blue-500"
             type="address"
             id="address"
             name="address"
             placeholder="Enter your address"
             value={formData.address} onChange={handleChange} required 
           />
         </div>

       
         <button
            className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
          >
            Add user
          </button>

        

      </form>

      {/* <Link to="/admin/users" className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
          Back
        </Link> */}
    </div>
  );
};

export default AddUser;
