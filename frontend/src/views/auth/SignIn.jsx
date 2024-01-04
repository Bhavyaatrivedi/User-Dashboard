import React, { useState } from "react";
import axios from "axios";
import InputField from "components/fields/InputField";
import Checkbox from "components/checkbox";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";


const SignIn = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
};



  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const url = "http://localhost:8000/login";
     const { data: res } = await axios.post(url, data);
    
     console.log(res)
      if (res.success) {
        
          // If 'token' property exists, set the cookie and navigate
          Cookies.set("user", { token: res.token });
          navigate("/admin/default");
        
      } else {
        // Handle login error
        setError("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid email or password");
    
    }
  };


  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      {/* Sign in section */}
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Sign In
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Enter your email and password to sign in!
        </p>

        <form onSubmit={handleSignIn}>

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

        {/* Password */}
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
      
        {/* Checkbox */}
        <div className="mb-4 flex items-center justify-between px-2">
          <div className="flex items-center">
            <Checkbox />
            <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
              Keep me logged In
            </p>
          </div>
          <Link
          to="/auth/forget-password"
            className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
           
          >
            Forgot Password?
          </Link>
        </div>
        <button
          className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
         
        >
          Sign In
        </button>
        <div className="mt-4">
          <span className=" text-sm font-medium text-navy-700 dark:text-gray-600">
            Not registered yet?
          </span>
          <Link
            to="/auth/sign-up"  // Link to the Signup page
            className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
          >
            Create an account
          </Link>
         
        </div>
         </form>
         {error && <div className="text-red-500 mt-2">{error}</div>}
         
      </div>
    </div>
  );
};

export default SignIn;