
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";


const Signup = () => { 
 const [data, setData] = useState({
       
    email: "",
    password: "",
   mobileNo: "",
   address: "",
   });
   const [error, setError] = useState("");
   const navigate = useNavigate();

   const handleChange = ({ currentTarget: input }) => {
       setData({ ...data, [input.name]: input.value });
   };

   const handleSubmit = async (e) => {
   e.preventDefault();
   try {
     const url = "http://localhost:8000/register";
     const { data: res } = await axios.post(url, data);
     console.log(res);
 
     // Redirect to the login page upon successful registration
     navigate("/auth/sign-in");
   } catch (error) {
     if (
       error.response &&
       error.response.status >= 400 &&
       error.response.status <= 500
     ) {
       setError(error.response.data.message);
     }
   }
 };
 

 return (
   <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
     <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Sign Up
        </h4>
       <form onSubmit={handleSubmit}>
         <div className="mb-4">
           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
             Email
           </label>
           <input
             className="w-full border rounded py-2 px-3 focus:outline-none focus:border-blue-500"
             type="text"
             id="email"
             name="email"
             placeholder="Enter your email"
             onChange={handleChange}
                           value={data.email}
           />
         </div>
         <div className="mb-4">
           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
             Password
           </label>
           <input
             className="w-full border rounded py-2 px-3 focus:outline-none focus:border-blue-500"
             type="password"
             id="password"
             name="password"
             placeholder="Enter your password"
             onChange={handleChange}
            value={data.password}
           />
         </div>
         <div className="mb-4">
           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mobileNo">
             MobileNo.
           </label>
           <input
             className="w-full border rounded py-2 px-3 focus:outline-none focus:border-blue-500"
             type="text"
             id="mobileNo"
             name="mobileNo"
             placeholder="Enter your mobileNo"
             onChange={handleChange}
                           value={data.mobileNo}
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
             onChange={handleChange}
                           value={data.address}
           />
         </div>
    

         <button
            className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
          >
            Log In
          </button>
          {error && <div className="text-red-500 mt-2">{error}</div>}
        
       </form>
     </div>
   </div>
 );
};

export default Signup;


