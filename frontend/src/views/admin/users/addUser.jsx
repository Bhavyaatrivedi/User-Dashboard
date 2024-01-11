import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const AddUser = ({  }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    mobileNo: '',
    name:'',
    address: '',
    workExp: '',
    linkedinUrl: '',
    project:'',
    references:'',
    skill:'',
    education:'',
    objective:'',
    userImg:null
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      userImg: e.target.files[0],
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('email', formData.email);
    data.append('name', formData.name);
    data.append('password', formData.password);
    data.append('mobileNo', formData.mobileNo);
    data.append('address', formData.address);
    data.append('workExp', formData.workExp);
    data.append('linkedinUrl', formData.linkedinUrl);
    data.append('project', formData.project);
    data.append('references', formData.references);
    data.append('skill', formData.skill);
    data.append('education', formData.education);
    data.append('objective', formData.objective);
    data.append('userImg', formData.userImg);
  
    try {
      const response = await axios.post('http://localhost:8000/add-user',  data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    
      console.log(response.data);
  
    
  
      
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
           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
             Name (in capital letters)
           </label>
           <input
             className="w-full border rounded py-2 px-3 focus:outline-none focus:border-blue-500"
             type="name"
             id="name"
             name="name"
             placeholder="Enter your Name"
             value={formData.name} onChange={handleChange} required 
           />
         </div>

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

         

         <div className="mb-4">
           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="workExp">
             Work Experience 
           </label>
           <textarea
             className="w-full border rounded py-2 px-3 h-32 focus:outline-none focus:border-blue-500"
             type="workExp"
             id="workExp"
             name="workExp"
             placeholder="Enter your work experience "
             value={formData.workExp} onChange={handleChange} required 
           />
         </div>

         <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="linkedinUrl">
            LinkedIn URL
          </label>
          <input
            className="w-full border rounded py-2 px-3 focus:outline-none focus:border-blue-500"
            type="text"
            name="linkedinUrl"
            placeholder="Enter your LinkedIn URL"
            value={formData.linkedinUrl}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="project">
             Projects
           </label>
           <textarea
             className="w-full border rounded py-2 px-3 h-32 focus:outline-none focus:border-blue-500"
             type="project"
             id="project"
             name="project"
             placeholder="Enter your Projects"
             value={formData.project} onChange={handleChange} required 
           />
         </div>

         <div className="mb-4">
           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="objective">
             Objective
           </label>
           <textarea
             className="w-full border rounded py-2 px-3 h-32 focus:outline-none focus:border-blue-500"
             type="objective"
             id="objective"
             name="objective"
             placeholder="Enter your objective"
             value={formData.objective} onChange={handleChange} required 
           />
         </div>

         <div className="mb-4">
           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="references">
             References
           </label>
           <input
             className="w-full border rounded py-2 px-3 focus:outline-none focus:border-blue-500"
             type="references"
             id="references"
             name="references"
             placeholder="Enter your References"
             value={formData.references} onChange={handleChange} required 
           />
         </div>

         <div className="mb-4">
           <label className="block text-gray-700  text-sm font-bold mb-2" htmlFor="skill">
           Skills
           </label>
           <textarea
             className="w-full border rounded py-2 px-3 h-32 focus:outline-none focus:border-blue-500"
             type="skill"
             id="skill"
             name="skill"
             placeholder="Enter your Skills"
             value={formData.skill} onChange={handleChange} required 
           />
         </div>

         <div className="mb-4">
           <label className="block text-gray-700 text-sm  font-bold mb-2" htmlFor="education">
           Education
           </label>
           <textarea
             className="w-full border rounded py-2 px-3 h-32 focus:outline-none focus:border-blue-500"
             type="education"
             id="education"
             name="education"
             placeholder="Enter your education"
             value={formData.education} onChange={handleChange} required 
           />
         </div>

         <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userImg">
            User Image
          </label>
          <input type="file" 
          accept="image/*" 
          onChange={handleImageChange} />

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
