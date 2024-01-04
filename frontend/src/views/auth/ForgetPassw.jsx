import React, { useState } from 'react';
import axios from 'axios';

const ForgetPassw = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/forget-password', { email });

      if (response.data.success) {
        setSuccess('Password reset email sent. Check your email inbox.');
        setError('');
      } else {
        setError(response.data.msg);
        setSuccess('');
      }
    } catch (error) {
      console.error('Error sending reset email:', error);
      setError('Something went wrong. Please try again later.');
      setSuccess('');
    }
  };

  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      {/* Forget Password section */}
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Forget Password
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Enter your email to reset your password.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-white">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              className="linear mt-2 w-full rounded-md px-3 py-2 border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-brand-500 focus:ring focus:ring-brand-200"
            />
          </div>
          {error && <div className="text-red-500">{error}</div>}
          {success && <div className="text-green-500">{success}</div>}
          <button
            type="submit"
            className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassw;
